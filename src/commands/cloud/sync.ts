import { Config } from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';
import { unZipFiles } from '@/utils/ZipUtils.js';
import { CLOUD_FOLDERS, fileInCloudFolder, MICROSERVICE_DEPLOYMENT_FILE } from '@/gshared/constants/index.js';
import fetch from 'node-fetch';
import path from 'path';
import { createPusher } from '@/common/pusher.js';
import fs from 'fs';

const TEMP = './.gecli';

export const CommandSync = async ({ namespace, project }: { namespace?: string; project?: string }) => {
  const resolve = await Config.configure({ namespace, project }, ['namespace', 'project']);
  const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  const deployment = p.sources?.sources?.find(
    (s) => s.filename === fileInCloudFolder('microservices_deployment')(MICROSERVICE_DEPLOYMENT_FILE),
  );
  if (!deployment?.getUrl) {
    return;
  }
  const deploymentZip = await (await fetch(deployment.getUrl)).buffer();
  const TEMPPATH = path.join(process.cwd(), TEMP);
  unZipFiles(deploymentZip, TEMPPATH);
  const pusher = createPusher();
  const ch = pusher.subscribe(`presence-${namespace}@${project}`);
  ch.bind('pusher:subscription_succeeded', (e: any) => {
    console.log(e);
  });
  ch.bind('client-live-files', (data: ReceiveData) => receiveLiveFiles(data));
  // make sync double sided also listen to file changes
  return new Promise((resolve, reject) => {
    process.on('SIGINT', () => {
      console.log('You clicked Ctrl+C!');
      fs.rmSync(TEMPPATH);
      resolve('ok');
      process.exit(1);
    });
  });
};
interface MemberInfo {
  name: string;
  nickname: string;
}

interface SentSaveData {
  __typename: 'save';
  type: string;
  s3Path: string;
  from?: string;
  content: string;
}
type ReceiveSaveData = Omit<SentSaveData, 'content'> & { url: string };

interface SentRemoveData {
  __typename: 'remove';
  s3Path: string;
  from?: string;
}
interface SentRenameData {
  __typename: 'rename';
  s3Path: string;
  newS3Path: string;
  from?: string;
}
type SentPayLoad = SentSaveData | SentRemoveData | SentRenameData;
type ReceivePayload = ReceiveSaveData | SentRemoveData | SentRenameData;

interface SentData {
  diffs: Array<SentPayLoad>;
}
interface ReceiveData {
  diffs: Array<ReceivePayload>;
}

const EVENT = 'client-live-files';
const receiveLiveFiles = async (data: ReceiveData) => {
  // decode content from url
  const renameFiles = data.diffs
    .filter((d) => d.__typename === 'rename' && d.s3Path.startsWith(CLOUD_FOLDERS.microserviceJs + '/'))
    .map((d) => d as SentRenameData);
  const removeFiles = data.diffs
    .filter((d) => d.__typename === 'remove' && d.s3Path.startsWith(CLOUD_FOLDERS.microserviceJs + '/'))
    .map((d) => d as SentRemoveData);
  const saveFiles = data.diffs
    .filter((d) => d.__typename === 'save' && d.s3Path.startsWith(CLOUD_FOLDERS.microserviceJs + '/'))
    .map((d) => d as ReceiveSaveData);
  if (renameFiles.length > 0) {
    console.log(`Renaming files:\n${renameFiles.map((rf) => `${rf.s3Path} => ${rf.newS3Path}`).join('\n')}`);
    // rename files with fs
  }
  if (removeFiles.length > 0) {
    console.log(`Removing files:\n${renameFiles.map((rf) => `${rf.s3Path}}`).join('\n')}`);
    removeFiles.forEach((rf) => {
      fs.rm(path.join(TEMP, rf.s3Path), () => {});
    });
    // remove files with fs
  }
  if (saveFiles.length > 0) {
    console.log(`Saving files:\n${saveFiles.map((rf) => `${rf.s3Path}`).join('\n')}`);
    saveFiles.forEach((sf) => {
      fetch(sf.url)
        .then((r) => r.text())
        .then((content) => {
          fs.writeFile(path.join(TEMP, sf.s3Path), content, () => {});
        });
    });
    // save/overwrite files with fs
  }
};
