import fs from 'fs';
import yargs from 'yargs';
import { Resolvers, StuccoConfig } from './api';
import { fileURLToPath } from 'url';

export const exists = (fn: string) => fs
  .promises
  .stat(fn)
  .then(() => true)
  .catch((e) => {
    if (e.code === 'ENOENT') {
      return false;
    }
    throw e;
  })

export const integrate = async (stuccoJson: string, ...integrationFiles: string[]) => {
  const stuccoFileOut: StuccoConfig = await exists(stuccoJson)
    ? JSON.parse(fs.readFileSync(stuccoJson, 'utf-8'))
    : {};

  const res = await integrateWithConfig(stuccoFileOut, ...integrationFiles);
  fs.writeFileSync(stuccoJson, JSON.stringify(res, null, 4));
}

export const integrateWithConfig = async (stuccoConfig: StuccoConfig, ...integrationFiles: string[]) => {
  const integrations = await Promise.all(
    integrationFiles.map((integrationFile) =>
      import(integrationFile).then((mod) => 'default' in mod ? mod.default : mod),
    )
  ) as StuccoConfig[];
  return {
    ...stuccoConfig,
    resolvers: {
      ...stuccoConfig.resolvers,
      ...integrations.reduce((pv, cv) => ({
        ...pv,
        ...cv.resolvers,
      }), {} as Resolvers),
    },
  };
}

if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    const main = async () => {
      const argv = await yargs(process.argv.slice(2))
        .option('stucco-json', {
          alias: 's',
          type: 'string',
          description: 'stucco json path',
          default: './stucco.json',
        })
        .option('integration-file', {
          alias: 'i',
          type: 'string',
          description: 'integration file path',
          default: './src/gei/integrate.ts',
        }).argv
      await integrate(argv['stucco-json'], argv['integration-file']);
    }

    main().catch((e) => {
      console.error(e);
      process.exit(1);
    });
  }
}
