import * as templates from '@/commands/typings/templates';
import { HandleTemplates } from '@/common';
import { Environment } from 'graphql-zeus';
import p from 'path';
export const TypeScript = async ({
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
  const ts = templates.TypeScript(schema, env, host);
  HandleTemplates.action({
    content: ts.const,
    path: p.join(path, 'zeus', 'const.ts'),
    type: 'add',
  });
  HandleTemplates.action({
    content: [ts.indexImports, ts.index].join('\n'),
    path: p.join(path, 'zeus', 'index.ts'),
    type: 'add',
  });
  return;
};
