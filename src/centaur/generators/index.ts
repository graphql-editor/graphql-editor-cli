import { ParserField, ParserTree, TypeDefinition, TypeSystemDefinition } from 'graphql-zeus';
import inquirer, { DistinctQuestion } from 'inquirer';
// @ts-ignore
import AutocompletePrompt from 'inquirer-autocomplete-prompt';
export interface TypeResolverReturns {
  resolver: ParserField;
  parentResolver: string;
}
inquirer.registerPrompt('autocomplete', AutocompletePrompt);
export const TypeResolver = (tree: ParserTree): Promise<TypeResolverReturns> =>
  new Promise((resolve, reject) => {
    const rootTypes = tree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition);
    const selectSubType = (types: ParserField[]): DistinctQuestion[] => [
      {
        type: 'autocomplete',
        name: 'type',
        source: async (answersSoFar: string[], input: string) => {
          const typeNames = types.map((t) => t.name);
          if (!input) {
            return typeNames;
          }
          return typeNames.filter((t) => t.toLowerCase().indexOf(input) !== -1);
        },
        message: 'Specify type',
      } as any,
    ];
    inquirer.prompt(selectSubType(rootTypes)).then((answers) => {
      const selectedField = rootTypes.find((n) => n.name === answers.type)!;
      const args = selectedField.args?.filter(
        (n) =>
          n.data &&
          (n.data.type === TypeDefinition.ObjectTypeDefinition || n.data.type === TypeSystemDefinition.FieldDefinition),
      );
      if (!args) {
        throw new Error("This type can't have any resolvers");
      }
      inquirer.prompt(selectSubType(args)).then((ans) => {
        const resolver = args.find((a) => ans.type === a.name)!;
        resolve({
          resolver,
          parentResolver: answers.type,
        });
      });
    });
  });
