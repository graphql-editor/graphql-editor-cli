import { Config } from '@/Configuration/index.js';

export const initConfiguration = async ({
  namespace,
  project,
  version,
}: {
  namespace?: string;
  project?: string;
  version?: string;
  schemaDir?: string | null;
}): Promise<void> => {
  Config.configure(
    {
      namespace,
      project,
      version,
    },
    ['namespace', 'project', 'version'],
  );
  return;
};
