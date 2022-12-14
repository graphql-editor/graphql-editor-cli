import path from 'path';
import { readFileSync } from 'fs';
import { DEPLOY_FILE, STUCCO_FILE } from '@/gshared/constants/index.js';
import { StuccoConfig } from '@/common/types.js';
import {
  getTypeName,
  Parser,
  ScalarTypes,
  TypeDefinition,
} from 'graphql-js-tree';
import { logger } from '@/common/log/index.js';
import ora from 'ora';

export const CommandInspect = async () => {
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
  const checking = ora(
    `Checking for non existing non-scalar resolvers`,
  ).start();
  const stuccoFileParsed: StuccoConfig = JSON.parse(stuccoFile);
  const tree = Parser.parse(schemaFile);
  tree.nodes
    .filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition)
    .map((n) => {
      n.args.map((field) => {
        if (
          (
            [
              ScalarTypes.Boolean,
              ScalarTypes.Float,
              ScalarTypes.ID,
              ScalarTypes.Int,
              ScalarTypes.String,
            ] as string[]
          ).includes(getTypeName(field.type.fieldType)) &&
          field.args.length === 0
        ) {
          return;
        }
        const implementationStuccoString = `${n.name}.${field.name}`;
        const isImplemented =
          stuccoFileParsed.resolvers[implementationStuccoString];
        if (!isImplemented) {
          logger(
            `There is no resolver for "${implementationStuccoString}" inside stucco.json`,
            'info',
          );
        }
      });
    });
  checking.succeed();
};
