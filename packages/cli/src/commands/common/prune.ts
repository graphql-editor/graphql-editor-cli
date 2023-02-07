import path from 'path';
import { readFileSync } from 'fs';
import { DEPLOY_FILE, STUCCO_FILE } from '@/gshared/constants/index.js';
import { StuccoConfig } from '@/common/types.js';
import { Parser } from 'graphql-js-tree';
import { logger } from '@/common/log/index.js';
import ora from 'ora';

export const CommandPrune = async () => {
  const stuccoFile = readFileSync(
    path.join(process.cwd(), STUCCO_FILE),
    'utf-8',
  );
  const schemaFile = readFileSync(
    path.join(process.cwd(), DEPLOY_FILE),
    'utf-8',
  );

  if (!schemaFile)
    throw new Error(`NO ${DEPLOY_FILE} in current working directory`);
  if (!stuccoFile)
    throw new Error(`NO ${STUCCO_FILE} in current working directory`);
  const checking = ora(`Checking for dead resolvers`).start();
  const stuccoFileParsed: StuccoConfig = JSON.parse(stuccoFile);
  const tree = Parser.parse(schemaFile);
  Object.entries(stuccoFileParsed.resolvers).map(([k, resolver]) => {
    const [node, field] = k.split('.');
    const n = tree.nodes.find((n) => n.name === node);
    if (!n) {
      logger(
        `Node "${node}" does not exist in schema please delete "${k}" from stucco.json`,
        'info',
      );
      return;
    }
    if (!n.args.find((a) => a.name === field)) {
      logger(
        `Field "${field}" does not exist in schema on node "${node}" please delete "${k}" from stucco.json`,
        'info',
      );
    }
  });
  checking.succeed();
};
