import { Parser, ParserField, TypeDefinition } from 'graphql-js-tree';
import { HandleTemplates } from '@/common';
import { Config } from '@/Configuration';
import path from 'path';
import { Editor } from '@/Editor';

export const getModel = async (modelsPath: string, field: ParserField) => {
  const modelName = `${field.name}Model`;
  HandleTemplates.action({
    type: 'addIfNotExist',
    path: `${modelsPath}/${modelName}.ts`,
    content: `import { ModelTypes } from '../zeus';
    
export type ${modelName} = ModelTypes['${field.name}'];`,
  });
  return modelName;
};

export const CommandModels = async ({
  namespace,
  backendSrc,
  project,
  version,
}: {
  backendSrc?: string;
  namespace?: string;
  project?: string;
  version?: string;
}) => {
  const resolve = await Config.configure({ namespace, backendSrc, project, version }, [
    'namespace',
    'project',
    'version',
    'backendSrc',
  ]);
  const schema = await Editor.getCompiledSchema(resolve);
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
