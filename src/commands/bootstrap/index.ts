import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { projectInstall } from 'pkg-install';
import ora from 'ora';
import { Auth } from '@/Auth';
import { AppType, Config, Configuration, ConfigurationOptions } from '@/Configuration';
import { Editor } from '@/Editor';
import { Javacript } from '@/commands/typings/generators';
import { TypeScript } from '@/commands/typings/generators';
import { getInitialConfig } from 'graphql-ssg';
import { logger } from '@/common/log';

const cwd = process.cwd();
const jsonFile = (json: any) => JSON.stringify(json, null, 4);

export const CommandBootstrap = async ({
  system,
  name,
  namespace,
  project,
  version,
}: {
  system?: AppType;
  name?: string;
  project?: string;
  namespace?: string;
  version?: string;
}) => {
  const projectDetails = await Config.resolve({ namespace, project, version, system }, [
    'system',
    'namespace',
    'project',
    'version',
  ]);
  const appSystemName = name
    ? name
    : (
        await inquirer.prompt({
          type: 'input',
          name: 'name',
          message: 'project name',
          default: projectDetails.project,
        })
      ).name;
  const projectPath = path.join(cwd, appSystemName);
  fs.mkdirSync(projectPath);
  const writeProjectJSONFile = (file: any, fileName: string) =>
    fs.writeFileSync(path.join(projectPath, fileName), jsonFile(file));

  if (projectDetails.system === 'backend') {
    const { type }: { type: 'js' | 'ts' } = await inquirer.prompt({
      type: 'list',
      name: 'type',
      message: 'programming language',
      choices: ['ts', 'js'],
    });
    // new Configuration(projectPath);
    const createFiles = {
      ts: async () => {
        writeProjectJSONFile((await import('./commands/backend/files/package.ts.json')).default, 'package.json');
        writeProjectJSONFile((await import('./commands/backend/files/eslintrc.ts.json')).default, '.eslintrc.json');
        writeProjectJSONFile((await import('./commands/backend/files/prettierrc.json')).default, '.prettierrc.json');
        writeProjectJSONFile((await import('./commands/backend/files/tsconfig.json')).default, 'tsconfig.json');
        fs.writeFileSync(
          path.join(projectPath, '.gitignore'),
          await (await import('./commands/backend/files/,gitignore')).default,
        );
      },
      js: async () => {
        writeProjectJSONFile((await import('./commands/backend/files/package.js.json')).default, 'package.json');
        writeProjectJSONFile((await import('./commands/backend/files/eslintrc.js.json')).default, '.eslintrc.json');
        writeProjectJSONFile((await import('./commands/backend/files/prettierrc.json')).default, '.prettierrc.json');
        fs.writeFileSync(
          path.join(projectPath, '.gitignore'),
          await (await import('./commands/backend/files/,gitignore')).default,
        );
      },
    };
    const loading = ora('Copying files').start();
    await createFiles[type]();
    loading.succeed();
    const loadingInstall = ora('Installing npm packages').start();
    await projectInstall({
      cwd: projectPath,
    });
    loadingInstall.succeed();
    const loggingIn = ora('Logging in...').start();
    loggingIn.succeed();
    const srcDir = './src';
    const libDir = './lib';

    const fetchingSchema = ora('Fetching compiled schema...').start();
    const schema = await Editor.getCompiledSchema({
      ...projectDetails,
    });
    fs.writeFileSync(path.join(projectPath, 'schema.graphql'), schema);
    fetchingSchema.succeed();
    const typingsDetails: Required<Pick<
      ConfigurationOptions,
      'typingsDir' | 'typingsEnv' | 'typingsGen' | 'typingsHost'
    >> = {
      typingsEnv: 'node',
      typingsGen: type === 'ts' ? 'TypeScript' : 'Javascript',
      typingsHost: 'http://localhost:8080/',
      typingsDir: srcDir,
    };
    if (type === 'js') {
      Javacript({
        env: typingsDetails.typingsEnv,
        host: typingsDetails.typingsHost,
        path: path.join(projectPath, 'src'),
        schema,
      });
    }
    if (type === 'ts') {
      TypeScript({
        env: typingsDetails.typingsEnv,
        host: typingsDetails.typingsHost,
        path: path.join(projectPath, 'src'),
        schema,
      });
    }
    writeProjectJSONFile(
      {
        ...projectDetails,
        ...typingsDetails,
        backendSrc: srcDir,
        backendLib: libDir,
        schemaDir: './',
      } as Partial<ConfigurationOptions>,
      Configuration.CONFIG_NAME,
    );
    logger(`\n\nSuccessfully created backend project in path: ${projectPath}.`, 'success');
  }
  if (projectDetails.system === 'frontend') {
    writeProjectJSONFile(
      {
        ...projectDetails,
      } as Partial<ConfigurationOptions>,
      Configuration.CONFIG_NAME,
    );
    const graphqlSSGConf = getInitialConfig({
      graphql: {
        main: {
          url: await Config.getUnknownString('typingsHost', {
            message: 'Provide GraphQL host',
            default: Editor.getFakerURL(`${projectDetails.namespace}/${projectDetails.project}`),
          }),
        },
      },
    });
    writeProjectJSONFile(graphqlSSGConf, 'graphql-ssg.json');
    fs.mkdirSync(path.join(projectPath, graphqlSSGConf.in));
    logger(
      `
Successfully acreated graphql-ssg project in path: ${projectPath}. 

Install graphql-ssg cli if you dont have it already:
npm i -g graphql-ssg

For further documentation visit:
https://graphqlssg.com/
  `,
      'success',
    );
  }
};
