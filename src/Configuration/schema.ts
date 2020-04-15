import { Config } from '../Configuration';
import inquirer from 'inquirer';
import fs from 'fs';
import { Editor } from '../Editor';
import { AutocompleteInputPrompt } from '../utils';
import { Utils } from 'graphql-zeus';

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

export const loadFromEditor = async () => {
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
    const project = await AutocompleteInputPrompt(
      projects.map((p) => p.name),
      {
        name: 'project',
        message: 'Choose a project',
      },
    );
    const projectURI = projects.find((p) => p.name === project)!.endpoint!.uri!;
    Config.set({
      sourceEditorProject: projectURI,
    });
  }
  const loadSchema = await Utils.getFromUrl(Editor.getFakerURL(Config.get('sourceEditorProject')));
  return loadSchema;
};
