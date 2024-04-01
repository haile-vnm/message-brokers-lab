import { Offset } from 'rabbitmq-stream-js-client';
import getEnv from '../helpers/env';
import { client } from './utils';

client.then((client) => {
  client.declareConsumer(
    {
      stream: getEnv('RABBITMQ_STREAM_COLORS_NAME'),
      singleActive: true,
      consumerRef: 'log-color-event',
      offset: Offset.timestamp(new Date(Date.now() - 2 * 60 * 1000)), // only read messages from past 2 minutes
    },
    (message) => {
      console.log(
        `${new Date().toUTCString()} received COLORS stream message:`,
        message.content.toString()
      );
    }
  );
});
