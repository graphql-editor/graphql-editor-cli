import { DEFAULT_INTEGRATION_PATH } from '@/commands/gei/shared/consts.js';
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
    integrationPath || DEFAULT_INTEGRATION_PATH,
  );
  writeSafe(p, fileContent);
};

const fileContent = `type IntegrationData = {
    name: string;
    description: string;
    value: string | string[];
    required?: boolean;
};

type IntegrationSpecification = {
    [resolver: string]: {
        name: string;
        description: string;
        data: Record<string, IntegrationData>;
        resolve: { name: string };
    };
};

// Declare your resolver specifications here to generate JSON from it later using \`gei integrate\` command
const integration: IntegrationSpecification = {};
  
export default integration;
`;
