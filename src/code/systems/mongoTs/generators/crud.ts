import * as templates from '@/code/systems/mongoTs/templates/crud';
import { getPaths, addStucco, functionParams, HandleTemplates } from '@/code/common';
import { getCollection } from '@/code/systems/mongoTs/core/collection';
import { init } from '@/code/systems/mongoTs/core/init';
import { getField } from '@/code/systems/mongoTs/core/field';

export const CRUD = async ({ resolverParentName, resolverField, rootTypes, sourceType }: functionParams) => {
  const { resolverPath, collectionsPath, basePath, resolverLibPath, modelsPath } = getPaths(
    resolverParentName,
    resolverField,
  );
  init(collectionsPath, modelsPath, rootTypes);
  const returnedType = await getField(resolverField, rootTypes);
  const collection = await getCollection(collectionsPath, returnedType);
  HandleTemplates.action({
    content: templates.crudBase({
      collection,
      field: resolverField,
      resolverParent: resolverParentName,
      sourceType,
    }),
    path: resolverPath,
    type: 'add',
  });
  addStucco({ basePath, stuccoResolverName: `${resolverParentName}.${resolverField.name}`, resolverLibPath });
  return;
};
