import fs from 'fs';
import path from 'path';
import { Action } from './models';
const unifyString = (s: string) => s.replace(/\s/g, '').replace(/\n/g, '').replace(/\"/g, `'`);
export class HandleTemplates {
  public static action = (a: Action) => {
    const folder = path.dirname(a.path);
    const existsPath = fs.existsSync(folder);
    if (!existsPath) {
      fs.mkdirSync(folder, {
        recursive: true,
      });
    }
    if (a.type === 'addIfNotExist') {
      const existsPath = fs.existsSync(a.path);
      if (!existsPath) {
        fs.writeFileSync(a.path, a.content);
      }
    }
    if (a.type === 'add') {
      fs.writeFileSync(a.path, a.content);
    }
    if (a.type === 'append') {
      const fileExist = fs.existsSync(a.path);
      if (fileExist) {
        const readFile = unifyString(fs.readFileSync(a.path).toString());
        if (readFile.includes(unifyString(a.content))) {
          return;
        }
      }
      fs.appendFileSync(a.path, a.content);
    }
  };
}
