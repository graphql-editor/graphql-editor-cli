import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { Environment } from 'graphql-zeus';
import { Editor } from '@/Editor';
import { AutocompleteInputPrompt } from '@/utils';

export type TypingsGen = 'Javascript' | 'TypeScript';

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
}

export interface ConfigurationOptions extends TypingsConf, EditorConf, BackendConf {
  system?: string;
  schemaDir?: string;
  compiled?: boolean;
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
  compiled: { type: 'checkbox', message: 'Get schema together with its libraries', default: false },
};

export class Configuration {
  private options: ConfigurationOptions = {};
  private tokenOptions: TokenConf = {};
  constructor(public projectPath = process.cwd()) {
    Config = this;
    this.init();
  }
  private tokenConfigPath = () => path.join(this.projectPath, '.graphql-editor-auth.json');
  private configPath = () => path.join(this.projectPath, '.graphql-editor.json');

  init = () => {
    const cliConfig: Partial<ConfigurationOptions> = fs.existsSync(this.configPath()) ? require(this.configPath()) : {};
    const authConfig: Partial<TokenConf> = fs.existsSync(this.tokenConfigPath()) ? require(this.tokenConfigPath()) : {};
    this.set(cliConfig);
    this.setTokenOptions(authConfig);
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
      this.options.project = projectName;
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
      this.options.version = versionName;
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
    this.options[k] = answer;
    return answer;
  };

  resolve = async <T>(props: T | ConfigurationOptions) => {
    const dict: Record<string, any> = {};
    for (const key of Object.keys(props)) {
      dict[key] =
        props[key as keyof typeof props] ||
        ((await Config.getUnknownString(key as keyof ConfigurationOptions)) as string);
    }
    return dict as {
      [P in keyof T]: T[P] extends infer R | undefined ? R : T[P];
    };
  };

  configure = async <T>(props: T | ConfigurationOptions) => {
    const reconfigured = await this.resolve(props);
    this.set(reconfigured);
    return reconfigured;
  };

  conf = () => this.options;

  getSchema = async (resolve: { namespace: string; project: string; version: string; compiled?: boolean }) => {
    const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
    if (!p) {
      throw new Error(`Project "${resolve.project}" does not exist in "${resolve.namespace}" namespace`);
    }

    const schemaSource = resolve.compiled
      ? p.sources?.sources?.find((s) => s.filename === `schema.graphql`)
      : p.sources?.sources?.find((s) => s.filename === `schema-${resolve.version}.graphql`);
    if (!schemaSource?.getUrl) {
      throw new Error(`Project "${resolve.project}" does not have a version "${resolve.version}"`);
    }

    const schema = await Editor.getSource(schemaSource.getUrl);
    return schema;
  };
}
