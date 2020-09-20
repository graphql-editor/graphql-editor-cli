import { ParserField } from 'graphql-zeus';
import { HandleTemplates } from '@/code/common';

export const getCollection = async (collectionsPath: string, field: ParserField, rootTypes: ParserField[]) => {
  const collection: string = `${field.type.name}Collection`;
  HandleTemplates.action({
    type: 'append',
    path: collectionsPath,
    content: `\nexport const ${collection} = "${collection}"`,
  });
  return collection;
};
