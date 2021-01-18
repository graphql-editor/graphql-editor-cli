export const operations = () => {
  return {
    ts: `import {
  Db,
  FilterQuery,
  ObjectId,
  OptionalId,
  CollectionInsertOneOptions,
  UpdateOneOptions,
  MatchKeysAndValues,
} from 'mongodb';
import * as collections from './collections';
import { Models } from './models';

export const Orm = <T extends keyof Models>(db: Db, collection: T) => {
  type Model = Models[T] & { _id: ObjectId };
  const c = collections[collection];
  const col = db.collection<Model>(c);
  const create = (docs: OptionalId<Model>, options?: CollectionInsertOneOptions) =>
    db.collection<Model>(c).insertOne(docs, options);
  const update = (filter: FilterQuery<Model>, update: MatchKeysAndValues<Model>, options?: UpdateOneOptions) =>
    db.collection<Model>(c).updateOne(filter, { $set: update }, options);
  const one = (filter: FilterQuery<Model>) => db.collection<Model>(c).findOne(filter);
  const oneOrThrow = async (filter: FilterQuery<Model>) => {
    const o = await db.collection<Model>(c).findOne(filter);
    if (!o) {
      throw new Error(\`Cannot find \${c} object for that params\`);
    }
    return o;
  };
  const list = (filter: FilterQuery<Model> = {}) =>
    db
      .collection<Model>(c)
      .find(filter)
      .toArray();
  const remove = (filter: FilterQuery<Model> = {}) => db.collection<Model>(c).deleteOne(filter);
  const removeMany = (filter: FilterQuery<Model> = {}) => db.collection<Model>(c).deleteMany(filter);
  return {
    col,
    create,
    update,
    one,
    oneOrThrow,
    list,
    remove,
    removeMany,
  };
};`,
  };
};
