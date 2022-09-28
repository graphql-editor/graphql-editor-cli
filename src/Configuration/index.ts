import fs from 'fs';
import path from 'path';
import inquirer, { QuestionCollection } from 'inquirer';
import { Environment } from 'graphql-zeus';
import { Editor } from '@/Editor.js';
import { IS_VERSION_FILE_REGEX } from '@/gshared/constants/index.js';
import Conf from 'conf';
import AutoCompleteInputPrompt from '@/utils/AutoCompleteInputPrompt.js';

export type DeploymentType = 'editor' | 'azure';

export interface TokenConf {
  token?: string;
  tokenLastSet?: string;
}

export interface TypingsConf {
  typingsDir?: string;
  typingsEnv?: Environment;
  typingsHost?: string;
}

export interface EditorConf {
  namespace?: string;
  project?: string;
  version?: string;
}

export interface BackendConf {
  backendSrc?: string;
  backendLib?: string;
  backendZip?: string;
  buildScript?: string;
}
export interface IntegrationConf {
  npmPackage?: string;
  registry?: string;
}
export interface ConfigurationOptions extends TypingsConf, EditorConf, BackendConf, IntegrationConf {
  schemaDir?: string;
}

export let Config: Configuration;

const ConfigurationSpecialPrompts: { [P in keyof ConfigurationOptions]?: QuestionCollection } = {
  typingsEnv: { choices: ['browser', 'node'], message: 'Select environment', name: 'typingsEnv', type: 'list' },
  version: { message: 'Project version', default: 'latest', type: 'input' },
};

export class Configuration {
  private options: ConfigurationOptions = {};
  private authConfig = new Conf<TokenConf>({ projectName: 'graphql-editor', projectSuffix: 'auth' });
  constructor(public projectPath = process.cwd()) {
    Config = this;
    this.init();
  }
  private configPath = () => path.join(this.projectPath, Configuration.CONFIG_NAME);
  static CONFIG_NAME = '.graphql-editor.json';
  init = () => {
    const cliConfig =
      fs.existsSync(this.configPath()) && JSON.parse(fs.readFileSync(this.configPath()).toString('utf8'));
    // const authConfig = this.authConfig.get()
    if (cliConfig) {
      this.options = { ...cliConfig };
    }
  };

  set = (opts?: Partial<ConfigurationOptions>) => {
    if (opts) {
      this.options = {
        ...this.options,
        ...opts,
      };
      fs.writeFileSync(this.configPath(), `${JSON.stringify(this.options, null, 4)}`);
    }
  };
  setTokenOptions = (opts?: Partial<TokenConf>) => {
    if (opts) {
      this.authConfig.set({ ...opts });
    }
  };
  getAuthPath = () => this.authConfig.path;

  get = <T extends keyof ConfigurationOptions>(k: T) => this.options[k]!;
  getTokenOptions = <T extends keyof TokenConf>(k: T) => this.authConfig.get(k);
  logout = () => this.authConfig.clear();

  getUnknownString = async <T extends keyof ConfigurationOptions>(
    k: T,
    options?: { message?: string; default?: string },
  ) => {
    if (this.options[k]) {
      return this.options[k];
    }
    if (k === 'project' && this.options.namespace) {
      const projects = await Editor.fetchProjects(this.options.namespace);
      const projectName = await AutoCompleteInputPrompt(
        projects.map((p) => p.name),
        { message: 'Select a project', name: 'project' },
      );
      return projectName;
    }
    if (k === 'version' && this.options.namespace && this.options.project) {
      const project = await Editor.fetchProject({
        accountName: this.options.namespace,
        projectName: this.options.project,
      });
      if (!project?.sources?.sources) {
        throw new Error('Invalid project - no graphql version available');
      }
      const files = project.sources.sources
        .filter((s) => IS_VERSION_FILE_REGEX.exec(s.filename!))
        .map((s) => IS_VERSION_FILE_REGEX.exec(s.filename!)![1]);
      const versionName = await AutoCompleteInputPrompt(files, { message: 'Select a version', name: 'version' });
      return versionName;
    }
    const inqProps: QuestionCollection = ConfigurationSpecialPrompts[k]
      ? (ConfigurationSpecialPrompts[k] as any)
      : {
          name: k,
          type: 'input',
          ...options,
          default: options?.default,
        };
    const answer = (await inquirer.prompt(inqProps))[k] as any;
    return answer;
  };

  resolve = async <T, Z extends Array<keyof T>>(props: T | ConfigurationOptions, order: Z) => {
    const dict: Record<string, any> = {};
    for (const key of order) {
      dict[key as string] =
        props[key as keyof typeof props] ||
        ((await Config.getUnknownString(key as keyof ConfigurationOptions)) as string);
      this.options[key as keyof ConfigurationOptions] = dict[key as string];
    }
    const updatedOptions = dict as ConfigurationOptions extends TypingsConf
      ? {
          [P in keyof T]: T[P] extends infer R | undefined ? R : T[P];
        }
      : never;
    return updatedOptions as Pick<typeof updatedOptions, Z extends Array<infer R> ? R : {}>;
  };

  configure = async <T, Z extends Array<keyof T>>(props: T | ConfigurationOptions, order: Z) => {
    const reconfigured = await this.resolve(props, order);
    this.set(reconfigured);
    return reconfigured;
  };

  conf = () => this.options;
}
