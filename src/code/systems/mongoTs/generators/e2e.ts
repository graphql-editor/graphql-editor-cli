import * as templates from '@/code/systems/mongoTs/templates';
import { getPaths, functionParams, HandleTemplates } from '@/code/common';
import { init } from '@/code/systems/mongoTs/core/init';

export const e2e = async ({ resolverParentName, resolverField }: functionParams) => {
  init();
  const { resolverPath } = getPaths(resolverParentName, resolverField, 'test.ts');
  HandleTemplates.action({
    content: await templates.e2eTest({
      field: resolverField,
      resolverParent: resolverParentName,
    }),
    path: resolverPath,
    type: 'add',
  });
  return;
};
