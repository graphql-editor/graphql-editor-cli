import { ParserField, Options } from 'graphql-zeus';
const typeScriptMap = {
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  ID: 'string',
  String: 'string',
};
const toTypeScriptPrimitive = (a: string) => (a in typeScriptMap ? typeScriptMap[a as keyof typeof typeScriptMap] : a);
const resolveType = (t: ParserField) => {
  let typeName = toTypeScriptPrimitive(t.type.name);
  if (t.type.options?.includes(Options.array)) {
    if (t.type.options?.includes(Options.arrayRequired)) {
      typeName = `${typeName}!`;
    }
    typeName = `[${typeName}]`;
  }
  if (t.type.options?.includes(Options.required)) {
    typeName = `${typeName}!`;
  }
  return typeName;
};
export const orm = ({ field }: { field: ParserField }) =>
  `interface ${field.name}{\n${field.args?.map((a) => `    ${a.name}: ${resolveType(a)}`).join(',\n')}\n}`;
