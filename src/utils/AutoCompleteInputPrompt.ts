import AwfulAutocompletePrompt from '@/utils/AwfulAutoCompletePrompt.js';
import inquirer, { DistinctQuestion } from 'inquirer';

inquirer.registerPrompt('autocomplete', AwfulAutocompletePrompt);

export type AutocompleteOptions = Omit<DistinctQuestion, 'type' | 'source'> &
  Required<Pick<DistinctQuestion, 'name' | 'message'>>;

const AutoCompleteInput = (choices: string[], options: AutocompleteOptions): DistinctQuestion =>
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

export default async (choices: string[], options: AutocompleteOptions): Promise<string> => {
  const answers = await inquirer.prompt(AutoCompleteInput(choices, options));
  return answers[options.name];
};
