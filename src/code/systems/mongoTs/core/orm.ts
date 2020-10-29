import { HandleTemplates, getPaths, functionParams } from '@/code/common';
import * as templates from '@/code/systems/mongoTs/templates/orm';
import { init } from './init';

export const orm = async ({ resolverParentName, resolverField }: functionParams) => {
  init();
  const { resolverPath } = getPaths(resolverParentName, resolverField);
  HandleTemplates.action({
    content: templates.orm({
      field: resolverField,
    }),
    path: resolverPath,
    type: 'add',
  });
  return;
};
