import { Config, TypingsGen } from '@/Configuration';
import { Editor } from '@/Editor';
import { Environment } from 'graphql-zeus';
import * as generators from './generators';
import * as templates from './templates';
export { generators, templates };

export const CommandTypings = async ({
  path,
  compiled,
  namespace,
  project,
  version,
  gen,
  env,
  host,
}: {
  path?: string;
  namespace?: string;
  project?: string;
  version?: string;
  compiled?: boolean;
  gen?: TypingsGen;
  env?: Environment;
  host?: string;
}) => {
  const cfg = await Config.configure({
    typingsDir: path,
    namespace,
    project,
    version,
    typingsEnv: env,
    typingsGen: gen,
    typingsHost: host,
  });
  const schema = await Config.getSchema(cfg);
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
