import { Auth } from '@/Auth/index.js';
import { projectOptions, confOptions, ConfOptions } from '@/common/promptOptions.js';
import { Config, ConfigurationOptions } from '@/Configuration/index.js';
import { CommandModule } from 'yargs';
import { CommandSchemaPull } from './pull.js';
// import { CommandSchemaPush } from './push.js';

const schemaOptions: ConfOptions = {
  ...projectOptions,
  schemaDir: {
    type: 'string',
    describe: 'location of the schema file'
  }
}

export default {
  command: 'schema <command>',
  describe: 'Generate and modify your GraphQL schema',
  builder: (yargs) => {
    return yargs
      .command(
        'pull',
        'Generate GraphQL schema from project at given path',
        async (yargs) => {
          yargs.options(confOptions(schemaOptions));
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandSchemaPull(
            argv as Pick<
              ConfigurationOptions,
              'namespace' | 'project' | 'projectVersion' | 'schemaDir'
            >,
          );
        },
      )
    // .command(
    //   'push',
    //   'Deploy GraphQL schema as latest',
    //   async (yargs) => {
    //     yargs.options(confOptions(schemaOptions));
    //   },
    //   async (argv) => {
    //     await Auth.login().then(Config.setTokenOptions);
    //     await CommandSchemaPush(
    //       argv as Pick<
    //         ConfigurationOptions,
    //         'namespace' | 'project' | 'projectVersion' | 'schemaDir'
    //       >,
    //     );
    //   },
    // );
  },
} as CommandModule;
