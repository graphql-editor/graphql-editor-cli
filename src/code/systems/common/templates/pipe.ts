import { ParserField } from 'graphql-zeus';
import { basicResolver } from '../functions';

export const pipe = ({ field, resolverParent }: { resolverParent: string; field: ParserField }) =>
  `export const handler = () = ({})`;
