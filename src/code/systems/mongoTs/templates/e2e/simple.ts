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

export const e2eTest = ({
  field,
  resolverParent,
  hostAddress = 'http://localhost:8080/graphql',
}: {
  field: ParserField;
  resolverParent: string;
  hostAddress?: string;
}) => {
  const body = {};
  if (field.args) {
    const answers = field.args.map(
      (a) =>
        ({
          type: a.type.name,
          promptType: a.type.name in ScalarTypes ? getPromptType(a.type.name as ScalarTypes) : {},
        } as PromptProps),
    );
  }
  const response = {};
  const testName = `Test ${resolverParent}.${field.name}`;
  return `
describe("${testName} resolver", () => {
    fetch(${hostAddress},{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(${JSON.stringify(body)})
    })
    .then((response) => response.json())
    .then((json) => {
        expect(json).toBe(${JSON.stringify(response)})
        console.log("${testName}" passed ✅)
    })
    .catch((error) => {
        console.log("${testName}" failed ❌)
    })
})  
`;
};
