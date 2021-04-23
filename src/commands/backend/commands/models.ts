import { Parser, ParserField, TypeDefinition } from 'graphql-zeus';
import { HandleTemplates } from '@/common';
import { Config } from '@/Configuration';
import path from 'path';

export const getModel = async (modelsPath: string, field: ParserField) => {
  const modelName = `${field.name}Model`;
  HandleTemplates.action({
    type: 'addIfNotExist',
    path: `${modelsPath}/${modelName}.ts`,
    content: `import { ModelTypes } from '../../graphql-zeus';
    
export type ${modelName} = ModelTypes['${field.name}'];`,
  });
  return modelName;
};

export const generateModelsFile = async ({
  compiled,
  namespace,
  backendSrc,
  project,
  version,
}: {
  backendSrc?: string;
  namespace?: string;
  project?: string;
  version?: string;
  compiled?: boolean;
}) => {
  const resolve = await Config.resolve({ compiled, namespace, backendSrc, project, version });
  const schema = await Config.getSchema(resolve);
  const tree = Parser.parseAddExtensions(schema);
  const modelFields = tree.nodes.filter((f) => f.data.type === TypeDefinition.ObjectTypeDefinition);
  const modelsPath = path.join(resolve.backendSrc, 'models');
  let importsContent = '';
  let modelsContent = [];
  for (const f of modelFields) {
    const modelName = await getModel(modelsPath, f);
    importsContent += `import { ${modelName} } from './${modelName}'\n`;
    modelsContent.push(`${modelName}: ${modelName};`);
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
