import { Parser } from 'graphql-js-tree';
import { Environment, TreeToTS } from 'graphql-zeus';

export const Javascript = (schema: string, env: Environment, host: string) => {
  const tree = Parser.parseAddExtensions(schema);
  return TreeToTS.javascriptSplit({ tree, env, host });
};
