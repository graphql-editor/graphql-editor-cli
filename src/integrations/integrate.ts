import fs from 'fs';
import yargs from 'yargs';
import { IntegrationSpecification } from './api';

const integrate = async (stuccoJson: string, integrationFile: string) => {
  const objectOut = await import(integrationFile).then((mod) => 'default' in mod ? mod.default : mod) as IntegrationSpecification;
  const stuccoFileOut = fs.existsSync(stuccoJson)
    ? JSON.parse(fs.readFileSync(stuccoJson, 'utf-8'))
    : {};
  const integrationResolvers = Object.entries(objectOut || {}).reduce(
    (a, b) => ({
      ...a,
      [b[0]]: b[1],
    }),
    {},
  );

  const result = {
    ...stuccoFileOut,
    resolvers: {
      ...stuccoFileOut.resolvers,
      ...integrationResolvers,
    },
  };

  fs.writeFileSync(stuccoJson, JSON.stringify(result, null, 4));
}

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
