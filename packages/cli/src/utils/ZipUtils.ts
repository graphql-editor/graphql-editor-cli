import archiver from 'archiver';
import fs from 'fs';
import fg from 'fast-glob';
import { Stream } from 'stream';
import ADMZip from 'adm-zip';
interface IFile {
  name: string;
  content: fs.ReadStream;
}
export const unZipFiles = async (buffer: Buffer, basePath: string) => {
  const zip = new ADMZip(buffer);
  return zip.extractAllToAsync(basePath);
};

export const zipFiles = (files: IFile[]): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const buffs: Buffer[] = [];

    const converter = new Stream.Writable();

    converter._write = (chunk: Buffer, encoding: string, cb: () => void) => {
      buffs.push(chunk);
      process.nextTick(cb);
    };

    converter.on('finish', () => {
      resolve(Buffer.concat(buffs));
    });

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(converter);

    for (const file of files) {
      archive.append(file.content, { name: file.name });
    }

    archive.finalize();
  });

export const getDirWithIgnoredGlobs = () => {
  const hasGitignore = fs.existsSync('.gitignore');
  const ignore: string[] = ['.git/**'];
  if (hasGitignore) {
    const gi = fs.readFileSync('.gitignore').toString('utf-8');
    ignore.push(...gi.split('\n').map((e) => (e.startsWith('/') ? e.substr(1) : e)));
  }

  const dirs = fg.sync('**/*.*', {
    ignore,
    dot: true,
  });
  return dirs;
};
export const zipCWD = async () => {
  const dirs = getDirWithIgnoredGlobs();
  const zipped = await zipFiles(dirs.map((d) => ({ content: fs.createReadStream(d), name: d })));
  return zipped;
};
