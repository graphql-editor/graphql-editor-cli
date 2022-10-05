import { logger } from '@/common/log/index.js';
import { Config } from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';
import { CLOUD_FOLDERS } from '@/gshared/constants/index.js';
import { getDirWithIgnoredGlobs } from '@/utils/ZipUtils.js';
import path from 'path';
import fs from 'fs';
import mime from 'mime';

export const CommandPush = async ({ namespace, project }: { namespace?: string; project?: string }) => {
  const resolve = await Config.configure({ namespace, project }, ['namespace', 'project']);
  const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
  const files = getDirWithIgnoredGlobs();
  if (!p.team?.id) {
    throw new Error('No team for this project. Invalid project');
  }
  logger('Cleaning directory before pushing the files', 'info');
  await Editor.removeFiles(
    p.team.id,
    p.id,
    p.sources?.sources
      ?.filter((s) => s.filename?.startsWith(CLOUD_FOLDERS.microserviceJs + '/'))
      .map((s) => s.filename!) || [],
  );
  logger('Files successfully removed', 'success');
  logger('Pushing the files to cloud', 'info');
  await Editor.saveFilesToCloud(
    p.id,
    files.map((f) => ({
      name: path.join(CLOUD_FOLDERS.microserviceJs, f),
      content: fs.readFileSync(f),
      type: mime.extension(f) || 'text/plain',
    })),
  );
  logger('Successfully uploaded files to GraphQL Editor Cloud', 'success');
  return;
};
