import { ParserField } from 'graphql-zeus';

export const twoInputUpdate = ({
  collection,
  resolverParent,
  field,
  input,
  sourceType,
  filterInput,
  modelName,
}: {
  collection: string;
  resolverParent: string;
  field: ParserField;
  input: string;
  filterInput: string;
  sourceType?: string;
  modelName: string;
}) => {
  const zeusImports: string[] = [];
  if (field.args && field.args.length > 0) {
    zeusImports.push('ResolverType');
    zeusImports.push('ValueTypes');
  }
  return `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { DB } from "../db/mongo";
import { Orm } from "../db/orm";
import { ${modelName}${sourceType ? `, ${sourceType}` : ''} } from "../db/models";
${zeusImports.length > 0 ? `import { ${zeusImports.join(', ')} } from "../graphql-zeus";` : ``}

export const handler = async (
  input: FieldResolveInput<ResolverType<ValueTypes["${resolverParent}"]["${field.name}"]>${
    sourceType ? `,${sourceType}` : ''
  }>,
): Promise<FieldResolveOutput<boolean>> => {
    const {
      arguments:{
        ${input},
        ${filterInput}
      }${
        sourceType
          ? `,
      source
      `
          : ''
      }
    } = input;
    const db = await DB();
    const o = await Orm<${modelName}>(db,'${collection}').update(${filterInput},${input})
    return o.modifiedCount > 0;
};
`;
};
