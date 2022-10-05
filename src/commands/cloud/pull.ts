import { Config } from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';
import { unZipFiles } from '@/utils/ZipUtils.js';
import { fileInCloudFolder, MICROSERVICE_DEPLOYMENT_FILE } from '@/gshared/constants/index.js';
import fetch from 'node-fetch';
import path from 'path';

export const CommandPull = async ({ namespace, project }: { namespace?: string; project?: string }) => {
  const resolve = await Config.configure({ namespace, project }, ['namespace', 'project']);
  const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  const deployment = p.sources?.sources?.find(
    (s) => s.filename === fileInCloudFolder('microservices_deployment')(MICROSERVICE_DEPLOYMENT_FILE),
  );
  if (!deployment?.getUrl) {
    return;
  }
  const deploymentZip = await (await fetch(deployment.getUrl)).buffer();
  unZipFiles(deploymentZip, path.join(process.cwd(), resolve.project));
  return;
};
