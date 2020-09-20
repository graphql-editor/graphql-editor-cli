module.exports = function (plop) {
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'system name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/code/systems/{{name}}/generators/index.ts',
        template: '// export generators here',
        skipIfExists: true,
      },
      {
        type: 'add',
        path: 'src/code/systems/{{name}}/templates/index.ts',
        template: '// export templates here',
        skipIfExists: true,
      },
      {
        type: 'add',
        path: 'src/code/systems/{{name}}/common/index.ts',
        template: '// export common elements here',
        skipIfExists: true,
      },
      {
        type: 'add',
        path: 'src/code/systems/{{name}}/index.ts',
        template: `import * as generators from './generators';
		import * as templates from './templates';
		export { generators, templates };
		`,
        skipIfExists: true,
      },
    ],
  });
};
