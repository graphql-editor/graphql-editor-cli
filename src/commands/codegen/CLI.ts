import { Auth } from '@/Auth/index.js';
import { CommandModels } from '@/commands/backend/commands/models.js';
import { CommandResolver } from '@/commands/backend/commands/resolver.js';
import { CommandTypings } from '@/commands/typings/index.js';
import { projectOptions, confOptions } from '@/common/promptOptions.js';
import { Config, ConfigurationOptions } from '@/Configuration/index.js';
import { CommandModule } from 'yargs';

export default {
  command: 'codegen <command>',
  describe: 'Code generation commands',
  builder: (yargs) => {
    return yargs
      .command(
        'resolver',
        'Create resolver for your backend project',
        async (yargs) => {
          yargs.options(confOptions({ ...projectOptions }));
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandResolver(argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'version'>);
        },
      )
      .command(
        'models',
        'Generate model files for your backend project',
        async (yargs) => {
          yargs.options(confOptions({ ...projectOptions }));
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandModels(argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'version'>);
        },
      )
      .command(
        'typings',
        'Generate GraphQL typings for TypeScript',
        async (yargs) => {
          yargs.options(
            confOptions({
              ...projectOptions,
              typingsHost: {
                describe: 'GraphQL Server address',
                type: 'string',
              },
              typingsDir: {
                describe: 'Path where to create generated files',
                type: 'string',
              },
              typingsEnv: {
                describe: 'Generation Environment',
                choices: ['browser', 'node'],
              },
            }),
          );
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandTypings(
            argv as Pick<
              ConfigurationOptions,
              'project' | 'namespace' | 'version' | 'typingsDir' | 'typingsEnv' | 'typingsHost'
            >,
          );
        },
      );
  },
} as CommandModule;
