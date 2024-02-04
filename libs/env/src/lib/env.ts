export const getEnv = <T = string>(name: T): string => {
  const value = process.env[String(name)];
  if (!value) {
    console.log(`🔥 DBG::Missing env ${name}`);
  }

  return value || '';
};
