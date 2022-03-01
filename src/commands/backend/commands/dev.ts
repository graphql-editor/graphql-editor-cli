import { logger } from '@/common/log/index.js';
import Tscwatch from 'tsc-watch/client.js';
import { stucco } from 'stucco-js/lib/stucco/run.js';
import { ChildProcess, spawn } from 'child_process';
import { SIGINT } from 'constants';

const client = new Tscwatch();

const terminate = async (ch?: ChildProcess): Promise<void | number> => {
  if (!ch) return;
  const ret = new Promise<number>((resolve) => ch.on('close', (code: number) => resolve(code)));
  ch.kill(SIGINT);
  return ret;
};

const spawnPromise = async (cmd: string, args: string[]): Promise<ChildProcess> => {
  const child = spawn(cmd, args, {
    stdio: [process.stdin, process.stdout, process.stderr],
  });
  return new Promise<ChildProcess>((resolve, reject) => {
    child.on('error', reject);
    child.on('spawn', () => {
      child.off('error', reject);
      resolve(child);
    });
  });
};

export const CommandDev = async ({ namespace, project }: { namespace?: string; project?: string }) => {
  const bin = await stucco();
  const args = ['local', 'start'];
  let child: ChildProcess | undefined;
  let delay: NodeJS.Timeout | undefined;
  process.on('SIGTERM', () => {
    child?.kill(SIGINT);
  });
  process.on('SIGINT', () => {
    child?.kill(SIGINT);
  });
  client.on('success', () => {
    if (delay) clearTimeout(delay);
    delay = setTimeout(async () => {
      const ch = child;
      child = undefined;
      const code = await terminate(ch);
      logger(`${code}`, 'info');
      if (code) logger(`child terminated with non 0 status`, 'info');
      if (child) return;
      child = await spawnPromise(bin.path(), args);
      logger('tsc success', 'success');
    }, 1000);
  });
  client.on('compile_errors', () => {
    logger('tsc error', 'error');
  });
  client.start();
  return;
};
