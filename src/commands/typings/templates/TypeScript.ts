import { Parser } from 'graphql-js-tree';
import { Environment, TreeToTS } from 'graphql-zeus';

export const TypeScript = (schema: string, env: Environment, host?: string) => {
  const tree = Parser.parseAddExtensions(schema);
  return TreeToTS.resolveTreeSplit(tree, env, host);
};
