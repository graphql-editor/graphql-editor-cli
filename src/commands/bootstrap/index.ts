import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import listr from 'listr';
import { projectInstall } from 'pkg-install';
import ora from 'ora';
import { Auth } from '@/Auth';
import { Config, Configuration } from '@/Configuration';

const cwd = process.cwd();
const jsonFile = (json: any) => JSON.stringify(json, null, 4);
export type AppType = 'backend' | 'frontend';

export const CommandBootstrap = async ({
  type,
  name,
  namespace,
  project,
  version,
}: {
  type?: AppType;
  name?: string;
  project?: string;
  namespace?: string;
  version?: string;
}) => {
  const appSystemType =
    type ??
    ((
      await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: 'App type',
        choices: ['backend', 'frontend'],
      })
    ).type as AppType);

  const appSystemName = name
    ? name
    : (
        await inquirer.prompt({
          type: 'input',
          name: 'name',
          message: 'project name',
        })
      ).name;
  const projectPath = path.join(cwd, appSystemName);
  fs.mkdirSync(projectPath);
  const writeProjectJSONFile = (file: any, fileName: string) =>
    fs.writeFileSync(path.join(projectPath, fileName), jsonFile(file));
  if (appSystemType === 'backend') {
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
      },
      js: async () => {
        writeProjectJSONFile((await import('./commands/backend/files/package.js.json')).default, 'package.json');
        writeProjectJSONFile((await import('./commands/backend/files/eslintrc.js.json')).default, '.eslintrc.json');
        writeProjectJSONFile((await import('./commands/backend/files/prettierrc.json')).default, '.prettierrc.json');
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
    const credentials = await Auth.login();
    writeProjectJSONFile(credentials, Configuration.AUTH_NAME);
    loggingIn.succeed();
    const projectDetails = await Config.resolve({ namespace, project, version });
    writeProjectJSONFile(projectDetails, Configuration.CONFIG_NAME);
    console.log(`\n\nSuccessfully created backend project in path: ${projectPath}.`);
  }
  if (type === 'frontend') {
    writeProjectJSONFile((await import('./commands/frontend/files/.graphql-ssg.json')).default, '.graphql-ssg.json');
    console.log(`Successfully created frontend project in path: ${projectPath}. 
Install graphql-ssg cli:
npm i -g graphql-ssg

or instal locally
npm i graphql-ssg

Then start creating js esmodules with ".zeus.js" extension in pages directory. Each file must return string containing html and can use top level await
  `);
  }
};
