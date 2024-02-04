const getArgs = (): Record<string, string> => {
  return (process.argv[2] || '')
    .split(' ')
    .map(item => item.split('='))
    .reduce(
      (pre, [key, value]) => Object.assign(pre, { [key]: value }),
      {}
    );
}

export const argv = getArgs();
