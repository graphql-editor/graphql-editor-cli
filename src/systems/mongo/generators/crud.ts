import { ValueDefinition, ScalarTypes } from 'graphql-zeus';
import inquirer from 'inquirer';
import { HandleTemplates } from '../../../handleTemplates';
import * as templates from '../templates';
import { functionParams } from './models';
import { addStucco } from './stucco';
import { getPaths } from './paths';
import { getCollection } from './collection';
import { AutocompleteInputPrompt } from '../../../AutoCompleteInput';

export const CRUD = async ({ resolverParentName, resolverField, rootTypes, sourceType }: functionParams) => {
  const crudResolvers = ['justAResolver', 'oneInputCreate', 'upsert', 'listFilter', 'remove', 'getByParam'];
  const resolverType = await AutocompleteInputPrompt(crudResolvers, {
    name: 'resolverType',
    message: `Specify resolver type`,
  });
  const { resolverPath, collectionsPath, basePath, resolverLibPath } = getPaths(resolverParentName, resolverField);
  const collection = await getCollection(collectionsPath, resolverField, rootTypes);
  if (resolverType === 'justAResolver') {
    HandleTemplates.action({
      content: templates.resolver({
        field: resolverField,
        resolverParent: resolverParentName,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'oneInputCreate') {
    const input = resolverField.args?.find((a) => a.data?.type === ValueDefinition.InputValueDefinition);
    if (!input) {
      throw new Error('If you want to create oneinput create please do connect input as the resolver argument');
    }
    HandleTemplates.action({
      content: templates.oneInputCreate({
        collection,
        resolverName: resolverField.name,
        resolverParent: resolverParentName,
        type: resolverField.type.name,
        input: input.name,
        sourceType,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'listFilter') {
    HandleTemplates.action({
      content: templates.listFilter({
        collection,
        resolverParent: resolverParentName,
        field: resolverField,
        sourceType,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'remove') {
    HandleTemplates.action({
      content: templates.remove({
        collection,
        pk: (
          await inquirer.prompt([
            {
              name: 'pk',
              message: 'Specify pk for remove',
              type: 'input',
              default: 'id',
            },
          ])
        ).pk,
        resolverParent: resolverParentName,
        resolverName: resolverField.name,
        sourceType,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'upsert') {
    const input = resolverField.args?.find((a) => a.data?.type === ValueDefinition.InputValueDefinition);
    if (!input) {
      throw new Error('If you want to create oneinput create please do connect input as the resolver argument');
    }
    HandleTemplates.action({
      content: templates.oneInputUpsert({
        collection,
        input: input.name,
        pk: (
          await inquirer.prompt([
            {
              name: 'pk',
              message: 'Specify pk for upsert',
              type: 'input',
              default: 'id',
            },
          ])
        ).pk,
        resolverParent: resolverParentName,
        resolverName: resolverField.name,
        sourceType,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'getByParam') {
    HandleTemplates.action({
      content: templates.getByParam({
        collection,
        pk: (
          await inquirer.prompt([
            {
              name: 'pk',
              message: 'Specify pk for get',
              type: 'input',
              default: 'id',
            },
          ])
        ).pk,
        type: resolverField.type.name,
        sourceType,
        resolverParent: resolverParentName,
        resolverName: resolverField.name,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  addStucco({ basePath, stuccoResolverName: `${resolverParentName}.${resolverField.name}`, resolverLibPath });
  return;
};
