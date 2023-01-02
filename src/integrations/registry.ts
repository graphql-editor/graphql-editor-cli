import { FieldResolveInput } from 'stucco-js';
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
    handler: (args: unknown, source: unknown, input: FieldResolveInput) => unknown;
};

export type IntegrationSpecificationInputType = {
  [fieldName: string]: IntegrationSpecificationInputField;
}

export type IntegrationSpecificationInput = {
    [typeName: string]: IntegrationSpecificationInputType;
};

export type IntegrationSpecificationField = Omit<IntegrationSpecificationInputField, 'handler'> & {
};
export let integrations: Record<string, IntegrationSpecificationInput> = {};
