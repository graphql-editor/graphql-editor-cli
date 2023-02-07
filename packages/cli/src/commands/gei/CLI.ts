import { bootstrapIntegrationFile } from '@/commands/gei/bootstrapIntegrationFile.js';
import { integrateStuccoJson } from '@/commands/gei/integrate.js';
import {
  CommandPublishIntegration,
  CommandRemoveIntegration,
} from '@/commands/gei/integration.js';
import { projectOptions, integrationOptions } from '@/common/promptOptions.js';
import { CommandModule } from 'yargs';
import { logger } from '@/common/log/index.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { Config } from '@/Configuration/index.js';

const packageJSON = async (name: string) => {
  const version = JSON.parse(
    await fs.promises
      .readFile(
        path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          '..',
          '..',
          '..',
          'package.json',
        ),
      )
      .then((b) => b.toString()),
  ).version as string;
  return `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "prepack": "gecli gei integrate",
    "postpack": "rm stucco.json"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "graphql-editor-cli": "^${version}"
  }
}`;
};

const tsconfig = `{
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./lib",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
	"declaration": true
  },
  "include": ["src/**/*"]
}`;

export default {
  command: 'gei <command>',
  describe: 'Integration development commands',
  builder: (yargs) => {
    return yargs
      .command(
        'integrate',
        'Update stucco.json from integration.ts file',
        async (yargs) => {
          yargs.options({
            integrationPath: {
              type: 'string',
              describe: 'Path to integration.ts file',
            },
          });
          yargs;
        },
        async (argv) => {
          await integrateStuccoJson(
            argv as Parameters<typeof integrateStuccoJson>[0],
          );
          logger(
            'Integration successfull! Remember to publish the integration to npm and graphql-editor to use it inside no code builder',
            'success',
          );
        },
      )
      .command(
        'init',
        'Generate gei definition files',
        async (yargs) => {
          yargs.options({
            integrationName: {
              type: 'string',
              describe: 'Integration name',
            },
          });
          yargs.options({
            filesPath: {
              type: 'string',
              describe: 'Path to generate config files',
            },
          });
        },
        async (argv) => {
          const { integrationName } = await Config.configure(
            {
              integrationName: argv?.name,
            },
            ['integrationName'],
          );
          await fs.promises.writeFile(
            'package.json',
            await packageJSON(integrationName as string),
          );
          await Promise.all([
            bootstrapIntegrationFile(
              argv as Parameters<typeof bootstrapIntegrationFile>[0],
            ),
            fs.promises.writeFile('tsconfig.json', tsconfig),
          ]);
          logger(
            'Initialization successful. Edit the integration.ts file to insert the resolvers visible in integration.',
            'success',
          );
        },
      )
      .command(
        'publish',
        'Publish a GraphQL Editor integration to use in no-code',
        async (yargs) => {
          yargs.options({
            ...projectOptions,
            ...integrationOptions,
          });
        },
        async (argv) => {
          await CommandPublishIntegration(
            argv as Parameters<typeof CommandPublishIntegration>[0],
          );
          logger(
            "Successfully added the integration to GraphQL Editor Marketplace.Don't forget to publish the package to npm or other registry.",
            'success',
          );
        },
      )
      .command(
        'unpublish',
        'Publish a GraphQL Editor integration to use in no-code',
        async (yargs) => {
          yargs.options({
            ...projectOptions,
          });
        },
        async (argv) => {
          await CommandRemoveIntegration(
            argv as Parameters<typeof CommandRemoveIntegration>[0],
          );
          logger(
            'Successfully removed integration from GraphQL Editor Marketplace',
            'success',
          );
        },
      );
  },
} as CommandModule;
