import { basicResolver, BasicResolverProps } from '@/code/systems/common/functions';

export interface DbResolverProps extends BasicResolverProps {}
export const dbResolver = ({ body, imports, ...props }: DbResolverProps) =>
  basicResolver({
    ...props,
    body: `
  const db = await DB();
  ${body}
    `,
    imports: `
import { DB } from "../db/mongo";
import { Orm } from "../db/orm";`,
  });
