import { AutocompleteInputPrompt } from '@/utils';
import { ParserTree } from 'graphql-zeus';
import * as generators from './generators';
import * as templates from './templates';
export { generators, templates };

export const System = async (schema: string, schemaTree: ParserTree) => {
  const generatorType = (await AutocompleteInputPrompt(Object.keys(generators), {
    name: 'generatorType',
    message: 'Choose generator type',
  })) as keyof typeof generators;
  generators[generatorType]({
    schema,
  });
};
