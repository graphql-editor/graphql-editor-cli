import { ParserField } from 'graphql-zeus';
import { dbResolver } from '../../functions';

export const crudBase = ({
  collection,
  resolverParent,
  field,
  sourceType,
}: {
  collection: string;
  resolverParent: string;
  field: ParserField;
  sourceType?: string;
}) => {
  return dbResolver({
    field,
    resolverParent,
    source: sourceType,
    body: `
  return Orm(db,'${collection}')
  // write your functions after the .
    `,
  });
};
