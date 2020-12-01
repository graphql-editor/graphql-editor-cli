import path from 'path';
import { Config } from '@/Configuration';
import { ParserField } from 'graphql-zeus';

export const getPaths = (resolverParentName: string, resolverField: ParserField, extension: string = 'ts') => {
  const basePath = process.cwd();
  const srcDir = path.join(basePath, Config.get('srcdir'));
  const resolverPath = path.join(srcDir, resolverParentName, `${resolverField.name}.${extension}`);
  const resolverLibPath = path.join(Config.get('libdir'), resolverParentName, `${resolverField.name}`);
  return { resolverPath, resolverLibPath, ...getBasePaths() };
};
export const getBasePaths = () => {
  const basePath = process.cwd();
  const srcDir = path.join(basePath, Config.get('srcdir'));
  const modelsPath = path.join(srcDir, 'db', 'models');
  const collectionsPath = path.join(srcDir, 'db', 'collections.ts');
  return { collectionsPath, basePath, modelsPath };
};
