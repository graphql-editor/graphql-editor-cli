import { ValueDefinition } from 'graphql-zeus';
import * as templates from '@/code/systems/mongoTs/templates/crud';
import { getPaths, addStucco, functionParams, HandleTemplates } from '@/code/common';
import { getCollection } from '@/code/systems/mongoTs/core/collection';
import { AutocompleteInputPrompt } from '@/utils';
import { init } from '@/code/systems/mongoTs/core/init';
import { getModel } from '@/code/systems/mongoTs/core/models';
import { getField } from '@/code/systems/mongoTs/core/field';

export const CRUD = async ({ resolverParentName, resolverField, rootTypes, sourceType }: functionParams) => {
  init();
  const resolverType = (await AutocompleteInputPrompt(Object.keys(templates), {
    name: 'resolverType',
    message: `Specify resolver type`,
  })) as keyof typeof templates;
  const { resolverPath, collectionsPath, basePath, resolverLibPath, modelsPath } = getPaths(
    resolverParentName,
    resolverField,
  );
  const returnedType = await getField(resolverField, rootTypes);
  const collection = await getCollection(collectionsPath, returnedType, rootTypes);
  const modelName = await getModel(modelsPath, returnedType, rootTypes);
  const input = resolverField.args?.find((a) => a.data?.type === ValueDefinition.InputValueDefinition);
  if (resolverType === 'oneInputCreate') {
    if (!input) {
      throw new Error('If you want to create oneinput create please do connect input as the resolver argument');
    }
    HandleTemplates.action({
      content: templates.oneInputCreate({
        collection,
        field: resolverField,
        resolverParent: resolverParentName,
        input: input.name,
        sourceType,
        modelName,
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
        modelName,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'oneInputRemove') {
    if (!input) {
      throw new Error('If you want to create oneinput create please do connect input as the resolver argument');
    }
    HandleTemplates.action({
      content: templates.oneInputRemove({
        collection,
        resolverParent: resolverParentName,
        sourceType,
        field: resolverField,
        input: input.name,
        modelName,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'twoInputUpdate') {
    const inputs = resolverField.args?.filter((a) => a.data?.type === ValueDefinition.InputValueDefinition) || [];
    if (inputs?.length !== 2) {
      throw new Error(
        'If you want to create twoinput update create please provide field with 2 inputs one for filtering one for update',
      );
    }

    const filterInput = await AutocompleteInputPrompt(
      inputs.map((i) => i.name),
      {
        name: 'filteringInput',
        message: `Specify filtering input`,
      },
    );
    const updatingInput = inputs.find((i) => i.name !== filterInput)!;
    HandleTemplates.action({
      content: templates.twoInputUpdate({
        collection,
        filterInput,
        input: updatingInput.name,
        resolverParent: resolverParentName,
        field: resolverField,
        sourceType,
        modelName,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'onInputGetByParam') {
    if (!input) {
      throw new Error('If you want to create oneinput create please do connect input as the resolver argument');
    }
    HandleTemplates.action({
      content: templates.onInputGetByParam({
        collection,
        sourceType,
        resolverParent: resolverParentName,
        field: resolverField,
        input: input.name,
        modelName,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  addStucco({ basePath, stuccoResolverName: `${resolverParentName}.${resolverField.name}`, resolverLibPath });
  return;
};
