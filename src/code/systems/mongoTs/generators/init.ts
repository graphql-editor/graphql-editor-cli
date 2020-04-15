import path from 'path';
import fs from 'fs';
import { utils, db } from '../templates';
import { Config } from '../../../../Configuration';

const createUtils = () => {
  const srcdir = path.join(Config.projectPath, Config.get('srcdir'));
  if (!fs.existsSync(srcdir)) {
    fs.mkdirSync(srcdir, { recursive: true });
  }
  fs.writeFileSync(path.join(srcdir, 'Utils.ts'), utils.ts);
};
const createDbAndDbDir = () => {
  const dbDir = path.join(Config.projectPath, Config.get('srcdir'), 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  fs.writeFileSync(path.join(dbDir, 'mongo.ts'), db({ name: Config.get('name') }).ts);
};

export const init = () => {
  createUtils();
  createDbAndDbDir();
};
