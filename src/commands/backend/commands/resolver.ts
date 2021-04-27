import { TypeResolver } from '@/common/selectors';
import { addStucco, getPaths, HandleTemplates } from '@/common';
import { Config } from '@/Configuration';
import { Parser, ParserField } from 'graphql-zeus';
import { Editor } from '@/Editor';

interface BasicResolverProps {
  resolverParent: string;
  field: ParserField;
  body?: string;
  imports?: string;
  source?: string;
}

const basicResolver = ({ field, resolverParent, body = '', imports = '', source }: BasicResolverProps) => `
import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus';
${imports}

export const handler = async (input: FieldResolveInput) => 
  resolverFor('${resolverParent}','${field.name}',async (args${source ? `, source:${source}` : ``}) => {
    ${body}
  })(input.arguments${source ? `, input.source` : ``});
`;

export const CommandResolver = async ({
  namespace,
  project,
  version,
}: {
  namespace?: string;
  project?: string;
  version?: string;
}) => {
  const resolve = await Config.configure({ namespace, project, version }, ['namespace', 'project', 'version']);
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
  addStucco({ basePath, stuccoResolverName: `${parentResolver}.${resolver.name}`, resolverLibPath });
};
