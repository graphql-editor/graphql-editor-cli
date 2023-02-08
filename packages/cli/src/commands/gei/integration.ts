import { Config } from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';

export const CommandPublishIntegration = async ({
  namespace,
  project,
  npmPackage,
  registry,
}: {
  namespace?: string;
  project?: string;
  npmPackage?: string;
  registry?: string;
}) => {
  const resolve = await Config.configure({ namespace, project, npmPackage, registry }, [
    'namespace',
    'project',
    'registry',
    'npmPackage',
  ]);
  const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  await Editor.publishIntegration(p.id, {
    npmRegistryPackage: {
      package: resolve.npmPackage,
      registry: resolve.registry,
    },
  });
  return;
};

export const CommandRemoveIntegration = async ({ namespace, project }: { namespace?: string; project?: string }) => {
  const resolve = await Config.configure({ namespace, project }, ['namespace', 'project']);
  const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  await Editor.removeIntegration(p.id);
  return;
};