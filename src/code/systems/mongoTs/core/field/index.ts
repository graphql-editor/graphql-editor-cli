import { ParserField, ScalarTypes } from 'graphql-zeus';
import { AutocompleteInputPrompt } from '@/utils';

export const getField = async (resolverField: ParserField, rootTypes: ParserField[]) => {
  const returnTypeScalar = Object.keys(ScalarTypes).includes(resolverField.type.name);
  const fieldName: string = returnTypeScalar
    ? await AutocompleteInputPrompt(
        rootTypes.map((rt) => rt.name),
        {
          message: 'specify collection Type',
          name: 'collection',
        },
      )
    : resolverField.type.name;
  return rootTypes.find((rt) => rt.name === fieldName)!;
};
