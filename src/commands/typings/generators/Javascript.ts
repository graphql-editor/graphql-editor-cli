import * as templates from '@/commands/typings/templates';
import { HandleTemplates } from '@/common';
import { Environment, TreeToTS } from 'graphql-zeus';
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
  const js = templates.Javascript(schema, env, host);
  HandleTemplates.action({
    content: TreeToTS.resolveBasisHeader().concat(js.const),
    path: p.join(path, 'zeus', 'index.js'),
    type: 'add',
  });
  HandleTemplates.action({
    content: TreeToTS.resolveBasisHeader().concat(js.definitions),
    path: p.join(path, 'zeus', 'index.d.ts'),
    type: 'add',
  });
  return;
};
