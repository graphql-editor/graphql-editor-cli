/* eslint-disable */

import { AllTypesProps, ReturnTypes, Ops } from './const.js';
import fetch, { Response } from 'node-fetch';
export const HOST = 'https://api.staging.project.graphqleditor.com/graphql';

export const HEADERS = {};
export const apiSubscription = (options: chainOptions) => (query: string) => {
  try {
    const queryString = options[0] + '?query=' + encodeURIComponent(query);
    const wsString = queryString.replace('http', 'ws');
    const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
    const webSocketOptions = options[1]?.websocket || [host];
    const ws = new WebSocket(...webSocketOptions);
    return {
      ws,
      on: (e: (args: any) => void) => {
        ws.onmessage = (event: any) => {
          if (event.data) {
            const parsed = JSON.parse(event.data);
            const data = parsed.data;
            return e(data);
          }
        };
      },
      off: (e: (args: any) => void) => {
        ws.onclose = e;
      },
      error: (e: (args: any) => void) => {
        ws.onerror = e;
      },
      open: (e: () => void) => {
        ws.onopen = e;
      },
    };
  } catch {
    throw new Error('No websockets implemented');
  }
};
const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then((text) => {
          try {
            reject(JSON.parse(text));
          } catch (err) {
            reject(text);
          }
        })
        .catch(reject);
    });
  }
  return response.json() as Promise<GraphQLResponse>;
};

export const apiFetch =
  (options: fetchOptions) =>
  (query: string, variables: Record<string, unknown> = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetch(`${options[0]}`, {
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };

export const InternalsBuildQuery = ({
  ops,
  props,
  returns,
  options,
  scalars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  options?: OperationOptions;
  scalars?: ScalarDefinition;
}) => {
  const ibb = (
    k: string,
    o: InputValueType | VType,
    p = '',
    root = true,
    vars: Array<{ name: string; graphQLType: string }> = [],
  ): string => {
    const keyForPath = purifyGraphQLKey(k);
    const newPath = [p, keyForPath].join(SEPARATOR);
    if (!o) {
      return '';
    }
    if (typeof o === 'boolean' || typeof o === 'number') {
      return k;
    }
    if (typeof o === 'string') {
      return `${k} ${o}`;
    }
    if (Array.isArray(o)) {
      const args = InternalArgsBuilt({
        props,
        returns,
        ops,
        scalars,
        vars,
      })(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(`${alias}:${operationName}`, operation, p, false, vars);
        })
        .join('\n');
    }
    const hasOperationName = root && options?.operationName ? ' ' + options.operationName : '';
    const keyForDirectives = o.__directives ?? '';
    const query = `{${Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false, vars))
      .join('\n')}}`;
    if (!root) {
      return `${k} ${keyForDirectives}${hasOperationName} ${query}`;
    }
    const varsString = vars.map((v) => `${v.name}: ${v.graphQLType}`).join(', ');
    return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ''} ${query}`;
  };
  return ibb;
};

export const Thunder =
  (fn: FetchFunction) =>
  <O extends keyof typeof Ops, SCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<SCLR>,
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions & { variables?: Record<string, unknown> }) =>
    fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: graphqlOptions?.scalars,
      }),
      ops?.variables,
    ).then((data) => {
      if (graphqlOptions?.scalars) {
        return decodeScalarsInResponse({
          response: data,
          initialOp: operation,
          initialZeusQuery: o as VType,
          returns: ReturnTypes,
          scalars: graphqlOptions.scalars,
          ops: Ops,
        });
      }
      return data;
    }) as Promise<InputType<GraphQLTypes[R], Z, SCLR>>;

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder =
  (fn: SubscriptionFunction) =>
  <O extends keyof typeof Ops, SCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<SCLR>,
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions & { variables?: ExtractVariables<Z> }) => {
    const returnedFunction = fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: graphqlOptions?.scalars,
      }),
    ) as SubscriptionToGraphQL<Z, GraphQLTypes[R], SCLR>;
    if (returnedFunction?.on && graphqlOptions?.scalars) {
      const wrapped = returnedFunction.on;
      returnedFunction.on = (fnToCall: (args: InputType<GraphQLTypes[R], Z, SCLR>) => void) =>
        wrapped((data: InputType<GraphQLTypes[R], Z, SCLR>) => {
          if (graphqlOptions?.scalars) {
            return fnToCall(
              decodeScalarsInResponse({
                response: data,
                initialOp: operation,
                initialZeusQuery: o as VType,
                returns: ReturnTypes,
                scalars: graphqlOptions.scalars,
                ops: Ops,
              }),
            );
          }
          return fnToCall(data);
        });
    }
    return returnedFunction;
  };

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>,
>(
  operation: O,
  o: Z | ValueTypes[R],
  ops?: {
    operationOptions?: OperationOptions;
    scalars?: ScalarDefinition;
  },
) =>
  InternalsBuildQuery({
    props: AllTypesProps,
    returns: ReturnTypes,
    ops: Ops,
    options: ops?.operationOptions,
    scalars: ops?.scalars,
  })(operation, o as VType);

export const ZeusSelect = <T>() => ((t: unknown) => t) as SelectionFunction<T>;

export const Selector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();

export const TypeFromSelector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();
export const Gql = Chain(HOST, {
  headers: {
    'Content-Type': 'application/json',
    ...HEADERS,
  },
});

export const ZeusScalars = ZeusSelect<ScalarCoders>();

export const decodeScalarsInResponse = <O extends Operations>({
  response,
  scalars,
  returns,
  ops,
  initialZeusQuery,
  initialOp,
}: {
  ops: O;
  response: any;
  returns: ReturnTypesType;
  scalars?: Record<string, ScalarResolver | undefined>;
  initialOp: keyof O;
  initialZeusQuery: InputValueType | VType;
}) => {
  if (!scalars) {
    return response;
  }
  const builder = PrepareScalarPaths({
    ops,
    returns,
  });

  const scalarPaths = builder(initialOp as string, ops[initialOp], initialZeusQuery);
  if (scalarPaths) {
    const r = traverseResponse({ scalarPaths, resolvers: scalars })(initialOp as string, response, [ops[initialOp]]);
    return r;
  }
  return response;
};

export const traverseResponse = ({
  resolvers,
  scalarPaths,
}: {
  scalarPaths: { [x: string]: `scalar.${string}` };
  resolvers: {
    [x: string]: ScalarResolver | undefined;
  };
}) => {
  const ibb = (k: string, o: InputValueType | VType, p: string[] = []): unknown => {
    if (Array.isArray(o)) {
      return o.map((eachO) => ibb(k, eachO, p));
    }
    if (o == null) {
      return o;
    }
    const scalarPathString = p.join(SEPARATOR);
    const currentScalarString = scalarPaths[scalarPathString];
    if (currentScalarString) {
      const currentDecoder = resolvers[currentScalarString.split('.')[1]]?.decode;
      if (currentDecoder) {
        return currentDecoder(o);
      }
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string' || !o) {
      return o;
    }
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, ibb(k, v, [...p, purifyGraphQLKey(k)])]));
  };
  return ibb;
};

export type AllTypesPropsType = {
  [x: string]:
    | undefined
    | `scalar.${string}`
    | 'enum'
    | {
        [x: string]:
          | undefined
          | string
          | {
              [x: string]: string | undefined;
            };
      };
};

export type ReturnTypesType = {
  [x: string]:
    | {
        [x: string]: string | undefined;
      }
    | `scalar.${string}`
    | undefined;
};
export type InputValueType = {
  [x: string]: undefined | boolean | string | number | [any, undefined | boolean | InputValueType] | InputValueType;
};
export type VType =
  | undefined
  | boolean
  | string
  | number
  | [any, undefined | boolean | InputValueType]
  | InputValueType;

export type PlainType = boolean | number | string | null | undefined;
export type ZeusArgsType =
  | PlainType
  | {
      [x: string]: ZeusArgsType;
    }
  | Array<ZeusArgsType>;

export type Operations = Record<string, string>;

export type VariableDefinition = {
  [x: string]: unknown;
};

export const SEPARATOR = '|';

export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (...args: infer R) => WebSocket ? R : never;
export type chainOptions = [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }] | [fetchOptions[0]];
export type FetchFunction = (query: string, variables?: Record<string, unknown>) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export type OperationOptions = {
  operationName?: string;
};

export type ScalarCoder = Record<string, (s: unknown) => string>;

export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
export class GraphQLError extends Error {
  constructor(public response: GraphQLResponse) {
    super('');
    console.error(response);
  }
  toString() {
    return 'GraphQL Response Error';
  }
}
export type GenericOperation<O> = O extends keyof typeof Ops ? typeof Ops[O] : never;
export type ThunderGraphQLOptions<SCLR extends ScalarDefinition> = {
  scalars?: SCLR | ScalarCoders;
};

const ExtractScalar = (mappedParts: string[], returns: ReturnTypesType): `scalar.${string}` | undefined => {
  if (mappedParts.length === 0) {
    return;
  }
  const oKey = mappedParts[0];
  const returnP1 = returns[oKey];
  if (typeof returnP1 === 'object') {
    const returnP2 = returnP1[mappedParts[1]];
    if (returnP2) {
      return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
    }
    return undefined;
  }
  return returnP1 as `scalar.${string}` | undefined;
};

export const PrepareScalarPaths = ({ ops, returns }: { returns: ReturnTypesType; ops: Operations }) => {
  const ibb = (
    k: string,
    originalKey: string,
    o: InputValueType | VType,
    p: string[] = [],
    pOriginals: string[] = [],
    root = true,
  ): { [x: string]: `scalar.${string}` } | undefined => {
    if (!o) {
      return;
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string') {
      const extractionArray = [...pOriginals, originalKey];
      const isScalar = ExtractScalar(extractionArray, returns);
      if (isScalar?.startsWith('scalar')) {
        const partOfTree = {
          [[...p, k].join(SEPARATOR)]: isScalar,
        };
        return partOfTree;
      }
      return {};
    }
    if (Array.isArray(o)) {
      return ibb(k, k, o[1], p, pOriginals, false);
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(alias, operationName, operation, p, pOriginals, false);
        })
        .reduce((a, b) => ({
          ...a,
          ...b,
        }));
    }
    const keyName = root ? ops[k] : k;
    return Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map(([k, v]) => {
        // Inline fragments shouldn't be added to the path as they aren't a field
        const isInlineFragment = originalKey.match(/^...\s*on/) != null;
        return ibb(
          k,
          k,
          v,
          isInlineFragment ? p : [...p, purifyGraphQLKey(keyName || k)],
          isInlineFragment ? pOriginals : [...pOriginals, purifyGraphQLKey(originalKey)],
          false,
        );
      })
      .reduce((a, b) => ({
        ...a,
        ...b,
      }));
  };
  return ibb;
};

export const purifyGraphQLKey = (k: string) => k.replace(/\([^)]*\)/g, '').replace(/^[^:]*\:/g, '');

const mapPart = (p: string) => {
  const [isArg, isField] = p.split('<>');
  if (isField) {
    return {
      v: isField,
      __type: 'field',
    } as const;
  }
  return {
    v: isArg,
    __type: 'arg',
  } as const;
};

type Part = ReturnType<typeof mapPart>;

export const ResolveFromPath = (props: AllTypesPropsType, returns: ReturnTypesType, ops: Operations) => {
  const ResolvePropsType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
    if (propsP1 === 'enum' && mappedParts.length === 1) {
      return 'enum';
    }
    if (typeof propsP1 === 'string' && propsP1.startsWith('scalar.') && mappedParts.length === 1) {
      return propsP1;
    }
    if (typeof propsP1 === 'object') {
      if (mappedParts.length < 2) {
        return 'not';
      }
      const propsP2 = propsP1[mappedParts[1].v];
      if (typeof propsP2 === 'string') {
        return rpp(
          `${propsP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
      if (typeof propsP2 === 'object') {
        if (mappedParts.length < 3) {
          return 'not';
        }
        const propsP3 = propsP2[mappedParts[2].v];
        if (propsP3 && mappedParts[2].__type === 'arg') {
          return rpp(
            `${propsP3}${SEPARATOR}${mappedParts
              .slice(3)
              .map((mp) => mp.v)
              .join(SEPARATOR)}`,
          );
        }
      }
    }
  };
  const ResolveReturnType = (mappedParts: Part[]) => {
    if (mappedParts.length === 0) {
      return 'not';
    }
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === 'object') {
      if (mappedParts.length < 2) return 'not';
      const returnP2 = returnP1[mappedParts[1].v];
      if (returnP2) {
        return rpp(
          `${returnP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
    }
  };
  const rpp = (path: string): 'enum' | 'not' | `scalar.${string}` => {
    const parts = path.split(SEPARATOR).filter((l) => l.length > 0);
    const mappedParts = parts.map(mapPart);
    const propsP1 = ResolvePropsType(mappedParts);
    if (propsP1) {
      return propsP1;
    }
    const returnP1 = ResolveReturnType(mappedParts);
    if (returnP1) {
      return returnP1;
    }
    return 'not';
  };
  return rpp;
};

export const InternalArgsBuilt = ({
  props,
  ops,
  returns,
  scalars,
  vars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  scalars?: ScalarDefinition;
  vars: Array<{ name: string; graphQLType: string }>;
}) => {
  const arb = (a: ZeusArgsType, p = '', root = true): string => {
    if (typeof a === 'string') {
      if (a.startsWith(START_VAR_NAME)) {
        const [varName, graphQLType] = a.replace(START_VAR_NAME, '$').split(GRAPHQL_TYPE_SEPARATOR);
        const v = vars.find((v) => v.name === varName);
        if (!v) {
          vars.push({
            name: varName,
            graphQLType,
          });
        } else {
          if (v.graphQLType !== graphQLType) {
            throw new Error(
              `Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`,
            );
          }
        }
        return varName;
      }
    }
    const checkType = ResolveFromPath(props, returns, ops)(p);
    if (checkType.startsWith('scalar.')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...splittedScalar] = checkType.split('.');
      const scalarKey = splittedScalar.join('.');
      return (scalars?.[scalarKey]?.encode?.(a) as string) || JSON.stringify(a);
    }
    if (Array.isArray(a)) {
      return `[${a.map((arr) => arb(arr, p, false)).join(', ')}]`;
    }
    if (typeof a === 'string') {
      if (checkType === 'enum') {
        return a;
      }
      return `${JSON.stringify(a)}`;
    }
    if (typeof a === 'object') {
      if (a === null) {
        return `null`;
      }
      const returnedObjectString = Object.entries(a)
        .filter(([, v]) => typeof v !== 'undefined')
        .map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`)
        .join(',\n');
      if (!root) {
        return `{${returnedObjectString}}`;
      }
      return returnedObjectString;
    }
    return `${a}`;
  };
  return arb;
};

export const resolverFor = <X, T extends keyof ResolverInputTypes, Z extends keyof ResolverInputTypes[T]>(
  type: T,
  field: Z,
  fn: (
    args: Required<ResolverInputTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : any,
) => fn as (args?: any, source?: any) => any;

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<UnwrapPromise<ReturnType<T>>>;
export type ZeusHook<
  T extends (...args: any[]) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>,
> = ZeusState<ReturnType<T>[N]>;

export type WithTypeNameValue<T> = T & {
  __typename?: boolean;
  __directives?: string;
};
export type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
export type ScalarDefinition = Record<string, ScalarResolver>;

type IsScalar<S, SCLR extends ScalarDefinition> = S extends 'scalar' & { name: infer T }
  ? T extends keyof SCLR
    ? SCLR[T]['decode'] extends (s: unknown) => unknown
      ? ReturnType<SCLR[T]['decode']>
      : unknown
    : unknown
  : S;
type IsArray<T, U, SCLR extends ScalarDefinition> = T extends Array<infer R>
  ? InputType<R, U, SCLR>[]
  : InputType<T, U, SCLR>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string | Variable<any, string>;

type IsInterfaced<SRC extends DeepAnify<DST>, DST, SCLR extends ScalarDefinition> = FlattenArray<SRC> extends
  | ZEUS_INTERFACES
  | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P], SCLR>
          : Record<string, unknown>
        : never;
    }[keyof DST] & {
      [P in keyof Omit<
        Pick<
          SRC,
          {
            [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
          }[keyof DST]
        >,
        '__typename'
      >]: IsPayLoad<DST[P]> extends BaseZeusResolver ? IsScalar<SRC[P], SCLR> : IsArray<SRC[P], DST[P], SCLR>;
    }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends BaseZeusResolver
        ? IsScalar<SRC[P], SCLR>
        : IsArray<SRC[P], DST[P], SCLR>;
    };

export type MapType<SRC, DST, SCLR extends ScalarDefinition> = SRC extends DeepAnify<DST>
  ? IsInterfaced<SRC, DST, SCLR>
  : never;
// eslint-disable-next-line @typescript-eslint/ban-types
export type InputType<SRC, DST, SCLR extends ScalarDefinition = {}> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P], SCLR>[keyof MapType<SRC, R[P], SCLR>];
    } & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>, SCLR>
  : MapType<SRC, IsPayLoad<DST>, SCLR>;
export type SubscriptionToGraphQL<Z, T, SCLR extends ScalarDefinition> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z, SCLR>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z, SCLR>; errors?: string[] }) => void) => void;
  open: () => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type FromSelector<SELECTOR, NAME extends keyof GraphQLTypes, SCLR extends ScalarDefinition = {}> = InputType<
  GraphQLTypes[NAME],
  SELECTOR,
  SCLR
>;

export type ScalarResolver = {
  encode?: (s: unknown) => string;
  decode?: (s: unknown) => unknown;
};

export type SelectionFunction<V> = <T>(t: T | V) => T;

type BuiltInVariableTypes = {
  ['String']: string;
  ['Int']: number;
  ['Float']: number;
  ['ID']: unknown;
  ['Boolean']: boolean;
};
type AllVariableTypes = keyof BuiltInVariableTypes | keyof ZEUS_VARIABLES;
type VariableRequired<T extends string> = `${T}!` | T | `[${T}]` | `[${T}]!` | `[${T}!]` | `[${T}!]!`;
type VR<T extends string> = VariableRequired<VariableRequired<T>>;

export type GraphQLVariableType = VR<AllVariableTypes>;

type ExtractVariableTypeString<T extends string> = T extends VR<infer R1>
  ? R1 extends VR<infer R2>
    ? R2 extends VR<infer R3>
      ? R3 extends VR<infer R4>
        ? R4 extends VR<infer R5>
          ? R5
          : R4
        : R3
      : R2
    : R1
  : T;

type DecomposeType<T, Type> = T extends `[${infer R}]`
  ? Array<DecomposeType<R, Type>> | undefined
  : T extends `${infer R}!`
  ? NonNullable<DecomposeType<R, Type>>
  : Type | undefined;

type ExtractTypeFromGraphQLType<T extends string> = T extends keyof ZEUS_VARIABLES
  ? ZEUS_VARIABLES[T]
  : T extends keyof BuiltInVariableTypes
  ? BuiltInVariableTypes[T]
  : any;

export type GetVariableType<T extends string> = DecomposeType<
  T,
  ExtractTypeFromGraphQLType<ExtractVariableTypeString<T>>
>;

type UndefinedKeys<T> = {
  [K in keyof T]-?: T[K] extends NonNullable<T[K]> ? never : K;
}[keyof T];

type WithNullableKeys<T> = Pick<T, UndefinedKeys<T>>;
type WithNonNullableKeys<T> = Omit<T, UndefinedKeys<T>>;

type OptionalKeys<T> = {
  [P in keyof T]?: T[P];
};

export type WithOptionalNullables<T> = OptionalKeys<WithNullableKeys<T>> & WithNonNullableKeys<T>;

export type Variable<T extends GraphQLVariableType, Name extends string> = {
  ' __zeus_name': Name;
  ' __zeus_type': T;
};

export type ExtractVariables<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends [infer Inputs, infer Outputs]
  ? ExtractVariables<Inputs> & ExtractVariables<Outputs>
  : Query extends string | number | boolean
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariables<Query[K]>> }[keyof Query]>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const START_VAR_NAME = `$ZEUS_VAR`;
export const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;

export const $ = <Type extends GraphQLVariableType, Name extends string>(name: Name, graphqlType: Type) => {
  return (START_VAR_NAME + name + GRAPHQL_TYPE_SEPARATOR + graphqlType) as unknown as Variable<Type, Name>;
};
type ZEUS_INTERFACES = never;
export type ScalarCoders = {
  RFC3339Date?: ScalarResolver;
  Decimal?: ScalarResolver;
  FileServerCredentials?: ScalarResolver;
  PaymentDate?: ScalarResolver;
};
type ZEUS_UNIONS = GraphQLTypes['MarketplaceUpstream'];

export type ValueTypes = {
  ['DeployCodeToCloudNode14Opts']: {
    buildScript?: string | undefined | null | Variable<any, string>;
  };
  /** Defines user's account type */
  ['AccountType']: AccountType;
  ['ServiceAccountApiKey']: AliasType<{
    id?: boolean | `@${string}`;
    key?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Marketplace item connection object

Used with paginated listing of projects */
  ['MarketplaceItemConnection']: AliasType<{
    /** Current connection page info */
    pageInfo?: ValueTypes['PageInfo'];
    /** List of market place items in connection */
    projects?: ValueTypes['MarketplaceItem'];
    __typename?: boolean | `@${string}`;
  }>;
  ['ChangeSubscriptionInput']: {
    subscriptionID: number | Variable<any, string>;
    subscriptionPlanID?: number | undefined | null | Variable<any, string>;
  };
  /** Project type */
  ['Project']: AliasType<{
    /** Return config of cloud deployment */
    cloudDeploymentConfig?: ValueTypes['CloudDeploymentConfig'];
    cloudDeploymentStatus?: [{ streamID?: string | undefined | null | Variable<any, string> }, boolean | `@${string}`];
    /** Return creation time stamp of a project */
    createdAt?: boolean | `@${string}`;
    /** A database connection info */
    dbConnection?: boolean | `@${string}`;
    /** Project description */
    description?: boolean | `@${string}`;
    /** Is project enabled */
    enabled?: boolean | `@${string}`;
    /** Project endpoint contains a slug under which project can be reached

For example https://app.graphqleditor.com/{endpoint.uri}/ */
    endpoint?: ValueTypes['Endpoint'];
    /** Unique project id */
    id?: boolean | `@${string}`;
    /** Is project deployed to cloud */
    inCloud?: boolean | `@${string}`;
    members?: [
      {
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
      },
      ValueTypes['MemberConnection'],
    ];
    /** Is project mocked by faker backend */
    mocked?: boolean | `@${string}`;
    /** Project name */
    name?: boolean | `@${string}`;
    /** Project owner

Can be null if project belongs to a team */
    owner?: ValueTypes['User'];
    /** True if project is public */
    public?: boolean | `@${string}`;
    /** Project part of the slug */
    slug?: boolean | `@${string}`;
    sources?: [
      {
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
      },
      ValueTypes['FakerSourceConnection'],
    ];
    /** Project tags */
    tags?: boolean | `@${string}`;
    /** Team to which project belongs

Can be null if project belongs to a user */
    team?: ValueTypes['Team'];
    /** Return creation time stamp of a project */
    updatedAt?: boolean | `@${string}`;
    /** A link to upstream URL */
    upstream?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** PredictCheckout represents payment prediction for checkout data */
  ['PredictCheckout']: AliasType<{
    /** Predicted checkout price */
    price?: boolean | `@${string}`;
    /** Predicted number of trial days */
    trialDays?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** ProjectsSortInput defines how projects from listProjects should be sorted. */
  ['ProjectsSortInput']: {
    /** Sort by owner */
    owner?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by visisbility */
    public?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by slug */
    slug?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by tag */
    tags?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
    team?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort projects by creation date */
    createdAt?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by name */
    name?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by id */
    id?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
  };
  /** RFC3339Date is a RFC3339 formated date-time string */
  ['RFC3339Date']: unknown;
  ['SubscriptionConnection']: AliasType<{
    /** Current conenction page info */
    pageInfo?: ValueTypes['PageInfo'];
    /** List of subscriptions in connection */
    subscriptions?: ValueTypes['Subscription'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Checkout data needed to begin payment process */
  ['PredictCheckoutInput']: {
    /** An id of a chosen subscription plan */
    planID: string | Variable<any, string>;
    /** Quantity of subscriptions that user wants */
    quantity?: number | undefined | null | Variable<any, string>;
    /** Optional discount coupon */
    coupon?: string | undefined | null | Variable<any, string>;
  };
  /** Customer data for checkout information */
  ['CustomerInput']: {
    /** User's country */
    country?: string | undefined | null | Variable<any, string>;
    /** User's post code */
    postCode?: string | undefined | null | Variable<any, string>;
    /** Must be true for marketing to be allowed */
    marketingConsent?: boolean | undefined | null | Variable<any, string>;
    /** User's email address */
    email?: string | undefined | null | Variable<any, string>;
  };
  /** A source object */
  ['FakerSource']: AliasType<{
    /** File checksum */
    checksum?: boolean | `@${string}`;
    contents?: boolean | `@${string}`;
    /** Name of source file */
    filename?: boolean | `@${string}`;
    /** Return an url by which source file can be accessed */
    getUrl?: boolean | `@${string}`;
    /** Return last time the object was updated */
    updatedAt?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Editor user */
  ['User']: AliasType<{
    /** User's account type */
    accountType?: boolean | `@${string}`;
    /** Marketing consent. True if given, false if declined, null if never asked. */
    consentGiven?: boolean | `@${string}`;
    /** Marketing consent given at */
    consentTimestamp?: boolean | `@${string}`;
    /** Unique user id */
    id?: boolean | `@${string}`;
    /** User's namespace */
    namespace?: ValueTypes['Namespace'];
    /** User's subscriptions */
    subscriptions?: ValueTypes['SubscriptionConnection'];
    /** Unique username */
    username?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Team object */
  ['Team']: AliasType<{
    /** Unique team id */
    id?: boolean | `@${string}`;
    member?: [{ username: string | Variable<any, string> }, ValueTypes['Member']];
    members?: [
      {
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
      },
      ValueTypes['MemberConnection'],
    ];
    /** Team name */
    name?: boolean | `@${string}`;
    /** Team's namespace */
    namespace?: ValueTypes['Namespace'];
    /** A plan ID of a plan associated with team */
    planID?: boolean | `@${string}`;
    serviceAccounts?: [
      {
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
      },
      ValueTypes['ServiceAccountConnection'],
    ];
    /** List invite tokens */
    tokens?: ValueTypes['InviteToken'];
    __typename?: boolean | `@${string}`;
  }>;
  ['NpmRegistryPackage']: AliasType<{
    package?: boolean | `@${string}`;
    registry?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Temporary file for project */
  ['TemporaryFile']: AliasType<{
    /** String with url used in GET request */
    getUrl?: boolean | `@${string}`;
    /** String with url used in PUT request */
    putUrl?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['DeployCodeToCloudURIKind']: DeployCodeToCloudURIKind;
  ['MarketplaceOps']: AliasType<{
    addProject?: [
      {
        id: string | Variable<any, string>;
        opts?: ValueTypes['AddProjectInput'] | undefined | null | Variable<any, string>;
      },
      boolean | `@${string}`,
    ];
    removeProject?: [{ id: string | Variable<any, string> }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  /** Teams connection */
  ['TeamConnection']: AliasType<{
    /** Pagination info used in next fetch */
    pageInfo?: ValueTypes['PageInfo'];
    /** List of teams returned by current page in connection */
    teams?: ValueTypes['Team'];
    __typename?: boolean | `@${string}`;
  }>;
  ['MarketplaceUpstream']: AliasType<{
    ['...on NpmRegistryPackage']: ValueTypes['NpmRegistryPackage'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Vat information of a user */
  ['VatInput']: {
    /** Vat company post code address. */
    postCode?: string | undefined | null | Variable<any, string>;
    /** Vat number */
    number?: string | undefined | null | Variable<any, string>;
    /** Vat company name */
    companyName?: string | undefined | null | Variable<any, string>;
    /** Vat company street address */
    street?: string | undefined | null | Variable<any, string>;
    /** Vat company city address */
    city?: string | undefined | null | Variable<any, string>;
    /** Vat company state address. Optional. */
    state?: string | undefined | null | Variable<any, string>;
    /** Vat company country address. */
    country?: string | undefined | null | Variable<any, string>;
  };
  ['Secret']: {
    name: string | Variable<any, string>;
    value?: string | undefined | null | Variable<any, string>;
  };
  ['CloudCorsSetting']: AliasType<{
    allowCredentials?: boolean | `@${string}`;
    allowedHeaders?: boolean | `@${string}`;
    allowedMethod?: boolean | `@${string}`;
    allowedOrigins?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['CloudDeploymentStatus']: CloudDeploymentStatus;
  /** Team member */
  ['Member']: AliasType<{
    /** Member email */
    email?: boolean | `@${string}`;
    /** Member role */
    role?: boolean | `@${string}`;
    /** Service account */
    serviceAccount?: boolean | `@${string}`;
    /** Member username */
    username?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Amount is a number that gives precise representation of real numbers */
  ['Decimal']: unknown;
  /** Update project payload */
  ['UpdateProject']: {
    /** Set project visiblity */
    public?: boolean | undefined | null | Variable<any, string>;
    /** Link to upstream schema */
    upstream?: string | undefined | null | Variable<any, string>;
    /** ID of project to be updated */
    project?: string | undefined | null | Variable<any, string>;
    /** New description for project */
    description?: string | undefined | null | Variable<any, string>;
    /** List of tags for project */
    tags?: Array<string> | undefined | null | Variable<any, string>;
  };
  ['CreateServiceAccountInput']: {
    tags?: Array<string> | undefined | null | Variable<any, string>;
    description?: string | undefined | null | Variable<any, string>;
  };
  /** Request header */
  ['Header']: AliasType<{
    /** Header name */
    key?: boolean | `@${string}`;
    /** Header value */
    value?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['ServiceAccount']: AliasType<{
    description?: boolean | `@${string}`;
    keys?: ValueTypes['ServiceAccountApiKey'];
    name?: boolean | `@${string}`;
    tags?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Sort order defines possible ordering of sorted outputs */
  ['SortOrder']: SortOrder;
  ['AddProjectInput']: {
    npmRegistryPackage?: ValueTypes['NpmRegistryPackageInput'] | undefined | null | Variable<any, string>;
  };
  /** New source payload */
  ['NewSource']: {
    /** Length of source in bytes */
    contentLength?: number | undefined | null | Variable<any, string>;
    /** Source mime type */
    contentType?: string | undefined | null | Variable<any, string>;
    /** Source checksum */
    checksum?: string | undefined | null | Variable<any, string>;
    /** source file name */
    filename?: string | undefined | null | Variable<any, string>;
  };
  ['SchemaSubscription']: AliasType<{
    watchJobStatus?: [{ streamID: string | Variable<any, string> }, boolean | `@${string}`];
    watchLogs?: [{ streamID: string | Variable<any, string> }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  /** Root query type */
  ['Query']: AliasType<{
    checkoutData?: [{ data: ValueTypes['CheckoutDataInput'] | Variable<any, string> }, boolean | `@${string}`];
    /** Returns true if the user is logged in and has verified email */
    emailVerified?: boolean | `@${string}`;
    exchangeServiceAccountKey?: [
      { serviceAccount: string | Variable<any, string>; key: string | Variable<any, string> },
      boolean | `@${string}`,
    ];
    fileServerCredentials?: [{ project?: string | undefined | null | Variable<any, string> }, boolean | `@${string}`];
    findProjects?: [
      {
        query: string | Variable<any, string>;
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
      },
      ValueTypes['ProjectConnection'],
    ];
    findProjectsByTag?: [
      {
        limit?: number | undefined | null | Variable<any, string>;
        tag: string | Variable<any, string>;
        last?: string | undefined | null | Variable<any, string>;
      },
      ValueTypes['ProjectConnection'],
    ];
    getNamespace?: [{ slug: string | Variable<any, string> }, ValueTypes['Namespace']];
    getProject?: [{ project: string | Variable<any, string> }, ValueTypes['Project']];
    getTeam?: [{ name: string | Variable<any, string> }, ValueTypes['Team']];
    getUser?: [{ username: string | Variable<any, string> }, ValueTypes['User']];
    listProjects?: [
      {
        owned?: boolean | undefined | null | Variable<any, string>;
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
        sort?: Array<ValueTypes['ProjectsSortInput'] | undefined | null> | undefined | null | Variable<any, string>;
      },
      ValueTypes['ProjectConnection'],
    ];
    /** Marketplace is a space to share your projects */
    marketplace?: ValueTypes['Marketplace'];
    myTeams?: [
      {
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
      },
      ValueTypes['TeamConnection'],
    ];
    /** List user payments */
    payments?: ValueTypes['Payment'];
    predictCheckout?: [
      { data: ValueTypes['PredictCheckoutInput'] | Variable<any, string> },
      ValueTypes['PredictCheckout'],
    ];
    __typename?: boolean | `@${string}`;
  }>;
  /** PageInfo contains information about connection page */
  ['PageInfo']: AliasType<{
    /** last element in connection */
    last?: boolean | `@${string}`;
    /** limit set while quering */
    limit?: boolean | `@${string}`;
    /** if next is false then client recieved all available data */
    next?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['RenameFileInput']: {
    src: string | Variable<any, string>;
    dst: string | Variable<any, string>;
  };
  /** Project connection object

Used with paginated listing of projects */
  ['ProjectConnection']: AliasType<{
    /** Current connection page info */
    pageInfo?: ValueTypes['PageInfo'];
    /** List of projects in connection */
    projects?: ValueTypes['Project'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Connection object containing list of faker sources */
  ['FakerSourceConnection']: AliasType<{
    /** Connection pageInfo */
    pageInfo?: ValueTypes['PageInfo'];
    /** List of sources returned by connection */
    sources?: ValueTypes['FakerSource'];
    __typename?: boolean | `@${string}`;
  }>;
  ['UserConnection']: AliasType<{
    /** Current connection page info */
    pageInfo?: ValueTypes['PageInfo'];
    /** List of projects in connection */
    users?: ValueTypes['User'];
    __typename?: boolean | `@${string}`;
  }>;
  ['FileServerCredentials']: unknown;
  ['Marketplace']: AliasType<{
    projects?: [
      {
        query?: string | undefined | null | Variable<any, string>;
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
        sort?:
          | Array<ValueTypes['MarketplaceProjectsSortInput'] | undefined | null>
          | undefined
          | null
          | Variable<any, string>;
      },
      ValueTypes['MarketplaceItemConnection'],
    ];
    __typename?: boolean | `@${string}`;
  }>;
  /** Checkout data needed to begin payment process */
  ['CheckoutDataInput']: {
    /** URL to which user should be redirected after failed transaction */
    cancelURL?: string | undefined | null | Variable<any, string>;
    /** An id of a chosen subscription plan */
    planID: string | Variable<any, string>;
    /** Quantity of subscriptions that user wants */
    quantity?: number | undefined | null | Variable<any, string>;
    /** Customer data */
    customer?: ValueTypes['CustomerInput'] | undefined | null | Variable<any, string>;
    /** Vat data */
    vat?: ValueTypes['VatInput'] | undefined | null | Variable<any, string>;
    /** Optional discount coupon */
    coupon?: string | undefined | null | Variable<any, string>;
    /** URL to which user should be redirected after successful transaction */
    successURL?: string | undefined | null | Variable<any, string>;
  };
  /** PaymentDate is a string in a format 'YYYY-MM-DD' */
  ['PaymentDate']: unknown;
  /** Team operations */
  ['TeamOps']: AliasType<{
    addMember?: [
      {
        loginCallback?: string | undefined | null | Variable<any, string>;
        username: string | Variable<any, string>;
        role: ValueTypes['Role'] | Variable<any, string>;
      },
      ValueTypes['Member'],
    ];
    createProject?: [
      { public?: boolean | undefined | null | Variable<any, string>; name: string | Variable<any, string> },
      ValueTypes['Project'],
    ];
    createServiceAccount?: [
      { input?: ValueTypes['CreateServiceAccountInput'] | undefined | null | Variable<any, string> },
      ValueTypes['ServiceAccount'],
    ];
    createServiceAccountApiKey?: [
      { serviceAccount: string | Variable<any, string>; name: string | Variable<any, string> },
      ValueTypes['ServiceAccountApiKey'],
    ];
    /** Delete team */
    delete?: boolean | `@${string}`;
    /** Unique team id */
    id?: boolean | `@${string}`;
    inviteToken?: [
      {
        name: string | Variable<any, string>;
        role?: ValueTypes['Role'] | undefined | null | Variable<any, string>;
        expiration?: number | undefined | null | Variable<any, string>;
        domain?: string | undefined | null | Variable<any, string>;
      },
      boolean | `@${string}`,
    ];
    member?: [{ username: string | Variable<any, string> }, ValueTypes['MemberOps']];
    members?: [
      {
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
      },
      ValueTypes['MemberConnection'],
    ];
    /** Team name */
    name?: boolean | `@${string}`;
    /** Team's namespace */
    namespace?: ValueTypes['Namespace'];
    /** A plan ID of a plan associated with team */
    planID?: boolean | `@${string}`;
    project?: [{ id: string | Variable<any, string> }, ValueTypes['ProjectOps']];
    removeServiceAccount?: [{ name: string | Variable<any, string> }, boolean | `@${string}`];
    removeServiceAccountApiKey?: [
      { serviceAccount: string | Variable<any, string>; id: string | Variable<any, string> },
      boolean | `@${string}`,
    ];
    removeToken?: [{ token: string | Variable<any, string> }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  /** Paginated service account list */
  ['ServiceAccountConnection']: AliasType<{
    /** pageInfo for service accounts connection */
    pageInfo?: ValueTypes['PageInfo'];
    /** List of members in this connection */
    serviceAccounts?: ValueTypes['ServiceAccount'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Team member ops */
  ['MemberOps']: AliasType<{
    /** Boolean object node */
    delete?: boolean | `@${string}`;
    update?: [{ role?: ValueTypes['Role'] | undefined | null | Variable<any, string> }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  ['CloudDeploymentConfig']: AliasType<{
    cors?: ValueTypes['CloudCorsSetting'];
    secrets?: ValueTypes['SecretOutput'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Endpoint returnes a full path to the project without host */
  ['Endpoint']: AliasType<{
    /** Full project uri without host */
    uri?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['Subscription']: AliasType<{
    /** Cancel subscription URL */
    cancelURL?: boolean | `@${string}`;
    /** Subscription expiration date */
    expiration?: boolean | `@${string}`;
    /** Number of seats in subscription */
    quantity?: boolean | `@${string}`;
    /** List of seats in subscription */
    seats?: ValueTypes['UserConnection'];
    /** Status of subscription */
    status?: boolean | `@${string}`;
    /** Subscription unique id */
    subscriptionID?: boolean | `@${string}`;
    /** Subscription plan unique id */
    subscriptionPlanID?: boolean | `@${string}`;
    /** Update subscription URL */
    updateURL?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['Mutation']: AliasType<{
    changePassword?: [
      { oldPassword: string | Variable<any, string>; newPassword: string | Variable<any, string> },
      boolean | `@${string}`,
    ];
    changeSubscription?: [
      { in: ValueTypes['ChangeSubscriptionInput'] | Variable<any, string> },
      boolean | `@${string}`,
    ];
    consumeInviteToken?: [{ token: string | Variable<any, string> }, boolean | `@${string}`];
    createCloudDeployment?: [{ id: string | Variable<any, string> }, boolean | `@${string}`];
    createProject?: [
      { public?: boolean | undefined | null | Variable<any, string>; name: string | Variable<any, string> },
      ValueTypes['Project'],
    ];
    createTeam?: [
      { namespace: string | Variable<any, string>; name: string | Variable<any, string> },
      ValueTypes['TeamOps'],
    ];
    createUser?: [
      { namespace: string | Variable<any, string>; public?: boolean | undefined | null | Variable<any, string> },
      ValueTypes['User'],
    ];
    /** Delete account */
    deleteAccount?: boolean | `@${string}`;
    deployCodeToCloud?: [
      { id: string | Variable<any, string>; opts: ValueTypes['DeployCodeToCloudInput'] | Variable<any, string> },
      boolean | `@${string}`,
    ];
    deployToFaker?: [{ id: string | Variable<any, string> }, boolean | `@${string}`];
    /** Returns marketplace ops */
    marketplace?: ValueTypes['MarketplaceOps'];
    removeCloudDeployment?: [{ id: string | Variable<any, string> }, boolean | `@${string}`];
    removeProject?: [{ project: string | Variable<any, string> }, boolean | `@${string}`];
    /** Resend verification email */
    resendVerificationEmail?: boolean | `@${string}`;
    runtimeLogs?: [{ id: string | Variable<any, string> }, boolean | `@${string}`];
    setCloudDeploymentConfig?: [
      {
        id: string | Variable<any, string>;
        input: ValueTypes['SetCloudDeploymentConfigInput'] | Variable<any, string>;
      },
      boolean | `@${string}`,
    ];
    sync?: [{ source: string | Variable<any, string>; target: string | Variable<any, string> }, boolean | `@${string}`];
    team?: [{ id: string | Variable<any, string> }, ValueTypes['TeamOps']];
    updateProject?: [
      { in?: ValueTypes['UpdateProject'] | undefined | null | Variable<any, string> },
      boolean | `@${string}`,
    ];
    updateSources?: [
      {
        sources?: Array<ValueTypes['NewSource']> | undefined | null | Variable<any, string>;
        project: string | Variable<any, string>;
      },
      ValueTypes['SourceUploadInfo'],
    ];
    __typename?: boolean | `@${string}`;
  }>;
  ['SetCloudDeploymentConfigCorsInput']: {
    allowCredentials?: boolean | undefined | null | Variable<any, string>;
    allowedOrigins?: Array<string> | undefined | null | Variable<any, string>;
    allowedHeaders?: Array<string> | undefined | null | Variable<any, string>;
    allowedMethods?: Array<string> | undefined | null | Variable<any, string>;
  };
  ['DeployCodeToCloudInput']: {
    kind?: ValueTypes['DeployCodeToCloudURIKind'] | undefined | null | Variable<any, string>;
    env?: ValueTypes['DeployCodeToCloudEnv'] | undefined | null | Variable<any, string>;
    secrets?: Array<ValueTypes['Secret']> | undefined | null | Variable<any, string>;
    node14Opts?: ValueTypes['DeployCodeToCloudNode14Opts'] | undefined | null | Variable<any, string>;
    codeURI: string | Variable<any, string>;
  };
  /** type object node */
  ['ProjectOps']: AliasType<{
    addMember?: [
      {
        username: string | Variable<any, string>;
        role: ValueTypes['Role'] | Variable<any, string>;
        loginCallback?: string | undefined | null | Variable<any, string>;
        serviceAccount?: boolean | undefined | null | Variable<any, string>;
      },
      ValueTypes['Member'],
    ];
    /** Create project in cloud */
    createCloudDeployment?: boolean | `@${string}`;
    createTemporaryFile?: [
      {
        contentType?: string | undefined | null | Variable<any, string>;
        contentLength?: number | undefined | null | Variable<any, string>;
      },
      ValueTypes['TemporaryFile'],
    ];
    /** Boolean object node */
    delete?: boolean | `@${string}`;
    deployCodeToCloud?: [
      { opts: ValueTypes['DeployCodeToCloudInput'] | Variable<any, string> },
      boolean | `@${string}`,
    ];
    /** deploy project to faker */
    deployToFaker?: boolean | `@${string}`;
    /** Remove deployment from cloud */
    removeCloudDeployment?: boolean | `@${string}`;
    removeSources?: [{ files?: Array<string> | undefined | null | Variable<any, string> }, boolean | `@${string}`];
    renameSources?: [
      { files?: Array<ValueTypes['RenameFileInput']> | undefined | null | Variable<any, string> },
      boolean | `@${string}`,
    ];
    /** Runtime logs request for project */
    runtimeLogs?: boolean | `@${string}`;
    setCloudDeploymentConfig?: [
      { input: ValueTypes['SetCloudDeploymentConfigInput'] | Variable<any, string> },
      boolean | `@${string}`,
    ];
    update?: [{ in?: ValueTypes['UpdateProject'] | undefined | null | Variable<any, string> }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  ['SetCloudDeploymentConfigInput']: {
    secrets?: Array<ValueTypes['Secret']> | undefined | null | Variable<any, string>;
    cors?: ValueTypes['SetCloudDeploymentConfigCorsInput'] | undefined | null | Variable<any, string>;
  };
  ['DeployCodeToCloudEnv']: DeployCodeToCloudEnv;
  ['SecretOutput']: AliasType<{
    name?: boolean | `@${string}`;
    value?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Namespace is a root object containing projects belonging
to a team or user */
  ['Namespace']: AliasType<{
    project?: [{ name: string | Variable<any, string> }, ValueTypes['Project']];
    projects?: [
      {
        last?: string | undefined | null | Variable<any, string>;
        limit?: number | undefined | null | Variable<any, string>;
      },
      ValueTypes['ProjectConnection'],
    ];
    /** True if namespace is public */
    public?: boolean | `@${string}`;
    /** Namespace part of the slug */
    slug?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** MarketplaceProjectsSortInput defines how projects from listProjects should be sorted in marketplace. */
  ['MarketplaceProjectsSortInput']: {
    /** Sort by owner */
    owner?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by visisbility */
    public?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by slug */
    slug?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by tag */
    tags?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
    team?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort projects by creation date */
    createdAt?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by name */
    name?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
    /** Sort by id */
    id?: ValueTypes['SortOrder'] | undefined | null | Variable<any, string>;
  };
  /** MarketplaceItem represents a project exposed in marketplace. */
  ['MarketplaceItem']: AliasType<{
    project?: ValueTypes['Project'];
    upstream?: ValueTypes['MarketplaceUpstream'];
    __typename?: boolean | `@${string}`;
  }>;
  ['Payment']: AliasType<{
    /** Amount paid */
    amount?: boolean | `@${string}`;
    /** Currency in which payment was made */
    currency?: boolean | `@${string}`;
    /** Date indicates a when the payment was made */
    date?: boolean | `@${string}`;
    /** URL from which user can download invoice */
    receiptURL?: boolean | `@${string}`;
    /** ID of subscription for which payment was made */
    subscriptionID?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Team member role */
  ['Role']: Role;
  /** Paginated members list */
  ['MemberConnection']: AliasType<{
    /** List of members in this connection */
    members?: ValueTypes['Member'];
    /** pageInfo for member connection */
    pageInfo?: ValueTypes['PageInfo'];
    __typename?: boolean | `@${string}`;
  }>;
  ['InviteToken']: AliasType<{
    domain?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    removed?: boolean | `@${string}`;
    token?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['NpmRegistryPackageInput']: {
    registry?: string | undefined | null | Variable<any, string>;
    package: string | Variable<any, string>;
  };
  /** Source upload info object */
  ['SourceUploadInfo']: AliasType<{
    /** Source file name */
    filename?: boolean | `@${string}`;
    /** List of headers that must be included in PUT request */
    headers?: ValueTypes['Header'];
    /** String with url used in PUT request */
    putUrl?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
};

export type ResolverInputTypes = {
  ['DeployCodeToCloudNode14Opts']: {
    buildScript?: string | undefined | null;
  };
  /** Defines user's account type */
  ['AccountType']: AccountType;
  ['ServiceAccountApiKey']: AliasType<{
    id?: boolean | `@${string}`;
    key?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Marketplace item connection object

Used with paginated listing of projects */
  ['MarketplaceItemConnection']: AliasType<{
    /** Current connection page info */
    pageInfo?: ResolverInputTypes['PageInfo'];
    /** List of market place items in connection */
    projects?: ResolverInputTypes['MarketplaceItem'];
    __typename?: boolean | `@${string}`;
  }>;
  ['ChangeSubscriptionInput']: {
    subscriptionID: number;
    subscriptionPlanID?: number | undefined | null;
  };
  /** Project type */
  ['Project']: AliasType<{
    /** Return config of cloud deployment */
    cloudDeploymentConfig?: ResolverInputTypes['CloudDeploymentConfig'];
    cloudDeploymentStatus?: [{ streamID?: string | undefined | null }, boolean | `@${string}`];
    /** Return creation time stamp of a project */
    createdAt?: boolean | `@${string}`;
    /** A database connection info */
    dbConnection?: boolean | `@${string}`;
    /** Project description */
    description?: boolean | `@${string}`;
    /** Is project enabled */
    enabled?: boolean | `@${string}`;
    /** Project endpoint contains a slug under which project can be reached

For example https://app.graphqleditor.com/{endpoint.uri}/ */
    endpoint?: ResolverInputTypes['Endpoint'];
    /** Unique project id */
    id?: boolean | `@${string}`;
    /** Is project deployed to cloud */
    inCloud?: boolean | `@${string}`;
    members?: [
      { last?: string | undefined | null; limit?: number | undefined | null },
      ResolverInputTypes['MemberConnection'],
    ];
    /** Is project mocked by faker backend */
    mocked?: boolean | `@${string}`;
    /** Project name */
    name?: boolean | `@${string}`;
    /** Project owner

Can be null if project belongs to a team */
    owner?: ResolverInputTypes['User'];
    /** True if project is public */
    public?: boolean | `@${string}`;
    /** Project part of the slug */
    slug?: boolean | `@${string}`;
    sources?: [
      { last?: string | undefined | null; limit?: number | undefined | null },
      ResolverInputTypes['FakerSourceConnection'],
    ];
    /** Project tags */
    tags?: boolean | `@${string}`;
    /** Team to which project belongs

Can be null if project belongs to a user */
    team?: ResolverInputTypes['Team'];
    /** Return creation time stamp of a project */
    updatedAt?: boolean | `@${string}`;
    /** A link to upstream URL */
    upstream?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** PredictCheckout represents payment prediction for checkout data */
  ['PredictCheckout']: AliasType<{
    /** Predicted checkout price */
    price?: boolean | `@${string}`;
    /** Predicted number of trial days */
    trialDays?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** ProjectsSortInput defines how projects from listProjects should be sorted. */
  ['ProjectsSortInput']: {
    /** Sort by owner */
    owner?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by visisbility */
    public?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by slug */
    slug?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by tag */
    tags?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
    team?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort projects by creation date */
    createdAt?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by name */
    name?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by id */
    id?: ResolverInputTypes['SortOrder'] | undefined | null;
  };
  /** RFC3339Date is a RFC3339 formated date-time string */
  ['RFC3339Date']: unknown;
  ['SubscriptionConnection']: AliasType<{
    /** Current conenction page info */
    pageInfo?: ResolverInputTypes['PageInfo'];
    /** List of subscriptions in connection */
    subscriptions?: ResolverInputTypes['Subscription'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Checkout data needed to begin payment process */
  ['PredictCheckoutInput']: {
    /** An id of a chosen subscription plan */
    planID: string;
    /** Quantity of subscriptions that user wants */
    quantity?: number | undefined | null;
    /** Optional discount coupon */
    coupon?: string | undefined | null;
  };
  /** Customer data for checkout information */
  ['CustomerInput']: {
    /** User's country */
    country?: string | undefined | null;
    /** User's post code */
    postCode?: string | undefined | null;
    /** Must be true for marketing to be allowed */
    marketingConsent?: boolean | undefined | null;
    /** User's email address */
    email?: string | undefined | null;
  };
  /** A source object */
  ['FakerSource']: AliasType<{
    /** File checksum */
    checksum?: boolean | `@${string}`;
    contents?: boolean | `@${string}`;
    /** Name of source file */
    filename?: boolean | `@${string}`;
    /** Return an url by which source file can be accessed */
    getUrl?: boolean | `@${string}`;
    /** Return last time the object was updated */
    updatedAt?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Editor user */
  ['User']: AliasType<{
    /** User's account type */
    accountType?: boolean | `@${string}`;
    /** Marketing consent. True if given, false if declined, null if never asked. */
    consentGiven?: boolean | `@${string}`;
    /** Marketing consent given at */
    consentTimestamp?: boolean | `@${string}`;
    /** Unique user id */
    id?: boolean | `@${string}`;
    /** User's namespace */
    namespace?: ResolverInputTypes['Namespace'];
    /** User's subscriptions */
    subscriptions?: ResolverInputTypes['SubscriptionConnection'];
    /** Unique username */
    username?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Team object */
  ['Team']: AliasType<{
    /** Unique team id */
    id?: boolean | `@${string}`;
    member?: [{ username: string }, ResolverInputTypes['Member']];
    members?: [
      { last?: string | undefined | null; limit?: number | undefined | null },
      ResolverInputTypes['MemberConnection'],
    ];
    /** Team name */
    name?: boolean | `@${string}`;
    /** Team's namespace */
    namespace?: ResolverInputTypes['Namespace'];
    /** A plan ID of a plan associated with team */
    planID?: boolean | `@${string}`;
    serviceAccounts?: [
      { last?: string | undefined | null; limit?: number | undefined | null },
      ResolverInputTypes['ServiceAccountConnection'],
    ];
    /** List invite tokens */
    tokens?: ResolverInputTypes['InviteToken'];
    __typename?: boolean | `@${string}`;
  }>;
  ['NpmRegistryPackage']: AliasType<{
    package?: boolean | `@${string}`;
    registry?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Temporary file for project */
  ['TemporaryFile']: AliasType<{
    /** String with url used in GET request */
    getUrl?: boolean | `@${string}`;
    /** String with url used in PUT request */
    putUrl?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['DeployCodeToCloudURIKind']: DeployCodeToCloudURIKind;
  ['MarketplaceOps']: AliasType<{
    addProject?: [
      { id: string; opts?: ResolverInputTypes['AddProjectInput'] | undefined | null },
      boolean | `@${string}`,
    ];
    removeProject?: [{ id: string }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  /** Teams connection */
  ['TeamConnection']: AliasType<{
    /** Pagination info used in next fetch */
    pageInfo?: ResolverInputTypes['PageInfo'];
    /** List of teams returned by current page in connection */
    teams?: ResolverInputTypes['Team'];
    __typename?: boolean | `@${string}`;
  }>;
  ['MarketplaceUpstream']: AliasType<{
    NpmRegistryPackage?: ResolverInputTypes['NpmRegistryPackage'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Vat information of a user */
  ['VatInput']: {
    /** Vat company post code address. */
    postCode?: string | undefined | null;
    /** Vat number */
    number?: string | undefined | null;
    /** Vat company name */
    companyName?: string | undefined | null;
    /** Vat company street address */
    street?: string | undefined | null;
    /** Vat company city address */
    city?: string | undefined | null;
    /** Vat company state address. Optional. */
    state?: string | undefined | null;
    /** Vat company country address. */
    country?: string | undefined | null;
  };
  ['Secret']: {
    name: string;
    value?: string | undefined | null;
  };
  ['CloudCorsSetting']: AliasType<{
    allowCredentials?: boolean | `@${string}`;
    allowedHeaders?: boolean | `@${string}`;
    allowedMethod?: boolean | `@${string}`;
    allowedOrigins?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['CloudDeploymentStatus']: CloudDeploymentStatus;
  /** Team member */
  ['Member']: AliasType<{
    /** Member email */
    email?: boolean | `@${string}`;
    /** Member role */
    role?: boolean | `@${string}`;
    /** Service account */
    serviceAccount?: boolean | `@${string}`;
    /** Member username */
    username?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Amount is a number that gives precise representation of real numbers */
  ['Decimal']: unknown;
  /** Update project payload */
  ['UpdateProject']: {
    /** Set project visiblity */
    public?: boolean | undefined | null;
    /** Link to upstream schema */
    upstream?: string | undefined | null;
    /** ID of project to be updated */
    project?: string | undefined | null;
    /** New description for project */
    description?: string | undefined | null;
    /** List of tags for project */
    tags?: Array<string> | undefined | null;
  };
  ['CreateServiceAccountInput']: {
    tags?: Array<string> | undefined | null;
    description?: string | undefined | null;
  };
  /** Request header */
  ['Header']: AliasType<{
    /** Header name */
    key?: boolean | `@${string}`;
    /** Header value */
    value?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['ServiceAccount']: AliasType<{
    description?: boolean | `@${string}`;
    keys?: ResolverInputTypes['ServiceAccountApiKey'];
    name?: boolean | `@${string}`;
    tags?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Sort order defines possible ordering of sorted outputs */
  ['SortOrder']: SortOrder;
  ['AddProjectInput']: {
    npmRegistryPackage?: ResolverInputTypes['NpmRegistryPackageInput'] | undefined | null;
  };
  /** New source payload */
  ['NewSource']: {
    /** Length of source in bytes */
    contentLength?: number | undefined | null;
    /** Source mime type */
    contentType?: string | undefined | null;
    /** Source checksum */
    checksum?: string | undefined | null;
    /** source file name */
    filename?: string | undefined | null;
  };
  ['SchemaSubscription']: AliasType<{
    watchJobStatus?: [{ streamID: string }, boolean | `@${string}`];
    watchLogs?: [{ streamID: string }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  /** Root query type */
  ['Query']: AliasType<{
    checkoutData?: [{ data: ResolverInputTypes['CheckoutDataInput'] }, boolean | `@${string}`];
    /** Returns true if the user is logged in and has verified email */
    emailVerified?: boolean | `@${string}`;
    exchangeServiceAccountKey?: [{ serviceAccount: string; key: string }, boolean | `@${string}`];
    fileServerCredentials?: [{ project?: string | undefined | null }, boolean | `@${string}`];
    findProjects?: [
      { query: string; last?: string | undefined | null; limit?: number | undefined | null },
      ResolverInputTypes['ProjectConnection'],
    ];
    findProjectsByTag?: [
      { limit?: number | undefined | null; tag: string; last?: string | undefined | null },
      ResolverInputTypes['ProjectConnection'],
    ];
    getNamespace?: [{ slug: string }, ResolverInputTypes['Namespace']];
    getProject?: [{ project: string }, ResolverInputTypes['Project']];
    getTeam?: [{ name: string }, ResolverInputTypes['Team']];
    getUser?: [{ username: string }, ResolverInputTypes['User']];
    listProjects?: [
      {
        owned?: boolean | undefined | null;
        last?: string | undefined | null;
        limit?: number | undefined | null;
        sort?: Array<ResolverInputTypes['ProjectsSortInput'] | undefined | null> | undefined | null;
      },
      ResolverInputTypes['ProjectConnection'],
    ];
    /** Marketplace is a space to share your projects */
    marketplace?: ResolverInputTypes['Marketplace'];
    myTeams?: [
      { last?: string | undefined | null; limit?: number | undefined | null },
      ResolverInputTypes['TeamConnection'],
    ];
    /** List user payments */
    payments?: ResolverInputTypes['Payment'];
    predictCheckout?: [{ data: ResolverInputTypes['PredictCheckoutInput'] }, ResolverInputTypes['PredictCheckout']];
    __typename?: boolean | `@${string}`;
  }>;
  /** PageInfo contains information about connection page */
  ['PageInfo']: AliasType<{
    /** last element in connection */
    last?: boolean | `@${string}`;
    /** limit set while quering */
    limit?: boolean | `@${string}`;
    /** if next is false then client recieved all available data */
    next?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['RenameFileInput']: {
    src: string;
    dst: string;
  };
  /** Project connection object

Used with paginated listing of projects */
  ['ProjectConnection']: AliasType<{
    /** Current connection page info */
    pageInfo?: ResolverInputTypes['PageInfo'];
    /** List of projects in connection */
    projects?: ResolverInputTypes['Project'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Connection object containing list of faker sources */
  ['FakerSourceConnection']: AliasType<{
    /** Connection pageInfo */
    pageInfo?: ResolverInputTypes['PageInfo'];
    /** List of sources returned by connection */
    sources?: ResolverInputTypes['FakerSource'];
    __typename?: boolean | `@${string}`;
  }>;
  ['UserConnection']: AliasType<{
    /** Current connection page info */
    pageInfo?: ResolverInputTypes['PageInfo'];
    /** List of projects in connection */
    users?: ResolverInputTypes['User'];
    __typename?: boolean | `@${string}`;
  }>;
  ['FileServerCredentials']: unknown;
  ['Marketplace']: AliasType<{
    projects?: [
      {
        query?: string | undefined | null;
        last?: string | undefined | null;
        limit?: number | undefined | null;
        sort?: Array<ResolverInputTypes['MarketplaceProjectsSortInput'] | undefined | null> | undefined | null;
      },
      ResolverInputTypes['MarketplaceItemConnection'],
    ];
    __typename?: boolean | `@${string}`;
  }>;
  /** Checkout data needed to begin payment process */
  ['CheckoutDataInput']: {
    /** URL to which user should be redirected after failed transaction */
    cancelURL?: string | undefined | null;
    /** An id of a chosen subscription plan */
    planID: string;
    /** Quantity of subscriptions that user wants */
    quantity?: number | undefined | null;
    /** Customer data */
    customer?: ResolverInputTypes['CustomerInput'] | undefined | null;
    /** Vat data */
    vat?: ResolverInputTypes['VatInput'] | undefined | null;
    /** Optional discount coupon */
    coupon?: string | undefined | null;
    /** URL to which user should be redirected after successful transaction */
    successURL?: string | undefined | null;
  };
  /** PaymentDate is a string in a format 'YYYY-MM-DD' */
  ['PaymentDate']: unknown;
  /** Team operations */
  ['TeamOps']: AliasType<{
    addMember?: [
      { loginCallback?: string | undefined | null; username: string; role: ResolverInputTypes['Role'] },
      ResolverInputTypes['Member'],
    ];
    createProject?: [{ public?: boolean | undefined | null; name: string }, ResolverInputTypes['Project']];
    createServiceAccount?: [
      { input?: ResolverInputTypes['CreateServiceAccountInput'] | undefined | null },
      ResolverInputTypes['ServiceAccount'],
    ];
    createServiceAccountApiKey?: [{ serviceAccount: string; name: string }, ResolverInputTypes['ServiceAccountApiKey']];
    /** Delete team */
    delete?: boolean | `@${string}`;
    /** Unique team id */
    id?: boolean | `@${string}`;
    inviteToken?: [
      {
        name: string;
        role?: ResolverInputTypes['Role'] | undefined | null;
        expiration?: number | undefined | null;
        domain?: string | undefined | null;
      },
      boolean | `@${string}`,
    ];
    member?: [{ username: string }, ResolverInputTypes['MemberOps']];
    members?: [
      { last?: string | undefined | null; limit?: number | undefined | null },
      ResolverInputTypes['MemberConnection'],
    ];
    /** Team name */
    name?: boolean | `@${string}`;
    /** Team's namespace */
    namespace?: ResolverInputTypes['Namespace'];
    /** A plan ID of a plan associated with team */
    planID?: boolean | `@${string}`;
    project?: [{ id: string }, ResolverInputTypes['ProjectOps']];
    removeServiceAccount?: [{ name: string }, boolean | `@${string}`];
    removeServiceAccountApiKey?: [{ serviceAccount: string; id: string }, boolean | `@${string}`];
    removeToken?: [{ token: string }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  /** Paginated service account list */
  ['ServiceAccountConnection']: AliasType<{
    /** pageInfo for service accounts connection */
    pageInfo?: ResolverInputTypes['PageInfo'];
    /** List of members in this connection */
    serviceAccounts?: ResolverInputTypes['ServiceAccount'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Team member ops */
  ['MemberOps']: AliasType<{
    /** Boolean object node */
    delete?: boolean | `@${string}`;
    update?: [{ role?: ResolverInputTypes['Role'] | undefined | null }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  ['CloudDeploymentConfig']: AliasType<{
    cors?: ResolverInputTypes['CloudCorsSetting'];
    secrets?: ResolverInputTypes['SecretOutput'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Endpoint returnes a full path to the project without host */
  ['Endpoint']: AliasType<{
    /** Full project uri without host */
    uri?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['Subscription']: AliasType<{
    /** Cancel subscription URL */
    cancelURL?: boolean | `@${string}`;
    /** Subscription expiration date */
    expiration?: boolean | `@${string}`;
    /** Number of seats in subscription */
    quantity?: boolean | `@${string}`;
    /** List of seats in subscription */
    seats?: ResolverInputTypes['UserConnection'];
    /** Status of subscription */
    status?: boolean | `@${string}`;
    /** Subscription unique id */
    subscriptionID?: boolean | `@${string}`;
    /** Subscription plan unique id */
    subscriptionPlanID?: boolean | `@${string}`;
    /** Update subscription URL */
    updateURL?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['Mutation']: AliasType<{
    changePassword?: [{ oldPassword: string; newPassword: string }, boolean | `@${string}`];
    changeSubscription?: [{ in: ResolverInputTypes['ChangeSubscriptionInput'] }, boolean | `@${string}`];
    consumeInviteToken?: [{ token: string }, boolean | `@${string}`];
    createCloudDeployment?: [{ id: string }, boolean | `@${string}`];
    createProject?: [{ public?: boolean | undefined | null; name: string }, ResolverInputTypes['Project']];
    createTeam?: [{ namespace: string; name: string }, ResolverInputTypes['TeamOps']];
    createUser?: [{ namespace: string; public?: boolean | undefined | null }, ResolverInputTypes['User']];
    /** Delete account */
    deleteAccount?: boolean | `@${string}`;
    deployCodeToCloud?: [{ id: string; opts: ResolverInputTypes['DeployCodeToCloudInput'] }, boolean | `@${string}`];
    deployToFaker?: [{ id: string }, boolean | `@${string}`];
    /** Returns marketplace ops */
    marketplace?: ResolverInputTypes['MarketplaceOps'];
    removeCloudDeployment?: [{ id: string }, boolean | `@${string}`];
    removeProject?: [{ project: string }, boolean | `@${string}`];
    /** Resend verification email */
    resendVerificationEmail?: boolean | `@${string}`;
    runtimeLogs?: [{ id: string }, boolean | `@${string}`];
    setCloudDeploymentConfig?: [
      { id: string; input: ResolverInputTypes['SetCloudDeploymentConfigInput'] },
      boolean | `@${string}`,
    ];
    sync?: [{ source: string; target: string }, boolean | `@${string}`];
    team?: [{ id: string }, ResolverInputTypes['TeamOps']];
    updateProject?: [{ in?: ResolverInputTypes['UpdateProject'] | undefined | null }, boolean | `@${string}`];
    updateSources?: [
      { sources?: Array<ResolverInputTypes['NewSource']> | undefined | null; project: string },
      ResolverInputTypes['SourceUploadInfo'],
    ];
    __typename?: boolean | `@${string}`;
  }>;
  ['SetCloudDeploymentConfigCorsInput']: {
    allowCredentials?: boolean | undefined | null;
    allowedOrigins?: Array<string> | undefined | null;
    allowedHeaders?: Array<string> | undefined | null;
    allowedMethods?: Array<string> | undefined | null;
  };
  ['DeployCodeToCloudInput']: {
    kind?: ResolverInputTypes['DeployCodeToCloudURIKind'] | undefined | null;
    env?: ResolverInputTypes['DeployCodeToCloudEnv'] | undefined | null;
    secrets?: Array<ResolverInputTypes['Secret']> | undefined | null;
    node14Opts?: ResolverInputTypes['DeployCodeToCloudNode14Opts'] | undefined | null;
    codeURI: string;
  };
  /** type object node */
  ['ProjectOps']: AliasType<{
    addMember?: [
      {
        username: string;
        role: ResolverInputTypes['Role'];
        loginCallback?: string | undefined | null;
        serviceAccount?: boolean | undefined | null;
      },
      ResolverInputTypes['Member'],
    ];
    /** Create project in cloud */
    createCloudDeployment?: boolean | `@${string}`;
    createTemporaryFile?: [
      { contentType?: string | undefined | null; contentLength?: number | undefined | null },
      ResolverInputTypes['TemporaryFile'],
    ];
    /** Boolean object node */
    delete?: boolean | `@${string}`;
    deployCodeToCloud?: [{ opts: ResolverInputTypes['DeployCodeToCloudInput'] }, boolean | `@${string}`];
    /** deploy project to faker */
    deployToFaker?: boolean | `@${string}`;
    /** Remove deployment from cloud */
    removeCloudDeployment?: boolean | `@${string}`;
    removeSources?: [{ files?: Array<string> | undefined | null }, boolean | `@${string}`];
    renameSources?: [
      { files?: Array<ResolverInputTypes['RenameFileInput']> | undefined | null },
      boolean | `@${string}`,
    ];
    /** Runtime logs request for project */
    runtimeLogs?: boolean | `@${string}`;
    setCloudDeploymentConfig?: [{ input: ResolverInputTypes['SetCloudDeploymentConfigInput'] }, boolean | `@${string}`];
    update?: [{ in?: ResolverInputTypes['UpdateProject'] | undefined | null }, boolean | `@${string}`];
    __typename?: boolean | `@${string}`;
  }>;
  ['SetCloudDeploymentConfigInput']: {
    secrets?: Array<ResolverInputTypes['Secret']> | undefined | null;
    cors?: ResolverInputTypes['SetCloudDeploymentConfigCorsInput'] | undefined | null;
  };
  ['DeployCodeToCloudEnv']: DeployCodeToCloudEnv;
  ['SecretOutput']: AliasType<{
    name?: boolean | `@${string}`;
    value?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Namespace is a root object containing projects belonging
to a team or user */
  ['Namespace']: AliasType<{
    project?: [{ name: string }, ResolverInputTypes['Project']];
    projects?: [
      { last?: string | undefined | null; limit?: number | undefined | null },
      ResolverInputTypes['ProjectConnection'],
    ];
    /** True if namespace is public */
    public?: boolean | `@${string}`;
    /** Namespace part of the slug */
    slug?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** MarketplaceProjectsSortInput defines how projects from listProjects should be sorted in marketplace. */
  ['MarketplaceProjectsSortInput']: {
    /** Sort by owner */
    owner?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by visisbility */
    public?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by slug */
    slug?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by tag */
    tags?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
    team?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort projects by creation date */
    createdAt?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by name */
    name?: ResolverInputTypes['SortOrder'] | undefined | null;
    /** Sort by id */
    id?: ResolverInputTypes['SortOrder'] | undefined | null;
  };
  /** MarketplaceItem represents a project exposed in marketplace. */
  ['MarketplaceItem']: AliasType<{
    project?: ResolverInputTypes['Project'];
    upstream?: ResolverInputTypes['MarketplaceUpstream'];
    __typename?: boolean | `@${string}`;
  }>;
  ['Payment']: AliasType<{
    /** Amount paid */
    amount?: boolean | `@${string}`;
    /** Currency in which payment was made */
    currency?: boolean | `@${string}`;
    /** Date indicates a when the payment was made */
    date?: boolean | `@${string}`;
    /** URL from which user can download invoice */
    receiptURL?: boolean | `@${string}`;
    /** ID of subscription for which payment was made */
    subscriptionID?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Team member role */
  ['Role']: Role;
  /** Paginated members list */
  ['MemberConnection']: AliasType<{
    /** List of members in this connection */
    members?: ResolverInputTypes['Member'];
    /** pageInfo for member connection */
    pageInfo?: ResolverInputTypes['PageInfo'];
    __typename?: boolean | `@${string}`;
  }>;
  ['InviteToken']: AliasType<{
    domain?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    removed?: boolean | `@${string}`;
    token?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['NpmRegistryPackageInput']: {
    registry?: string | undefined | null;
    package: string;
  };
  /** Source upload info object */
  ['SourceUploadInfo']: AliasType<{
    /** Source file name */
    filename?: boolean | `@${string}`;
    /** List of headers that must be included in PUT request */
    headers?: ResolverInputTypes['Header'];
    /** String with url used in PUT request */
    putUrl?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
};

export type ModelTypes = {
  ['DeployCodeToCloudNode14Opts']: {
    buildScript?: string | undefined;
  };
  ['AccountType']: AccountType;
  ['ServiceAccountApiKey']: {
    id: string;
    key: string;
    name: string;
  };
  /** Marketplace item connection object

Used with paginated listing of projects */
  ['MarketplaceItemConnection']: {
    /** Current connection page info */
    pageInfo: ModelTypes['PageInfo'];
    /** List of market place items in connection */
    projects?: Array<ModelTypes['MarketplaceItem']> | undefined;
  };
  ['ChangeSubscriptionInput']: {
    subscriptionID: number;
    subscriptionPlanID?: number | undefined;
  };
  /** Project type */
  ['Project']: {
    /** Return config of cloud deployment */
    cloudDeploymentConfig?: ModelTypes['CloudDeploymentConfig'] | undefined;
    /** Return status of cloud deployment */
    cloudDeploymentStatus?: ModelTypes['CloudDeploymentStatus'] | undefined;
    /** Return creation time stamp of a project */
    createdAt?: ModelTypes['RFC3339Date'] | undefined;
    /** A database connection info */
    dbConnection?: string | undefined;
    /** Project description */
    description?: string | undefined;
    /** Is project enabled */
    enabled?: boolean | undefined;
    /** Project endpoint contains a slug under which project can be reached

For example https://app.graphqleditor.com/{endpoint.uri}/ */
    endpoint?: ModelTypes['Endpoint'] | undefined;
    /** Unique project id */
    id: string;
    /** Is project deployed to cloud */
    inCloud?: boolean | undefined;
    /** Paginated list of members in team */
    members?: ModelTypes['MemberConnection'] | undefined;
    /** Is project mocked by faker backend */
    mocked?: boolean | undefined;
    /** Project name */
    name: string;
    /** Project owner

Can be null if project belongs to a team */
    owner?: ModelTypes['User'] | undefined;
    /** True if project is public */
    public?: boolean | undefined;
    /** Project part of the slug */
    slug?: string | undefined;
    /** Returns a connection object with source files in project

last is a string returned by previous call to Project.sources

limit sets a limit on how many objects can be returned */
    sources?: ModelTypes['FakerSourceConnection'] | undefined;
    /** Project tags */
    tags?: Array<string> | undefined;
    /** Team to which project belongs

Can be null if project belongs to a user */
    team?: ModelTypes['Team'] | undefined;
    /** Return creation time stamp of a project */
    updatedAt?: ModelTypes['RFC3339Date'] | undefined;
    /** A link to upstream URL */
    upstream?: string | undefined;
  };
  /** PredictCheckout represents payment prediction for checkout data */
  ['PredictCheckout']: {
    /** Predicted checkout price */
    price: number;
    /** Predicted number of trial days */
    trialDays?: number | undefined;
  };
  /** ProjectsSortInput defines how projects from listProjects should be sorted. */
  ['ProjectsSortInput']: {
    /** Sort by owner */
    owner?: ModelTypes['SortOrder'] | undefined;
    /** Sort by visisbility */
    public?: ModelTypes['SortOrder'] | undefined;
    /** Sort by slug */
    slug?: ModelTypes['SortOrder'] | undefined;
    /** Sort by tag */
    tags?: ModelTypes['SortOrder'] | undefined;
    /** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
    team?: ModelTypes['SortOrder'] | undefined;
    /** Sort projects by creation date */
    createdAt?: ModelTypes['SortOrder'] | undefined;
    /** Sort by name */
    name?: ModelTypes['SortOrder'] | undefined;
    /** Sort by id */
    id?: ModelTypes['SortOrder'] | undefined;
  };
  /** RFC3339Date is a RFC3339 formated date-time string */
  ['RFC3339Date']: any;
  ['SubscriptionConnection']: {
    /** Current conenction page info */
    pageInfo: ModelTypes['PageInfo'];
    /** List of subscriptions in connection */
    subscriptions?: Array<ModelTypes['Subscription']> | undefined;
  };
  /** Checkout data needed to begin payment process */
  ['PredictCheckoutInput']: {
    /** An id of a chosen subscription plan */
    planID: string;
    /** Quantity of subscriptions that user wants */
    quantity?: number | undefined;
    /** Optional discount coupon */
    coupon?: string | undefined;
  };
  /** Customer data for checkout information */
  ['CustomerInput']: {
    /** User's country */
    country?: string | undefined;
    /** User's post code */
    postCode?: string | undefined;
    /** Must be true for marketing to be allowed */
    marketingConsent?: boolean | undefined;
    /** User's email address */
    email?: string | undefined;
  };
  /** A source object */
  ['FakerSource']: {
    /** File checksum */
    checksum?: string | undefined;
    contents?: string | undefined;
    /** Name of source file */
    filename?: string | undefined;
    /** Return an url by which source file can be accessed */
    getUrl?: string | undefined;
    /** Return last time the object was updated */
    updatedAt?: string | undefined;
  };
  /** Editor user */
  ['User']: {
    /** User's account type */
    accountType: ModelTypes['AccountType'];
    /** Marketing consent. True if given, false if declined, null if never asked. */
    consentGiven?: boolean | undefined;
    /** Marketing consent given at */
    consentTimestamp?: number | undefined;
    /** Unique user id */
    id?: string | undefined;
    /** User's namespace */
    namespace?: ModelTypes['Namespace'] | undefined;
    /** User's subscriptions */
    subscriptions?: ModelTypes['SubscriptionConnection'] | undefined;
    /** Unique username */
    username?: string | undefined;
  };
  /** Team object */
  ['Team']: {
    /** Unique team id */
    id?: string | undefined;
    /** type object node */
    member?: ModelTypes['Member'] | undefined;
    /** Paginated list of members in team */
    members?: ModelTypes['MemberConnection'] | undefined;
    /** Team name */
    name: string;
    /** Team's namespace */
    namespace: ModelTypes['Namespace'];
    /** A plan ID of a plan associated with team */
    planID?: number | undefined;
    /** List service accounts in team */
    serviceAccounts?: ModelTypes['ServiceAccountConnection'] | undefined;
    /** List invite tokens */
    tokens?: Array<ModelTypes['InviteToken']> | undefined;
  };
  ['NpmRegistryPackage']: {
    package: string;
    registry?: string | undefined;
  };
  /** Temporary file for project */
  ['TemporaryFile']: {
    /** String with url used in GET request */
    getUrl: string;
    /** String with url used in PUT request */
    putUrl: string;
  };
  ['DeployCodeToCloudURIKind']: DeployCodeToCloudURIKind;
  ['MarketplaceOps']: {
    /** Add project to market place */
    addProject?: boolean | undefined;
    /** Remove project from market place */
    removeProject?: boolean | undefined;
  };
  /** Teams connection */
  ['TeamConnection']: {
    /** Pagination info used in next fetch */
    pageInfo: ModelTypes['PageInfo'];
    /** List of teams returned by current page in connection */
    teams?: Array<ModelTypes['Team']> | undefined;
  };
  ['MarketplaceUpstream']: ModelTypes['NpmRegistryPackage'];
  /** Vat information of a user */
  ['VatInput']: {
    /** Vat company post code address. */
    postCode?: string | undefined;
    /** Vat number */
    number?: string | undefined;
    /** Vat company name */
    companyName?: string | undefined;
    /** Vat company street address */
    street?: string | undefined;
    /** Vat company city address */
    city?: string | undefined;
    /** Vat company state address. Optional. */
    state?: string | undefined;
    /** Vat company country address. */
    country?: string | undefined;
  };
  ['Secret']: {
    name: string;
    value?: string | undefined;
  };
  ['CloudCorsSetting']: {
    allowCredentials?: boolean | undefined;
    allowedHeaders?: Array<string> | undefined;
    allowedMethod?: Array<string> | undefined;
    allowedOrigins?: Array<string> | undefined;
  };
  ['CloudDeploymentStatus']: CloudDeploymentStatus;
  /** Team member */
  ['Member']: {
    /** Member email */
    email?: string | undefined;
    /** Member role */
    role?: ModelTypes['Role'] | undefined;
    /** Service account */
    serviceAccount?: boolean | undefined;
    /** Member username */
    username?: string | undefined;
  };
  /** Amount is a number that gives precise representation of real numbers */
  ['Decimal']: any;
  /** Update project payload */
  ['UpdateProject']: {
    /** Set project visiblity */
    public?: boolean | undefined;
    /** Link to upstream schema */
    upstream?: string | undefined;
    /** ID of project to be updated */
    project?: string | undefined;
    /** New description for project */
    description?: string | undefined;
    /** List of tags for project */
    tags?: Array<string> | undefined;
  };
  ['CreateServiceAccountInput']: {
    tags?: Array<string> | undefined;
    description?: string | undefined;
  };
  /** Request header */
  ['Header']: {
    /** Header name */
    key: string;
    /** Header value */
    value?: string | undefined;
  };
  ['ServiceAccount']: {
    description?: string | undefined;
    keys?: Array<ModelTypes['ServiceAccountApiKey']> | undefined;
    name: string;
    tags?: Array<string> | undefined;
  };
  ['SortOrder']: SortOrder;
  ['AddProjectInput']: {
    npmRegistryPackage?: ModelTypes['NpmRegistryPackageInput'] | undefined;
  };
  /** New source payload */
  ['NewSource']: {
    /** Length of source in bytes */
    contentLength?: number | undefined;
    /** Source mime type */
    contentType?: string | undefined;
    /** Source checksum */
    checksum?: string | undefined;
    /** source file name */
    filename?: string | undefined;
  };
  ['SchemaSubscription']: {
    watchJobStatus?: ModelTypes['CloudDeploymentStatus'] | undefined;
    watchLogs?: string | undefined;
  };
  /** Root query type */
  ['Query']: {
    /** Data needed by the current user to start payment flow */
    checkoutData?: string | undefined;
    /** Returns true if the user is logged in and has verified email */
    emailVerified?: boolean | undefined;
    /** Exchange service account key for token */
    exchangeServiceAccountKey?: string | undefined;
    /** Returns credentials to file server. If project ID is not provided returns a 
credentials that grants access to all projects owned by user, otherwise creates a
credentials that grants access to one project only if the project is public or
belongs to a user. */
    fileServerCredentials?: ModelTypes['FileServerCredentials'] | undefined;
    /** Returns a project connection

query is a regular expresion matched agains project slug

last is an id of the last project returned by previous call

limit limits the number of returned projects */
    findProjects?: ModelTypes['ProjectConnection'] | undefined;
    /** Find projects which contain tag

tag is a string

last is an id of the last project returned by previous call

limit limits the number of returned projects */
    findProjectsByTag?: ModelTypes['ProjectConnection'] | undefined;
    /** Return namespace matching slug */
    getNamespace?: ModelTypes['Namespace'] | undefined;
    /** Return project by id */
    getProject?: ModelTypes['Project'] | undefined;
    /** Return team by name */
    getTeam?: ModelTypes['Team'] | undefined;
    /** Return user by name */
    getUser?: ModelTypes['User'] | undefined;
    /** Returns a project connection

If owned is true, returns only project belonging to currently logged user

last is an id of the last project returned by previous call

limit limits the number of returned projects */
    listProjects?: ModelTypes['ProjectConnection'] | undefined;
    /** Marketplace is a space to share your projects */
    marketplace: ModelTypes['Marketplace'];
    /** List of current user teams */
    myTeams?: ModelTypes['TeamConnection'] | undefined;
    /** List user payments */
    payments?: Array<ModelTypes['Payment'] | undefined> | undefined;
    /** Calculate checkout information */
    predictCheckout?: ModelTypes['PredictCheckout'] | undefined;
  };
  /** PageInfo contains information about connection page */
  ['PageInfo']: {
    /** last element in connection */
    last?: string | undefined;
    /** limit set while quering */
    limit?: number | undefined;
    /** if next is false then client recieved all available data */
    next?: boolean | undefined;
  };
  ['RenameFileInput']: {
    src: string;
    dst: string;
  };
  /** Project connection object

Used with paginated listing of projects */
  ['ProjectConnection']: {
    /** Current connection page info */
    pageInfo: ModelTypes['PageInfo'];
    /** List of projects in connection */
    projects?: Array<ModelTypes['Project']> | undefined;
  };
  /** Connection object containing list of faker sources */
  ['FakerSourceConnection']: {
    /** Connection pageInfo */
    pageInfo: ModelTypes['PageInfo'];
    /** List of sources returned by connection */
    sources?: Array<ModelTypes['FakerSource']> | undefined;
  };
  ['UserConnection']: {
    /** Current connection page info */
    pageInfo: ModelTypes['PageInfo'];
    /** List of projects in connection */
    users?: Array<ModelTypes['User']> | undefined;
  };
  ['FileServerCredentials']: any;
  ['Marketplace']: {
    /** Returns a project connection

If owned is true, returns only project belonging to currently logged user

last is an id of the last project returned by previous call

limit limits the number of returned projects */
    projects?: ModelTypes['MarketplaceItemConnection'] | undefined;
  };
  /** Checkout data needed to begin payment process */
  ['CheckoutDataInput']: {
    /** URL to which user should be redirected after failed transaction */
    cancelURL?: string | undefined;
    /** An id of a chosen subscription plan */
    planID: string;
    /** Quantity of subscriptions that user wants */
    quantity?: number | undefined;
    /** Customer data */
    customer?: ModelTypes['CustomerInput'] | undefined;
    /** Vat data */
    vat?: ModelTypes['VatInput'] | undefined;
    /** Optional discount coupon */
    coupon?: string | undefined;
    /** URL to which user should be redirected after successful transaction */
    successURL?: string | undefined;
  };
  /** PaymentDate is a string in a format 'YYYY-MM-DD' */
  ['PaymentDate']: any;
  /** Team operations */
  ['TeamOps']: {
    /** Add member to the team */
    addMember?: ModelTypes['Member'] | undefined;
    /** Create new team project */
    createProject?: ModelTypes['Project'] | undefined;
    /** Add service account to the team */
    createServiceAccount?: ModelTypes['ServiceAccount'] | undefined;
    /** Create service account api key */
    createServiceAccountApiKey?: ModelTypes['ServiceAccountApiKey'] | undefined;
    /** Delete team */
    delete?: boolean | undefined;
    /** Unique team id */
    id?: string | undefined;
    /** Creates a invite token that can be accepted by anyone to join a team

role - A role which new user will have after accepting invite. Default viewer
expiration - How long invitation token stays valid in minutes. Default is 7 days. Max is one 5 years.
domain - Limits users to those who have verified email from domain */
    inviteToken?: string | undefined;
    /** type object node */
    member?: ModelTypes['MemberOps'] | undefined;
    /** Paginated list of members in team */
    members?: ModelTypes['MemberConnection'] | undefined;
    /** Team name */
    name?: string | undefined;
    /** Team's namespace */
    namespace?: ModelTypes['Namespace'] | undefined;
    /** A plan ID of a plan associated with team */
    planID?: number | undefined;
    /** type object node */
    project?: ModelTypes['ProjectOps'] | undefined;
    /** Remove service account */
    removeServiceAccount?: boolean | undefined;
    /** Remove service account api key */
    removeServiceAccountApiKey?: boolean | undefined;
    /** Removes a token making it unusable for future usages */
    removeToken?: string | undefined;
  };
  /** Paginated service account list */
  ['ServiceAccountConnection']: {
    /** pageInfo for service accounts connection */
    pageInfo: ModelTypes['PageInfo'];
    /** List of members in this connection */
    serviceAccounts?: Array<ModelTypes['ServiceAccount']> | undefined;
  };
  /** Team member ops */
  ['MemberOps']: {
    /** Boolean object node */
    delete?: boolean | undefined;
    /** Boolean object node */
    update?: boolean | undefined;
  };
  ['CloudDeploymentConfig']: {
    cors?: ModelTypes['CloudCorsSetting'] | undefined;
    secrets?: Array<ModelTypes['SecretOutput']> | undefined;
  };
  /** Endpoint returnes a full path to the project without host */
  ['Endpoint']: {
    /** Full project uri without host */
    uri?: string | undefined;
  };
  ['Subscription']: {
    /** Cancel subscription URL */
    cancelURL?: string | undefined;
    /** Subscription expiration date */
    expiration?: string | undefined;
    /** Number of seats in subscription */
    quantity?: number | undefined;
    /** List of seats in subscription */
    seats?: ModelTypes['UserConnection'] | undefined;
    /** Status of subscription */
    status?: string | undefined;
    /** Subscription unique id */
    subscriptionID?: number | undefined;
    /** Subscription plan unique id */
    subscriptionPlanID?: number | undefined;
    /** Update subscription URL */
    updateURL?: string | undefined;
  };
  ['Mutation']: {
    /** Change user password */
    changePassword?: boolean | undefined;
    /** Changes subscription settings for user */
    changeSubscription?: boolean | undefined;
    /** Consume invite token */
    consumeInviteToken?: boolean | undefined;
    /** Create project in cloud */
    createCloudDeployment?: string | undefined;
    /** Create new user project

public if true project is public

name is project name */
    createProject: ModelTypes['Project'];
    /** Create new team */
    createTeam?: ModelTypes['TeamOps'] | undefined;
    /** Create new user

namespace name for a user

public is user namespace public */
    createUser: ModelTypes['User'];
    /** Delete account */
    deleteAccount?: boolean | undefined;
    /** Deploy code to the project in cloud */
    deployCodeToCloud?: string | undefined;
    /** deploy project to faker */
    deployToFaker?: boolean | undefined;
    /** Returns marketplace ops */
    marketplace?: ModelTypes['MarketplaceOps'] | undefined;
    /** Remove project from cloud */
    removeCloudDeployment?: string | undefined;
    /** Remove project by id */
    removeProject?: boolean | undefined;
    /** Resend verification email */
    resendVerificationEmail?: boolean | undefined;
    /** Runtime logs request for project */
    runtimeLogs?: string | undefined;
    /** Set cloud deployment config */
    setCloudDeploymentConfig?: boolean | undefined;
    /** Synhronises the target project with source. It overrides existing files
of target with files of sources. It does not remove files from target that do not
exist in source. */
    sync?: boolean | undefined;
    /** type object node */
    team?: ModelTypes['TeamOps'] | undefined;
    /** Modify project */
    updateProject?: boolean | undefined;
    /** Add sources to the project */
    updateSources?: Array<ModelTypes['SourceUploadInfo'] | undefined> | undefined;
  };
  ['SetCloudDeploymentConfigCorsInput']: {
    allowCredentials?: boolean | undefined;
    allowedOrigins?: Array<string> | undefined;
    allowedHeaders?: Array<string> | undefined;
    allowedMethods?: Array<string> | undefined;
  };
  ['DeployCodeToCloudInput']: {
    kind?: ModelTypes['DeployCodeToCloudURIKind'] | undefined;
    env?: ModelTypes['DeployCodeToCloudEnv'] | undefined;
    secrets?: Array<ModelTypes['Secret']> | undefined;
    node14Opts?: ModelTypes['DeployCodeToCloudNode14Opts'] | undefined;
    codeURI: string;
  };
  /** type object node */
  ['ProjectOps']: {
    /** Add member to the project */
    addMember?: ModelTypes['Member'] | undefined;
    /** Create project in cloud */
    createCloudDeployment?: string | undefined;
    /** Create temporary file for project */
    createTemporaryFile?: ModelTypes['TemporaryFile'] | undefined;
    /** Boolean object node */
    delete?: boolean | undefined;
    /** Deploy code to the project in cloud */
    deployCodeToCloud?: string | undefined;
    /** deploy project to faker */
    deployToFaker?: boolean | undefined;
    /** Remove deployment from cloud */
    removeCloudDeployment?: string | undefined;
    /** remove files from project */
    removeSources?: boolean | undefined;
    /** rename files in project */
    renameSources?: boolean | undefined;
    /** Runtime logs request for project */
    runtimeLogs?: string | undefined;
    /** Set cloud deployment config */
    setCloudDeploymentConfig?: boolean | undefined;
    /** Boolean object node */
    update?: boolean | undefined;
  };
  ['SetCloudDeploymentConfigInput']: {
    secrets?: Array<ModelTypes['Secret']> | undefined;
    cors?: ModelTypes['SetCloudDeploymentConfigCorsInput'] | undefined;
  };
  ['DeployCodeToCloudEnv']: DeployCodeToCloudEnv;
  ['SecretOutput']: {
    name: string;
    value?: string | undefined;
  };
  /** Namespace is a root object containing projects belonging
to a team or user */
  ['Namespace']: {
    /** Return project by name from namespace */
    project?: ModelTypes['Project'] | undefined;
    /** Returns a project connection object which contains a projects belonging to namespace

last is a string returned by previous call to Namespace.projects

limit sets a limit on how many objects can be returned */
    projects?: ModelTypes['ProjectConnection'] | undefined;
    /** True if namespace is public */
    public?: boolean | undefined;
    /** Namespace part of the slug */
    slug?: string | undefined;
  };
  /** MarketplaceProjectsSortInput defines how projects from listProjects should be sorted in marketplace. */
  ['MarketplaceProjectsSortInput']: {
    /** Sort by owner */
    owner?: ModelTypes['SortOrder'] | undefined;
    /** Sort by visisbility */
    public?: ModelTypes['SortOrder'] | undefined;
    /** Sort by slug */
    slug?: ModelTypes['SortOrder'] | undefined;
    /** Sort by tag */
    tags?: ModelTypes['SortOrder'] | undefined;
    /** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
    team?: ModelTypes['SortOrder'] | undefined;
    /** Sort projects by creation date */
    createdAt?: ModelTypes['SortOrder'] | undefined;
    /** Sort by name */
    name?: ModelTypes['SortOrder'] | undefined;
    /** Sort by id */
    id?: ModelTypes['SortOrder'] | undefined;
  };
  /** MarketplaceItem represents a project exposed in marketplace. */
  ['MarketplaceItem']: {
    project?: ModelTypes['Project'] | undefined;
    upstream?: ModelTypes['MarketplaceUpstream'] | undefined;
  };
  ['Payment']: {
    /** Amount paid */
    amount?: ModelTypes['Decimal'] | undefined;
    /** Currency in which payment was made */
    currency?: string | undefined;
    /** Date indicates a when the payment was made */
    date?: ModelTypes['PaymentDate'] | undefined;
    /** URL from which user can download invoice */
    receiptURL?: string | undefined;
    /** ID of subscription for which payment was made */
    subscriptionID?: number | undefined;
  };
  ['Role']: Role;
  /** Paginated members list */
  ['MemberConnection']: {
    /** List of members in this connection */
    members?: Array<ModelTypes['Member']> | undefined;
    /** pageInfo for member connection */
    pageInfo: ModelTypes['PageInfo'];
  };
  ['InviteToken']: {
    domain?: string | undefined;
    name: string;
    removed?: boolean | undefined;
    token?: string | undefined;
  };
  ['NpmRegistryPackageInput']: {
    registry?: string | undefined;
    package: string;
  };
  /** Source upload info object */
  ['SourceUploadInfo']: {
    /** Source file name */
    filename?: string | undefined;
    /** List of headers that must be included in PUT request */
    headers?: Array<ModelTypes['Header'] | undefined> | undefined;
    /** String with url used in PUT request */
    putUrl: string;
  };
};

export type GraphQLTypes = {
  ['DeployCodeToCloudNode14Opts']: {
    buildScript?: string | undefined;
  };
  /** Defines user's account type */
  ['AccountType']: AccountType;
  ['ServiceAccountApiKey']: {
    __typename: 'ServiceAccountApiKey';
    id: string;
    key: string;
    name: string;
  };
  /** Marketplace item connection object

Used with paginated listing of projects */
  ['MarketplaceItemConnection']: {
    __typename: 'MarketplaceItemConnection';
    /** Current connection page info */
    pageInfo: GraphQLTypes['PageInfo'];
    /** List of market place items in connection */
    projects?: Array<GraphQLTypes['MarketplaceItem']> | undefined;
  };
  ['ChangeSubscriptionInput']: {
    subscriptionID: number;
    subscriptionPlanID?: number | undefined;
  };
  /** Project type */
  ['Project']: {
    __typename: 'Project';
    /** Return config of cloud deployment */
    cloudDeploymentConfig?: GraphQLTypes['CloudDeploymentConfig'] | undefined;
    /** Return status of cloud deployment */
    cloudDeploymentStatus?: GraphQLTypes['CloudDeploymentStatus'] | undefined;
    /** Return creation time stamp of a project */
    createdAt?: GraphQLTypes['RFC3339Date'] | undefined;
    /** A database connection info */
    dbConnection?: string | undefined;
    /** Project description */
    description?: string | undefined;
    /** Is project enabled */
    enabled?: boolean | undefined;
    /** Project endpoint contains a slug under which project can be reached

For example https://app.graphqleditor.com/{endpoint.uri}/ */
    endpoint?: GraphQLTypes['Endpoint'] | undefined;
    /** Unique project id */
    id: string;
    /** Is project deployed to cloud */
    inCloud?: boolean | undefined;
    /** Paginated list of members in team */
    members?: GraphQLTypes['MemberConnection'] | undefined;
    /** Is project mocked by faker backend */
    mocked?: boolean | undefined;
    /** Project name */
    name: string;
    /** Project owner

Can be null if project belongs to a team */
    owner?: GraphQLTypes['User'] | undefined;
    /** True if project is public */
    public?: boolean | undefined;
    /** Project part of the slug */
    slug?: string | undefined;
    /** Returns a connection object with source files in project

last is a string returned by previous call to Project.sources

limit sets a limit on how many objects can be returned */
    sources?: GraphQLTypes['FakerSourceConnection'] | undefined;
    /** Project tags */
    tags?: Array<string> | undefined;
    /** Team to which project belongs

Can be null if project belongs to a user */
    team?: GraphQLTypes['Team'] | undefined;
    /** Return creation time stamp of a project */
    updatedAt?: GraphQLTypes['RFC3339Date'] | undefined;
    /** A link to upstream URL */
    upstream?: string | undefined;
  };
  /** PredictCheckout represents payment prediction for checkout data */
  ['PredictCheckout']: {
    __typename: 'PredictCheckout';
    /** Predicted checkout price */
    price: number;
    /** Predicted number of trial days */
    trialDays?: number | undefined;
  };
  /** ProjectsSortInput defines how projects from listProjects should be sorted. */
  ['ProjectsSortInput']: {
    /** Sort by owner */
    owner?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by visisbility */
    public?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by slug */
    slug?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by tag */
    tags?: GraphQLTypes['SortOrder'] | undefined;
    /** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
    team?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort projects by creation date */
    createdAt?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by name */
    name?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by id */
    id?: GraphQLTypes['SortOrder'] | undefined;
  };
  /** RFC3339Date is a RFC3339 formated date-time string */
  ['RFC3339Date']: 'scalar' & { name: 'RFC3339Date' };
  ['SubscriptionConnection']: {
    __typename: 'SubscriptionConnection';
    /** Current conenction page info */
    pageInfo: GraphQLTypes['PageInfo'];
    /** List of subscriptions in connection */
    subscriptions?: Array<GraphQLTypes['Subscription']> | undefined;
  };
  /** Checkout data needed to begin payment process */
  ['PredictCheckoutInput']: {
    /** An id of a chosen subscription plan */
    planID: string;
    /** Quantity of subscriptions that user wants */
    quantity?: number | undefined;
    /** Optional discount coupon */
    coupon?: string | undefined;
  };
  /** Customer data for checkout information */
  ['CustomerInput']: {
    /** User's country */
    country?: string | undefined;
    /** User's post code */
    postCode?: string | undefined;
    /** Must be true for marketing to be allowed */
    marketingConsent?: boolean | undefined;
    /** User's email address */
    email?: string | undefined;
  };
  /** A source object */
  ['FakerSource']: {
    __typename: 'FakerSource';
    /** File checksum */
    checksum?: string | undefined;
    contents?: string | undefined;
    /** Name of source file */
    filename?: string | undefined;
    /** Return an url by which source file can be accessed */
    getUrl?: string | undefined;
    /** Return last time the object was updated */
    updatedAt?: string | undefined;
  };
  /** Editor user */
  ['User']: {
    __typename: 'User';
    /** User's account type */
    accountType: GraphQLTypes['AccountType'];
    /** Marketing consent. True if given, false if declined, null if never asked. */
    consentGiven?: boolean | undefined;
    /** Marketing consent given at */
    consentTimestamp?: number | undefined;
    /** Unique user id */
    id?: string | undefined;
    /** User's namespace */
    namespace?: GraphQLTypes['Namespace'] | undefined;
    /** User's subscriptions */
    subscriptions?: GraphQLTypes['SubscriptionConnection'] | undefined;
    /** Unique username */
    username?: string | undefined;
  };
  /** Team object */
  ['Team']: {
    __typename: 'Team';
    /** Unique team id */
    id?: string | undefined;
    /** type object node */
    member?: GraphQLTypes['Member'] | undefined;
    /** Paginated list of members in team */
    members?: GraphQLTypes['MemberConnection'] | undefined;
    /** Team name */
    name: string;
    /** Team's namespace */
    namespace: GraphQLTypes['Namespace'];
    /** A plan ID of a plan associated with team */
    planID?: number | undefined;
    /** List service accounts in team */
    serviceAccounts?: GraphQLTypes['ServiceAccountConnection'] | undefined;
    /** List invite tokens */
    tokens?: Array<GraphQLTypes['InviteToken']> | undefined;
  };
  ['NpmRegistryPackage']: {
    __typename: 'NpmRegistryPackage';
    package: string;
    registry?: string | undefined;
  };
  /** Temporary file for project */
  ['TemporaryFile']: {
    __typename: 'TemporaryFile';
    /** String with url used in GET request */
    getUrl: string;
    /** String with url used in PUT request */
    putUrl: string;
  };
  ['DeployCodeToCloudURIKind']: DeployCodeToCloudURIKind;
  ['MarketplaceOps']: {
    __typename: 'MarketplaceOps';
    /** Add project to market place */
    addProject?: boolean | undefined;
    /** Remove project from market place */
    removeProject?: boolean | undefined;
  };
  /** Teams connection */
  ['TeamConnection']: {
    __typename: 'TeamConnection';
    /** Pagination info used in next fetch */
    pageInfo: GraphQLTypes['PageInfo'];
    /** List of teams returned by current page in connection */
    teams?: Array<GraphQLTypes['Team']> | undefined;
  };
  ['MarketplaceUpstream']: {
    __typename: 'NpmRegistryPackage';
    ['...on NpmRegistryPackage']: '__union' & GraphQLTypes['NpmRegistryPackage'];
  };
  /** Vat information of a user */
  ['VatInput']: {
    /** Vat company post code address. */
    postCode?: string | undefined;
    /** Vat number */
    number?: string | undefined;
    /** Vat company name */
    companyName?: string | undefined;
    /** Vat company street address */
    street?: string | undefined;
    /** Vat company city address */
    city?: string | undefined;
    /** Vat company state address. Optional. */
    state?: string | undefined;
    /** Vat company country address. */
    country?: string | undefined;
  };
  ['Secret']: {
    name: string;
    value?: string | undefined;
  };
  ['CloudCorsSetting']: {
    __typename: 'CloudCorsSetting';
    allowCredentials?: boolean | undefined;
    allowedHeaders?: Array<string> | undefined;
    allowedMethod?: Array<string> | undefined;
    allowedOrigins?: Array<string> | undefined;
  };
  ['CloudDeploymentStatus']: CloudDeploymentStatus;
  /** Team member */
  ['Member']: {
    __typename: 'Member';
    /** Member email */
    email?: string | undefined;
    /** Member role */
    role?: GraphQLTypes['Role'] | undefined;
    /** Service account */
    serviceAccount?: boolean | undefined;
    /** Member username */
    username?: string | undefined;
  };
  /** Amount is a number that gives precise representation of real numbers */
  ['Decimal']: 'scalar' & { name: 'Decimal' };
  /** Update project payload */
  ['UpdateProject']: {
    /** Set project visiblity */
    public?: boolean | undefined;
    /** Link to upstream schema */
    upstream?: string | undefined;
    /** ID of project to be updated */
    project?: string | undefined;
    /** New description for project */
    description?: string | undefined;
    /** List of tags for project */
    tags?: Array<string> | undefined;
  };
  ['CreateServiceAccountInput']: {
    tags?: Array<string> | undefined;
    description?: string | undefined;
  };
  /** Request header */
  ['Header']: {
    __typename: 'Header';
    /** Header name */
    key: string;
    /** Header value */
    value?: string | undefined;
  };
  ['ServiceAccount']: {
    __typename: 'ServiceAccount';
    description?: string | undefined;
    keys?: Array<GraphQLTypes['ServiceAccountApiKey']> | undefined;
    name: string;
    tags?: Array<string> | undefined;
  };
  /** Sort order defines possible ordering of sorted outputs */
  ['SortOrder']: SortOrder;
  ['AddProjectInput']: {
    npmRegistryPackage?: GraphQLTypes['NpmRegistryPackageInput'] | undefined;
  };
  /** New source payload */
  ['NewSource']: {
    /** Length of source in bytes */
    contentLength?: number | undefined;
    /** Source mime type */
    contentType?: string | undefined;
    /** Source checksum */
    checksum?: string | undefined;
    /** source file name */
    filename?: string | undefined;
  };
  ['SchemaSubscription']: {
    __typename: 'SchemaSubscription';
    watchJobStatus?: GraphQLTypes['CloudDeploymentStatus'] | undefined;
    watchLogs?: string | undefined;
  };
  /** Root query type */
  ['Query']: {
    __typename: 'Query';
    /** Data needed by the current user to start payment flow */
    checkoutData?: string | undefined;
    /** Returns true if the user is logged in and has verified email */
    emailVerified?: boolean | undefined;
    /** Exchange service account key for token */
    exchangeServiceAccountKey?: string | undefined;
    /** Returns credentials to file server. If project ID is not provided returns a 
credentials that grants access to all projects owned by user, otherwise creates a
credentials that grants access to one project only if the project is public or
belongs to a user. */
    fileServerCredentials?: GraphQLTypes['FileServerCredentials'] | undefined;
    /** Returns a project connection

query is a regular expresion matched agains project slug

last is an id of the last project returned by previous call

limit limits the number of returned projects */
    findProjects?: GraphQLTypes['ProjectConnection'] | undefined;
    /** Find projects which contain tag

tag is a string

last is an id of the last project returned by previous call

limit limits the number of returned projects */
    findProjectsByTag?: GraphQLTypes['ProjectConnection'] | undefined;
    /** Return namespace matching slug */
    getNamespace?: GraphQLTypes['Namespace'] | undefined;
    /** Return project by id */
    getProject?: GraphQLTypes['Project'] | undefined;
    /** Return team by name */
    getTeam?: GraphQLTypes['Team'] | undefined;
    /** Return user by name */
    getUser?: GraphQLTypes['User'] | undefined;
    /** Returns a project connection

If owned is true, returns only project belonging to currently logged user

last is an id of the last project returned by previous call

limit limits the number of returned projects */
    listProjects?: GraphQLTypes['ProjectConnection'] | undefined;
    /** Marketplace is a space to share your projects */
    marketplace: GraphQLTypes['Marketplace'];
    /** List of current user teams */
    myTeams?: GraphQLTypes['TeamConnection'] | undefined;
    /** List user payments */
    payments?: Array<GraphQLTypes['Payment'] | undefined> | undefined;
    /** Calculate checkout information */
    predictCheckout?: GraphQLTypes['PredictCheckout'] | undefined;
  };
  /** PageInfo contains information about connection page */
  ['PageInfo']: {
    __typename: 'PageInfo';
    /** last element in connection */
    last?: string | undefined;
    /** limit set while quering */
    limit?: number | undefined;
    /** if next is false then client recieved all available data */
    next?: boolean | undefined;
  };
  ['RenameFileInput']: {
    src: string;
    dst: string;
  };
  /** Project connection object

Used with paginated listing of projects */
  ['ProjectConnection']: {
    __typename: 'ProjectConnection';
    /** Current connection page info */
    pageInfo: GraphQLTypes['PageInfo'];
    /** List of projects in connection */
    projects?: Array<GraphQLTypes['Project']> | undefined;
  };
  /** Connection object containing list of faker sources */
  ['FakerSourceConnection']: {
    __typename: 'FakerSourceConnection';
    /** Connection pageInfo */
    pageInfo: GraphQLTypes['PageInfo'];
    /** List of sources returned by connection */
    sources?: Array<GraphQLTypes['FakerSource']> | undefined;
  };
  ['UserConnection']: {
    __typename: 'UserConnection';
    /** Current connection page info */
    pageInfo: GraphQLTypes['PageInfo'];
    /** List of projects in connection */
    users?: Array<GraphQLTypes['User']> | undefined;
  };
  ['FileServerCredentials']: 'scalar' & { name: 'FileServerCredentials' };
  ['Marketplace']: {
    __typename: 'Marketplace';
    /** Returns a project connection

If owned is true, returns only project belonging to currently logged user

last is an id of the last project returned by previous call

limit limits the number of returned projects */
    projects?: GraphQLTypes['MarketplaceItemConnection'] | undefined;
  };
  /** Checkout data needed to begin payment process */
  ['CheckoutDataInput']: {
    /** URL to which user should be redirected after failed transaction */
    cancelURL?: string | undefined;
    /** An id of a chosen subscription plan */
    planID: string;
    /** Quantity of subscriptions that user wants */
    quantity?: number | undefined;
    /** Customer data */
    customer?: GraphQLTypes['CustomerInput'] | undefined;
    /** Vat data */
    vat?: GraphQLTypes['VatInput'] | undefined;
    /** Optional discount coupon */
    coupon?: string | undefined;
    /** URL to which user should be redirected after successful transaction */
    successURL?: string | undefined;
  };
  /** PaymentDate is a string in a format 'YYYY-MM-DD' */
  ['PaymentDate']: 'scalar' & { name: 'PaymentDate' };
  /** Team operations */
  ['TeamOps']: {
    __typename: 'TeamOps';
    /** Add member to the team */
    addMember?: GraphQLTypes['Member'] | undefined;
    /** Create new team project */
    createProject?: GraphQLTypes['Project'] | undefined;
    /** Add service account to the team */
    createServiceAccount?: GraphQLTypes['ServiceAccount'] | undefined;
    /** Create service account api key */
    createServiceAccountApiKey?: GraphQLTypes['ServiceAccountApiKey'] | undefined;
    /** Delete team */
    delete?: boolean | undefined;
    /** Unique team id */
    id?: string | undefined;
    /** Creates a invite token that can be accepted by anyone to join a team

role - A role which new user will have after accepting invite. Default viewer
expiration - How long invitation token stays valid in minutes. Default is 7 days. Max is one 5 years.
domain - Limits users to those who have verified email from domain */
    inviteToken?: string | undefined;
    /** type object node */
    member?: GraphQLTypes['MemberOps'] | undefined;
    /** Paginated list of members in team */
    members?: GraphQLTypes['MemberConnection'] | undefined;
    /** Team name */
    name?: string | undefined;
    /** Team's namespace */
    namespace?: GraphQLTypes['Namespace'] | undefined;
    /** A plan ID of a plan associated with team */
    planID?: number | undefined;
    /** type object node */
    project?: GraphQLTypes['ProjectOps'] | undefined;
    /** Remove service account */
    removeServiceAccount?: boolean | undefined;
    /** Remove service account api key */
    removeServiceAccountApiKey?: boolean | undefined;
    /** Removes a token making it unusable for future usages */
    removeToken?: string | undefined;
  };
  /** Paginated service account list */
  ['ServiceAccountConnection']: {
    __typename: 'ServiceAccountConnection';
    /** pageInfo for service accounts connection */
    pageInfo: GraphQLTypes['PageInfo'];
    /** List of members in this connection */
    serviceAccounts?: Array<GraphQLTypes['ServiceAccount']> | undefined;
  };
  /** Team member ops */
  ['MemberOps']: {
    __typename: 'MemberOps';
    /** Boolean object node */
    delete?: boolean | undefined;
    /** Boolean object node */
    update?: boolean | undefined;
  };
  ['CloudDeploymentConfig']: {
    __typename: 'CloudDeploymentConfig';
    cors?: GraphQLTypes['CloudCorsSetting'] | undefined;
    secrets?: Array<GraphQLTypes['SecretOutput']> | undefined;
  };
  /** Endpoint returnes a full path to the project without host */
  ['Endpoint']: {
    __typename: 'Endpoint';
    /** Full project uri without host */
    uri?: string | undefined;
  };
  ['Subscription']: {
    __typename: 'Subscription';
    /** Cancel subscription URL */
    cancelURL?: string | undefined;
    /** Subscription expiration date */
    expiration?: string | undefined;
    /** Number of seats in subscription */
    quantity?: number | undefined;
    /** List of seats in subscription */
    seats?: GraphQLTypes['UserConnection'] | undefined;
    /** Status of subscription */
    status?: string | undefined;
    /** Subscription unique id */
    subscriptionID?: number | undefined;
    /** Subscription plan unique id */
    subscriptionPlanID?: number | undefined;
    /** Update subscription URL */
    updateURL?: string | undefined;
  };
  ['Mutation']: {
    __typename: 'Mutation';
    /** Change user password */
    changePassword?: boolean | undefined;
    /** Changes subscription settings for user */
    changeSubscription?: boolean | undefined;
    /** Consume invite token */
    consumeInviteToken?: boolean | undefined;
    /** Create project in cloud */
    createCloudDeployment?: string | undefined;
    /** Create new user project

public if true project is public

name is project name */
    createProject: GraphQLTypes['Project'];
    /** Create new team */
    createTeam?: GraphQLTypes['TeamOps'] | undefined;
    /** Create new user

namespace name for a user

public is user namespace public */
    createUser: GraphQLTypes['User'];
    /** Delete account */
    deleteAccount?: boolean | undefined;
    /** Deploy code to the project in cloud */
    deployCodeToCloud?: string | undefined;
    /** deploy project to faker */
    deployToFaker?: boolean | undefined;
    /** Returns marketplace ops */
    marketplace?: GraphQLTypes['MarketplaceOps'] | undefined;
    /** Remove project from cloud */
    removeCloudDeployment?: string | undefined;
    /** Remove project by id */
    removeProject?: boolean | undefined;
    /** Resend verification email */
    resendVerificationEmail?: boolean | undefined;
    /** Runtime logs request for project */
    runtimeLogs?: string | undefined;
    /** Set cloud deployment config */
    setCloudDeploymentConfig?: boolean | undefined;
    /** Synhronises the target project with source. It overrides existing files
of target with files of sources. It does not remove files from target that do not
exist in source. */
    sync?: boolean | undefined;
    /** type object node */
    team?: GraphQLTypes['TeamOps'] | undefined;
    /** Modify project */
    updateProject?: boolean | undefined;
    /** Add sources to the project */
    updateSources?: Array<GraphQLTypes['SourceUploadInfo'] | undefined> | undefined;
  };
  ['SetCloudDeploymentConfigCorsInput']: {
    allowCredentials?: boolean | undefined;
    allowedOrigins?: Array<string> | undefined;
    allowedHeaders?: Array<string> | undefined;
    allowedMethods?: Array<string> | undefined;
  };
  ['DeployCodeToCloudInput']: {
    kind?: GraphQLTypes['DeployCodeToCloudURIKind'] | undefined;
    env?: GraphQLTypes['DeployCodeToCloudEnv'] | undefined;
    secrets?: Array<GraphQLTypes['Secret']> | undefined;
    node14Opts?: GraphQLTypes['DeployCodeToCloudNode14Opts'] | undefined;
    codeURI: string;
  };
  /** type object node */
  ['ProjectOps']: {
    __typename: 'ProjectOps';
    /** Add member to the project */
    addMember?: GraphQLTypes['Member'] | undefined;
    /** Create project in cloud */
    createCloudDeployment?: string | undefined;
    /** Create temporary file for project */
    createTemporaryFile?: GraphQLTypes['TemporaryFile'] | undefined;
    /** Boolean object node */
    delete?: boolean | undefined;
    /** Deploy code to the project in cloud */
    deployCodeToCloud?: string | undefined;
    /** deploy project to faker */
    deployToFaker?: boolean | undefined;
    /** Remove deployment from cloud */
    removeCloudDeployment?: string | undefined;
    /** remove files from project */
    removeSources?: boolean | undefined;
    /** rename files in project */
    renameSources?: boolean | undefined;
    /** Runtime logs request for project */
    runtimeLogs?: string | undefined;
    /** Set cloud deployment config */
    setCloudDeploymentConfig?: boolean | undefined;
    /** Boolean object node */
    update?: boolean | undefined;
  };
  ['SetCloudDeploymentConfigInput']: {
    secrets?: Array<GraphQLTypes['Secret']> | undefined;
    cors?: GraphQLTypes['SetCloudDeploymentConfigCorsInput'] | undefined;
  };
  ['DeployCodeToCloudEnv']: DeployCodeToCloudEnv;
  ['SecretOutput']: {
    __typename: 'SecretOutput';
    name: string;
    value?: string | undefined;
  };
  /** Namespace is a root object containing projects belonging
to a team or user */
  ['Namespace']: {
    __typename: 'Namespace';
    /** Return project by name from namespace */
    project?: GraphQLTypes['Project'] | undefined;
    /** Returns a project connection object which contains a projects belonging to namespace

last is a string returned by previous call to Namespace.projects

limit sets a limit on how many objects can be returned */
    projects?: GraphQLTypes['ProjectConnection'] | undefined;
    /** True if namespace is public */
    public?: boolean | undefined;
    /** Namespace part of the slug */
    slug?: string | undefined;
  };
  /** MarketplaceProjectsSortInput defines how projects from listProjects should be sorted in marketplace. */
  ['MarketplaceProjectsSortInput']: {
    /** Sort by owner */
    owner?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by visisbility */
    public?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by slug */
    slug?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by tag */
    tags?: GraphQLTypes['SortOrder'] | undefined;
    /** Sorts projects by team.

Sort behaviour for projects by team is implemenation depednant. */
    team?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort projects by creation date */
    createdAt?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by name */
    name?: GraphQLTypes['SortOrder'] | undefined;
    /** Sort by id */
    id?: GraphQLTypes['SortOrder'] | undefined;
  };
  /** MarketplaceItem represents a project exposed in marketplace. */
  ['MarketplaceItem']: {
    __typename: 'MarketplaceItem';
    project?: GraphQLTypes['Project'] | undefined;
    upstream?: GraphQLTypes['MarketplaceUpstream'] | undefined;
  };
  ['Payment']: {
    __typename: 'Payment';
    /** Amount paid */
    amount?: GraphQLTypes['Decimal'] | undefined;
    /** Currency in which payment was made */
    currency?: string | undefined;
    /** Date indicates a when the payment was made */
    date?: GraphQLTypes['PaymentDate'] | undefined;
    /** URL from which user can download invoice */
    receiptURL?: string | undefined;
    /** ID of subscription for which payment was made */
    subscriptionID?: number | undefined;
  };
  /** Team member role */
  ['Role']: Role;
  /** Paginated members list */
  ['MemberConnection']: {
    __typename: 'MemberConnection';
    /** List of members in this connection */
    members?: Array<GraphQLTypes['Member']> | undefined;
    /** pageInfo for member connection */
    pageInfo: GraphQLTypes['PageInfo'];
  };
  ['InviteToken']: {
    __typename: 'InviteToken';
    domain?: string | undefined;
    name: string;
    removed?: boolean | undefined;
    token?: string | undefined;
  };
  ['NpmRegistryPackageInput']: {
    registry?: string | undefined;
    package: string;
  };
  /** Source upload info object */
  ['SourceUploadInfo']: {
    __typename: 'SourceUploadInfo';
    /** Source file name */
    filename?: string | undefined;
    /** List of headers that must be included in PUT request */
    headers?: Array<GraphQLTypes['Header'] | undefined> | undefined;
    /** String with url used in PUT request */
    putUrl: string;
  };
};
/** Defines user's account type */
export const enum AccountType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}
export const enum DeployCodeToCloudURIKind {
  ZIP = 'ZIP',
  PROJECT_FILES = 'PROJECT_FILES',
}
export const enum CloudDeploymentStatus {
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  STARTING = 'STARTING',
}
/** Sort order defines possible ordering of sorted outputs */
export const enum SortOrder {
  Ascending = 'Ascending',
  Descending = 'Descending',
}
export const enum DeployCodeToCloudEnv {
  NODE14 = 'NODE14',
}
/** Team member role */
export const enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
  CONTRIBUTOR = 'CONTRIBUTOR',
}

type ZEUS_VARIABLES = {
  ['DeployCodeToCloudNode14Opts']: ValueTypes['DeployCodeToCloudNode14Opts'];
  ['AccountType']: ValueTypes['AccountType'];
  ['ChangeSubscriptionInput']: ValueTypes['ChangeSubscriptionInput'];
  ['ProjectsSortInput']: ValueTypes['ProjectsSortInput'];
  ['RFC3339Date']: ValueTypes['RFC3339Date'];
  ['PredictCheckoutInput']: ValueTypes['PredictCheckoutInput'];
  ['CustomerInput']: ValueTypes['CustomerInput'];
  ['DeployCodeToCloudURIKind']: ValueTypes['DeployCodeToCloudURIKind'];
  ['VatInput']: ValueTypes['VatInput'];
  ['Secret']: ValueTypes['Secret'];
  ['CloudDeploymentStatus']: ValueTypes['CloudDeploymentStatus'];
  ['Decimal']: ValueTypes['Decimal'];
  ['UpdateProject']: ValueTypes['UpdateProject'];
  ['CreateServiceAccountInput']: ValueTypes['CreateServiceAccountInput'];
  ['SortOrder']: ValueTypes['SortOrder'];
  ['AddProjectInput']: ValueTypes['AddProjectInput'];
  ['NewSource']: ValueTypes['NewSource'];
  ['RenameFileInput']: ValueTypes['RenameFileInput'];
  ['FileServerCredentials']: ValueTypes['FileServerCredentials'];
  ['CheckoutDataInput']: ValueTypes['CheckoutDataInput'];
  ['PaymentDate']: ValueTypes['PaymentDate'];
  ['SetCloudDeploymentConfigCorsInput']: ValueTypes['SetCloudDeploymentConfigCorsInput'];
  ['DeployCodeToCloudInput']: ValueTypes['DeployCodeToCloudInput'];
  ['SetCloudDeploymentConfigInput']: ValueTypes['SetCloudDeploymentConfigInput'];
  ['DeployCodeToCloudEnv']: ValueTypes['DeployCodeToCloudEnv'];
  ['MarketplaceProjectsSortInput']: ValueTypes['MarketplaceProjectsSortInput'];
  ['Role']: ValueTypes['Role'];
  ['NpmRegistryPackageInput']: ValueTypes['NpmRegistryPackageInput'];
};
