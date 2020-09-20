import { ParserField } from 'graphql-zeus';
import { HandleTemplates } from '@/code/common';

export const getModel = async (modelsPath: string, field: ParserField, rootTypes: ParserField[]) => {
  const modelName = `${field.name}Model`;
  HandleTemplates.action({
    type: 'addIfNotExist',
    path: `${modelsPath}/${modelName}.ts`,
    content: `
import { ${field.name} } from '../../graphql-zeus';
// Create your model here as it is stored in MongoDB
export type ${modelName} = Omit<${field.name}, "__typename">`,
  });
  HandleTemplates.action({
    type: 'append',
    path: `${modelsPath}/index.ts`,
    content: `\nexport * from './${modelName}';`,
  });
  return modelName;
};
