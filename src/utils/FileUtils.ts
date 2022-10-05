import path from 'path';
import fs from 'fs';
export const ensureDirectoryExistence = (filePath: string) => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};
export const writeSafe = (filePath: string, content: string) => {
  ensureDirectoryExistence(filePath);
  return fs.writeFileSync(filePath, content);
};
