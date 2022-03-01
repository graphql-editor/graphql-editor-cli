import { logger } from '@/common/log/index.js';
import Tscwatch from 'tsc-watch/client.js';
import { stucco } from 'stucco-js/lib/stucco/run.js';
import { ChildProcessByStdio, spawn } from 'child_process';
import { SIGINT, SIGTERM } from 'constants';

const client = new Tscwatch();

export const CommandDev = async ({ namespace, project }: { namespace?: string; project?: string }) => {
  const bin = await stucco();
  const args = ['local', 'start'];
  let child: ChildProcessByStdio<null, null, null> | undefined;
  process.on('SIGTERM', () => {
    child?.kill(SIGINT);
  });
  process.on('SIGINT', () => {
    child?.kill(SIGINT);
  });
  client.on('success', () => {
    child?.kill(SIGINT);
    child = spawn(bin.path(), args, {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    logger('tsc success', 'success');
  });
  client.on('compile_errors', () => {
    logger('tsc error', 'error');
  });
  client.start();
  return;
};
