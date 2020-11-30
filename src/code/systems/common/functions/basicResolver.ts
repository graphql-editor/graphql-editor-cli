import { ParserField } from 'graphql-zeus';

export interface BasicResolverProps {
  resolverParent: string;
  field: ParserField;
  body?: string;
  imports?: string;
  source?: string;
}

export const basicResolver = ({ field, resolverParent, body = '', imports = '', source }: BasicResolverProps) => `
import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../graphql-zeus';
${imports}

export const handler = async (input: FieldResolveInput) => 
  resolverFor('${resolverParent}','${field.name}',async (args${source ? `, source:${source}` : ``}) => {
    ${body}
  })(input.arguments${source ? `, input.source` : ``});
`;
