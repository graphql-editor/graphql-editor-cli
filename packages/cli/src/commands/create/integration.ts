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

export const CommandBootstrapIntegration = async ({
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
          message: 'integration name',
          default: projectDetails.project,
        })
      ).name;
  const projectPath = path.join(cwd, appSystemName);
  const packagesPath = path.join(projectPath, 'packages');
  const sandboxPath = path.join(packagesPath, 'sandbox');
  const integrationPath = path.join(packagesPath, 'integration');
  fs.mkdirSync(projectPath);
  fs.mkdirSync(packagesPath);
  fs.mkdirSync(sandboxPath);
  fs.mkdirSync(integrationPath);

  const writeProjectJSONFile = (file: any, fileName: string) =>
    fs.writeFileSync(path.join(projectPath, fileName), jsonFile(file));
  const writeSandboxJSONFile = (file: any, fileName: string) =>
    fs.writeFileSync(path.join(sandboxPath, fileName), jsonFile(file));
  const writeIntegrationJSONFile = (file: any, fileName: string) =>
    fs.writeFileSync(path.join(integrationPath, fileName), jsonFile(file));

  const createFiles = async () => {
    writeProjectJSONFile(
      (await import('./files/gei/package.ts.json.js')).default(appSystemName),
      'package.json',
    );
    writeProjectJSONFile(
      (await import('./files/gei/tsconfig.json.js')).default,
      'tsconfig.json',
    );

    writeIntegrationJSONFile(
      (
        await import('./files/gei/packages/integration/package.ts.json.js')
      ).default(appSystemName),
      'package.json',
    );
    writeIntegrationJSONFile(
      (await import('./files/gei/packages/integration/tsconfig.json.js'))
        .default,
      'tsconfig.json',
    );
    writeIntegrationJSONFile(
      (await import('./files/gei/packages/integration/eslintrc.ts.json.js'))
        .default,
      '.eslintrc.json',
    );
    writeIntegrationJSONFile(
      (await import('./files/gei/packages/integration/prettierrc.json.js'))
        .default,
      '.prettierrc.json',
    );
    writeIntegrationJSONFile(
      (await import('./files/gei/packages/integration/stucco.json.js')).default,
      STUCCO_FILE,
    );

    writeSandboxJSONFile(
      (await import('./files/gei/packages/sandbox/package.ts.json.js')).default,
      'package.json',
    );
    writeSandboxJSONFile(
      (await import('./files/gei/packages/integration/stucco.json.js')).default,
      STUCCO_FILE,
    );
    writeSandboxJSONFile(
      (await import('./files/gei/packages/integration/tsconfig.json.js'))
        .default,
      'tsconfig.json',
    );
    const githubPath = path.join(projectPath, '.github');
    const workflowsPath = path.join(githubPath, 'workflows');

    fs.mkdirSync(githubPath);
    fs.mkdirSync(workflowsPath);

    fs.writeFileSync(
      path.join(workflowsPath, 'release.yml'),
      await (
        await import('./files/gei/.github/release.yml.js')
      ).default(appSystemName),
    );

    fs.writeFileSync(
      path.join(projectPath, '.gitignore'),
      await (
        await import('./files/.gitignore.js')
      ).default,
    );
    fs.writeFileSync(
      path.join(integrationPath, '.gitignore'),
      await (
        await import('./files/.gitignore.js')
      ).default,
    );
    fs.writeFileSync(
      path.join(sandboxPath, '.gitignore'),
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
  fs.writeFileSync(path.join(integrationPath, 'schema.graphql'), schema);
  fs.writeFileSync(path.join(sandboxPath, 'schema.graphql'), schema);
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
    path: path.join(integrationPath, 'src'),
    schema,
  });
  writeIntegrationJSONFile(
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
