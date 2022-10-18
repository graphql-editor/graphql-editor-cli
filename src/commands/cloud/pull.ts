import { Config } from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';
import { CLOUD_FOLDERS } from '@/gshared/constants/index.js';
import path from 'path';
import { writeInitialFiles } from '@/common/liveFiles.js';

export const CommandPull = async ({
  namespace,
  project,
}: {
  namespace?: string;
  project?: string;
}) => {
  const resolve = await Config.configure({ namespace, project }, [
    'namespace',
    'project',
  ]);
  const p = await Editor.fetchProject({
    accountName: resolve.namespace,
    projectName: resolve.project,
  });

  const s3Files = p.sources?.sources?.filter((s) =>
    s.filename?.startsWith(CLOUD_FOLDERS['microserviceJs'] + '/'),
  );
  await writeInitialFiles(path.join(process.cwd(), resolve.project), s3Files);
  return;
};
