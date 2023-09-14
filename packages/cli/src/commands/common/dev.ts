import { logger } from '@/common/log/index.js';
import { stuccoRun } from '@/common/stucco/index.js';
import { typescriptServer } from '@/common/typescriptServer.js';
import { DEPLOY_FILE, STUCCO_FILE } from '@/gshared/constants/index.js';
import path from 'path';
import fs from 'fs';
import process from 'node:process';
import { getEnvFile } from '@/common/envs.js';

let killing = false;
let changingFile = false;
const MAX_NEST = 10;

const traverseDirToRoot = (iteration: number) => {
  const execDir = process.cwd().split('/');
  let finalPath = '';
  for (let index = 0; index < execDir.length - iteration; index++) {
    finalPath += execDir[index];
  }
  return finalPath[1] === '/' ? finalPath.substring(1) : finalPath;
};

const tryRunStuccoWithDynamicPath = async () => {
  for (let index = 0; index < MAX_NEST; index++) {
    const basePath = traverseDirToRoot(index);
    if (basePath.length === 0) {
      break;
    }
    try {
      const { onCloseStucco, onCreateStucco } = await stuccoRun({
        basePath: basePath,
        schemaPath: path.join(process.cwd(), DEPLOY_FILE),
        configPath: path.join(process.cwd(), STUCCO_FILE),
      });
      return { onCloseStucco, onCreateStucco };
    } catch (e) {}
  }
  throw new Error('cannot find stucco binary');
};

export const CommandDev = async () => {
  const { onCloseStucco, onCreateStucco } = await tryRunStuccoWithDynamicPath();

  const tsServer = typescriptServer({
    searchPath: './',
    onCreate: async () => {
      const envFile = getEnvFile();
      await onCreateStucco({
        envs: envFile?.content,
      });
    },
  });
  const fileServer = fs.watch(process.cwd(), (e, f) => {
    if (changingFile) return;
    if (f === STUCCO_FILE || f.startsWith('.env') || f.endsWith('.graphql')) {
      const envFile = getEnvFile();
      changingFile = true;
      onCreateStucco({
        envs: envFile?.content,
      }).then((e) => {
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
