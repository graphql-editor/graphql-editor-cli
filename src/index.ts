#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { Parser, Utils, TreeToTS, TreeToGraphQL, TypeDefinition } from 'graphql-zeus';
import inquirer, { QuestionCollection } from 'inquirer';
import { Editor } from './Editor';
import * as systems from './systems';
import * as centaur from './centaur';
import { Config, SchemaSourceOptions } from './Configuration';
import { Auth } from './Auth/Auth';

const { mongo } = systems;

export interface SchemaFileAnswers {
  schema_path: string;
}
const cwd = process.cwd();
const SourceOptions = {
  'Load schema from file': SchemaSourceOptions.file,
  'Load schema from URL': SchemaSourceOptions.url,
  'Load schema from GraphQL Editor Account': SchemaSourceOptions.editor,
};

const createUtils = () => {
  const srcdir = path.join(cwd, Config.get('srcdir'));
  if (!fs.existsSync(srcdir)) {
    fs.mkdirSync(srcdir, { recursive: true });
  }
  fs.writeFileSync(path.join(srcdir, 'Utils.ts'), mongo.templates.utils);
};
const createDbAndDbDir = () => {
  const dbDir = path.join(cwd, Config.get('srcdir'), 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  fs.writeFileSync(path.join(dbDir, 'mongo.ts'), mongo.templates.mongo({ name: Config.get('name') }));
};

const readZeus = (schemaFile: string) => {
  const parseSchema = Parser.parse(schemaFile);
  const zeusFile = TreeToTS.resolveTree(parseSchema, 'node');
  const graphqlFile = TreeToGraphQL.parse(parseSchema);
  fs.writeFileSync(path.join(process.cwd(), Config.get('srcdir'), 'graphql-zeus.ts'), zeusFile);
  fs.writeFileSync(path.join(process.cwd(), 'schema.graphql'), graphqlFile);
  return parseSchema;
};

const configure = (): Promise<void> =>
  new Promise((resolve) => {
    const { libdir, name, srcdir, source } = Config.conf();
    const prompts: QuestionCollection[] = [];
    if (!name) {
      prompts.push({
        type: 'input',
        name: 'name',
        default: 'centaur',
        message: 'Name your database',
      });
    }
    if (!srcdir) {
      prompts.push({
        type: 'list',
        choices: fs.readdirSync(cwd).filter((f) => fs.lstatSync(path.join(cwd, f)).isDirectory()),
        name: 'srcdir',
        message: 'Choose your src directory',
      });
    }
    if (!libdir) {
      prompts.push({
        type: 'input',
        name: 'libdir',
        default: 'lib',
        message: 'Name your lib directory',
      });
    }
    if (!source) {
      prompts.push({
        type: 'list',
        choices: Object.keys(SourceOptions),
        name: 'source',
        message: 'Choose your schema source',
      });
    }
    if (prompts.length > 0) {
      inquirer.prompt(prompts).then((answers) => {
        let setConfig = {
          ...answers,
        };
        if (answers.source) {
          setConfig = {
            ...setConfig,
            source: SourceOptions[answers.source as keyof typeof SourceOptions],
          };
        }
        Config.set(setConfig);
        resolve();
      });
      return;
    }
    createUtils();
    createDbAndDbDir();
    resolve();
  });

const welcome = (): Promise<void> =>
  new Promise((resolve) => {
    console.log(centaur.templates.logo);
    resolve();
  });

const loadFromFile = async () => {
  const { sourceFile } = Config.conf();
  if (!sourceFile) {
    const { schema_path } = await inquirer.prompt([
      {
        type: 'input',
        name: 'schema_path',
        default: 'schema.graphql',
        message: 'Enter schema path',
        validate: (userInput: string) => {
          return !!userInput;
        },
      },
    ]);
    Config.set({
      sourceFile: schema_path,
    });
  }
  const schemaFile = fs.readFileSync(Config.get('sourceFile')).toString();
  return schemaFile;
};

const loadFromURL = async () => {
  const { sourceURL } = Config.conf();
  if (!sourceURL) {
    const { schema_url } = await inquirer.prompt([
      {
        type: 'input',
        name: 'schema_url',
        message: 'Enter schema URL with http:// or https://',
        validate: (userInput: string) => {
          return userInput.startsWith('http://') || userInput.startsWith('https://');
        },
      },
    ]);
    Config.set({
      sourceURL: schema_url,
    });
  }
  const loadSchema = await Utils.getFromUrl(Config.get('sourceURL'));
  return loadSchema;
};

const loadFromEditor = async () => {
  const { sourceEditorNamespace, sourceEditorProject } = Config.conf();
  if (!sourceEditorNamespace) {
    const { namespaceSlug } = await inquirer.prompt([
      {
        type: 'input',
        name: 'namespaceSlug',
        message: 'Enter your namespace name',
        validate: async (userInput: string) => {
          const exists = await Editor.nameSpaceExists(userInput);
          if (!exists) {
            return 'Namespace with that slug doesnt exist';
          }
          return true;
        },
      },
    ]);
    Config.set({
      sourceEditorNamespace: namespaceSlug,
    });
  }
  if (!sourceEditorProject) {
    const projects = await Editor.fetchProjects(Config.get('sourceEditorNamespace'));
    const { project } = await inquirer.prompt([
      {
        type: 'list',
        name: 'project',
        choices: projects.map((p) => p.name),
      },
    ]);
    const projectURI = projects.find((p) => p.name === project)!.endpoint!.uri!;
    Config.set({
      sourceEditorProject: projectURI,
    });
  }
  const loadSchema = await Utils.getFromUrl(Editor.getFakerURL(Config.get('sourceEditorProject')));
  return loadSchema;
};

welcome()
  .then(configure)
  .then(async () => {
    const source = Config.get('source');
    let parseSchema: string = '';
    if (source === SchemaSourceOptions.file) {
      parseSchema = await loadFromFile();
    }
    if (source === SchemaSourceOptions.url) {
      parseSchema = await loadFromURL();
    }
    if (source === SchemaSourceOptions.editor) {
      try {
        await Auth.login();
      } catch (error) {
        throw new Error('Option only for logged in users');
      }
      parseSchema = await loadFromEditor();
    }
    const schemaTree = readZeus(parseSchema);
    const { resolver, parentResolver } = await centaur.generators.TypeResolver(schemaTree);
    const { generatorType }: { generatorType: keyof typeof mongo.generators } = await inquirer.prompt([
      {
        type: 'list',
        name: 'generatorType',
        choices: Object.keys(mongo.generators),
      },
    ]);
    const typeNodes = schemaTree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition);
    typeNodes.sort((a, b) => (a.name > b.name ? 1 : -1));
    mongo.generators[generatorType]({
      resolverField: resolver,
      resolverParentName: parentResolver,
      rootTypes: schemaTree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition),
    });
  });
