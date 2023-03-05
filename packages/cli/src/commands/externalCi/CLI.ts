import { CommandAzureGitlab } from '@/commands/externalCi/azure.js';
import {
  CommandEnvs,
  CommandGenerateEnvs,
} from '@/commands/externalCi/envs.js';
import { Configuration } from '@/Configuration/index.js';
import { AzureGitlabCIConf } from '@/Configuration/index.js';
import { CommandModule, Options } from 'yargs';

export default {
  command: 'external-ci <command>',
  describe:
    'External continous integration generation commands. Azure Functions for now.',
  builder: (yargs) => {
    return yargs
      .command(
        'azure-gitlab',
        'Generate .gitlab-ci.yml file to deploy backend to Azure functions',
        async (yargs) => {
          yargs.options({
            azureEnv: {
              type: 'string',
              describe: 'Comma separated environment variables names',
            },
            azureFnName: {
              type: 'string',
              describe: 'Globally unique name of azure service',
            },
            azureCors: {
              type: 'string',
              describe:
                'Space separated CORS addresses for production and staging',
            },
          } as {
            [P in keyof AzureGitlabCIConf]: Options;
          });
        },
        async (argv) => {
          await CommandAzureGitlab(argv as any);
        },
      )
      .command(
        'env',
        `Inject envs from .env file to ${Configuration.CONFIG_NAME}`,
        async (yargs) => {},
        async (argv) => {
          await CommandEnvs();
        },
      )
      .command(
        'env-generate',
        `Generate .env file from ${Configuration.CONFIG_NAME}. Works idempotent. When you already have an .env file it adds missing keys `,
        async (yargs) => {},
        async (argv) => {
          await CommandGenerateEnvs();
        },
      );
  },
} as CommandModule;
