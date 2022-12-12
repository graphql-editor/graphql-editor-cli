import { CLOUD_FOLDERS } from '@/gshared/constants/index.js';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import { ModelTypes } from '@/zeus/index.js';
import { writeSafe } from '@/utils/FileUtils.js';

const TEMP = './.gecli';
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

export const stratsWithS3 = (p: string) =>
  p.replace(`${CLOUD_FOLDERS['microserviceJs']}/`, '');
export const replaceS3 = (p: string) =>
  p.replace(`${CLOUD_FOLDERS['microserviceJs']}/`, '');
export const getS3File = async (file: ModelTypes['FakerSource']) => {
  if (!file?.getUrl || !file.filename) {
    return {};
  }
  const fileBuffer = await (await fetch(file.getUrl)).text();
  return {
    fileBuffer,
    newName: file.filename.replace(
      `${CLOUD_FOLDERS['microserviceJs']}/`,
      '',
    ) as string,
  };
};
export const writeInitialFiles = async (
  folder: string,
  s3Files?: ModelTypes['FakerSource'][],
) => {
  await s3Files?.map(async (file) => {
    const { fileBuffer, newName } = await getS3File(file);
    if (!fileBuffer) return;
    writeSafe(path.join(folder, newName), fileBuffer);
  });
};
export const removeInitialFiles = (folder: string) => {
  fs.rmSync(folder, { force: true, recursive: true });
};

export const receiveLiveFiles = async (liveData: ReceiveData) => {
  const data: ReceiveData = {
    ...liveData,
    diffs: liveData.diffs
      .filter((diff) => stratsWithS3(diff.s3Path))
      .map((diff) =>
        diff.__typename === 'rename'
          ? {
              ...diff,
              s3Path: replaceS3(diff.s3Path),
              newS3Path: replaceS3(diff.newS3Path),
            }
          : {
              ...diff,
              s3Path: replaceS3(diff.s3Path),
            },
      ),
  };
  // decode content from url
  const renameFiles = data.diffs
    .filter((d) => d.__typename === 'rename')
    .map((d) => d as SentRenameData);
  const removeFiles = data.diffs
    .filter((d) => d.__typename === 'remove')
    .map((d) => d as SentRemoveData);
  const saveFiles = data.diffs
    .filter((d) => d.__typename === 'save')
    .map((d) => d as ReceiveSaveData);

  if (renameFiles.length > 0) {
    console.log(
      `Renaming files:\n${renameFiles
        .map((rf) => `${rf.s3Path} => ${rf.newS3Path}`)
        .join('\n')}`,
    );
    // rename files with fs
  }
  if (removeFiles.length > 0) {
    console.log(
      `Removing files:\n${renameFiles.map((rf) => rf.s3Path).join('\n')}`,
    );
    removeFiles.forEach((rf) => {
      fs.rm(path.join(TEMP, rf.s3Path), () => {});
    });
    // remove files with fs
  }
  if (saveFiles.length > 0) {
    console.log(
      `Saving files:\n${saveFiles
        .map((rf) => `${rf.s3Path}`)
        .map(replaceS3)
        .join('\n')}`,
    );
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
