import { functionParams, getBasePaths } from '@/code/common';
import { init } from '@/code/systems/mongoTs/core/init';

export const update = ({ rootTypes }: functionParams) => {
  const { collectionsPath, modelsPath } = getBasePaths();
  init(collectionsPath, modelsPath, rootTypes);
};
