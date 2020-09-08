export const operations = () => {
  return {
    ts: `
import { Db } from 'mongodb';
import * as collections from './collections';

export const Orm = <T>(db: Db, collection: keyof typeof collections) => {
    const c = collections[collection]
    const create = (props:Partial<T>) => {
        return db.collection(c).insertOne(props)
    }
    const update = (by:any, props:Partial<T>) => {
        return db.collection(c).updateOne(by,{
            $set: props
        },{
            upsert: false
        })
    }
    const one = (filter:any) => {
        return db.collection(c).findOne(filter) as Promise<T>
    }
    const list = (filter:any) => {
        return db.collection(c).find(filter).toArray() as Promise<T[]>
    }
    const remove = (filter:any) => {
        return db.collection(c).deleteOne(filter)
    }
    const removeMany = (filter:any) => {
        return db.collection(c).deleteMany(filter)
    }
    return {
        create,
        update,
        one,
        list,
        remove,
        removeMany
    }
}
    `,
  };
};
