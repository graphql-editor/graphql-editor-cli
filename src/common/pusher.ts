import { Config } from '@/Configuration/index.js';
import Pusher from 'pusher-js';

export const createPusher = () => {
  return new Pusher('ee58c700921c5e079a64', {
    cluster: 'us2',
    authEndpoint: `https://api.staging.project.graphqleditor.com/pusher/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${Config.getTokenOptions('token')}`,
      },
    },
  });
};
