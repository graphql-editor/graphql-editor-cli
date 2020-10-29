import fs from 'fs';
import path from 'path';
import { Parser, TreeToTS, TreeToGraphQL, TypeDefinition } from 'graphql-zeus';
import * as systems from './systems';
import * as centaur from './centaur';
import { Config, Configuration } from '../Configuration';
import { AutocompleteInputPrompt } from '../utils';

const { mongoTs: mongo, common } = systems;

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
  const schemaTree = readZeus(await Config.getSchema(source));
  const systemTypes = ['database', 'common'];
  const systemType = (await AutocompleteInputPrompt(systemTypes, {
    name: 'systemType',
    message: 'Choose system type',
  })) as 'database' | 'common';
  if (systemType === 'common') {
    const generatorType = (await AutocompleteInputPrompt(Object.keys(common.generators), {
      name: 'generatorType',
      message: 'Choose generator type',
    })) as keyof typeof common.generators;
    const typeNodes = schemaTree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition);
    typeNodes.sort((a, b) => (a.name > b.name ? 1 : -1));
    const { resolver, parentResolver } = await centaur.generators.TypeResolver(schemaTree);
    common.generators[generatorType]({
      resolverField: resolver,
      resolverParentName: parentResolver,
      rootTypes: schemaTree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition),
    });
  }
  if (systemType === 'database') {
    const generatorType = (await AutocompleteInputPrompt(Object.keys(mongo.generators), {
      name: 'generatorType',
      message: 'Choose generator type',
    })) as keyof typeof mongo.generators;
    const typeNodes = schemaTree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition);
    typeNodes.sort((a, b) => (a.name > b.name ? 1 : -1));
    const { resolver, parentResolver } = await centaur.generators.TypeResolver(schemaTree);
    mongo.generators[generatorType]({
      resolverField: resolver,
      resolverParentName: parentResolver,
      rootTypes: schemaTree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition),
    });
  }
};
