import { ParserField, ScalarTypes } from 'graphql-zeus';
import inquirer, { QuestionCollection, Question } from 'inquirer';

type InquirerPrompt =
  | 'number'
  | 'input'
  | 'password'
  | 'list'
  | 'expand'
  | 'checkbox'
  | 'confirm'
  | 'editor'
  | 'rawlist';

interface PromptProps extends Question {}
const getPromptType = (s: ScalarTypes): InquirerPrompt => {
  if (s === ScalarTypes.Boolean) {
    return 'checkbox';
  }
  return 'input';
};

export const e2eTest = async ({ field, resolverParent }: { field: ParserField; resolverParent: string }) => {
  let body;
  if (field.args) {
    const answers = field.args.map(
      (a) =>
        ({
          type: a.type.name,
          promptType: a.type.name in ScalarTypes ? getPromptType(a.type.name as ScalarTypes) : {},
        } as PromptProps),
    );
    body = await inquirer.prompt(answers);
  }
  const testName = `Test ${resolverParent}.${field.name}`;
  return `
import { handler } from './${field.name}';

test("${testName} resolver", async () => {
  const result = await handler({
    info:{ fieldName: '${field.name}'},
    arguments:${body ? JSON.stringify(body) : ''},
    source:{}
  })
  expect(result).toBeTruthy()
})  
`;
};
