import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { projectInstall } from 'pkg-install';
import ora from 'ora';
import {
  Config,
  Configuration,
  ConfigurationOptions,
} from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';
import { TypeScript } from '@/commands/codegen/typings/generators/TypeScript.js';
import { logger } from '@/common/log/index.js';
import { STUCCO_FILE } from '@/gshared/constants/index.js';

const cwd = process.cwd();
const jsonFile = (json: any) => JSON.stringify(json, null, 4);

export const CommandBootstrap = async ({
  name,
  namespace,
  project,
  projectVersion,
}: {
  name?: string;
  project?: string;
  namespace?: string;
  projectVersion?: string;
}) => {
  const projectDetails = await Config.resolve(
    { namespace, project, projectVersion },
    ['namespace', 'project', 'projectVersion'],
  );
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

  // new Configuration(projectPath);
  const createFiles = async () => {
    writeProjectJSONFile(
      (await import('./files/package.ts.json.js')).default(appSystemName),
      'package.json',
    );
    writeProjectJSONFile(
      (await import('./files/eslintrc.ts.json.js')).default,
      '.eslintrc.json',
    );
    writeProjectJSONFile(
      (await import('./files/prettierrc.json.js')).default,
      '.prettierrc.json',
    );
    writeProjectJSONFile(
      (await import('./files/tsconfig.json.js')).default,
      'tsconfig.json',
    );
    writeProjectJSONFile(
      (await import('./files/stucco.json.js')).default,
      STUCCO_FILE,
    );
    fs.writeFileSync(
      path.join(projectPath, '.gitignore'),
      await (
        await import('./files/.gitignore.js')
      ).default,
    );
  };
  const loading = ora('Copying files').start();
  await createFiles();
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
  const typingsDetails: Required<
    Pick<ConfigurationOptions, 'typingsDir' | 'typingsEnv' | 'typingsHost'>
  > = {
    typingsEnv: 'node',
    typingsHost: 'http://localhost:8080/',
    typingsDir: srcDir,
  };
  TypeScript({
    env: typingsDetails.typingsEnv,
    host: typingsDetails.typingsHost,
    path: path.join(projectPath, 'src'),
    schema,
  });
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
  logger(
    `\n\nSuccessfully created backend project in path: ${projectPath}.`,
    'success',
  );
};
