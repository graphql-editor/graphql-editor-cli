import { CommandAzureGitlab } from '@/commands/externalCi/azure.js';
import { AzureGitlabCIConf } from '@/Configuration/index.js';
import { CommandModule, Options } from 'yargs';

export default {
  command: 'external-ci <command>',
  describe:
    'External continous integration generation commands. Azure Functions for now.',
  builder: (yargs) => {
    return yargs.command(
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
    );
  },
} as CommandModule;
