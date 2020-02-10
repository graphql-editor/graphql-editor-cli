export const remove = ({
  collection,
  pk,
  resolverName,
  resolverParent,
}: {
  collection: string;
  pk: string;
  resolverParent: string;
  resolverName: string;
}) => `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { ${collection} } from "../db/collections";
import { DB } from "../db/mongo";
import { ResolverType, ValueTypes } from "../graphql-zeus";${pk === 'id' ? `\nimport { ObjectID } from "bson";` : ''}

export const handler = async (
  input: FieldResolveInput,
): Promise<FieldResolveOutput> => {
    const { ${pk} } = input.arguments as ResolverType<ValueTypes["${resolverParent}"]["${resolverName}"]>;
    const db = await DB();
    const col = await db.collection(${collection});
    await col.deleteOne(${pk === 'id' ? `{ _id: new ObjectID(${pk})  }` : `{ ${pk} }`});
    return true
}
`;
