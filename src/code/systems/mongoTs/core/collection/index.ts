import { ParserField } from 'graphql-zeus';
import { HandleTemplates } from '@/code/common';

export const getCollection = (collectionsPath: string, field: ParserField) => {
  const collection: string = `${field.name}Collection`;
  HandleTemplates.action({
    type: 'append',
    path: collectionsPath,
    content: `\nexport const ${collection} = "${collection}"`,
  });
  return collection;
};
