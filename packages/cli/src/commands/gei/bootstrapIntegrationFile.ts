import { Config } from '@/Configuration/index.js';
import { writeSafe } from '@/utils/FileUtils.js';
import path from 'path';

export const bootstrapIntegrationFile = async ({
  integrationPath,
}: {
  integrationPath?: string;
}) => {
  const resolve = await Config.configure({ integrationPath }, [
    'integrationPath',
  ]);
  const fileContent = `import { NewIntegration } from 'graphql-editor-cli';

const integration = NewIntegration({});

export default integration;
`;
  const p = path.join(process.cwd(), resolve.integrationPath);
  writeSafe(p, fileContent);
};
