import { ParserField } from 'graphql-zeus';

export const resolver = ({ field, resolverParent }: { resolverParent: string; field: ParserField }) => `
import { IFieldResolveInput, IFieldResolveOutput } from "stucco-js";
import { DB } from "../db/mongo";
import { ResolverType, ValueTypes } from '../graphql-zeus';

export const handler = async (
  input: IFieldResolveInput,
): Promise<IFieldResolveOutput> => {
  const args = input.arguments as ResolverType<ValueTypes['${resolverParent}']['${field.name}']>;
  try {
    const db = await DB();
    return {
      // Return your resolver data here
      response: undefined,
    };
  } catch (error) {
    return {
      error,
    };
  }
};
`;
