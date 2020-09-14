import { ParserField } from 'graphql-zeus';

export const oneInputRemove = ({
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
    const o = await Orm<${modelName}>(db,'${collection}').remove(${input})
    return !!o.result.ok;
};
`;
};
