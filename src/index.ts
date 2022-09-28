#!/usr/bin/env node

import yargs from 'yargs';
import { welcome } from '@/welcome.js';
import { Auth } from '@/Auth/index.js';
import { initConfiguration } from '@/commands/init/index.js';
import { CommandSchema } from '@/commands/schema/index.js';
import { CommandBootstrap } from '@/commands/bootstrap/index.js';
import { Config, Configuration, ConfigurationOptions } from '@/Configuration/index.js';
import { CommandGetCIToken } from '@/commands/editor/getCIToken.js';
import { CommandDev } from '@/commands/backend/commands/dev.js';
import Gei from '@/commands/gei/CLI.js';
import CodeGen from '@/commands/codegen/CLI.js';
import Cloud from '@/commands/cloud/CLI.js';
import { confOptions, projectOptions, integrationOptions } from '@/common/promptOptions.js';

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
    .command(Cloud)
    .command(CodeGen)
    .command(Gei)
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
    .command('token', 'Get CI token', async (argv) => {
      await CommandGetCIToken();
    })
    .version()
    .showHelpOnFail(true)
    .demandCommand()
    .epilog('Bye!').argv;
});
