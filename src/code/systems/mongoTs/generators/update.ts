import { functionParams, getBasePaths } from '@/code/common';
import { init } from '@/code/systems/mongoTs/core/init';

export const update = ({ rootTypes }: Pick<functionParams, 'rootTypes'>) => {
  const { collectionsPath, modelsPath } = getBasePaths();
  init(collectionsPath, modelsPath, rootTypes);
};
