import { Config } from '@/Configuration';
import { Editor } from '@/Editor';
import { ValueTypes } from '@/zeus';
import { zipCWD } from '@/utils/ZipUtils';
import { fileInCloudFolder, MICROSERVICE_DEPLOYMENT_FILE } from '@/gshared/constants';
import { logger } from '@/common/log';

export const CommandDeploy = async ({
  namespace,
  project,
  env,
  buildScript = 'build',
}: {
  namespace?: string;
  project?: string;
  env?: ValueTypes['Secret'][];
  buildScript?: string;
}) => {
  const resolve = await Config.configure({ namespace, project, buildScript }, ['namespace', 'project', 'buildScript']);
  const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  if (!p.inCloud) {
    await Editor.deployProjectToCloud(p.id);
  }
  const deploymentFile = fileInCloudFolder('microservices_deployment')(MICROSERVICE_DEPLOYMENT_FILE);
  await Editor.saveFilesToCloud(p.id, [{ content: await zipCWD(), name: deploymentFile, type: 'application/zip' }]);
  const pWithSource = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  const backendZip = pWithSource.sources?.sources?.find((f) => f.filename === deploymentFile)?.getUrl;
  if (!backendZip) {
    throw new Error('Cannot get backend zip source');
  }
  logger(`Successfully created deployment zip ${backendZip}`, 'success');
  const deploymentId = await Editor.deployRepoToSharedWorker(p.id, backendZip, {
    secrets: env,
    node14Opts: {
      buildScript: resolve.buildScript,
    },
  });

  const socket = await Editor.showDeploymentLogs(deploymentId);

  socket.on(({ watchLogs }) => {
    console.log(watchLogs);
  });
  return;
};
