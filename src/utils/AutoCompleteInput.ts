import inquirer, { DistinctQuestion } from 'inquirer';
// @ts-ignore
import AutocompletePrompt from 'inquirer-autocomplete-prompt';

inquirer.registerPrompt('autocomplete', AutocompletePrompt);

export type AutocompleteOptions = Omit<DistinctQuestion, 'type' | 'source'> &
  Required<Pick<DistinctQuestion, 'name' | 'message'>>;

export const AutocompleteInput = (choices: string[], options: AutocompleteOptions): DistinctQuestion =>
  ({
    type: 'autocomplete',
    source: async (answersSoFar: string[], input: string) => {
      const typeNames = choices;
      if (!input) {
        return typeNames;
      }
      return typeNames.filter((t) => t.toLowerCase().indexOf(input.toLowerCase()) !== -1);
    },
    ...options,
  } as any);

export const AutocompleteInputPrompt = async (choices: string[], options: AutocompleteOptions): Promise<string> => {
  const answers = await inquirer.prompt(AutocompleteInput(choices, options));
  return answers[options.name];
};
