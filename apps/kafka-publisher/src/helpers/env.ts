import { getEnv } from '@message-brokers-lab/env';

export default getEnv<
  'PORT' |
  'APP_ID' |
  'KAFKA_BROKERS' |
  'LOGS_TOPIC' |
  'COLORS_TOPIC'
>;
