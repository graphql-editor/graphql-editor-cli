import { logger } from '@/common/log/index.js';
import { stuccoRun } from '@/common/stucco/index.js';
import { typescriptServer } from '@/common/typescriptServer.js';

export const CommandDev = async () => {
  const { onCloseStucco, onCreateStucco } = await stuccoRun();
  const tsServer = typescriptServer({
    searchPath: './',
    onCreate: async () => {
      try {
        await onCreateStucco();
        logger('tsc success', 'success');
      } finally {
      }
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
