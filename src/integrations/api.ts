import fs from 'fs';
import path from 'path';
import { FieldResolveInput } from 'stucco-js';

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

export interface StuccoConfig {
  resolvers: Resolvers;
}

export interface Resolvers {
  [x: `${string}.${string}`]: ResolverConfig;
}

export interface ResolverConfig<T = unknown> {
  resolve: Resolve;
  data?: {
    [P in keyof T]: {
      value: T[P];
    };
  };
}

export interface Resolve {
  name: string;
}

interface NamedTypeRef {
  name: string;
}
interface NonNullTypeRef {
  nonNull: TypeRef;
}
interface ListTypeRef {
  list: TypeRef;
}
type TypeRef = NamedTypeRef | NonNullTypeRef | ListTypeRef | undefined;
export const getReturnTypeName = (ref: TypeRef): string | undefined => {
  if (!ref) return;
  if ('nonNull' in ref || 'list' in ref) {
    return getReturnTypeName(ref);
  }
  return ref.name;
};
export type IntegrationData = {
    name: string;
    description: string;
    value: string | string[];
    required?: boolean;
};

export type IntegrationSpecification = {
    [resolver: string]: {
        name: string;
        description: string;
        data: Record<string, IntegrationData>;
        resolve: { name: string };
    };
};

export const NewIntegration = (integration: IntegrationSpecification): IntegrationSpecification => integration;
