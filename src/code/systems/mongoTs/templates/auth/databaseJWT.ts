export const databaseJWT = `import { DB } from './mongo';
import { FieldResolveInput } from 'stucco-js';
import { verify } from 'jsonwebtoken';

export const AdminCollection = 'AdminCollection';
export const UserCollection = 'UserCollection';

const decodeToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret not set');
  }
  const verifiedToken = verify(token, process.env.JWT_SECRET);
  if (typeof verifiedToken !== 'object') {
    throw new Error('Token is not an object');
  }
  if (!('username' in verifiedToken)) {
    throw new Error('Invalid token');
  }
  return verifiedToken as { username: string };
};

export const isAdmin = async (username: string): Promise<boolean> => {
  const db = await DB();
  const col = await db.collection(AdminCollection);
  const adminExists = await col.findOne({
    username,
  });
  console.log(JSON.stringify({ adminExists: !!adminExists }, null, 4));
  return !!adminExists;
};

export const getUser = async (token: string): Promise<{ username: string } | undefined> => {
  const db = await DB();
  const col = await db.collection(UserCollection);
  const { username } = decodeToken(token);
  const user = await col.findOne({
    username,
  });
  if (!user) {
    return;
  }
  return {
    username: user.username,
  };
};

export const getUserFromHandlerInput = async (input: FieldResolveInput): Promise<{ username: string } | undefined> => {
  if (!input.protocol?.headers) {
    return;
  }
  const { Authorization }: { Authorization?: string[] } = input.protocol.headers;
  if (!Authorization) {
    return;
  }
  const findUser = await getUser(Authorization[0]);
  if (!findUser) {
    return;
  }
  return findUser;
};

export const getUserFromHandlerInputOrThrow = async (input: FieldResolveInput): Promise<{ username: string }> => {
  const user = await getUserFromHandlerInput(input);
  if (!user) {
    throw new Error('You are not logged in');
  }
  return user;
};

export const isAdminOrThrow = async (input: FieldResolveInput): Promise<void> => {
  const user = await getUserFromHandlerInputOrThrow(input);
  const admin = isAdmin(user.username);
  if (!admin) {
    throw new Error('Only administrator of the system can access this endpoint');
  }
};

const genRandomString = (length: number) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);

const sha512 = (password: string, salt: string) => {
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const passwordHash = hash.digest('hex');
  return {
    salt,
    passwordHash,
  };
};

export const saltHashPassword = (password: string) => {
  const salt = genRandomString(16); /** Gives us salt of length 16 */
  return sha512(password, salt);
};

export const comparePasswords = ({ password, hash, salt }: { password: string; hash: string; salt: string }) => {
  return hash === sha512(password, salt).passwordHash;
};
`;
