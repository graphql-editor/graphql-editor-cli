export const db = ({ name }: { name: string }) => ({
  ts: `import { MongoClient } from 'mongodb';

let mongoConnection: MongoClient | undefined = undefined;
function mongo(): Promise<MongoClient> {
  if (!mongoConnection) {
    let mongoUrl = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/';
    return new Promise((resolve, reject) =>
      MongoClient.connect(mongoUrl, (err, db) => {
        if (err) {
          reject(err);
          return;
        }
        mongoConnection = db;
        resolve(db);
      }),
    );
  }
  return Promise.resolve(mongoConnection);
}

export function DB() {
  return mongo().then((db) => db.db('${name}'));
}
`,
  js: `import { MongoClient } from 'mongodb';

let mongoConnection= undefined;
function mongo() {
  if (!mongoConnection) {
    let mongoUrl = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/';
    return new Promise((resolve, reject) =>
      MongoClient.connect(mongoUrl, (err, db) => {
        if (err) {
          reject(err);
          return;
        }
        mongoConnection = db;
        resolve(db);
      }),
    );
  }
  return Promise.resolve(mongoConnection);
}

export function DB() {
  return mongo().then((db) => db.db('${name}'));
}`,
});
