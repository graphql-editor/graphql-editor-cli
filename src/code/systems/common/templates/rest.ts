import { ParserField } from 'graphql-zeus';
import { basicResolver } from '../functions';

export const rest = ({ field, resolverParent, url }: { resolverParent: string; field: ParserField; url: string }) =>
  basicResolver({
    field,
    resolverParent,
    body: `
  const result = await fetch('${url}')
  const response = await result.json()
  return response
`,
    imports: `
import fetch from 'node-fetch';
`,
  });
