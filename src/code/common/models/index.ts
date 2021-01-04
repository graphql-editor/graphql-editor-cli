import { ParserField } from 'graphql-zeus';

export type functionParams = {
  resolverParentName: string;
  resolverField: ParserField;
  rootTypes: ParserField[];
  sourceType?: string;
  schema: string;
};
