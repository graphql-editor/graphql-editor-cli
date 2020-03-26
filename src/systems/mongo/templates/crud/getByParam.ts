export const getByParam = ({
  collection,
  pk,
  type,
  sourceType = '',
  resolverName,
  resolverParent,
}: {
  collection: string;
  pk: string;
  type: string;
  sourceType?: string;
  resolverName: string;
  resolverParent: string;
}) => `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { GraphQLSchema } from "graphql";
import { ${collection} } from "../db/collections";
import { DB } from "../db/mongo";
import { ${type}, ${sourceType ? `${sourceType}, ` : ''}ResolverType, ValueTypes } from "../graphql-zeus";
import { Utils } from "../Utils";${pk === 'id' ? `\nimport { ObjectID } from "bson";` : ''}

export const handler = async (
  input: FieldResolveInput,
): Promise<FieldResolveOutput> => {
    ${sourceType ? `const source = input.source as ${sourceType}` : ''}
    const { ${pk} } = input.arguments as ResolverType<ValueTypes["${resolverParent}"]["${resolverName}"]>;
    const db = await DB();
    const col = await db.collection(${collection});
    const response = await col.findOne(${pk === 'id' ? `{ _id: new ObjectID(${pk})  }` : `{ ${pk} }`});
    if (!response) {
      throw new Error(\`${type} with ${pk} '\${${pk}}' doesnt exist\`);
    }
    return Utils.mongoToGraphQL<${type}>(response);
};`;
