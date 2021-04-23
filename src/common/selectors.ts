import { ParserField, ParserTree, TypeDefinition, TypeSystemDefinition } from 'graphql-zeus';
import inquirer, { DistinctQuestion } from 'inquirer';
import { AutocompleteInput, AutocompleteInputPrompt } from '@/utils';
export interface TypeResolverReturns {
  resolver: ParserField;
  parentResolver: string;
}
const selectSubType = (types: ParserField[], options: Partial<DistinctQuestion> = {}) =>
  AutocompleteInputPrompt(
    types.map((t) => t.name),
    {
      name: 'type',
      message: 'specify type',
      ...options,
    },
  );
export const TypeSelector = async (
  rootTypes: ParserField[],
  options: Partial<DistinctQuestion> = {},
): Promise<ParserField> => {
  const t = await selectSubType(rootTypes, options);
  const selectedField = rootTypes.find((n) => n.name === t)!;
  return selectedField;
};

export const TypeResolver = async (tree: ParserTree): Promise<TypeResolverReturns> => {
  const rootTypes = tree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition);
  const selectedField = await TypeSelector(rootTypes);
  const args = selectedField.args?.filter(
    (n) =>
      n.data &&
      (n.data.type === TypeDefinition.ObjectTypeDefinition || n.data.type === TypeSystemDefinition.FieldDefinition),
  );
  if (!args) {
    throw new Error("This type can't have any resolvers");
  }
  const resolver = await TypeSelector(args);
  return {
    resolver,
    parentResolver: selectedField.name,
  };
};
