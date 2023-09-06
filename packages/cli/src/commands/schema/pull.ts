import { Config } from '@/Configuration/index.js';
import { HandleTemplates } from '@/common/index.js';
import { Editor } from '@/Editor.js';
import path from 'path';

export const CommandSchemaPull = async ({
  schemaDir,
  namespace,
  project,
  projectVersion,
}: {
  schemaDir?: string;
  namespace?: string;
  project?: string;
  projectVersion?: string;
}) => {
  const resolve = await Config.configure(
    { namespace, project, projectVersion, schemaDir },
    ['namespace', 'project', 'projectVersion', 'schemaDir'],
  );
  const schema = await Editor.getCompiledSchema(resolve);

  const isFile = resolve.schemaDir.match(/.*\.(graphql|gql|sdl)$/);

  HandleTemplates.action({
    content: schema,
    path: isFile
      ? resolve.schemaDir
      : path.join(resolve.schemaDir, 'schema.graphql'),
    type: 'add',
  });
};
