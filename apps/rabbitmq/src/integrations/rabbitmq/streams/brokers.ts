import { getEnv } from '../../../helpers/env';
import { Client, connect  } from 'rabbitmq-stream-js-client';;

let client: Client;

const intializeResources = async () => {
  await getStreamClient().createSuperStream(
    { streamName: getEnv('RABBITMQ_STREAM_LOGS_NAME'), arguments: { 'initial-cluster-size': 2 }  },
    undefined, // binding keys
    3 // partions
  );

  await getStreamClient().createStream({
    stream: getEnv('RABBITMQ_STREAM_COLORS_NAME'), arguments: { 'initial-cluster-size': 3, 'max-age': '1d' }
  });
  // Waiting 400ms for partitions to be created
  await new Promise(r => {
    setTimeout(() => {
      r(true);
    }, 400);
  });
};

export const init = async () => {
  client = await connect({
    hostname: getEnv('RABBITMQ_STREAM_HOSTNAME'),
    port: +getEnv('RABBITMQ_STREAM_PORT'),
    username: getEnv('RABBITMQ_STREAM_USERNAME'),
    password: getEnv('RABBITMQ_STREAM_PASSWORD'),
    vhost: getEnv('RABBITMQ_STREAM_VHOST'),
  });

  intializeResources();
};

export const getStreamClient = () => {
  if (!client) {
    throw 'You have to initial the connection by calling the init() at the boot time first';
  }

  return client;
};
