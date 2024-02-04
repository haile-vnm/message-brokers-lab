import { getEnv as getEnvFunc } from '@message-brokers-lab/env';

type EnvKey =
  'PORT' |
  'RABBITMQ_ENDPOINT' |
  'X_LOGS' |
  'X_COLORS' |
  'X_ORGANISMS' |
  'Q_BLACK' |
  'Q_BROWN' |
  'Q_APPLES' |
  'Q_ANIMALS' |
  'Q_EVERYTHING';

export const getEnv = getEnvFunc<EnvKey>;
