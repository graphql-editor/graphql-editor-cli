import * as templates from '@/commands/typings/templates';
import { HandleTemplates } from '@/common';
import { Environment } from 'graphql-zeus';
import p from 'path';

export const Javacript = async ({
  schema,
  env,
  host,
  path,
}: {
  schema: string;
  env: Environment;
  host: string;
  path: string;
}) => {
  HandleTemplates.action({
    content: templates.Javascript(schema, env, host),
    path: p.join(path, 'zeus', 'index.js'),
    type: 'add',
  });
  HandleTemplates.action({
    content: templates.JavascriptDefinitions(schema, env, host),
    path: p.join(path, 'zeus', 'index.d.ts'),
    type: 'add',
  });
  return;
};
