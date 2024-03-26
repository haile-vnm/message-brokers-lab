import { Offset } from 'rabbitmq-stream-js-client';
import getEnv from '../helpers/env';
import { client } from './utils';

client.then(client => {
  client.declareConsumer({
    stream: getEnv('RABBITMQ_STREAM_COLORS_NAME'),
    singleActive: true,
    offset: Offset.timestamp(new Date(Date.now() - 15 * 60 * 1000)), // from past 15 minutes
  }, message => {
    console.log(`${new Date().toUTCString()} received COLORS stream message:`, message.content.toString());
  })
})
