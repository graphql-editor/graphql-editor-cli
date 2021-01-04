import { AutocompleteInputPrompt } from '@/utils';
import { ParserTree, TypeDefinition } from 'graphql-zeus';
import * as generators from './generators';
import * as templates from './templates';
import * as centaur from '@/code/centaur';
export { generators, templates };

export const System = async (schema: string, schemaTree: ParserTree) => {
  const generatorType = (await AutocompleteInputPrompt(Object.keys(generators), {
    name: 'generatorType',
    message: 'Choose generator type',
  })) as keyof typeof generators;

  const rootTypes = schemaTree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition);

  if (generatorType === 'update') {
    generators['update']({ rootTypes });
    return;
  }

  const typeNodes = schemaTree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition);
  typeNodes.sort((a, b) => (a.name > b.name ? 1 : -1));
  const { resolver, parentResolver } = await centaur.generators.TypeResolver(schemaTree);
  generators[generatorType]({
    resolverField: resolver,
    resolverParentName: parentResolver,
    rootTypes,
    schema,
  });
};
