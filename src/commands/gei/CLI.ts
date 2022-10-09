import { bootstrapGeiFile } from '@/commands/gei/bootstrapGeiFile.js';
import { bootstrapIntegrationFile } from '@/commands/gei/bootstrapIntegrationFile.js';
import { integrateStuccoJson } from '@/commands/gei/integrate.js';
import {
  CommandPublishIntegration,
  CommandRemoveIntegration,
} from '@/commands/gei/integration.js';
import { projectOptions, integrationOptions } from '@/common/promptOptions.js';
import { CommandModule } from 'yargs';
import { logger } from '@/common/log/index.js';

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
            filesPath: {
              type: 'string',
              describe: 'Path to generate config files',
            },
          });
        },
        async (argv) => {
          bootstrapGeiFile(argv as Parameters<typeof bootstrapGeiFile>[0]);
          bootstrapIntegrationFile(
            argv as Parameters<typeof bootstrapIntegrationFile>[0],
          );
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
