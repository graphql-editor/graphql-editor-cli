import { Environment, Parser, TreeToTS } from 'graphql-zeus';

export const Javascript = (schema: string, env: Environment, host: string) => {
  const tree = Parser.parseAddExtensions(schema);
  return TreeToTS.javascript(tree, env, host).javascript;
};

export const JavascriptDefinitions = (schema: string, env: Environment, host: string) => {
  const tree = Parser.parseAddExtensions(schema);
  return TreeToTS.javascript(tree, env, host).definitions;
};
