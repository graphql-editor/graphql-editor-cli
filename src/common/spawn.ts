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

export const spawnPromise = async ({
  args,
  cmd,
  basePath = process.cwd(),
  cwd = process.cwd(),
}: {
  cmd: string;
  args: string[];
  basePath?: string;
  cwd?: string;
}): Promise<ChildProcess> => {
  const child = spawn(cmd, args, {
    stdio: [process.stdin, process.stdout, process.stderr],
    cwd,
    env: {
      ...process.env,
      cwd: process.cwd(),
      ['PATH']: `${path.join(basePath, 'node_modules', '.bin')}:${
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
