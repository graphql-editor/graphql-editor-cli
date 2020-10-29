import fs from 'fs';
import path from 'path';
import { loadFromFile, loadFromEditor, loadFromURL } from './schema';
import { Auth } from '../Auth';

export interface ConfigurationOptions {
  name?: string;
  srcdir?: string;
  libdir?: string;
  testdir?: string;
  source?: SchemaSourceOptions;
  sourceFile?: string;
  sourceURL?: string;
  sourceEditorNamespace?: string;
  sourceEditorProject?: string;
  sourceEditorProjectName?: string;
  sourceEditorVersion?: string;
  token?: string;
  tokenLastSet?: string;
  system?: string;
}

export enum SchemaSourceOptions {
  file = 'file',
  url = 'url',
  editor = 'editor',
}

export let Config: Configuration;

export class Configuration {
  private options: ConfigurationOptions = {};
  constructor(public projectPath = process.cwd()) {
    Config = this;
    this.init();
  }
  private centaurPath = () => path.join(this.projectPath, '.centaur.js');
  getSchema = async (source?: SchemaSourceOptions) => {
    if (!source) {
      console.log(`
      Please init your centaur first
      `);
      throw new Error('No source is defined');
    }
    let parseSchema;
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
    if (!parseSchema) {
      throw new Error(
        `Wrong schema option 'source': "${source}", should be one of:${Object.keys(SchemaSourceOptions).join(
          ', ',
        )}. Please check your .centaur.js file`,
      );
    }
    return parseSchema;
  };
  init = () => {
    const centaurConfig: Partial<ConfigurationOptions> = fs.existsSync(this.centaurPath())
      ? require(this.centaurPath())
      : {};
    this.set(centaurConfig);
  };
  set = (opts?: Partial<ConfigurationOptions>) => {
    if (opts) {
      this.options = {
        ...this.options,
        ...opts,
      };
      fs.writeFileSync(this.centaurPath(), `module.exports = ${JSON.stringify(this.options, null, 4)}`);
    }
  };
  get = (k: keyof ConfigurationOptions) => this.options[k]!;
  conf = () => this.options;
}
