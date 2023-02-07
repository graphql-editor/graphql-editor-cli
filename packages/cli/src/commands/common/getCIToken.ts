import { Editor } from '@/Editor.js';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import open from 'open';
import { logger } from '@/common/log/index.js';

export const CommandGetCIToken = async () => {
  const { device_code, verification_uri_complete } = await Editor.getDeviceCode();
  open(verification_uri_complete);
  await inquirer.prompt({
    type: 'confirm',
    message: 'Click verify in broser and the click yes. Are you ready?',
    name: 'ready',
  });
  const result = await Editor.getDeviceToken(device_code);
  clipboardy.writeSync(result.refresh_token);
  logger('CI token copied to clipoard. Put it to GRAPHQL_EDITOR_TOKEN variable in your CI.', 'info');
  return;
};
