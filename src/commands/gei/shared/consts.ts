import path from 'path';

export const GEI_FOLDER = 'gei';
export const DEFAULT_SRC_FOLDER = 'src';
export const INTEGRATION_FILE = 'integration.ts';
export const GEI_FILE = 'gei.ts';

export const DEFAULT_INTEGRATION_PATH = path.join(DEFAULT_SRC_FOLDER, GEI_FOLDER, INTEGRATION_FILE);
export const DEFAULT_GEI_PATH = path.join(DEFAULT_SRC_FOLDER, GEI_FOLDER, GEI_FILE);
export const gei = (filesPath: string) =>
  path.join(process.cwd(), filesPath || DEFAULT_SRC_FOLDER, GEI_FOLDER, INTEGRATION_FILE);
