import { Config, TypingsGen } from '@/Configuration';
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
  typingsGen,
  typingsEnv,
  typingsHost,
}: {
  typingsDir?: string;
  namespace?: string;
  project?: string;
  version?: string;
  typingsGen?: TypingsGen;
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
      typingsGen,
      typingsHost,
    },
    ['namespace', 'project', 'version', 'typingsDir', 'typingsEnv', 'typingsHost', 'typingsGen'],
  );
  const schema = await Editor.getCompiledSchema(cfg);
  if (cfg.typingsGen === 'Javascript') {
    generators.Javacript({
      env: cfg.typingsEnv,
      host: cfg.typingsHost,
      path: cfg.typingsDir,
      schema,
    });
  }
  if (cfg.typingsGen === 'TypeScript') {
    generators.TypeScript({
      env: cfg.typingsEnv,
      host: cfg.typingsHost,
      path: cfg.typingsDir,
      schema,
    });
  }
};
