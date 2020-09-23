import { ParserField } from 'graphql-zeus';

export const listFilter = ({
  collection,
  resolverParent,
  field,
  sourceType,
  modelName,
}: {
  collection: string;
  resolverParent: string;
  field: ParserField;
  modelName: string;
  sourceType?: string;
}) => {
  if (field.args && field.args.length) {
    return `
  import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
  import { DB } from "../db/mongo";
  import { Orm } from "../db/orm";
  import { ${modelName}${sourceType ? `, ${sourceType}` : ''} } from "../db/models";
  import { ${field.type.name}${`, ResolverType, ValueTypes `}} from "../graphql-zeus";
  
  export const handler = async (
    input: FieldResolveInput<ResolverType<ValueTypes["${resolverParent}"]["${field.name}"]>${
      sourceType ? `, ${sourceType}` : ', never'
    }>,
  ): Promise<FieldResolveOutput<${field.type.name}[]>> => {
      const {
        arguments:{
          ${field.args[0].name}
        }${
          sourceType
            ? `,
        source
        `
            : ''
        }
      } = input;
      const db = await DB();
      return Orm<${modelName}>(db,'${collection}').list({...${field.args[0].name}})
  };
  `;
  }
  return `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { DB } from "../db/mongo";
import { Orm } from "../db/orm";
import { ${modelName}${sourceType ? `, ${sourceType}` : ''} } from "../db/models";
import { ${field.type.name} } from "../graphql-zeus";

export const handler = async (
  input: FieldResolveInput<never${sourceType ? `, ${sourceType}` : ', never'}>,
): Promise<FieldResolveOutput<${field.type.name}[]>> => {
    ${sourceType ? `const { source } = input;` : ``}
    const db = await DB();
    return Orm<${modelName}>(db,'${collection}').list()
};
`;
};
