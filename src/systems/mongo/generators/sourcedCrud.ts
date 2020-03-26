import { CRUD } from './crud';
import { functionParams } from './models';
import { TypeSelector } from '../../../centaur/generators';

export const sourcedCrud = async ({ resolverParentName, resolverField, rootTypes }: functionParams) => {
  const selectedSourceType = await TypeSelector(rootTypes, {
    message: 'Select type of source',
  });
  CRUD({ resolverParentName, resolverField, rootTypes, sourceType: selectedSourceType.name });
};
