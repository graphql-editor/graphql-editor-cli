import { Config } from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';
import {
  CLOUD_FOLDERS,
  DEPLOY_FILE,
  STUCCO_FILE,
} from '@/gshared/constants/index.js';
import path from 'path';
import { logger } from '@/common/log/index.js';
import { projectInstall } from 'pkg-install';
import { typescriptServer } from '@/common/typescriptServer.js';
import { pusherSync } from '@/common/pusherSync.js';
import {
  receiveLiveFiles,
  removeInitialFiles,
  writeInitialFiles,
} from '@/common/liveFiles.js';
import { stuccoRun } from '@/common/stucco/index.js';
import ora from 'ora';

const TEMP = './.gecli';
const EVENT = 'client-live-files';
export const CommandSync = async ({
  namespace,
  project,
}: {
  namespace?: string;
  project?: string;
}) => {
  const resolve = await Config.configure({ namespace, project }, [
    'namespace',
    'project',
  ]);
  const p = await Editor.fetchProject({
    accountName: resolve.namespace,
    projectName: resolve.project,
  });
  const TEMPPATH = path.join(process.cwd(), TEMP);
  const s3Files = p.sources?.sources?.filter((s) =>
    s.filename?.startsWith(CLOUD_FOLDERS['microserviceJs'] + '/'),
  );
  await writeInitialFiles(TEMPPATH, s3Files);
  const loadingInstall = ora('Installing npm packages').start();
  await projectInstall({
    cwd: TEMPPATH,
  });
  loadingInstall.succeed();
  const { onCloseStucco, onCreateStucco } = await stuccoRun({
    configPath: path.join(TEMPPATH, STUCCO_FILE),
    schemaPath: path.join(TEMPPATH, DEPLOY_FILE),
    basePath: TEMPPATH,
    cwd: TEMPPATH,
  });

  const tsServer = typescriptServer({
    searchPath: TEMPPATH,
    onCreate: async () => {
      try {
        await onCreateStucco();
        logger('tsc success', 'success');
      } finally {
      }
    },
  });
  const { ch } = pusherSync({
    namespace: resolve.namespace,
    project: resolve.project,
  });
  ch.bind(EVENT, (data: any) => receiveLiveFiles(data));
  // make sync double sided also listen to file changes
  return new Promise((resolve, reject) => {
    const close = () => {
      onCloseStucco();
      tsServer.close();
      removeInitialFiles(TEMPPATH);
    };
    process.on('SIGTERM', () => {
      close();
    });
    process.on('SIGINT', () => {
      console.log('You clicked Ctrl+C!');
      close();
      resolve('ok');
      process.exit(1);
    });
  });
};
