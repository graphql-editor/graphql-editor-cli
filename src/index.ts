#!/usr/bin/env node

import yargs, { argv, Options } from 'yargs';
import { welcome } from './welcome';
import { Auth } from '@/Auth';
import { initConfiguration } from '@/commands/init';
import { CommandSchema } from '@/commands/schema';
import { CommandTypings } from '@/commands/typings';
import { CommandBootstrap } from '@/commands/bootstrap';
import { Config, Configuration, ConfigurationOptions } from '@/Configuration';
import { CommandResolver } from '@/commands/backend/commands/resolver';
import { CommandModels } from '@/commands/backend/commands/models';
import { CommandDeploy } from '@/commands/backend/commands/deploy';
import { ValueTypes } from '@/zeus';

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

welcome().then(() => {
  new Configuration();
  return yargs
    .usage('Usage: $0 <command> [options]')
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
      'Generate GraphQL typings for TypeScript or Javascript',
      async (yargs) => {
        yargs.options(
          confOptions({
            ...projectOptions,
            typingsGen: {
              describe: 'Generation language',
              choices: ['Javascript', 'TypeScript'],
            },
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
            'project' | 'namespace' | 'version' | 'typingsDir' | 'typingsEnv' | 'typingsGen' | 'typingsHost'
          >,
        );
      },
    )
    .command(
      'bootstrap',
      'Bootstrap a new frontend or backend project',
      async (yargs) => {
        yargs.options(
          confOptions({
            ...projectOptions,
            system: {
              type: 'string',
              choices: ['backend', 'frontend'],
              describe: 'Choose the type of app you want to bootstrap',
            },
          }),
        );
      },
      async (argv) => {
        await CommandBootstrap(argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'version' | 'system'>);
      },
    )
    .command(
      'resolver',
      'Create resolver for your backend project',
      async (yargs) => {
        yargs.options(confOptions({ ...projectOptions }));
      },
      async (argv) => {
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
        await CommandModels(argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'version'>);
      },
    )
    .command(
      'deploy',
      'Deploy GraphQL backend to GraphQL Editor shared worker',
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
        await CommandDeploy(
          argv as Pick<ConfigurationOptions, 'project' | 'namespace' | 'backendZip'> & {
            env?: ValueTypes['Secret'][];
          },
        );
      },
    )
    .showHelpOnFail(true)
    .demandCommand()
    .epilog('Bye!').argv;
});
