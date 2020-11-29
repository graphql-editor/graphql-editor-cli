import { ParserField } from 'graphql-zeus';
import { dbResolver } from '../../functions';

export const crudBase = ({
  collection,
  resolverParent,
  field,
  sourceType,
  modelName,
}: {
  collection: string;
  resolverParent: string;
  field: ParserField;
  modelName: string;
  sourceType?: string;
}) => {
  return dbResolver({
    field,
    resolverParent,
    source: sourceType,
    modelName,
    body: `
  return Orm<${modelName}>(db,'${collection}')
  // write your functions after the .
    `,
  });
};
