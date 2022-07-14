import fs from 'fs';
import path from 'path';
import typescript from 'typescript';
import nodeVM from 'node:vm';

export const integrateStuccoJson = (props?: { integrationPath?: string }) => {
  const { integrationPath = './src/integration.ts' } = props || {};
  const stuccoPath = './stucco.json';
  const integrationFile = path.join(process.cwd(), integrationPath);
  const stuccoFile = path.join(process.cwd(), stuccoPath);

  const existsStucco = fs.existsSync(stuccoFile);
  const existIntegrationFile = fs.existsSync(integrationFile);
  if (!existsStucco) {
    throw new Error('stucco.json does not exist. Please create stucco.json file in root integration folder');
  }
  if (!existIntegrationFile) {
    throw new Error(
      'integration.ts does not exist. Please create integration.ts file in ./src integration folder or provide other path',
    );
  }

  try {
    const out = typescript.transpileModule(fs.readFileSync(integrationFile, 'utf-8'), {
      compilerOptions: {
        target: 1,
        module: 1,
        moduleResolution: 2,
      },
    });
    const context = nodeVM.createContext({ exports: {} });
    const objectOut = nodeVM.runInContext(out.outputText, context);
    const stuccoFileOut = JSON.parse(fs.readFileSync(stuccoFile, 'utf-8'));

    const result = {
      ...stuccoFileOut,
      resolvers: Object.entries(stuccoFileOut.resolvers)
        .map(([k, v]) => [k, objectOut[k]])
        .reduce(
          (a, b) => ({
            ...a,
            [b[0]]: b[1],
          }),
          {},
        ),
    };

    fs.writeFileSync(stuccoFile, JSON.stringify(result, null, 4));
  } catch (error) {
    throw new Error(
      'Invalid integration file. Refer to https://github.com/graphql-editor/gei-crud/blob/main/src/integration.ts to check how it should look like. To bootstrap integration file call gei:bootstrap',
    );
  }
};
