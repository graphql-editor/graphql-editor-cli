import { Config } from '@/Configuration';
import { Editor } from '@/Editor';
export const CommandDeploy = async ({
  namespace,
  project,
  backendZip,
}: {
  namespace?: string;
  project?: string;
  backendZip?: string;
}) => {
  const resolve = await Config.configure({ namespace, project, backendZip }, ['namespace', 'project', 'backendZip']);
  const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  const deploymentId = await Editor.deployRepoToSharedWorker(p.id, resolve.backendZip);
  console.log(`Successfully deployed ${backendZip} to shared worker with deployment id: ${deploymentId}`);
  return;
};
