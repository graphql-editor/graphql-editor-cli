import fs from 'fs';
import path from 'path';
import { logger } from '@/common/log/index.js';
import { stucco } from 'stucco-js/lib/stucco/run.js';
import { ChildProcess } from 'child_process';
import { SIGINT } from 'constants';
import { terminate, spawnPromise } from '@/common/spawn.js';

export const addStucco = ({
  basePath,
  stuccoResolverName,
  resolverLibPath,
}: {
  basePath: string;
  stuccoResolverName: string;
  resolverLibPath: string;
}) => {
  const stuccoPath = path.join(basePath, 'stucco.json');
  const stuccoFile = fs.existsSync(stuccoPath)
    ? JSON.parse(fs.readFileSync(stuccoPath).toString())
    : { resolvers: {} };
  const stuccoFileContent = {
    ...stuccoFile,
    resolvers: {
      ...stuccoFile.resolvers,
    },
  };
  stuccoFileContent.resolvers[stuccoResolverName] = {
    resolve: {
      name: resolverLibPath,
    },
  };
  fs.writeFileSync(stuccoPath, JSON.stringify(stuccoFileContent, null, 4));
};

export const stuccoRun = async () => {
  const bin = await stucco();
  const args = ['local', 'start'];

  let stuccoChildProcess: ChildProcess | undefined;
  let taskRunning = false;

  return {
    onCreateStucco: async () => {
      if (taskRunning) return;
      taskRunning = true;
      try {
        const code = await terminate(stuccoChildProcess);
        if (code)
          logger(`stucco terminated with non 0 status: ${code}`, 'error');
        stuccoChildProcess = await spawnPromise(bin, args);
      } finally {
        taskRunning = false;
      }
    },
    onCloseStucco: () => {
      stuccoChildProcess?.kill(SIGINT);
    },
  };
};
