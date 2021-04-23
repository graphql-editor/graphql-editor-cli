import { Config } from '@/Configuration';

export const initConfiguration = async (): Promise<void> => {
  Config.configure({
    namespace: undefined,
    project: undefined,
    version: undefined,
  });
  return;
};
