import { getEnv } from '@message-brokers-lab/env';

export default getEnv<
  'PORT' |
  'RABBITMQ_ENDPOINT' |
  'X_LOGS' |
  'X_COLORS' |
  'X_ORGANISMS' |
  'Q_BLACK' |
  'Q_BROWN' |
  'Q_APPLES' |
  'Q_ANIMALS' |
  'Q_EVERYTHING' |

  'RABBITMQ_STREAM_HOSTNAME' |
  'RABBITMQ_STREAM_PORT' |
  'RABBITMQ_STREAM_USERNAME' |
  'RABBITMQ_STREAM_PASSWORD' |
  'RABBITMQ_STREAM_VHOST' |
  'RABBITMQ_STREAM_LOGS_NAME'
>;
