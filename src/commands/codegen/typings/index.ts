import { Config } from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';
import { Environment } from 'graphql-zeus-core';
import * as generators from '@/commands/codegen/typings/generators/TypeScript.js';
import * as templates from '@/commands/codegen/typings/templates/TypeScript.js';
export { generators, templates };

export const CommandTypings = async ({
  typingsDir,
  namespace,
  project,
  projectVersion,
  typingsEnv,
  typingsHost,
}: {
  typingsDir?: string;
  namespace?: string;
  project?: string;
  projectVersion?: string;
  typingsEnv?: Environment;
  typingsHost?: string;
}) => {
  const cfg = await Config.configure(
    {
      typingsDir,
      namespace,
      project,
      projectVersion,
      typingsEnv,
      typingsHost,
    },
    [
      'namespace',
      'project',
      'projectVersion',
      'typingsDir',
      'typingsEnv',
      'typingsHost',
    ],
  );
  const schema = await Editor.getCompiledSchema(cfg);
  generators.TypeScript({
    env: cfg.typingsEnv,
    host: cfg.typingsHost,
    path: cfg.typingsDir,
    schema,
  });
};
