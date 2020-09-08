import { HandleTemplates } from '../../../handleTemplates';
import * as templates from '../templates/orm';
import { functionParams } from '../../common/models';
import { getPaths } from '../../common/paths';
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
