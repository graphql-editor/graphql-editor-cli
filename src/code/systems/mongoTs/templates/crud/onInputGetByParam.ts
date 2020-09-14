import { ParserField } from 'graphql-zeus';

export const onInputGetByParam = ({
  collection,
  resolverParent,
  field,
  sourceType,
  input,
  modelName,
}: {
  collection: string;
  resolverParent: string;
  field: ParserField;
  sourceType?: string;
  input: string;
  modelName: string;
}) => {
  return `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { DB } from "../db/mongo";
import { Orm } from "../db/orm";
import { ${modelName}${sourceType ? `, ${sourceType}` : ''} } from "../db/models";
import { ${field.type.name}${
    field.args && field.args.length > 0 ? `, ResolverType, ValueTypes ` : ''
  }} from "../graphql-zeus";

export const handler = async (
  input: FieldResolveInput<ResolverType<ValueTypes["${resolverParent}"]["${field.name}"]>${
    sourceType ? `,${sourceType}` : ''
  }>,
): Promise<FieldResolveOutput<${field.type.name} | undefined>> => {
    const {
      arguments:{
        ${input}
      }${
        sourceType
          ? `,
      source
      `
          : ''
      }
    } = input;
    const db = await DB();
    return Orm<${modelName}>(db,'${collection}').one(${input})
};
`;
};
