import * as templates from '@/code/systems/mongoTs/templates/crud';
import { getPaths, addStucco, functionParams, HandleTemplates } from '@/code/common';
import { getCollection } from '@/code/systems/mongoTs/core/collection';
import { init } from '@/code/systems/mongoTs/core/init';
import { getModel } from '@/code/systems/mongoTs/core/models';
import { getField } from '@/code/systems/mongoTs/core/field';

export const CRUD = async ({ resolverParentName, resolverField, rootTypes, sourceType }: functionParams) => {
  init();
  const { resolverPath, collectionsPath, basePath, resolverLibPath, modelsPath } = getPaths(
    resolverParentName,
    resolverField,
  );
  const returnedType = await getField(resolverField, rootTypes);
  const collection = await getCollection(collectionsPath, returnedType);
  const modelName = await getModel(modelsPath, returnedType, rootTypes);
  HandleTemplates.action({
    content: templates.crudBase({
      collection,
      field: resolverField,
      resolverParent: resolverParentName,
      sourceType,
      modelName,
    }),
    path: resolverPath,
    type: 'add',
  });
  addStucco({ basePath, stuccoResolverName: `${resolverParentName}.${resolverField.name}`, resolverLibPath });
  return;
};
