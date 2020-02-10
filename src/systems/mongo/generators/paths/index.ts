import path from 'path';
import { Config } from '../../../../Configuration';
import { ParserField } from 'graphql-zeus';

export const getPaths = (resolverParentName: string, resolverField: ParserField) => {
  const basePath = process.cwd();
  const srcDir = path.join(basePath, Config.get('srcdir'));
  const collectionsPath = path.join(srcDir, 'db', 'collections.ts');
  const resolverPath = path.join(srcDir, resolverParentName, `${resolverField.name}.ts`);
  const resolverLibPath = path.join(Config.get('libdir'), resolverParentName, `${resolverField.name}`);
  return { resolverPath, collectionsPath, basePath, resolverLibPath };
};
