import { ParserField } from 'graphql-zeus';

export const resolver = ({ field, resolverParent }: { resolverParent: string; field: ParserField }) => `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { DB } from "../db/mongo";
import { ResolverType, ValueTypes } from '../graphql-zeus';

export const handler = async (
  input: FieldResolveInput,
): Promise<FieldResolveOutput> => {
  const args = input.arguments as ResolverType<ValueTypes['${resolverParent}']['${field.name}']>;
  const db = await DB();
  // Return your resolver data here
  return undefined
};
`;
