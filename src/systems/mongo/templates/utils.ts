export const utils = `
import { ObjectID } from "bson";
import { Cursor, Db } from "mongodb";

export class Utils {
  public static mongoToGraphQL = <T = any>(object: any): T => {
    const { _id, id, ...props } = object;
    if (!_id && !id) {
      return object;
    }
    return {
      id: ((id || _id) as ObjectID).toHexString(),
      ...props,
    };
  }
  public static mapObjectsToGraphQLID = <T = any>(objects: any[]): T[] => {
    return objects.map((o) => Utils.mongoToGraphQL<T>(o));
  }
  public static CursorToGraphQLArray = async <T = any>(
    cursor: Cursor<any>,
  ): Promise<T[]> => {
    const list = await cursor.toArray();
    return Utils.mapObjectsToGraphQLID<T>(list);
  }
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
          $in: objects
            .map((o) => o[propertyName])
            .reduce((a, b) => [...a, ...(b || [])], []),
        },
      }),
    )
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
    )
}
type IsType<M, T, Z, L> = T extends M ? Z : L;
type IsScalar<T, Z, L> = IsType<string | boolean | number, T, Z, L>;
export type AsModel<T> = {
  readonly [P in keyof T]: T[P] extends (Array<infer R> | undefined)
    ? Array<AsModel<R>>
    : T[P] extends (...args: any) => any
    ? never
    : IsScalar<T, T, string>;
};
`;
