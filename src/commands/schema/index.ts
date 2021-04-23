import { Config } from '@/Configuration';
import { HandleTemplates } from '@/common';

export const CommandSchema = async ({
  path,
  namespace,
  project,
  version,
  compiled,
}: {
  path?: string;
  namespace?: string;
  project?: string;
  version?: string;
  compiled?: boolean;
}) => {
  const resolve = await Config.configure({ namespace, project, version, schemaDir: path, compiled });
  const schema = await Config.getSchema(resolve);
  HandleTemplates.action({
    content: schema,
    path: resolve.schemaDir,
    type: 'add',
  });
};
