import { Auth } from '@/Auth/index.js';
import { CommandDeploy } from '@/commands/backend/commands/deploy.js';
import { CommandDeployRemote } from '@/commands/backend/commands/deployFromRemote.js';
import { CommandPull } from '@/commands/backend/commands/pull.js';
import { CommandPush } from '@/commands/backend/commands/push.js';
import { CommandSync } from '@/commands/cloud/sync.js';
import { projectOptions, confOptions } from '@/common/promptOptions.js';
import { Config, ConfigurationOptions } from '@/Configuration/index.js';
import { ValueTypes } from '@/zeus';
import { CommandModule } from 'yargs';

export default {
  command: 'cloud <command>',
  describe: 'Cloud deployment management',
  builder: (yargs) => {
    return yargs
      .command(
        'sync',
        'Live sync files from Editor Cloud to a temporary folder',
        async (yargs) => {
          yargs.options(confOptions({ ...projectOptions }));
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandSync(argv as Pick<ConfigurationOptions, 'project' | 'namespace'>);
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
          await CommandPull(argv as Pick<ConfigurationOptions, 'project' | 'namespace'>);
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
          await CommandPush(argv as Pick<ConfigurationOptions, 'project' | 'namespace'>);
        },
      )
      .command(
        'deploy:zip',
        'Deploy GraphQL backend to GraphQL Editor shared worker from remote zip',
        async (yargs) => {
          yargs.options({
            ...confOptions({
              namespace: projectOptions.namespace,
              project: projectOptions.project,
              backendZip: {
                type: 'string',
                describe:
                  'Paste your repo zip url, for github it will be https://github.com/account_name/repository/archive/refs/heads/main.zip',
              },
            }),
            env: {
              alias: 'e',
              array: true,
              coerce: (v: Array<string>) => {
                return v.map((e: string) => e.split('=')).map(([name, ...value]) => ({ name, value: value.join('=') }));
              },
              describe: 'Set environment variables for example "-e URL=$URL" or "-e URL=example.com"',
            },
          });
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandDeployRemote(
            argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'backendZip'> & {
              env?: ValueTypes['Secret'][];
            },
          );
        },
      )
      .command(
        'deploy',
        'Deploy GraphQL backend to GraphQL Editor shared worker from current repository',
        async (yargs) => {
          yargs.options({
            ...confOptions({
              namespace: projectOptions.namespace,
              project: projectOptions.project,
              buildScript: {
                type: 'string',
                describe: 'Build script as in your package.json',
                default: 'build',
              },
            }),
            env: {
              alias: 'e',
              array: true,
              coerce: (v: Array<string>) => {
                return v.map((e: string) => e.split('=')).map(([name, ...value]) => ({ name, value: value.join('=') }));
              },
              describe: 'Set environment variables for example "-e URL=$URL" or "-e URL=example.com"',
            },
          });
        },
        async (argv) => {
          await Auth.login().then(Config.setTokenOptions);
          await CommandDeploy(
            argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'backendZip' | 'buildScript'> & {
              env?: ValueTypes['Secret'][];
            },
          );
        },
      );
  },
  handler: (args) => {
    console.log('handler foo!');
  },
} as CommandModule;
