import { Config } from '@/Configuration';
import { HandleTemplates } from '@/common';
import { Editor } from '@/Editor';
import path from 'path';

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

  const isFile = resolve.schemaDir.match(/.*\.(graphql|gql|sdl)$/);

  HandleTemplates.action({
    content: schema,
    path: isFile ? resolve.schemaDir : path.join(resolve.schemaDir, 'schema.graphql'),
    type: 'add',
  });
};
