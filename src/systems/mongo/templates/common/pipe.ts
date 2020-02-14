export const pipe = () => `
import { FieldResolveInput, FieldResolveOutput } from 'stucco-js';

export const handler = async (input: FieldResolveInput): Promise<FieldResolveOutput> => {
  return input.arguments;
};

`;
