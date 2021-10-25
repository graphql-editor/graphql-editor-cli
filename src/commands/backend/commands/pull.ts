import { Config } from '@/Configuration';
import { Editor } from '@/Editor';
import { unZipFiles } from '@/utils/ZipUtils';
import { fileInCloudFolder, MICROSERVICE_DEPLOYMENT_FILE } from '@/gshared/constants';
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
