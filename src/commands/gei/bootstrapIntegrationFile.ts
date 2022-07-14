import fs from 'fs';
import path from 'path';

export const bootstrapIntegrationFile = ({ integrationFilePath }: { integrationFilePath?: string }) => {
  const p = path.join(process.cwd(), integrationFilePath || './src/integration.ts');
  fs.writeFileSync(p, fileContent);
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

const integration: IntegrationSpecification = {};
  
export default integration;
`;
