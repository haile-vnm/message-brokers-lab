import { client } from './utils';
import getEnv from '../helpers/env';

client.then((client) => {
  client.declareSuperStreamConsumer(
    {
      superStream: getEnv('RABBITMQ_STREAM_LOGS_NAME'),
      // offset: Offset.first(), singleActiveConsumer are default client library options and can not be changed now
    },
    (message) => {
      console.log(
        `${new Date().toISOString()} - Received Message from SUPER STREAM ${getEnv(
          'RABBITMQ_STREAM_LOGS_NAME'
        )}`,
        message.content.toString()
      ); // it's a Buffer
    }
  );
});
