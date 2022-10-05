import fs from 'fs';
import path from 'path';

export const bootstrapIntegrationFile = ({ filesPath }: { filesPath?: string }) => {
  const p = path.join(process.cwd(), filesPath || 'src', 'gei', 'integration.ts');
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

// Declare your resolver specifications here to generate JSON from it later using \`gei integrate\` command
const integration: IntegrationSpecification = {};
  
export default integration;
`;
