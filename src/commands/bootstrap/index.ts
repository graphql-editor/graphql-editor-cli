import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const jsonFile = (json: any) => JSON.stringify(json, null, 4);
export type AppType = 'backend' | 'frontend';

export const CommandBootstrap = async ({ appType, project }: { appType?: AppType; project?: string }) => {
  const appSystemType =
    appType ??
    ((
      await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: 'App type',
        choices: ['backend', 'frontend'],
      })
    ).type as AppType);

  const { name } = project
    ? { name: project }
    : await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'project name',
      });
  const projectPath = path.join(cwd, name);
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
    if (type === 'ts') {
      writeProjectJSONFile(await import('./commands/backend/files/package.ts.json'), 'package.json');
      writeProjectJSONFile(await import('./commands/backend/files/eslintrc.ts.json'), '.eslintrc.json');
      writeProjectJSONFile(await import('./commands/backend/files/prettierrc.json'), '.prettierrc.json');
      writeProjectJSONFile(await import('./commands/backend/files/tsconfig.json'), 'tsconfig.json');
    } else if (type === 'js') {
      writeProjectJSONFile(await import('./commands/backend/files/package.js.json'), 'package.json');
      writeProjectJSONFile(await import('./commands/backend/files/eslintrc.js.json'), '.eslintrc.json');
      writeProjectJSONFile(await import('./commands/backend/files/prettierrc.json'), '.prettierrc.json');
    }
    console.log(`Successfully created centaur project in path: ${projectPath}. 
Go inside and run:
npm install

then run this cli resolver command inside project:
gecli resolver 

to generate resolver.
  `);
  }
  if (appType === 'frontend') {
    writeProjectJSONFile(await import('./commands/frontend/files/.graphql-ssg.json'), '.graphql-ssg.json');
    console.log(`Successfully created frontend project in path: ${projectPath}. 
Install graphql-ssg cli:
npm i -g graphql-ssg

or instal locally
npm i graphql-ssg

Then start creating js esmodules with ".zeus.js" extension in pages directory. Each file must return string containing html and can use top level await
  `);
  }
};
