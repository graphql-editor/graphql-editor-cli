import { Config } from '@/Configuration';
import { HandleTemplates } from '@/common';
import { Editor } from '@/Editor';

export const CommandSchema = async ({
  schemaDir,
  namespace,
  project,
  version,
}: {
  schemaDir?: string;
  namespace?: string;
  project?: string;
  version?: string;
}) => {
  const resolve = await Config.configure({ namespace, project, version, schemaDir }, [
    'namespace',
    'project',
    'version',
    'schemaDir',
  ]);
  const schema = await Editor.getCompiledSchema(resolve);
  HandleTemplates.action({
    content: schema,
    path: resolve.schemaDir,
    type: 'add',
  });
};
