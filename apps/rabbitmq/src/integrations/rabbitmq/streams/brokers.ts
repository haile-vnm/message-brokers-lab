import { getEnv } from '../../../helpers/env';
import { Client, connect  } from 'rabbitmq-stream-js-client';;

let client: Client;

export const init = async () => {
  client = await connect({
    hostname: getEnv('RABBITMQ_STREAM_HOSTNAME'),
    port: +getEnv('RABBITMQ_STREAM_PORT'),
    username: getEnv('RABBITMQ_STREAM_USERNAME'),
    password: getEnv('RABBITMQ_STREAM_PASSWORD'),
    vhost:  getEnv('RABBITMQ_STREAM_VHOST'),
  });
}

export const getStreamClient = () => {
  if (!client) {
    throw 'You have to initial the connection by calling the init() at the boot time first';
  }

  return client;
};
