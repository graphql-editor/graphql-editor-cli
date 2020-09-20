import { CRUD } from './crud';
import { getModel } from './models';
import { getPaths, functionParams } from '@/code/common';
import { TypeSelector } from '@/code/centaur/generators';

export const sourcedCrud = async ({ resolverParentName, resolverField, rootTypes }: functionParams) => {
  const selectedSourceType = await TypeSelector(rootTypes, {
    message: 'Select type of source',
  });
  const { modelsPath } = getPaths(resolverParentName, resolverField);
  const sourceModel = await getModel(modelsPath, selectedSourceType, rootTypes);
  CRUD({ resolverParentName, resolverField, rootTypes, sourceType: sourceModel });
};
