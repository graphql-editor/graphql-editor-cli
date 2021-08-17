import { ParserField } from 'graphql-js-tree';

export type functionParams = {
  resolverParentName: string;
  resolverField: ParserField;
  rootTypes: ParserField[];
  sourceType?: string;
  schema: string;
};
