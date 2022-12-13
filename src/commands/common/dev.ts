import { logger } from '@/common/log/index.js';
import { stuccoRun } from '@/common/stucco/index.js';
import { typescriptServer } from '@/common/typescriptServer.js';
import { DEPLOY_FILE, STUCCO_FILE } from '@/gshared/constants/index.js';
import path from 'path';

export const CommandDev = async () => {
  const { onCloseStucco, onCreateStucco } = await stuccoRun({
    schemaPath: path.join(process.cwd(), DEPLOY_FILE),
    configPath: path.join(process.cwd(), STUCCO_FILE),
  });
  const tsServer = typescriptServer({
    searchPath: './',
    onCreate: async () => {
      await onCreateStucco();
    },
  });
  const close = () => {
    tsServer.close();
    onCloseStucco();
  };
  process.on('SIGTERM', () => {
    close();
  });
  process.on('SIGINT', () => {
    close();
  });
  return;
};
