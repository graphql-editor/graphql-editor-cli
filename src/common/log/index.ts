import chalk from 'chalk';

export const logger = (message: string, t: 'loading' | 'success' | 'info' | 'error') => {
  return ({
    loading: () => console.log(chalk.yellowBright(message)),
    success: () => console.log(chalk.greenBright(message)),
    error: () => console.log(chalk.red(message)),
    info: () => console.log(chalk.blueBright(message)),
  } as Record<typeof t, () => void>)[t]();
};
