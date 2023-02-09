import deps from '@/deps.js';

export default (integrationName: string) => ({
  name: 'gei-workspace',
  version: '0.0.1',
  description: '',
  workspaces: ['./packages/integration', './packages/sandbox'],
  devDependencies: {
    'graphql-editor-cli': '^0.7.6',
    [integrationName]: '*',
  },
});
