export const operations = () => {
  return {
    ts: `import { Db, FilterQuery, ObjectId } from 'mongodb';
    import * as collections from './collections';
    import { Models } from './models';
    
    export const Orm = <T extends keyof Models>(db: Db, collection: T) => {
      type Model = Models[T] & { _id: ObjectId };
      const c = collections[collection]
      const col = db.collection<Model>
      const create = db.collection<Model>(c).insertOne;
      const update = db.collection<Model>(c).updateOne;
      const one = db.collection<Model>(c).findOne;
      const oneOrThrow = async (filter: FilterQuery<Model>) => {
        const o = await db.collection<Model>(c).findOne(filter);
        if (!o) {
          throw new Error(\`Cannot find \${c} object for that params\`);
        }
        return o;
      };
      const list = (filter: FilterQuery<Model> = {}) => db.collection<Model>(c).find(filter).toArray();
      const remove = db.collection<Model>(c).deleteOne;
      const removeMany = db.collection<Model>(c).deleteMany;
      return {
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
