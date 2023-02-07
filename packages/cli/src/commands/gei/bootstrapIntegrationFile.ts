import { Config } from '@/Configuration/index.js';
import { writeSafe } from '@/utils/FileUtils.js';
import path from 'path';
import fs from 'fs';

export const bootstrapIntegrationFile = async (props: {
  integrationPath?: string;
}) => {
  const pJSON = JSON.parse(await fs.promises.readFile('package.json').then((b) => b.toString()));

  const fileContent = `import { NewIntegration } from 'graphql-editor-cli';

const integration = NewIntegration('${pJSON.name}', {});

export default integration;
`;
  const { integrationPath } = await Config.configure(
    {
      integrationPath: props?.integrationPath,
    },
    ['integrationPath'],
  );
  const p = path.join(
    process.cwd(),
    integrationPath || "src/index.ts",
  );
  writeSafe(p, fileContent);
};
