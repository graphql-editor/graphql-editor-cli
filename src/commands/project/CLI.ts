
import { integrate } from '@/integrations/integrate.js';
import { CommandModule } from 'yargs';
import { logger } from '@/common/log/index.js';
import fs from 'fs';
import { integrationMainImport, StuccoConfig } from '@/integrations/api.js';

export default {
  command: 'project <command>',
  describe: 'Project development commands',
  builder: (yargs) => {
    return yargs
      .command(
        'update',
        'Update stucco.json after integration changes',
        () => {},
        async () => {
          const { integrations = [] } = JSON.parse(
            await fs.promises.readFile('./stucco.json').then((b) => b.toString()),
          ) as StuccoConfig;
          const integrationImports = await Promise.all(integrations.map(integrationMainImport));
          await integrate('./stucco.json', ...integrationImports);
          logger(
            'Updated stucco.json',
            'success',
          );
        },
      )
  },
} as CommandModule;
