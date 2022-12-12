import * as templates from '@/commands/codegen/typings/templates/TypeScript.js';
import { HandleTemplates } from '@/common/index.js';
import { Environment, TreeToTS } from 'graphql-zeus-core';
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
    content: TreeToTS.resolveBasisHeader().concat(ts.const),
    path: p.join(path, 'zeus', 'const.ts'),
    type: 'add',
  });
  HandleTemplates.action({
    content: [TreeToTS.resolveBasisHeader(), ts.indexImports, ts.index].join(
      '\n',
    ),
    path: p.join(path, 'zeus', 'index.ts'),
    type: 'add',
  });
  return;
};
