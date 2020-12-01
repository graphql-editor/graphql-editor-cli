import * as templates from '@/code/systems/mongoTs/templates';
import { getPaths, functionParams, HandleTemplates } from '@/code/common';
import { init } from '@/code/systems/mongoTs/core/init';

export const e2e = async ({ resolverParentName, resolverField, rootTypes }: functionParams) => {
  const { resolverPath, collectionsPath, modelsPath } = getPaths(resolverParentName, resolverField, 'test.ts');
  init(collectionsPath, modelsPath, rootTypes);
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
