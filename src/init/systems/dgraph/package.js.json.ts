export default {
  name: 'centaur-package',
  version: '0.0.0',
  description: 'Automatically generated Dgraph starter by graphql-centaur',
  main: 'src/index.js',
  scripts: {
    start: 'stucco',
    build: 'tsc',
    watch: 'tsc --watch',
    database: 'docker run -v "$(pwd):/dgraph" -p 9000:9000  -it dgraph/standalone:v2.0.0-beta',
    schema: 'schema=$(cat schema.graphql); curl localhost:9000/admin/schema -d $schema',
    generate: 'mkdir ./generated-nodejs && zeus http://localhost:9000/graphql ./generated-nodejs -g ./generated-nodejs',
  },
  author: 'GraphQL Editor Centaur Generator',
  license: 'ISC',
  devDependencies: {
    '@types/node': '^12.6.9',
    'babel-eslint': '^10.1.0',
    eslint: '^6.7.1',
    'eslint-config-prettier': '^6.7.0',
    'eslint-plugin-prettier': '^3.1.1',
    'graphql-zeus': 'latest',
    prettier: 'latest',
  },
  dependencies: {
    'node-fetch': '^2.6.0',
    'stucco-js': 'latest',
  },
};
