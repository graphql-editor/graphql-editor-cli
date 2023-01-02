import fs from 'fs';
import path from 'path';
import { FieldResolveHandler, NamedTypeRef } from 'stucco-js';
import {
  IntegrationSpecificationInputField,
  integrations,
} from './registry.js';

const readJSONFile = async (fn: string) => JSON.parse(await fs.promises.readFile(fn).then((b) => b.toString()));


export interface StuccoConfig {
  integrations?: string[];
  resolvers: Resolvers;
}

export interface Resolvers {
  [x: `${string}.${string}`]: ResolverConfig;
}

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
  integration: 'gei',
};

export type ResolverConfig<T = unknown> = {
  resolve: Resolve;
} | IntegrationResolverConfig<T>



export interface Resolve {
  name: string;
}

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
}

export const integrationMainImport = async (integration: string) => {
  const pkg = path.join(findNodeModules(), integration)
  const pJSON = await readJSONFile(path.join(pkg, 'package.json')) as { main: string };
  return path.join(pkg, pJSON.main);
}

const isIntegrationResolverConfig = (v: ResolverConfig): v is IntegrationResolverConfig => 'integration' in v && v.integration === 'gei';

let stuccoJSON: StuccoConfig | undefined;
let integrationsMap: Record<string, IntegrationSpecificationInputField | undefined> = {};
const loadIntegration = async (integration: string) => import(await integrationMainImport(integration));
const loadIntegrations = async () => {
  if (stuccoJSON) {
    return;
  }
  const lstuccoJSON = await readJSONFile('./stucco.json') as StuccoConfig;
  const integrationConfigs = Object
    .entries(lstuccoJSON.resolvers)
    .filter((v): v is [string, IntegrationResolverConfig] => isIntegrationResolverConfig(v[1]));
  const modules = integrationConfigs
    .map((v) => v[1].resolve.integration)
    .filter((v, idx, arr) => idx === arr.findIndex((el) => el === v));
  await Promise.all(modules.map(loadIntegration));
  const getIntegration = (resolver: string, config: IntegrationResolverConfig) => {
    const [typeName, fieldName, ...rest] = resolver.split('.');
    if (!typeName || !fieldName || rest.length) {
      throw new Error('invalid resolver name, must be <typename>.<fieldname>');
    }
    return integrations[config.resolve.integration][typeName][fieldName];
  }
  integrationsMap = integrationConfigs.reduce((pv, [resolver, config]) => ({
    ...pv,
    [resolver]: getIntegration(resolver, config),
  }), {} as Record<string, IntegrationSpecificationInputField | undefined>)
  stuccoJSON = lstuccoJSON;
}

export const handler: FieldResolveHandler = async (input) => {
  await loadIntegrations();
  const resolverName = `${(input.info.parentType as NamedTypeRef).name}.${input.info.fieldName}`
  const integration = integrationsMap[resolverName];
  if (!integration) {
    throw new Error(`integration for ${resolverName} is missing`);
  }
  return integration.handler(input.arguments, input.source, input);
}
