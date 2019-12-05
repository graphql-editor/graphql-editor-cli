import { ParserField } from 'graphql-zeus';

export const listFilter = ({
  collection,
  resolverParent,
  field,
}: {
  collection: string;
  resolverParent: string;
  field: ParserField;
}) => `
import { IFieldResolveInput, IFieldResolveOutput } from "stucco-js";
import { ${collection} } from "../db/collections";
import { DB } from "../db/mongo";
import { Utils } from "../Utils";
import { ${field.type.name}${
  field.args && field.args.length > 0 ? `, ResolverType, ValueTypes ` : ''
}} from "../graphql-zeus";

export const handler = async (
  input: IFieldResolveInput,
): Promise<IFieldResolveOutput> => {
  try {
    ${
      field.args && field.args.length > 0
        ? `const args = input.arguments as ResolverType<ValueTypes["${resolverParent}"]["${field.name}"]>;
    if (args) {
      // DO Something
    }`
        : ''
    }
    const db = await DB();
    const col = await db.collection(${collection});
    return {
      response: await Utils.CursorToGraphQLArray<${field.type.name}>(
        await col.find({}),
      ),
    };
  } catch (error) {
    return { error };
  }
};
`;
