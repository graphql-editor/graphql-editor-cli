import { ParserField } from 'graphql-zeus';

export const listFilter = ({
  collection,
  resolverParent,
  field,
  sourceType = '',
}: {
  collection: string;
  resolverParent: string;
  field: ParserField;
  sourceType?: string;
}) => `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { ${collection} } from "../db/collections";
import { DB } from "../db/mongo";
import { Utils } from "../Utils";
import { ${field.type.name}${
  field.args && field.args.length > 0 ? `,${sourceType ? `${sourceType}, ` : ''} ResolverType, ValueTypes ` : ''
}} from "../graphql-zeus";

export const handler = async (
  input: FieldResolveInput,
): Promise<FieldResolveOutput> => {
    ${sourceType ? `const source = input.source as ${sourceType}` : ''}
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
    return Utils.CursorToGraphQLArray<${field.type.name}>(
        await col.find({}),
      );
};
`;
