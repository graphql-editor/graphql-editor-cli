import { Config } from '../Configuration';
import inquirer from 'inquirer';
import fs from 'fs';
import { Editor } from '../Editor';
import { AutocompleteInputPrompt } from '../utils';
import { Utils } from 'graphql-zeus';
import fetch from 'node-fetch';

export const loadFromFile = async () => {
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

export const loadFromURL = async () => {
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

export const IS_VERSION_SCHEMA_FILE_REGEX = /^schema-(.*)\.graphql$/;
export const IS_VERSION_STITCH_FILE_REGEX = /^stitch-(.*)\.graphql$/;
export const IS_VERSION_FILE_REGEX = /^schema-(.*)\.json$/;

export const loadFromEditor = async () => {
  const { sourceEditorNamespace, sourceEditorProjectName, sourceEditorVersion } = Config.conf();
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
  const projects = await Editor.fetchProjects(Config.get('sourceEditorNamespace'));
  if (!sourceEditorProjectName) {
    const project = await AutocompleteInputPrompt(
      projects.map((p) => p.name),
      {
        name: 'project',
        message: 'Choose a project',
      },
    );
    Config.set({
      sourceEditorProjectName: project,
    });
  }
  const currentProject = projects.find((p) => p.name === Config.get('sourceEditorProjectName'))!;
  const versionFiles = currentProject.sources!.sources!.filter((s) => IS_VERSION_FILE_REGEX.test(s.filename!));
  if (!sourceEditorVersion) {
    const versionNames = versionFiles.map((s) => IS_VERSION_FILE_REGEX.exec(s.filename!)![1]);
    const chosenVersion = await AutocompleteInputPrompt(versionNames, {
      name: 'version',
      message: 'Choose version',
    });
    Config.set({
      sourceEditorVersion: chosenVersion,
    });
  }
  const versionGraphQLFiles = await Promise.all(
    currentProject
      .sources!.sources!.filter((v) => v.filename?.endsWith(`${Config.get('sourceEditorVersion')}.graphql`))
      .map((v) => fetch(v.getUrl!).then((v) => v.text())),
  );
  return versionGraphQLFiles.join('\n');
};
