import chalk from 'chalk';

export const logger = (
  message: string,
  t: 'loading' | 'success' | 'info' | 'error',
) => {
  return (
    {
      loading: () => console.log('\n', chalk.magentaBright(message)),
      success: () => console.log('\n', chalk.greenBright(message)),
      error: () => console.log('\n', chalk.red(message)),
      info: () => console.log('\n', chalk.yellowBright(message)),
    } as Record<typeof t, () => void>
  )[t]();
};
