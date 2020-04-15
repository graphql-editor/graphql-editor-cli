export const oneInputCreate = ({
  collection,
  resolverName,
  resolverParent,
  type,
  input,
  sourceType = '',
}: {
  collection: string;
  type: string;
  resolverName: string;
  resolverParent: string;
  input: string;
  sourceType?: string;
}) => `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { ${collection} } from "../db/collections";
import { DB } from "../db/mongo";
import { ${type}, ${sourceType ? `${sourceType}, ` : ''}ResolverType, ValueTypes } from "../graphql-zeus";
import { Utils } from "../Utils";

export const handler = async (
  input: FieldResolveInput,
): Promise<FieldResolveOutput> => {
    ${sourceType ? `const source = input.source as ${sourceType}` : ''}
    const args = input.arguments as ResolverType<ValueTypes["${resolverParent}"]["${resolverName}"]>;
    const db = await DB();
    const col = await db.collection(${collection});
    const inserted = await col.insertOne(args.${input});
    return Utils.mongoToGraphQL<${type}>({
        ...args.${input},
        id: inserted.insertedId,
      })
};
`;
