import { Config } from '@/Configuration/index.js';
import { writeSafe } from '@/utils/FileUtils.js';
import path from 'path';

export const bootstrapIntegrationFile = async (props: {
  integrationPath?: string;
}) => {
  const { integrationPath } = await Config.configure(
    {
      integrationPath: props?.integrationPath,
    },
    ['integrationPath'],
  );
  const p = path.join(
    process.cwd(),
    integrationPath || "gei.ts",
  );
  writeSafe(p, fileContent);
};

const fileContent = `import { NewIntegration } from 'graphql-editor-cli';

// Declare your resolver specifications here to generate JSON from it later using \`gei integrate\` command
const integration = NewIntegration({});
  
export default integration;
`;
