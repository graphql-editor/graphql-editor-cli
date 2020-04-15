import { ParserField } from 'graphql-zeus';

export const rest = ({ field, resolverParent, url }: { resolverParent: string; field: ParserField; url: string }) => `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { ResolverType, ValueTypes } from '../graphql-zeus';
import fetch from 'node-fetch';

export const handler = async (
  input: FieldResolveInput,
): Promise<FieldResolveOutput> => {
  const args = input.arguments as ResolverType<ValueTypes['${resolverParent}']['${field.name}']>;
  // Return your resolver data here
  const result = await fetch('${url}')
  const response = await result.json()
  return response
};
`;
