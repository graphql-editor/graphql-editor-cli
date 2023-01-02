import fs from 'fs';
import path from 'path';
import { FieldResolveInput, TypeRef} from 'stucco-js';
import { integrateWithConfig } from './integrate.js';
import { StuccoConfig, ResolverConfig, findNodeModules } from './handler.js';
import { integrations, IntegrationSpecificationInput } from './registry.js';

export interface ConfigOpts {
    stuccoJSONPath?: string;
}
export const config = ({
    stuccoJSONPath = path.join(process.cwd(), 'stucco.json'),
}: ConfigOpts = {}) => JSON.parse(fs.readFileSync(stuccoJSONPath, 'utf-8')) as StuccoConfig;

export const getResolverData = <T>(input: FieldResolveInput, opts?: ConfigOpts) => {
  const { parentType, fieldName } = input.info;
  const resolver = config(opts).resolvers[`${getReturnTypeName(parentType)}.${fieldName}`];
  return resolver as ResolverConfig<T>;
};

export const getReturnTypeName = (ref: TypeRef): string | undefined => {
  if (!ref) return;
  if ('nonNull' in ref || 'list' in ref) {
    return getReturnTypeName(ref);
  }
  return ref.name;
};


export const NewIntegration = (integrationName: string, integration: IntegrationSpecificationInput): StuccoConfig => {
  const res: StuccoConfig = {
    resolvers: {}
  };
  // register integration
  integrations[integrationName] = integration;
  const nodeModules = path.relative(process.cwd(), findNodeModules());
  for (const typeName in integration) {
    for (const fieldName in integration[typeName]) {
      const { handler, ...field } = integration[typeName][fieldName]
      res.resolvers = {
        ...res.resolvers,
        [`${typeName}.${fieldName}`]: {
          ...field,
          integration: 'gei',
          resolve: {
            name: path.join(nodeModules, 'graphql-editor-cli', 'lib', 'integrations', 'handler.js'),
            integration: integrationName,
          },
        },
      }
    }
  }
  return res;
}

export interface Project extends StuccoConfig {
  integrations?: string[];
}

export const NewProject = (project: Project) => {
  const { integrations = [], ...rest } = project;
  return integrateWithConfig(rest, ...integrations);
}

export {
  IntegrationData,
  IntegrationSpecificationInput,
  IntegrationSpecificationInputField,
  IntegrationSpecificationInputType,
  IntegrationSpecificationField,
} from './registry.js';

export {
  findNodeModules,
  ResolverConfig,
  StuccoConfig,
  IntegrationResolverConfig,
  Resolve,
  Resolvers,
  integrationMainImport,
} from './handler.js';
