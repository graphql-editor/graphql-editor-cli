import { logger } from '@/common/log/index.js';
import { stuccoRun } from '@/common/stucco/index.js';
import { typescriptServer } from '@/common/typescriptServer.js';
import { DEPLOY_FILE, STUCCO_FILE } from '@/gshared/constants/index.js';
import path from 'path';
import fs from 'fs';
import process from 'node:process';

let killing = false;
let changingFile = false;

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
  const fileServer = fs.watch(process.cwd(), (e, f) => {
    if (changingFile) return;
    if (f === STUCCO_FILE || f.startsWith('.env')) {
      changingFile = true;
      onCreateStucco().then((e) => {
        changingFile = false;
      });
    }
  });
  const close = () => {
    if (killing) return;
    killing = true;
    logger('Exiting gracefully...', 'loading');
    fileServer.close();
    logger('FileServer closed', 'loading');
    tsServer.close();
    logger('TsServer closed', 'loading');
    onCloseStucco();
    logger('Gecli server closed', 'info');
  };
  process.on('', () => {
    close();
  });
  process.on('SIGINT', () => {
    close();
  });
  return;
};
