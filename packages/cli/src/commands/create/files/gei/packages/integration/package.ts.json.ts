import deps from '@/deps.js';
const { dependencies, devDependencies } = deps;

export default (integrationName: string) => ({
  name: integrationName,
  version: '0.0.1',
  description: 'Automatically generated by graphql-editor-cli',
  main: 'index.js',
  scripts: {
    start: 'gecli dev',
    build: 'tsc',
    watch: 'tsc --watch',
    update: 'gecli codegen models && gecli schema && gecli codegen typings',
  },
  author: 'GraphQL Editor Centaur Generator',
  license: 'ISC',
  type: 'module',
  devDependencies: {
    ...devDependencies,
  },
  dependencies: {
    ...dependencies,
    'graphql-editor-cli': '^0.7.6',
  },
});