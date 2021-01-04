import * as templates from '@/code/systems/typings/templates';
import { functionParams, HandleTemplates } from '@/code/common';
import { Config } from '@/Configuration';
import { Environment } from 'graphql-zeus';

export const Javacript = async ({ schema }: Pick<functionParams, 'schema'>) => {
  const path = await Config.getUnknownString('typings', { message: 'Provide typings directory.', default: './' });
  const env = (await Config.getUnknownString('env', {
    message: 'Provide schema directory.',
    default: './',
  })) as Environment;
  const host = await Config.getUnknownString('host', {
    message: 'Provide host to communicate with(optional)',
    default: '',
  });
  HandleTemplates.action({
    content: templates.Javascript(schema, env, host),
    path,
    type: 'add',
  });
  HandleTemplates.action({
    content: templates.JavascriptDefinitions(schema, env, host),
    path,
    type: 'add',
  });
  return;
};
