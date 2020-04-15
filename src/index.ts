#!/usr/bin/env node

import yargs from 'yargs';
import { code } from './code';
import { welcome } from './welcome';
import { init } from './init';

welcome().then(() => {
  yargs
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .command('init', 'Bootstrap new stucco based app', (yargs) => {
      init();
    })
    .command('code', 'Generate code for your backend', (yargs) => {
      code();
    })
    .showHelpOnFail(true)
    .demandCommand()
    .epilog('copyright 2020').argv;
});
