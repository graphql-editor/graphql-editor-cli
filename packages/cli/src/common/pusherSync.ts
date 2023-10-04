import { Config } from '@/Configuration/index.js';
import { GRAPHQL_HOST } from '@/Editor';
import Pusher from 'pusher-js';

export const pusherSync = ({
  namespace,
  project,
}: {
  namespace: string;
  project: string;
}) => {
  const pusher = new Pusher('ee58c700921c5e079a64', {
    cluster: 'us2',
    authEndpoint: `${GRAPHQL_HOST}/pusher/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${Config.getTokenOptions('token')}`,
      },
    },
  });

  pusher.connection.bind('error', (err: any) => {
    console.log(JSON.stringify(err, null, 4));
  });
  pusher.connection.bind('connected', function () {
    console.log('CONNECTED');
  });
  pusher.connection.bind('disconnected', function () {
    console.log('DISCONNECTED');
  });
  const ch = pusher.subscribe(`presence-${namespace}@${project}`);
  ch.bind('pusher:subscription_error', (e: any) => {
    console.log('FAILED');
    console.log(e);
  });
  ch.bind('pusher:subscription_succeeded', (e: any) => {
    console.log('SUCCEEDED');
  });
  return {
    ch,
    pusher,
  };
};
