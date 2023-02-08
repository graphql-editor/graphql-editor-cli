import fs from 'fs';
import path from 'path';
import { FieldResolveInput, TypeRef } from 'stucco-js';
import { integrateWithConfig } from './integrate.js';

export interface ConfigOpts {
  stuccoJSONPath?: string;
}
export const config = ({
  stuccoJSONPath = path.join(process.cwd(), 'stucco.json'),
}: ConfigOpts = {}) =>
  JSON.parse(fs.readFileSync(stuccoJSONPath, 'utf-8')) as StuccoConfig;

export const getResolverData = <T>(
  input: FieldResolveInput,
  opts?: ConfigOpts,
) => {
  const { parentType, fieldName } = input.info;
  const resolver =
    config(opts).resolvers[`${getReturnTypeName(parentType)}.${fieldName}`];
  return resolver as ResolverConfig<T>;
};

export const getReturnTypeName = (ref: TypeRef): string | undefined => {
  if (!ref) return;
  if ('nonNull' in ref || 'list' in ref) {
    return getReturnTypeName(ref);
  }
  return ref.name;
};

export const NewIntegration = (integration: IntegrationSpecificationInput) => {
  return integration;
};

export interface Project extends StuccoConfig {
  integrations?: string[];
}

export const NewProject = (project: Project) => {
  const { integrations = [], ...rest } = project;
  return integrateWithConfig(rest, ...integrations);
};

export type IntegrationResolverConfig<T = unknown> = {
  resolve: {
    name: string;
    integration: string;
  };
  data?: {
    [P in keyof T]: {
      value: T[P];
    };
  };
  integration: 'gei';
};

export type ResolverConfig<T = unknown> =
  | {
      resolve: Resolve;
    }
  | IntegrationResolverConfig<T>;

export interface Resolve {
  name: string;
}
export interface StuccoConfig {
  resolvers: Resolvers;
}
export interface Resolvers {
  [x: `${string}.${string}`]: ResolverConfig;
}
export type IntegrationData = {
  name: string;
  description: string;
  value: string | string[];
  required?: boolean;
};

export type IntegrationSpecificationInputField = {
  name: string;
  description: string;
  data?: Record<string, IntegrationData>;
  handler: (input: FieldResolveInput) => unknown;
};

export type IntegrationSpecificationInputType = {
  [fieldName: string]: IntegrationSpecificationInputField;
};

export type IntegrationSpecificationInput = {
  [typeName: string]: IntegrationSpecificationInputType;
};

export type IntegrationSpecificationField = Omit<
  IntegrationSpecificationInputField,
  'handler'
> & {};
export let integrations: Record<string, IntegrationSpecificationInput> = {};

export const findNodeModules = (at: string = process.cwd()): string => {
  at = path.normalize(at);
  try {
    const nm = path.join(at, 'node_modules');
    const st = fs.statSync(nm);
    if (!st.isDirectory()) {
      throw new Error('not a directory');
    }
    return nm;
  } catch (e) {
    const up = path.normalize(path.join(at, '..'));
    if (up === at) {
      throw e;
    }
    return findNodeModules(up);
  }
};
