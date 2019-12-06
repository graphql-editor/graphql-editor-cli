import fs from 'fs';
import { ParserField, ValueDefinition, ScalarTypes } from 'graphql-zeus';
import inquirer from 'inquirer';
import { HandleTemplates } from '../../../handleTemplates';
import * as templates from '../templates';
import path from 'path';
import { Config } from '../../../Configuration';

export const CRUD = async (resolverParentName: string, resolverField: ParserField, rootTypes: ParserField[]) => {
  const { resolverType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'resolverType',
      message: `Specify resolver type`,
      choices: ['justAResolver', 'oneInputCreate', 'upsert', 'listFilter', 'remove', 'getByParam'],
    },
  ]);
  const basePath = process.cwd();
  const srcDir = path.join(basePath, Config.get('srcdir'));
  const collectionsPath = path.join(srcDir, 'db', 'collections.ts');
  const resolverPath = path.join(srcDir, resolverParentName, `${resolverField.name}.ts`);
  const resolverLibPath = path.join(Config.get('libdir'), resolverParentName, `${resolverField.name}`);
  const gafferResolverName = `${resolverParentName}.${resolverField.name}`;
  const returnTypeScalar = Object.keys(ScalarTypes).includes(resolverField.type.name);
  const collection = returnTypeScalar
    ? `${
        (
          await inquirer.prompt({
            type: 'list',
            message: 'specify collection Type',
            choices: rootTypes.map((rt) => rt.name),
            name: 'collection',
          })
        ).collection
      }Collection`
    : `${resolverField.type.name}Collection`;
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
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  HandleTemplates.action({
    type: 'append',
    path: collectionsPath,
    content: `\nexport const ${collection} = "${collection}"`,
  });
  const gafferPath = path.join(basePath, 'stucco.json');
  const gafferFile = fs.existsSync(gafferPath) ? JSON.parse(fs.readFileSync(gafferPath).toString()) : { resolvers: {} };
  const gafferFileContent = {
    ...gafferFile,
    resolvers: {
      ...gafferFile.resolvers,
    },
  };

  gafferFileContent.resolvers[gafferResolverName] = {
    resolve: {
      name: resolverLibPath,
    },
  };
  fs.writeFileSync(gafferPath, JSON.stringify(gafferFileContent, null, 4));
  return;
};
