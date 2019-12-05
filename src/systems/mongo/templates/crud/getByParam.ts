export const getByParam = ({ collection, pk, type }: { collection: string; pk: string; type: string }) => `
import { IFieldResolveInput, IFieldResolveOutput } from "stucco-js";
import { GraphQLSchema } from "graphql";
import { ${collection} } from "../db/collections";
import { DB } from "../db/mongo";
import { ${type}, ResolverType, ValueTypes } from "../graphql-zeus";
import { Utils } from "../Utils";${pk === 'id' ? `\nimport { ObjectID } from "bson";` : ''}

export const handler = async (
  input: IFieldResolveInput,
): Promise<IFieldResolveOutput> => {
  try {
    const { ${pk} } = input.arguments;
    const db = await DB();
    const col = await db.collection(${collection});
    const response = await col.findOne(${pk === 'id' ? `{ _id: new ObjectID(${pk})  }` : `{ ${pk} }`});
    if (!response) {
      throw new Error(\`${type} with ${pk} '\${${pk}}' doesnt exist\`);
    }
    return { response: Utils.mongoToGraphQL<${type}>(response) };
  } catch (error) {
    return { error };
  }
};`;
