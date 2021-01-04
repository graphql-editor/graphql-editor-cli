import * as templates from '@/code/systems/typings/templates';
import { functionParams, HandleTemplates } from '@/code/common';
import { Config } from '@/Configuration';
import { Environment } from 'graphql-zeus';

export const TypeScript = async ({ schema }: Pick<functionParams, 'schema'>) => {
  const path = await Config.getUnknownString('typings', { message: 'Provide typings directory.', default: './' });
  const env = (await Config.getUnknownString('env', {
    message: 'Provide environment.',
    default: 'browser',
  })) as Environment;
  const host = await Config.getUnknownString('host', {
    message: 'Provide host to communicate with(optional)',
    default: '',
  });
  HandleTemplates.action({
    content: templates.TypeScript(schema, env, host),
    path,
    type: 'add',
  });
  return;
};
