import { CRUD } from './crud';
import { functionParams } from '../../common/models';
import { TypeSelector } from '../../../centaur/generators';
import { getModel } from './models';
import { getPaths } from '../../common/paths';

export const sourcedCrud = async ({ resolverParentName, resolverField, rootTypes }: functionParams) => {
  const selectedSourceType = await TypeSelector(rootTypes, {
    message: 'Select type of source',
  });
  const { modelsPath } = getPaths(resolverParentName, resolverField);
  const sourceModel = await getModel(modelsPath, selectedSourceType, rootTypes);
  CRUD({ resolverParentName, resolverField, rootTypes, sourceType: sourceModel });
};
