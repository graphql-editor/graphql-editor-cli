import path from 'path';
import { Config } from '@/Configuration';
import { ParserField } from 'graphql-js-tree';

export const getPaths = async ({
  resolverField,
  resolverParentName,
  extension = 'ts',
  backendLib,
  backendSrc,
}: {
  resolverParentName: string;
  resolverField: ParserField;
  extension: string;
  backendSrc?: string;
  backendLib?: string;
}) => {
  const resolved = await Config.configure({ backendLib, backendSrc }, ['backendSrc', 'backendLib']);
  const basePath = process.cwd();
  const srcDir = path.join(basePath, resolved.backendSrc);
  const resolverPath = path.join(srcDir, resolverParentName, `${resolverField.name}.${extension}`);
  const resolverLibPath = path.join(resolved.backendLib, resolverParentName, `${resolverField.name}`);
  return { resolverPath, resolverLibPath, ...getBasePaths({ backendSrc: resolved.backendSrc }) };
};
export const getBasePaths = ({ backendSrc }: { backendSrc: string }) => {
  const basePath = process.cwd();
  const srcDir = path.join(basePath, backendSrc);
  const modelsPath = path.join(srcDir, 'models');
  return { basePath, modelsPath };
};
