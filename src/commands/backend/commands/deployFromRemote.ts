import { Config } from '@/Configuration';
import { Editor } from '@/Editor';
import { ValueTypes } from '@/zeus';
export const CommandDeployRemote = async ({
  namespace,
  project,
  backendZip,
  env,
  buildScript = 'build',
}: {
  namespace?: string;
  project?: string;
  backendZip?: string;
  env?: ValueTypes['Secret'][];
  buildScript?: string;
}) => {
  const resolve = await Config.configure({ namespace, project, backendZip }, ['namespace', 'project', 'backendZip']);
  const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  if (!p.inCloud) {
    await Editor.deployProjectToCloud(p.id);
  }
  const deploymentId = await Editor.deployRepoToSharedWorker(p.id, resolve.backendZip, {
    secrets: env,
    node14Opts: {
      buildScript,
    },
  });

  const socket = await Editor.showDeploymentLogs(deploymentId);
  console.log('Starting deployment...');
  socket.on(({ watchLogs }) => {
    console.log(watchLogs);
  });
  return;
};
