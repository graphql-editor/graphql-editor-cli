import fs from 'fs';
import path from 'path';

interface Options {
  name?: string;
  srcdir?: string;
  libdir?: string;
  source?: SchemaSourceOptions;
  sourceFile?: string;
  sourceURL?: string;
  sourceEditorNamespace?: string;
  sourceEditorProject?: string;
  token?: string;
  tokenLastSet?: string;
}

export enum SchemaSourceOptions {
  file = 'file',
  url = 'url',
  editor = 'editor',
}

const centaurConfigPath = path.join(process.cwd(), '.centaur.js');
const centaurConfig: Partial<Options> = fs.existsSync(centaurConfigPath) ? require(centaurConfigPath) : {};

export let Config: Configuration;

class Configuration {
  private options: Options = {};
  constructor(opts?: Partial<Options>) {
    this.set(opts);
    Config = this;
  }
  set = (opts?: Partial<Options>) => {
    if (opts) {
      this.options = {
        ...this.options,
        ...opts,
      };
      fs.writeFileSync('.centaur.js', `module.exports = ${JSON.stringify(this.options, null, 4)}`);
    }
  };
  get = (k: keyof Options) => this.options[k]!;
  conf = () => this.options;
}

new Configuration(centaurConfig);
