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

export const getEnv = (name: EnvKey): string => {
  const value = process.env[name];
  if (!value) {
    console.log(`🔥 DBG::Missing env ${name}`);
  }

  return value || '';
};
