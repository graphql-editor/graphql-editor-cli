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
export const configure = (): Promise<void> =>
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
        name: 'srcdir',
        message: 'Name your src directory',
        default: 'src',
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
      prompts.push(
        AutocompleteInput(Object.keys(SourceOptions), {
          name: 'source',
          message: 'Choose your schema source',
        }),
      );
    }
    if (prompts.length > 0) {
      inquirer.prompt(prompts).then((answers) => {
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
        resolve();
      });
      return;
    }
    resolve();
  });
