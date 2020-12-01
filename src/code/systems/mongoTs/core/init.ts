import path from 'path';
import fs from 'fs';
import { db, operations } from '@/code/systems/mongoTs/templates';
import { Config } from '@/Configuration';
import { ParserField, TypeDefinition } from 'graphql-zeus';
import { generateModelsFile, getModel } from './models';

const createUtils = () => {
  const srcdir = path.join(Config.projectPath, Config.get('srcdir'));
  if (!fs.existsSync(srcdir)) {
    fs.mkdirSync(srcdir, { recursive: true });
  }
};
const createOrmEngine = () => {
  const dbDir = path.join(Config.projectPath, Config.get('srcdir'), 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  fs.writeFileSync(path.join(dbDir, 'orm.ts'), operations().ts);
};
const createDbAndDbDir = () => {
  const dbDir = path.join(Config.projectPath, Config.get('srcdir'), 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'mongo.ts');
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(path.join(dbDir, 'mongo.ts'), db({ name: Config.get('name') }).ts);
  }
};
export const init = (collectionPath: string, modelsPath: string, nodes: ParserField[]) => {
  createUtils();
  createDbAndDbDir();
  createOrmEngine();
  generateModelsFile(collectionPath, modelsPath, nodes);
};
