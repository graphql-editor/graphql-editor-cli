import inquirer from 'inquirer';
import * as templates from '@/code/systems/common/templates';
import { addStucco, getPaths, functionParams, HandleTemplates } from '@/code/common';
import { AutocompleteInputPrompt } from '@/utils';
import { Config } from '@/Configuration';

export const common = async ({ resolverParentName, resolverField, schema }: functionParams) => {
  const { resolverPath, basePath, resolverLibPath } = getPaths(resolverParentName, resolverField);
  const commonResolvers = Object.keys(templates);
  const resolverType = (await AutocompleteInputPrompt(commonResolvers, {
    name: 'resolverType',
    message: `Specify resolver type`,
  })) as keyof typeof templates;
  if (resolverType === 'resolver') {
    HandleTemplates.action({
      content: templates.resolver({
        field: resolverField,
        resolverParent: resolverParentName,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'pipe') {
    HandleTemplates.action({
      content: templates.pipe({
        field: resolverField,
        resolverParent: resolverParentName,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'rest') {
    HandleTemplates.action({
      content: templates.rest({
        field: resolverField,
        resolverParent: resolverParentName,
        url: (
          await inquirer.prompt([
            {
              name: 'url',
              message: 'Specify rest endpoint url',
              type: 'input',
              default: 'id',
            },
          ])
        ).url,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'schema') {
    HandleTemplates.action({
      content: templates.schema(schema),
      path: await Config.getUnknownString('schemaDir', { message: 'Provide schema directory.', default: './' }),
      type: 'add',
    });
    return;
  }
  addStucco({ basePath, stuccoResolverName: `${resolverParentName}.${resolverField.name}`, resolverLibPath });
};
