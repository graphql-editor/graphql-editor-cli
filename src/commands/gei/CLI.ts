import { bootstrapGeiFile } from '@/commands/gei/bootstrapGeiFile.js';
import { bootstrapIntegrationFile } from '@/commands/gei/bootstrapIntegrationFile.js';
import { integrateStuccoJson } from '@/commands/gei/integrate.js';
import { CommandPublishIntegration, CommandRemoveIntegration } from '@/commands/gei/integration.js';
import { projectOptions, integrationOptions } from '@/common/promptOptions.js';
import yargs, { CommandModule } from 'yargs';

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
          integrateStuccoJson(argv as Parameters<typeof integrateStuccoJson>[0]);
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
          bootstrapIntegrationFile(argv as Parameters<typeof bootstrapIntegrationFile>[0]);
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
          await CommandPublishIntegration(argv as Parameters<typeof CommandPublishIntegration>[0]);
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
          await CommandRemoveIntegration(argv as Parameters<typeof CommandRemoveIntegration>[0]);
        },
      );
  },
} as CommandModule;
