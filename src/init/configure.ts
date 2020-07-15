import { AutocompleteInput } from '../utils';
import fs from 'fs';
import path from 'path';
import inquirer, { QuestionCollection } from 'inquirer';
import { Config, SchemaSourceOptions, ConfigurationOptions } from '../Configuration';

const SourceOptions = {
  'Load schema from file': SchemaSourceOptions.file,
  'Load schema from URL': SchemaSourceOptions.url,
  'Load schema from GraphQL Editor Account': SchemaSourceOptions.editor,
};
export const configure = async (): Promise<void> => {
  const {
    libdir = 'lib',
    name = 'centaur',
    srcdir = 'src',
    source = SchemaSourceOptions.editor,
    system,
  } = Config.conf();
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      default: name,
      message: 'Name your database',
    },
    {
      name: 'srcdir',
      message: 'Name your src directory',
      default: srcdir,
    },
    {
      type: 'input',
      name: 'libdir',
      default: libdir,
      message: 'Name your lib directory',
    },
    AutocompleteInput(Object.keys(SourceOptions), {
      name: 'source',
      message: 'Choose your schema source',
      default: source,
    }),
    AutocompleteInput(Object.keys(SourceOptions), {
      name: 'system',
      message: 'Choose your system',
    }),
  ]);
  let setConfig: ConfigurationOptions = {
    ...answers,
  };
  if (answers.source) {
    setConfig = {
      ...setConfig,
      source: SourceOptions[answers.source as keyof typeof SourceOptions],
    };
  }

  Config.set(setConfig);
  const srcDir = path.join(Config.projectPath, Config.get('srcdir'));
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
  }
  return;
};
