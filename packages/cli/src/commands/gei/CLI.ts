import { bootstrapIntegrationFile } from '@/commands/gei/bootstrapIntegrationFile.js';
import { integrateStuccoJson } from '@/commands/gei/integrate.js';
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
            integrationPath: {
              type: 'string',
              describe: 'Path to generate main integration file',
            },
          });
        },
        async (argv) => {
          await bootstrapIntegrationFile(
            argv as Parameters<typeof bootstrapIntegrationFile>[0],
          ),
            logger(
              'Initialization successful. Edit the integration.ts file to insert the resolvers visible in integration.',
              'success',
            );
        },
      );
  },
} as CommandModule;
