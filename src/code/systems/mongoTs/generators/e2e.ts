import * as templates from '@/code/systems/mongoTs/templates';
import { getPaths, addStucco, functionParams, HandleTemplates } from '@/code/common';
import { init } from '@/code/systems/mongoTs/core/init';

export const CRUD = async ({ resolverParentName, resolverField, rootTypes, sourceType }: functionParams) => {
  init();
  const { resolverPath, basePath, resolverLibPath } = getPaths(resolverParentName, resolverField, 'test.ts');
  HandleTemplates.action({
    content: await templates.e2eTest({
      field: resolverField,
      resolverParent: resolverParentName,
    }),
    path: resolverPath,
    type: 'add',
  });
  addStucco({ basePath, stuccoResolverName: `${resolverParentName}.${resolverField.name}`, resolverLibPath });
  return;
};
