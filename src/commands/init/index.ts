import { Config } from '@/Configuration';

export const initConfiguration = async ({
  namespace,
  project,
  version,
}: {
  namespace?: string;
  project?: string;
  version?: string;
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
