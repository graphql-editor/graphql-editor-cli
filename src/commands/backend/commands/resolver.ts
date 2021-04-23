import { TypeResolver } from '@/common/selectors';
import { addStucco, getPaths, HandleTemplates } from '@/common';
import { Config } from '@/Configuration';
import { Parser, ParserField } from 'graphql-zeus';

interface BasicResolverProps {
  resolverParent: string;
  field: ParserField;
  body?: string;
  imports?: string;
  source?: string;
}

const basicResolver = ({ field, resolverParent, body = '', imports = '', source }: BasicResolverProps) => `
import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../graphql-zeus';
${imports}

export const handler = async (input: FieldResolveInput) => 
  resolverFor('${resolverParent}','${field.name}',async (args${source ? `, source:${source}` : ``}) => {
    ${body}
  })(input.arguments${source ? `, input.source` : ``});
`;

export const resolver = async ({
  compiled,
  namespace,
  path,
  project,
  version,
}: {
  path?: string;
  namespace?: string;
  project?: string;
  version?: string;
  compiled?: boolean;
}) => {
  const resolve = await Config.resolve({ compiled, namespace, path, project, version });
  const schema = await Config.getSchema(resolve);
  const parseSchema = Parser.parseAddExtensions(schema);
  const { parentResolver, resolver } = await TypeResolver(parseSchema);
  const { resolverPath, basePath, resolverLibPath } = getPaths(parentResolver, resolver);
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
