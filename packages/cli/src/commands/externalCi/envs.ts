import { Config, Configuration } from '@/Configuration/index.js';
import { getEnvFile } from '@/common/envs.js';
import { logger } from '@/common/log/index.js';
import fs from 'fs';
import path from 'path';
export const CommandEnvs = () => {
  const envFile = getEnvFile();
  if (!envFile) {
    logger(
      'No .env file in current path. Please create .env file first',
      'error',
    );
    return;
  }
  const commaSeparatedEnvKeys = Object.keys(envFile.content).join(',');
  Config.set({
    azureEnv: commaSeparatedEnvKeys,
  });
  logger(
    `Successfully wrote .env keys to ${Configuration.CONFIG_NAME} file.`,
    'success',
  );
  return;
};

export const CommandGenerateEnvs = () => {
  const envFile = getEnvFile();
  const envKeysInConfig = Config.get('azureEnv')?.split(',');
  const envKeysInFile = envFile ? Object.keys(envFile.content) : [];
  const keysInConfigButNotInFile = envKeysInConfig.filter(
    (k) => !envKeysInFile.includes(k),
  );
  const mappedKeysAddon = keysInConfigButNotInFile
    .map((k) => `${k}=`)
    .join('\n');

  fs.appendFileSync(
    envFile?.path || path.join(process.cwd(), '.env'),
    envFile?.path ? '\n' + mappedKeysAddon : mappedKeysAddon,
  );

  logger(
    `Successfully synchronized ${Configuration.CONFIG_NAME} envs to .env file.`,
    'success',
  );
  return;
};
