import crypto from 'crypto';
import qs from 'qs';
import open from 'open';
import express from 'express';
import fetch from 'node-fetch';
import { Config, TokenConf } from '@/Configuration/index.js';
import { logger } from '@/common/log/index.js';
import { GRAPHQL_HOST } from '@/Editor';

function base64URLEncode(str: Buffer) {
  return str
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
function sha256(buffer: Buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

/**
 * Date delta in seconds
 */
function dateDelta(date1: Date, date2: Date) {
  const d1 = date1.getTime();
  const d2 = date2.getTime();
  const secDiff = Math.floor((d2 - d1) / 1000);
  const hoursDiff = secDiff / 3600.0;
  return hoursDiff;
}
/**
 * Provides connection to GraphQL Editor
 */
export class Auth {
  public static logout = () => {
    Config.logout();
    logger('Successfully logged out', 'success');
  };
  public static login = async (): Promise<TokenConf> =>
    new Promise(async (resolve, reject) => {
      const currentToken = Config.getTokenOptions('token');
      if (currentToken) {
        const lastSet = Config.getTokenOptions('tokenLastSet');
        if (lastSet) {
          const nowDate = new Date();
          const beforeDate = new Date(lastSet);
          const delta = dateDelta(beforeDate, nowDate);
          if (delta <= 24) {
            resolve({
              token: currentToken,
              tokenLastSet: lastSet,
            });
            return;
          }
        }
      }
      if (process.env.GRAPHQL_EDITOR_TOKEN) {
        const response = await fetch(`${GRAPHQL_HOST}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: process.env.GRAPHQL_EDITOR_TOKEN,
            client_id: 'pNh9rJhjO2qnD1gAlfKtQFnlxN88LCil',
            grant_type: 'refresh_token',
          }),
        });
        const result = (await response.json()) as {
          access_token: string;
          id_token: string;
          scope: string;
          expires_in: number;
          token_type: string;
        };
        resolve({
          token: result.access_token,
          tokenLastSet: new Date().toISOString(),
        });
        return;
      }
      const code_verifier = base64URLEncode(crypto.randomBytes(32));
      const code_challenge = base64URLEncode(
        sha256(Buffer.from(code_verifier)),
      );
      const url = `https://auth.graphqleditor.com`;
      const params = qs.stringify({
        audience: 'https://graphqleditor.com/',
        client_id: 'yKOZj61N2Bih0AsOIn8qpI1tm9d7TBKM',
        redirect_uri: 'http://localhost:1571/',
        scope: 'openid profile email',
        code_challenge,
        code_challenge_method: 'S256',
        response_type: 'code',
      });
      const loginUrl = `${url}/authorize?${params}`;
      logger(
        `Please login inside browser. If you were not redirected please open\n`,
        'loading',
      );
      logger(`${loginUrl}\n`, 'info');
      await open(`${url}/authorize?${params}`);
      const app = express();
      const server = app.listen(1571);
      app.get('/', async (req, res) => {
        const options = {
          method: 'POST',
          url: 'https://auth.graphqleditor.com/oauth/token',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          form: {
            grant_type: 'authorization_code',
            client_id: 'yKOZj61N2Bih0AsOIn8qpI1tm9d7TBKM',
            code_verifier,
            code: req.query.code,
            redirect_uri: 'http://localhost:1571/',
          },
        };
        const rawResponse = await fetch(options.url, {
          method: options.method,
          headers: options.headers,
          body: qs.stringify(options.form),
        });
        const jsonResponse = (await rawResponse.json()) as {
          access_token?: string;
        };
        res.send(
          `You are logged in with GraphQL Editor account. You can go back to CLI`,
        );
        if (jsonResponse.access_token) {
          server.close();
          logger(
            `You have successfully logged in. Your auth config is stored at "${Config.getAuthPath()}""`,
            'success',
          );
          resolve({
            token: jsonResponse.access_token,
            tokenLastSet: new Date().toISOString(),
          });
        } else {
          reject('Cannot get access token');
        }
      });
      return;
    });
}
