import { DEFAULT_GEI_PATH } from '@/commands/gei/shared/consts.js';
import { writeSafe } from '@/utils/FileUtils.js';
import path from 'path';

export const bootstrapGeiFile = ({ filesPath }: { filesPath?: string }) => {
  const p = path.join(process.cwd(), filesPath || DEFAULT_GEI_PATH);
  writeSafe(p, fileContent);
};

const fileContent = `import fs from 'fs';
import path from 'path';
import { FieldResolveInput } from 'stucco-js';

export const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'stucco.json'), 'utf-8')) as StuccoConfig;

export const getResolverData = <T>(input: FieldResolveInput) => {
  const { parentType, fieldName } = input.info;
  const resolver = config.resolvers[\`\${getReturnTypeName(parentType)}.\${fieldName}\`];
  return resolver as ResolverConfig<T>;
};

export interface StuccoConfig {
  resolvers: Resolvers;
}

export interface Resolvers {
  [x: \`\${string}.\${string}\`]: ResolverConfig;
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
`;
