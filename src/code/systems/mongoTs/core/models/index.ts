import { ParserField, TypeDefinition } from 'graphql-zeus';
import { HandleTemplates } from '@/code/common';
import { getCollection } from '../collection';

export const getModel = async (modelsPath: string, field: ParserField) => {
  const modelName = `${field.name}Model`;
  HandleTemplates.action({
    type: 'addIfNotExist',
    path: `${modelsPath}/${modelName}.ts`,
    content: `import { ModelTypes} from '../../graphql-zeus';
// Create your model here as it is stored in MongoDB
export type ${modelName} = ModelTypes['${field.name}'];`,
  });
  return modelName;
};

export const generateModelsFile = async (collectionsPath: string, modelsPath: string, fields: ParserField[]) => {
  const modelFields = fields.filter((f) => f.data.type === TypeDefinition.ObjectTypeDefinition);
  let importsContent = '';
  let modelsContent = [];
  for (const f of modelFields) {
    const modelName = await getModel(modelsPath, f);
    const collectionName = getCollection(collectionsPath, f);
    importsContent += `import { ${modelName} } from './${modelName}'\n`;
    modelsContent.push(`${collectionName}: ${modelName};`);
  }
  const modelsContentString = `export type Models = {\n\t${modelsContent.join('\n\t')}\n};`;

  const modelFileIndex = [importsContent, modelsContentString].join('\n\n');
  HandleTemplates.action({
    type: 'add',
    path: `${modelsPath}/index.ts`,
    content: modelFileIndex,
  });
  return;
};
