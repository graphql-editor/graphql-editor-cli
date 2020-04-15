import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { Language } from './models';
import { configure } from './configure';
import { Configuration } from '../Configuration';

import packageTS from './systems/mongo/package.ts.json';
import packageJS from './systems/mongo/package.js.json';
import eslintTS from './eslintrc.ts.json';
import eslintJS from './eslintrc.js.json';
import prettier from './prettierrc.json';
import tsconfig from './tsconfig.json';

const cwd = process.cwd();
const jsonFile = (json: any) => JSON.stringify(json, null, 4);

export const init = async () => {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'project name',
  });
  const projectPath = path.join(cwd, name);
  fs.mkdirSync(projectPath);
  const writeProjectJSONFile = (file: any, fileName: string) =>
    fs.writeFileSync(path.join(projectPath, fileName), jsonFile(file));
  const { type }: { type: Language } = await inquirer.prompt({
    type: 'list',
    name: 'type',
    message: 'programming language',
    choices: ['ts', 'js'],
  });
  new Configuration(projectPath);
  await configure();
  if (type === 'ts') {
    writeProjectJSONFile(packageTS, 'package.json');
    writeProjectJSONFile(eslintTS, '.eslintrc.json');
    writeProjectJSONFile(prettier, '.prettierrc.json');
    writeProjectJSONFile(tsconfig, 'tsconfig.json');
  } else if (type === 'js') {
    writeProjectJSONFile(packageJS, 'package.json');
    writeProjectJSONFile(eslintJS, '.eslintrc.json');
    writeProjectJSONFile(prettier, '.prettierrc.json');
  }
  // Create .gitignore
  // configure
  console.log(`Successfully created centaur project in path: ${projectPath}. 
Go inside and run 'npm install'

then run:

centaur code 

to start code generation.
`);
};
