#!/usr/bin/env node

import yargs, { argv, Options } from 'yargs';
import { welcome } from '@/welcome.js';
import { Auth } from '@/Auth/index.js';
import { initConfiguration } from '@/commands/init/index.js';
import { CommandSchema } from '@/commands/schema/index.js';
import { CommandTypings } from '@/commands/typings/index.js';
import { CommandBootstrap } from '@/commands/bootstrap/index.js';
import { Config, Configuration, ConfigurationOptions } from '@/Configuration/index.js';
import { CommandResolver } from '@/commands/backend/commands/resolver.js';
import { CommandModels } from '@/commands/backend/commands/models.js';
import { CommandDeploy } from '@/commands/backend/commands/deploy.js';
import { ValueTypes } from '@/zeus/index.js';
import { CommandDeployRemote } from '@/commands/backend/commands/deployFromRemote.js';
import { CommandGetCIToken } from '@/commands/editor/getCIToken.js';
import { CommandPull } from '@/commands/backend/commands/pull.js';
import { CommandPush } from '@/commands/backend/commands/push.js';
import { CommandDev } from '@/commands/backend/commands/dev.js';
import { integrateStuccoJson } from '@/commands/gei/integrate.js';
import { bootstrapIntegrationFile } from '@/commands/gei/bootstrapIntegrationFile.js';
import { bootstrapGeiFile } from '@/commands/gei/bootstrapGeiFile.js';
import { CommandPublishIntegration, CommandRemoveIntegration } from '@/commands/gei/integration.js';

type ConfOptions = {
  [P in keyof ConfigurationOptions]: Options;
};

const confOptions = (o: ConfOptions) => o as { [key: string]: Options };

const projectOptions: ConfOptions = {
  namespace: {
    describe: 'GraphQL Editor Namespace',
    type: 'string',
  },
  project: {
    describe: 'GraphQL Editor Project',
    type: 'string',
  },
  version: {
    describe: 'GraphQL Editor Version name',
    type: 'string',
  },
};

const integrationOptions: ConfOptions = {
  registry: {
    describe: 'Package npm registry',
    type: 'string',
    default: 'https://registry.npmjs.org/',
  },
  npmPackage: {
    describe: 'npm package name',
    type: 'string',
  },
};
welcome().then(() => {
  new Configuration();
  return yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .version(false)
    .help('h')
    .alias('h', 'help')
    .command(
      'init',
      'Create editor project config inside current working directory.',
      async (yargs) => {
        yargs.options(
          confOptions({
            ...projectOptions,
          }),
        );
      },
      async (argv) => {
        await Auth.login().then(Config.setTokenOptions);
        await initConfiguration(argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'version'>);
      },
    )
    .command(
      'login',
      'Login to GraphQL Editor',
      async (yargs) => {},
      async (argv) => {
        await Auth.login().then(Config.setTokenOptions);
      },
    )
    .command(
      'schema',
      'Generate GraphQL schema from project at given path',
      async (yargs) => {
        yargs.options(
          confOptions({
            ...projectOptions,
            schemaDir: {
              describe: 'Path to created schema containing its name and extension',
              type: 'string',
            },
          }),
        );
      },
      async (argv) => {
        await Auth.login().then(Config.setTokenOptions);
        await CommandSchema(argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'version' | 'schemaDir'>);
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
    )
    .command(
      'bootstrap',
      'Bootstrap a backend project',
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
    )
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
      'gei:integrate',
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
        integrateStuccoJson(argv as Parameters<typeof integrateStuccoJson>[0]);
      },
    )
    .command(
      'gei:generate',
      'Generate integration.ts file',
      async (yargs) => {
        yargs.options({
          integrationFilePath: {
            type: 'string',
            describe: 'Path to generate integration.ts file',
          },
        });
      },
      async (argv) => {
        bootstrapIntegrationFile(argv as Parameters<typeof bootstrapIntegrationFile>[0]);
      },
    )
    .command(
      'gei:gei',
      'Generate gei.ts file',
      async (yargs) => {
        yargs.options({
          geiFilePath: {
            type: 'string',
            describe: 'Path to generate gei.ts file',
          },
        });
      },
      async (argv) => {
        bootstrapGeiFile(argv as Parameters<typeof bootstrapGeiFile>[0]);
      },
    )
    .command(
      'gei:publish',
      'Publish a GraphQL Editor integration to use in no-code',
      async (yargs) => {
        yargs.options({
          ...projectOptions,
          ...integrationOptions,
        });
      },
      async (argv) => {
        CommandPublishIntegration(argv as Parameters<typeof CommandPublishIntegration>[0]);
      },
    )
    .command(
      'gei:unpublish',
      'Publish a GraphQL Editor integration to use in no-code',
      async (yargs) => {
        yargs.options({
          ...projectOptions,
        });
      },
      async (argv) => {
        CommandRemoveIntegration(argv as Parameters<typeof CommandRemoveIntegration>[0]);
      },
    )
    .command(
      'dev',
      'Start development Typescript server and stucco server with hot reload.',
      async (yargs) => {
        yargs.options(confOptions({ ...projectOptions }));
      },
      async (argv) => {
        CommandDev(argv as Pick<ConfigurationOptions, 'project' | 'namespace'>);
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
    .command('token', 'Get CI token', async (argv) => {
      await CommandGetCIToken();
    })
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
    .showHelpOnFail(true)
    .demandCommand()
    .epilog('Bye!').argv;
});
