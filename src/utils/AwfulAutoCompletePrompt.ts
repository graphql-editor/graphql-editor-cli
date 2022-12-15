import figures from 'figures';
import Base from 'inquirer/lib/prompts/base.js';
import Choices from 'inquirer/lib/objects/choices.js';
import observe from 'inquirer/lib/utils/events.js';
import { up } from 'inquirer/lib/utils/readline.js';
import Paginator from 'inquirer/lib/utils/paginator.js';
import pc from 'picocolors';
import { takeWhile } from 'rxjs/operators';
import inquirer, { Answers, Question } from 'inquirer';
import { Interface as ReadLineInterface } from 'readline';
//@ts-ignore
import runAsync from 'run-async';
class AwfulAutocompletePrompt extends Base {
  currentChoices = new Choices<Answers>([], {});
  firstRender = true;
  selected = 0;
  initialValue: Question;
  paginator: Paginator;
  nbChoices = 0;

  answer?: string;
  answerName?: string;
  shortAnswer?: string;
  searchedOnce?: boolean;
  searching?: boolean;
  lastSearchTerm?: string;
  done?: Function;
  opt: inquirer.prompts.PromptOptions<
    Question<Answers> & {
      source: (answers: Answers, searchTerm?: string) => string[];
    }
  > = this.opt;

  constructor(
    questions: Array<Question>,
    rl: ReadLineInterface,
    answers: Answers,
  ) {
    super(questions, rl, answers);

    // Make sure no default is set (so it won't be printed)
    this.initialValue = this.opt.default;

    this.paginator = new Paginator(this.screen, {
      isInfinite: false,
    });
  }

  _run(cb: Function) {
    this.done = cb;

    const events = observe(this.rl);

    const dontHaveAnswer = () => this.answer === undefined;

    events.line
      .pipe(takeWhile(dontHaveAnswer)) // $FlowFixMe[method-unbinding]
      .forEach(this.onSubmit.bind(this));
    events.keypress
      .pipe(takeWhile(dontHaveAnswer)) // $FlowFixMe[method-unbinding]
      .forEach(this.onKeypress.bind(this));

    // Call once at init
    this.search(undefined);

    return this;
  }

  /**
   * Render the prompt to screen
   * @return {undefined}
   */
  render(error?: string) {
    // Render question
    let content = this.getQuestion();
    let bottomContent = '';

    if (this.firstRender) {
      const suggestText = '';
      content += pc.dim(
        '(Use arrow keys or type to search' + suggestText + ')',
      );
    }

    // Render choices or answer depending on the state
    if (this.status === 'answered') {
      content += pc.cyan(this.shortAnswer || this.answerName || this.answer);
    } else if (this.searching) {
      content += this.rl.line;
      bottomContent += '  ' + pc.dim('Searching...');
    } else if (this.nbChoices) {
      const choicesStr = listRender(this.currentChoices, this.selected);
      content += this.rl.line;
      const indexPosition = this.selected;
      let realIndexPosition = 0;
      this.currentChoices.choices.every((choice, index) => {
        if (index > indexPosition) {
          return false;
        }
        const name = 'name' in choice ? choice.name : undefined;
        realIndexPosition += name ? name.split('\n').length : 0;
        return true;
      });
      bottomContent += this.paginator.paginate(
        choicesStr,
        realIndexPosition,
        10,
      );
    } else {
      content += this.rl.line;
      bottomContent += '  ' + pc.yellow('No results...');
    }

    if (error) {
      bottomContent += '\n' + pc.red('>> ') + error;
    }

    this.firstRender = false;

    this.screen.render(content, bottomContent);
  }

  /**
   * When user press `enter` key
   */
  onSubmit(line: string) {
    let lineOrRl = line || this.rl.line;

    // only set default when suggestOnly (behaving as input prompt)
    // list prompt does only set default if matching actual item in list

    if (typeof this.opt.validate === 'function') {
      const checkValidationResult = (validationResult: string | boolean) => {
        if (validationResult !== true) {
          this.render(
            validationResult || 'Enter something, tab to autocomplete!',
          );
        } else {
          this.onSubmitAfterValidation(lineOrRl);
        }
      };

      let validationResult;
      const choice = this.currentChoices.getChoice(this.selected);
      validationResult = this.opt.validate(choice, this.answers);

      if (isPromise(validationResult)) {
        validationResult.then(checkValidationResult);
      } else {
        checkValidationResult(validationResult);
      }
    } else {
      this.onSubmitAfterValidation(lineOrRl);
    }
  }

  onSubmitAfterValidation(line: string) {
    if (this.nbChoices <= this.selected) {
      this.rl.write(line);
      this.search(line);
      return;
    }
    let choice: ReturnType<typeof this.currentChoices.getChoice>;
    if (this.nbChoices) {
      choice = this.currentChoices.getChoice(this.selected);
      this.answer = choice.value;
      this.answerName = choice.name;
      this.shortAnswer = choice.short;
    } else {
      this.rl.write(line);
      this.search(line);
      return;
    }

    runAsync(this.opt.filter, (err: any, value?: string) => {
      choice.value = value;
      this.answer = value;

      this.status = 'answered';
      // Rerender prompt
      this.render();
      this.screen.done();
      this.done?.(choice.value);
    })(choice.value);
  }

  search(searchTerm?: string) /*: Promise<any>*/ {
    this.selected = 0;

    // Only render searching state after first time
    if (this.searchedOnce) {
      this.searching = true;
      this.currentChoices = new Choices([], {});
      this.render(); // Now render current searching state
    } else {
      this.searchedOnce = true;
    }

    this.lastSearchTerm = searchTerm;

    let thisPromise: Promise<any>;
    try {
      const result = this.opt.source(this.answers, searchTerm);
      thisPromise = Promise.resolve(result);
    } catch (error) {
      thisPromise = Promise.reject(error);
    }

    // Store this promise for check in the callback
    const lastPromise = thisPromise;

    return thisPromise.then((choices: any) => {
      // If another search is triggered before the current search finishes, don't set results
      if (thisPromise !== lastPromise) return;

      this.currentChoices = new Choices(choices, {});

      const realChoices = choices;
      this.nbChoices = realChoices.length;

      const selectedIndex = realChoices.findIndex(
        (choice: any) =>
          choice === this.initialValue || choice.value === this.initialValue,
      );

      if (selectedIndex >= 0) {
        this.selected = selectedIndex;
      }

      this.searching = false;
      this.render();
    });
  }

  ensureSelectedInRange() {
    const selectedIndex = Math.min(this.selected, this.nbChoices); // Not above currentChoices length - 1
    this.selected = Math.max(selectedIndex, 0); // Not below 0
  }

  /**
   * When user type
   */

  onKeypress(e: { key: { name?: string; ctrl?: boolean }; value: string }) {
    let len;
    const keyName = (e.key && e.key.name) || undefined;

    if (keyName === 'down' || (keyName === 'n' && e.key.ctrl)) {
      len = this.nbChoices;
      this.selected = this.selected < len - 1 ? this.selected + 1 : 0;
      this.ensureSelectedInRange();
      this.render();
      up(this.rl, 2);
    } else if (keyName === 'up' || (keyName === 'p' && e.key.ctrl)) {
      len = this.nbChoices;
      this.selected = this.selected > 0 ? this.selected - 1 : len - 1;
      this.ensureSelectedInRange();
      this.render();
    } else {
      this.render(); // Render input automatically
      // Only search if input have actually changed, not because of other keypresses
      if (this.lastSearchTerm !== this.rl.line) {
        this.search(this.rl.line); // Trigger new search
      }
    }
  }
}

function listRender(choices: Choices, pointer: number) {
  let output = '';
  let separatorOffset = 0;

  choices.forEach((choice, i) => {
    if (choice.type === 'separator') {
      separatorOffset++;
      output += '  ' + choice + '\n';
      return;
    }

    if (choice.disabled) {
      separatorOffset++;
      output += '  - ' + choice.name;
      output +=
        ' (' +
        (typeof choice.disabled === 'string' ? choice.disabled : 'Disabled') +
        ')';
      output += '\n';
      return;
    }

    const isSelected = i - separatorOffset === pointer;
    let line = (isSelected ? figures.pointer + ' ' : '  ') + choice.name;

    if (isSelected) {
      line = pc.cyan(line);
    }

    output += line + ' \n';
  });

  return output.replace(/\n$/, '');
}

function isPromise(value: any): value is Promise<any> {
  return typeof value === 'object' && typeof value.then === 'function';
}

export default AwfulAutocompletePrompt;
