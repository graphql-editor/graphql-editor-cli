import { Config } from '@/Configuration/index.js';
import { HandleTemplates } from '@/common/index.js';
import { Editor } from '@/Editor.js';
import path from 'path';

export const CommandSchemaPush = async ({
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
  const isFile = resolve.schemaDir.match(/.*\.(graphql|gql|sdl)$/);
  const schema = HandleTemplates.action({
    content: '',
    path: isFile
      ? resolve.schemaDir
      : path.join(resolve.schemaDir, 'schema.graphql'),
    type: 'get',
  });
  if (!schema) {
    throw new Error('schema does not exists');
  }
  const p = await Editor.fetchProject({
    accountName: resolve.namespace,
    projectName: resolve.project,
  });
  await Editor.saveFilesToCloud(p.id, [
    {
      content: schema,
      name: 'schema-latest.graphql',
      type: 'application/json',
    },
  ]);
};
