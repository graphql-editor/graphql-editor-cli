import { basicResolver, BasicResolverProps } from '@/code/systems/common/functions';

export interface DbResolverProps extends BasicResolverProps {
  modelName: string;
}
export const dbResolver = ({ body, imports, modelName, ...props }: DbResolverProps) =>
  basicResolver({
    ...props,
    body: `
  const db = await DB();
  ${body}
    `,
    imports: `
import { DB } from "../db/mongo";
import { Orm } from "../db/orm";
import { ${modelName}${props.source ? `, ${props.source}` : ''} } from "../db/models";`,
  });
