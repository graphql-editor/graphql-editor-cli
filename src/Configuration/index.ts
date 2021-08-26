import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { Environment } from 'graphql-zeus';
import { Editor } from '@/Editor';
import { AutocompleteInputPrompt } from '@/utils';

export type AppType = 'backend' | 'frontend';
export type TypingsGen = 'Javascript' | 'TypeScript';
export type DeploymentType = 'editor' | 'azure';

export interface TokenConf {
  token?: string;
  tokenLastSet?: string;
}

export interface TypingsConf {
  typingsDir?: string;
  typingsEnv?: Environment;
  typingsGen?: TypingsGen;
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
}

export interface ConfigurationOptions extends TypingsConf, EditorConf, BackendConf {
  system?: AppType;
  schemaDir?: string;
}

export let Config: Configuration;

const ConfigurationSpecialPrompts: { [P in keyof ConfigurationOptions]?: inquirer.QuestionCollection } = {
  typingsGen: {
    choices: ['TypeScript', 'Javascript'],
    message: 'Generation language',
    name: 'typingsGen',
    type: 'list',
  },
  typingsEnv: { choices: ['browser', 'node'], message: 'Select environment', name: 'typingsEnv', type: 'list' },
  version: { message: 'Project version', default: 'latest', type: 'input' },
  system: { type: 'list', choices: ['backend', 'frontend'], message: 'Select project type', name: 'system' },
};

export class Configuration {
  private options: ConfigurationOptions = {};
  private tokenOptions: TokenConf = {};
  constructor(public projectPath = process.cwd()) {
    Config = this;
    this.init();
  }
  private tokenConfigPath = () => path.join(this.projectPath, Configuration.AUTH_NAME);
  private configPath = () => path.join(this.projectPath, Configuration.CONFIG_NAME);
  static CONFIG_NAME = '.graphql-editor.json';
  static AUTH_NAME = '.graphql-editor-auth.json';
  init = () => {
    const cliConfig = fs.existsSync(this.configPath()) && require(this.configPath());
    const authConfig = fs.existsSync(this.tokenConfigPath()) && require(this.tokenConfigPath());
    if (cliConfig) {
      this.options = { ...cliConfig };
    }
    if (authConfig) {
      this.tokenOptions = { ...authConfig };
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
      this.tokenOptions = {
        ...this.tokenOptions,
        ...opts,
      };
      fs.writeFileSync(this.tokenConfigPath(), `${JSON.stringify(this.tokenOptions, null, 4)}`);
    }
  };

  get = <T extends keyof ConfigurationOptions>(k: T) => this.options[k]!;
  getTokenOptions = <T extends keyof TokenConf>(k: T) => this.tokenOptions[k]!;

  getUnknownString = async <T extends keyof ConfigurationOptions>(
    k: T,
    options?: { message?: string; default?: string },
  ) => {
    if (this.options[k]) {
      return this.options[k];
    }
    if (k === 'project' && this.options.namespace) {
      const projects = await Editor.fetchProjects(this.options.namespace);
      const projectName = await AutocompleteInputPrompt(
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
        .filter((s) => s.filename!.match(/schema-(.*).graphql/))
        .map((s) => s.filename!.match(/schema-(.*).graphql/)![1]);
      const versionName = await AutocompleteInputPrompt(files, { message: 'Select a version', name: 'version' });
      return versionName;
    }
    const inqProps: inquirer.QuestionCollection = ConfigurationSpecialPrompts[k]
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
