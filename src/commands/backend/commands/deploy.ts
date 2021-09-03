import { Config } from '@/Configuration';
import { Editor } from '@/Editor';
import { ValueTypes } from '@/zeus';
import { zipCWD } from '@/utils/ZipUtils';

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
  const resolve = await Config.configure({ namespace, project }, ['namespace', 'project']);
  const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  if (!p.inCloud) {
    await Editor.deployProjectToCloud(p.id);
  }
  await Editor.saveFilesToCloud(p.id, [
    { content: await zipCWD(), name: 'microservices_deployment/function.zip', type: 'application/zip' },
  ]);
  const pWithSource = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  const backendZip = pWithSource.sources?.sources?.find((f) => f.filename === 'microservices_deployment/function.zip')
    ?.getUrl;
  if (!backendZip) {
    throw new Error('Cannot get backend zip source');
  }
  console.log(`Successfully created deployment zip ${backendZip}`);
  const deploymentId = await Editor.deployRepoToSharedWorker(p.id, backendZip, {
    secrets: env,
    node14Opts: {
      buildScript,
    },
  });

  const socket = await Editor.showDeploymentLogs(deploymentId);

  socket.on(({ watchLogs }) => {
    console.log(watchLogs);
  });
  return;
};
