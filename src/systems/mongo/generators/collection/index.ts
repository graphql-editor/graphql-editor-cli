import inquirer from 'inquirer';
import { ParserField, ScalarTypes } from 'graphql-zeus';
import { HandleTemplates } from '../../../../handleTemplates';

export const getCollection = async (collectionsPath: string, resolverField: ParserField, rootTypes: ParserField[]) => {
  const returnTypeScalar = Object.keys(ScalarTypes).includes(resolverField.type.name);
  const collection: string = returnTypeScalar
    ? `${
        (
          await inquirer.prompt({
            type: 'list',
            message: 'specify collection Type',
            choices: rootTypes.map((rt) => rt.name),
            name: 'collection',
          })
        ).collection
      }Collection`
    : `${resolverField.type.name}Collection`;
  HandleTemplates.action({
    type: 'append',
    path: collectionsPath,
    content: `\nexport const ${collection} = "${collection}"`,
  });
  return collection;
};
