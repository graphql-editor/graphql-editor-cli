export const oneInputCreate = ({
  collection,
  resolverName,
  resolverParent,
  type,
  input,
}: {
  collection: string;
  type: string;
  resolverName: string;
  resolverParent: string;
  input: string;
}) => `
import { IFieldResolveInput, IFieldResolveOutput } from "stucco-js";
import { ${collection} } from "../db/collections";
import { DB } from "../db/mongo";
import { ${type}, ResolverType, ValueTypes } from "../graphql-zeus";
import { Utils } from "../Utils";

export const handler = async (
  input: IFieldResolveInput,
): Promise<IFieldResolveOutput> => {
  try {
    const args = input.arguments as ResolverType<ValueTypes["${resolverParent}"]["${resolverName}"]>;
    const db = await DB();
    const col = await db.collection(${collection});
    const inserted = await col.insertOne(args.${input});
    return {
      response: Utils.mongoToGraphQL<${type}>({
        ...args.${input},
        id: inserted.insertedId,
      }),
    };
  } catch (error) {
    return { error };
  }
};
`;
