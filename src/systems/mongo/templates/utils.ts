export const utils = `
import { ObjectID } from 'bson';
import { Cursor, Db } from 'mongodb';

type Populate<T> = {
  [P in keyof T]?: {
    by: keyof T[P];
    objects: T[P][];
    list?: boolean;
  };
};

export class Utils {
  public static mongoToGraphQL = <T = any>(object: any, populate?: Populate<T>): T => {
    const newO = {
      ...object,
    };
    if (populate) {
      Object.keys(populate).forEach((k) => {
        if (!newO[k]) {
          return;
        }
        const popO = populate[k as keyof typeof populate]!;
        newO[k] = popO.list
          ? popO.objects.filter((o) => o[popO.by] === newO[k])!
          : popO.objects.find((o) => o[popO.by] === newO[k])!;
      });
    }
    const { _id, id, ...props } = newO;
    if (!_id && !id) {
      return newO;
    }
    return {
      id: ((id || _id) as ObjectID).toHexString(),
      ...props,
    };
  };
  public static mapObjectsToGraphQLID = <T = any>(objects: any[], populate?: Populate<T>): T[] => {
    return objects.map((o) => Utils.mongoToGraphQL<T>(o, populate));
  };
  public static CursorToGraphQLArray = async <T = any>(cursor: Cursor<any>, populate?: Populate<T>): Promise<T[]> => {
    const list = await cursor.toArray();
    return Utils.mapObjectsToGraphQLID<T>(list, populate);
  };
  public static ManyToMany = async <T>({
    db,
    collection,
    objects,
    pk,
    propertyName,
  }: {
    db: Db;
    collection: string;
    objects: any[];
    pk: string;
    propertyName: string;
  }) =>
    await Utils.CursorToGraphQLArray<T>(
      await db.collection(collection).find({
        [pk]: {
          $in: objects.map((o) => o[propertyName]).reduce((a, b) => [...a, ...(b || [])], []),
        },
      }),
    );
  public static OneToMany = async <T>({
    db,
    collection,
    objects,
    pk,
    propertyName,
  }: {
    db: Db;
    collection: string;
    objects: any[];
    pk: string;
    propertyName: string;
  }) =>
    await Utils.CursorToGraphQLArray<T>(
      await db.collection(collection).find({
        [pk]: {
          $in: objects.map((o) => o[propertyName]),
        },
      }),
    );
}
type IsType<M, T, Z, L> = T extends M ? Z : L;
type IsScalar<T, Z, L> = IsType<string | boolean | number, T, Z, L>;
export type AsModel<T> = {
  readonly [P in keyof T]: T[P] extends Array<infer R> | undefined
    ? Array<AsModel<R>>
    : T[P] extends (...args: any) => any
    ? never
    : IsScalar<T, T, string>;
};

`;
