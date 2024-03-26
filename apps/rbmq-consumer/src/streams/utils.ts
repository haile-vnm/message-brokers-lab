import { connect } from 'rabbitmq-stream-js-client';
import getEnv from '../helpers/env';

export const client = connect({
  hostname: getEnv('RABBITMQ_STREAM_HOSTNAME'),
  port: +getEnv('RABBITMQ_STREAM_PORT'),
  username: getEnv('RABBITMQ_STREAM_USERNAME'),
  password: getEnv('RABBITMQ_STREAM_PASSWORD'),
  vhost: getEnv('RABBITMQ_STREAM_VHOST'),
});
