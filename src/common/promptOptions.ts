import { ConfigurationOptions } from '@/Configuration';
import { Options } from 'yargs';

export type ConfOptions = {
  [P in keyof ConfigurationOptions]: Options;
};

export const confOptions = (o: ConfOptions) => o as { [key: string]: Options };

export const projectOptions: ConfOptions = {
  namespace: {
    describe: 'GraphQL Editor Namespace',
    type: 'string',
  },
  project: {
    describe: 'GraphQL Editor Project',
    type: 'string',
  },
  version: {
    describe: 'GraphQL Editor Version name',
    type: 'string',
  },
};

export const integrationOptions: ConfOptions = {
  registry: {
    describe: 'Package npm registry',
    type: 'string',
    default: 'https://registry.npmjs.org/',
  },
  npmPackage: {
    describe: 'npm package name',
    type: 'string',
  },
};
