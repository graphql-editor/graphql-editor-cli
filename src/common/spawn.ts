import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import { SIGINT } from 'constants';

export const terminate = async (ch?: ChildProcess): Promise<void | number> => {
  if (!ch) return;
  const ret = new Promise<number>((resolve) =>
    ch.on('close', (code: number) => resolve(code)),
  );
  ch.kill(SIGINT);
  return ret;
};

export const spawnPromise = async (
  cmd: string,
  args: string[],
): Promise<ChildProcess> => {
  const child = spawn(cmd, args, {
    stdio: [process.stdin, process.stdout, process.stderr],
    env: {
      ['PATH']: `${path.join(process.cwd(), 'node_modules', '.bin')}:${
        process.env.PATH
      }`,
    },
  });
  return new Promise<ChildProcess>((resolve, reject) => {
    child.on('error', reject);
    child.on('spawn', () => {
      child.off('error', reject);
      resolve(child);
    });
  });
};
