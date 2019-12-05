export const upsert = ({
  collection,
  pk,
  resolverName,
  resolverParent,
}: {
  collection: string;
  pk: string;
  resolverName: string;
  resolverParent: string;
}) => `
import { IFieldResolveInput, IFieldResolveOutput } from "stucco-js";
import { ${collection} } from "../db/collections";
import { DB } from "../db/mongo";
import { ResolverType, ValueTypes } from "../graphql-zeus";
import { Utils } from "../Utils";${pk === 'id' ? `\nimport { ObjectID } from "bson";` : ''}

export const handler = async (
  input: IFieldResolveInput,
): Promise<IFieldResolveOutput> => {
  try {
    const { ${pk},...args } = input.arguments as ResolverType<ValueTypes["${resolverParent}"]["${resolverName}"]>
    const db = await DB();
    const col = await db.collection(${collection});
    const o = await col.findOneAndUpdate(
      ${pk === 'id' ? `{ _id: new ObjectID(${pk})  }` : `{ ${pk} }`},
      { $set: args },
      { upsert: true },
    );
    return {
      response: Utils.mongoToGraphQL(o),
    };
  } catch (error) {
    return { error };
  }
};
`;
