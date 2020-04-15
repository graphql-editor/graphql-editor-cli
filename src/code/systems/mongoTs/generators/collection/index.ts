import inquirer from 'inquirer';
import { ParserField, ScalarTypes } from 'graphql-zeus';
import { HandleTemplates } from '../../../../handleTemplates';
import { AutocompleteInputPrompt } from '../../../../../utils';

export const getCollection = async (collectionsPath: string, resolverField: ParserField, rootTypes: ParserField[]) => {
  const returnTypeScalar = Object.keys(ScalarTypes).includes(resolverField.type.name);
  const collection: string = returnTypeScalar
    ? `${await AutocompleteInputPrompt(
        rootTypes.map((rt) => rt.name),
        {
          message: 'specify collection Type',
          name: 'collection',
        },
      )}Collection`
    : `${resolverField.type.name}Collection`;
  HandleTemplates.action({
    type: 'append',
    path: collectionsPath,
    content: `\nexport const ${collection} = "${collection}"`,
  });
  return collection;
};
