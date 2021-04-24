#!/usr/bin/env node

import yargs from 'yargs';
import { welcome } from './welcome';
import { Auth } from '@/Auth';
import { initConfiguration } from '@/commands/init';
import { CommandSchema } from '@/commands/schema';
import { CommandTypings } from '@/commands/typings';
import { CommandBootstrap } from '@/commands/bootstrap';
import { Config, Configuration } from '@/Configuration';

welcome().then(() => {
  new Configuration();
  return yargs
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .command('init', 'Create editor project config inside current working directory.', async (yargs) => {
      await Auth.login().then(Config.setTokenOptions);
      await initConfiguration();
    })
    .command('schema [path]', 'Generate GraphQL schema from project at given path', async (yargs) => {
      await Auth.login().then(Config.setTokenOptions);
      await CommandSchema(yargs.argv as any);
    })
    .options({
      namespace: {
        describe: 'GraphQL Editor Namespace',
      },
      project: {
        describe: 'GraphQL Editor Project',
      },
      version: {
        describe: 'GraphQL Editor Version name',
      },
      compiled: {
        boolean: true,
        describe: 'Get project with libraries',
      },
    })
    .command('typings [path]', 'Generate GraphQL typings for TypeScript or Javascript', async (yargs) => {
      yargs.positional('path', {
        describe: 'Path to store typings',
        type: 'string',
      });
      await Auth.login().then(Config.setTokenOptions);
      await CommandTypings(yargs.argv as any);
    })
    .options({
      namespace: {
        describe: 'GraphQL Editor Namespace',
        type: 'string',
      },
      project: {
        describe: 'GraphQL Editor Project',
        type: 'string',
      },
      projectVersion: {
        describe: 'GraphQL Editor Version name',
        type: 'string',
      },
      gen: {
        describe: 'Generation language',
        choices: ['Javascript', 'TypeScript'],
      },
      host: {
        describe: 'GraphQL Server address',
        type: 'string',
      },
      env: {
        describe: 'Generation Environment',
        choices: ['browser', 'node'],
      },
      compiled: {
        boolean: true,
        describe: 'Get project with libraries',
      },
    })
    .command('bootstrap [type] [name]', 'Bootstrap a new frontend or backend project', async (yargs) => {
      yargs.positional('type', {
        describe: 'Project type.',
        type: 'string',
        choices: ['backend', 'frontend'],
      });
      yargs.positional('name', {
        describe: 'Project name.',
        type: 'string',
      });
      await CommandBootstrap(yargs.argv as any);
    })
    .showHelpOnFail(true)
    .demandCommand()
    .epilog('copyright 2020').argv;
});
