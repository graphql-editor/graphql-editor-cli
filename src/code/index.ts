import fs from 'fs';
import path from 'path';
import { Parser, TreeToTS, TreeToGraphQL, TypeDefinition } from 'graphql-zeus';
import * as systems from './systems';
import * as centaur from './centaur';
import { Config, Configuration } from '../Configuration';
import { AutocompleteInputPrompt } from '../utils';

const { common, mongoTs } = systems;

export interface SchemaFileAnswers {
  schema_path: string;
}
const readZeus = (schemaFile: string) => {
  const parseSchema = Parser.parseAddExtensions(schemaFile);
  const zeusFile = TreeToTS.resolveTree(parseSchema, 'node');
  fs.writeFileSync(path.join(process.cwd(), Config.get('srcdir'), 'graphql-zeus.ts'), zeusFile);
  fs.writeFileSync(path.join(process.cwd(), 'schema.graphql'), schemaFile);
  return parseSchema;
};

export const code = async () => {
  new Configuration();
  const { source } = Config.conf();
  const schema = await Config.getSchema(source);
  const schemaTree = readZeus(schema);
  const systemTypes = Object.keys(systems);
  const systemType = (await AutocompleteInputPrompt(systemTypes, {
    name: 'systemType',
    message: 'Choose system type',
  })) as keyof typeof systems;
  await systems[systemType].System(schema, schemaTree);
};
