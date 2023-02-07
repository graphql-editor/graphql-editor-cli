import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { DEFAULT_INTEGRATION_PATH } from '@/commands/gei/shared/consts.js';
import { Config } from '@/Configuration/index.js';

const makeAbs = ({ integrationPath }: { integrationPath: string }) => {
  if (integrationPath && !path.isAbsolute(integrationPath)) {
    integrationPath = path.join(process.cwd(), integrationPath);
  }
  return { integrationPath };
};
export const integrateStuccoJson = async (props?: {
  integrationPath?: string;
}) => {
  const { integrationPath } = makeAbs(
    await Config.configure(
      {
        integrationPath: props?.integrationPath,
      },
      ['integrationPath'],
    ),
  );
  const stuccoPath = path.join(process.cwd(), 'stucco.json');
  const defaultPath = path.join(process.cwd(), DEFAULT_INTEGRATION_PATH);
  const integrationFile = integrationPath
    ? integrationPath
    : fs.existsSync(defaultPath)
    ? defaultPath
    : path.join(process.cwd(), 'src/index.ts');

  const existIntegrationFile = fs.existsSync(integrationFile);
  if (!existIntegrationFile) {
    throw new Error(
      'integration.ts does not exist. Please create integration.ts file in ./src integration folder or provide other path',
    );
  }

  try {
    const pathToIntegrate = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '..',
      '..',
      '..',
      'lib',
      'integrations',
      'integrate.js',
    );
    const proc = spawn(
      'node',
      [
        '--loader',
        'ts-node/esm',
        pathToIntegrate,
        '-s',
        stuccoPath,
        '-i',
        integrationFile,
      ],
      {
        cwd: process.cwd(),
        stdio: ['ignore', 'ignore', 'pipe'],
      },
    );
    let stderr = [] as Uint8Array[];
    proc.stderr.on('data', (data) => {
      stderr = stderr.concat(data);
    });
    const code = await new Promise<number | null>((resolve) =>
      proc.on('exit', (code) => resolve(code)),
    );
    if (code !== 0) {
      throw new Error(
        `Error creating integration, exit code ${code}.\n${Buffer.concat(
          stderr,
        ).toString()}`,
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error('Could not spawn integration subtask');
  }
};
