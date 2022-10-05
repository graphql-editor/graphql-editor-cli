import { Auth } from '@/Auth/index.js';
import { CommandBootstrap } from '@/commands/create/project.js';
import { projectOptions, confOptions } from '@/common/promptOptions.js';
import { Config, ConfigurationOptions } from '@/Configuration/index.js';
import { CommandModule } from 'yargs';

export default {
  command: 'create <command>',
  describe: 'Create commands. Create backend projects.',
  builder: (yargs) => {
    return yargs.command(
      'backend',
      'Create a backend project',
      async (yargs) => {
        yargs.options(
          confOptions({
            ...projectOptions,
          }),
        );
      },
      async (argv) => {
        await Auth.login().then(Config.setTokenOptions);
        await CommandBootstrap(argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'version'>);
      },
    );
  },
} as CommandModule;
