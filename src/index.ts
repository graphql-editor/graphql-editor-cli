#!/usr/bin/env node

import yargs from 'yargs';
import { welcome } from '@/welcome.js';
import { Auth } from '@/Auth/index.js';
import { initConfiguration } from '@/commands/common/init.js';
import { CommandSchema } from '@/commands/common/schema.js';
import {
  Config,
  Configuration,
  ConfigurationOptions,
} from '@/Configuration/index.js';
import { CommandGetCIToken } from '@/commands/common/getCIToken.js';
import { CommandDev } from '@/commands/common/dev.js';
import Gei from '@/commands/gei/CLI.js';
import CodeGen from '@/commands/codegen/CLI.js';
import Cloud from '@/commands/create/CLI.js';
import Create from '@/commands/cloud/CLI.js';
import ExternalCI from '@/commands/externalCi/CLI.js';
import { confOptions, projectOptions } from '@/common/promptOptions.js';
import { CommandPrune } from '@/commands/common/prune.js';
import { CommandInspect } from '@/commands/common/inspect.js';

welcome().then(() => {
  new Configuration();
  return yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .version(false)
    .help('h')
    .alias('h', 'help')
    .command(
      'init',
      'Configure current folder to work with editor commands and create config inside current working directory.',
      async (yargs) => {
        yargs.options(
          confOptions({
            ...projectOptions,
          }),
        );
      },
      async (argv) => {
        await Auth.login().then(Config.setTokenOptions);
        await initConfiguration(
          argv as Pick<
            ConfigurationOptions,
            'project' | 'namespace' | 'projectVersion'
          >,
        );
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
              describe:
                'Path to created schema containing its name and extension',
              type: 'string',
            },
          }),
        );
      },
      async (argv) => {
        await Auth.login().then(Config.setTokenOptions);
        await CommandSchema(
          argv as Pick<
            ConfigurationOptions,
            'project' | 'namespace' | 'projectVersion' | 'schemaDir'
          >,
        );
      },
    )
    .command(
      'prune',
      'Get information about redundant resolvers that do not exist in schema now.',
      async (yargs) => {},
      async (argv) => {
        await CommandPrune();
      },
    )
    .command(
      'inspect',
      'Get information about non-scalar resolvers that are not implemented in stucco.json',
      async (yargs) => {},
      async (argv) => {
        await CommandInspect();
      },
    )
    .command(Create)
    .command(Cloud)
    .command(ExternalCI)
    .command(CodeGen)
    .command(Gei)
    .command(
      'dev',
      'Start Typescript server and stucco server with hot reload.',
      async (yargs) => {},
      async (argv) => {
        CommandDev();
      },
    )
    .command('token', 'Get CI token', async (argv) => {
      await CommandGetCIToken();
    })
    .showHelpOnFail(true)
    .demandCommand()
    .version()
    .epilog('Bye!').argv;
});
