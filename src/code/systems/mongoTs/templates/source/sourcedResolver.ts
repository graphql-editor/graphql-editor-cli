import { ParserField } from 'graphql-zeus';

export const sourcedResolver = ({
  collection,
  field,
  resolverParent,
  source,
}: {
  collection: string;
  field: ParserField;
  resolverParent: string;
  source: ParserField;
}) => `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { DB } from "../db/mongo";
import {
  ResolverType,
  ValueTypes,
  ${source.name},
} from "../graphql-zeus";
import { ${collection} } from "../db/collections";

export const handler = async (
  input: FieldResolveInput
): Promise<FieldResolveOutput> => {
  const ${source.name}Source = input.source as ${source.name};
  const args = input.arguments as ResolverType<
    ValueTypes["${resolverParent}"]["${field.name}"]
  >;
  const db = await DB();
  const col = await db.collection(${collection});
  // Return your response here
  return undefined;
};

`;
