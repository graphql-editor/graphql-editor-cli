import fs from 'fs';
import path from 'path';
import { logger } from '@/common/log/index.js';
import { ChildProcess } from 'child_process';
import { SIGINT } from 'constants';
import { terminate, spawnPromise } from '@/common/spawn.js';
import { platform } from 'os';
import { findNodeModules } from '@/api.js';

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
const toFile = (s: string) => {
  const p = platform();
  if (p === 'win32') {
    return '/' + s.split(path.sep).slice(1).join(path.posix.sep);
  }
  return s;
};

export const stuccoRun = async (props?: {
  schemaPath?: string;
  configPath?: string;
  basePath?: string;
  cwd?: string;
}) => {
  const nodeModules = findNodeModules(props?.basePath || process.cwd());
  const stuccoPath = path.join(nodeModules, '.bin');
  const bin = path.join(
    stuccoPath,
    platform() === 'win32' ? 'stucco.cmd' : 'stucco',
  );
  const args: string[] = ['local', 'start'];
  if (props?.schemaPath) args.push('-s', toFile(props.schemaPath));
  if (props?.configPath) args.push('-c', toFile(props.configPath));

  let stuccoChildProcess: ChildProcess | undefined;
  let taskRunning = false;

  return {
    onCreateStucco: async (stuccoProps?: { envs?: Record<string, string> }) => {
      if (taskRunning) return;
      taskRunning = true;
      try {
        const code = await terminate(stuccoChildProcess);
        if (code)
          logger(`stucco terminated with non 0 status: ${code}`, 'error');
        stuccoChildProcess = await spawnPromise({
          args,
          cwd: props?.cwd,
          cmd: bin,
          basePath: props?.basePath,
          envs: stuccoProps?.envs,
        });
      } finally {
        taskRunning = false;
      }
    },
    onCloseStucco: () => {
      stuccoChildProcess?.kill(SIGINT);
    },
  };
};
