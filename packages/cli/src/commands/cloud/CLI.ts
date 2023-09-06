import { Auth } from '@/Auth/index.js';
import { CommandInstall } from '@/commands/cloud/install.js';
import { CommandPull } from '@/commands/cloud/pull.js';
import { CommandPush } from '@/commands/cloud/push.js';
import { CommandSync } from '@/commands/cloud/server.js';
import { projectOptions, confOptions } from '@/common/promptOptions.js';
import { Config, ConfigurationOptions } from '@/Configuration/index.js';
import { ValueTypes } from '@/zeus/index.js';
import { CommandModule } from 'yargs';

export default {
  command: 'cloud <command>',
  describe: 'Cloud deployment management',
  builder: (yargs) => {
    return yargs
      .command(
        'server',
        'Live sync files from Editor Cloud to a temporary folder',
        async (yargs) => {
          yargs.options(confOptions({ ...projectOptions }));
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandSync(
            argv as Pick<ConfigurationOptions, 'project' | 'namespace'>,
          );
        },
      )
      .command(
        'install',
        'Install no-code microservices from GraphQL Editor in your stucco.json file',
        async (yargs) => {
          yargs.options(confOptions({ ...projectOptions }));
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandInstall(
            argv as Pick<ConfigurationOptions, 'project' | 'namespace'>,
          );
        },
      )
      .command(
        'pull',
        'Pull current deployment and extract it to CWD',
        async (yargs) => {
          yargs.options(confOptions({ ...projectOptions }));
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandPull(
            argv as Pick<ConfigurationOptions, 'project' | 'namespace'>,
          );
        },
      )
      .command(
        'push',
        'Push current working directory to cloud',
        async (yargs) => {
          yargs.options(confOptions({ ...projectOptions }));
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandPush(
            argv as Pick<ConfigurationOptions, 'project' | 'namespace'>,
          );
        },
      );
  },
} as CommandModule;
