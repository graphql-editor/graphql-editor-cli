import { ParserField, ParserTree, TypeDefinition, TypeSystemDefinition } from 'graphql-zeus';
import inquirer, { DistinctQuestion } from 'inquirer';
export interface TypeResolverReturns {
  resolver: ParserField;
  parentResolver: string;
}
export const TypeResolver = (tree: ParserTree): Promise<TypeResolverReturns> =>
  new Promise((resolve, reject) => {
    const rootTypes = tree.nodes.filter((n) => n.data && n.data.type === TypeDefinition.ObjectTypeDefinition);
    const selectSubType = (types: ParserField[]): DistinctQuestion[] => [
      {
        type: 'list',
        name: 'type',
        choices: types.map((t) => t.name),
        message: 'Specify type',
      },
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
