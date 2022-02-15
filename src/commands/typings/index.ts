import { Config } from '@/Configuration';
import { Editor } from '@/Editor';
import { Environment } from 'graphql-zeus';
import * as generators from './generators';
import * as templates from './templates';
export { generators, templates };

export const CommandTypings = async ({
  typingsDir,
  namespace,
  project,
  version,
  typingsEnv,
  typingsHost,
}: {
  typingsDir?: string;
  namespace?: string;
  project?: string;
  version?: string;
  typingsEnv?: Environment;
  typingsHost?: string;
}) => {
  const cfg = await Config.configure(
    {
      typingsDir,
      namespace,
      project,
      version,
      typingsEnv,
      typingsHost,
    },
    ['namespace', 'project', 'version', 'typingsDir', 'typingsEnv', 'typingsHost'],
  );
  const schema = await Editor.getCompiledSchema(cfg);
  generators.TypeScript({
    env: cfg.typingsEnv,
    host: cfg.typingsHost,
    path: cfg.typingsDir,
    schema,
  });
};
