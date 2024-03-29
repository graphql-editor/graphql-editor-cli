import { TypeResolver } from '@/common/selectors.js';
import { addStucco, getPaths, HandleTemplates } from '@/common/index.js';
import { Config } from '@/Configuration/index.js';
import { Parser, ParserField } from 'graphql-js-tree';
import { Editor } from '@/Editor.js';

interface BasicResolverProps {
  resolverParent: string;
  field: ParserField;
  body?: string;
  imports?: string;
  source?: string;
}

const basicResolver = ({
  field,
  resolverParent,
  source,
}: BasicResolverProps) => `
import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';

export const handler = async (input: FieldResolveInput) => 
  resolverFor('${resolverParent}','${field.name}',async (args${
  source ? `, source:${source}` : ``
}) => {
  })(input.arguments${source ? `, input.source` : ``});
`;

export const CommandResolver = async ({
  namespace,
  project,
  projectVersion,
}: {
  namespace?: string;
  project?: string;
  projectVersion?: string;
}) => {
  const resolve = await Config.configure(
    { namespace, project, projectVersion },
    ['namespace', 'project', 'projectVersion'],
  );
  const schema = await Editor.getCompiledSchema(resolve);
  const parseSchema = Parser.parseAddExtensions(schema);
  const { parentResolver, resolver } = await TypeResolver(parseSchema);
  const { resolverPath, basePath, resolverLibPath } = await getPaths({
    resolverParentName: parentResolver,
    resolverField: resolver,
    extension: 'ts',
  });
  HandleTemplates.action({
    content: basicResolver({
      field: resolver,
      resolverParent: parentResolver,
    }),
    path: resolverPath,
    type: 'add',
  });
  addStucco({
    basePath,
    stuccoResolverName: `${parentResolver}.${resolver.name}`,
    resolverLibPath,
  });
};
