export const operations = () => {
  return {
    ts: `import { Db } from 'mongodb';
import * as collections from './collections';

type PartialNull<T> = { [P in keyof T]?: T[P] | undefined | null };

export const Orm = <T extends keyof Models>(db: Db, collection: T) => {
    const c = collections[collection];
    const create = (props: Partial<Models[T]>) => {
      return db.collection(c).insertOne(props);
    };
    const update = (by: any, props: PartialNull<Models[T]>) => {
      return db.collection(c).updateOne(
        by,
        {
          $set: props,
        },
        {
          upsert: false,
        },
      );
    };
    const one = (filter: any) => {
      return db.collection(c).findOne(filter) as Promise<Models[T] | undefined>;
    };
    const oneOrThrow = async (filter: any) => {
      const o = await db.collection(c).findOne(filter);
      if (!o) {
        throw new Error(\`Cannot find \${c} object for that params\`);
      }
      return o as Promise<Models[T]>;
    };
    const list = (filter: any = {}) => {
      return db
        .collection(c)
        .find(filter)
        .toArray() as Promise<Models[T][]>;
    };
    const remove = (filter: any) => {
      return db.collection(c).deleteOne(filter);
    };
    const removeMany = (filter: any) => {
      return db.collection(c).deleteMany(filter);
    };
    return {
      create,
      update,
      one,
      oneOrThrow,
      list,
      remove,
      removeMany,
    };
  };
  `,
  };
};
