import { Config } from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';
import {
  CLOUD_FOLDERS,
  PACKAGE_JSON_FILE,
  STUCCO_FILE,
} from '@/gshared/constants/index.js';
import path from 'path';
import { getS3File, writeInitialFiles } from '@/common/liveFiles.js';
import { GRAPHQL_EDITOR_URL } from '@/common/const.js';
import { readFileSync, writeFileSync } from 'fs';
import type { StuccoConfig } from '@/common/types';
import ora from 'ora';
import { installSync } from 'pkg-install';

export const CommandInstall = async ({
  namespace,
  project,
}: {
  namespace?: string;
  project?: string;
}) => {
  const resolve = await Config.configure({ namespace, project }, [
    'namespace',
    'project',
  ]);
  const p = await Editor.fetchProject({
    accountName: resolve.namespace,
    projectName: resolve.project,
  });

  const stuccoFile = p.sources?.sources?.find(
    (s) => s.filename === CLOUD_FOLDERS['microserviceJs'] + '/' + STUCCO_FILE,
  );
  if (!stuccoFile) {
    throw new Error(
      `No integrations file found in your GraphQL Editor Project. Please check ${GRAPHQL_EDITOR_URL}/${p.endpoint?.uri}/?visibleMenu=microservices`,
    );
  }
  const downloading = ora('Getting the stucco.json file from project').start();
  const { fileBuffer } = await getS3File(stuccoFile);
  if (!fileBuffer) {
    throw new Error(
      `No integrations file found in your GraphQL Editor Project. Please check ${GRAPHQL_EDITOR_URL}/${p.endpoint?.uri}/?visibleMenu=microservices`,
    );
  }
  downloading.succeed();
  const merging = ora('Merging with local stucco file').start();
  const currentStucco = readFileSync(
    path.join(process.cwd(), STUCCO_FILE),
    'utf-8',
  );
  const loadStucco: StuccoConfig = JSON.parse(currentStucco);
  const localStucco: StuccoConfig = JSON.parse(fileBuffer);
  const updatedStucco: StuccoConfig = {
    ...localStucco,
    resolvers: {
      ...localStucco.resolvers,
      ...loadStucco.resolvers,
    },
  };

  writeFileSync(
    path.join(process.cwd(), STUCCO_FILE),
    JSON.stringify(updatedStucco, null, 4),
  );
  merging.succeed();
  const checking = ora('Checking no-code packages for installation').start();

  const packages = extractNpmPackages(updatedStucco);
  const currentPackageJSON = readFileSync(
    path.join(process.cwd(), PACKAGE_JSON_FILE),
    'utf-8',
  );
  if (!currentPackageJSON) {
    throw new Error('No package.json file found.');
  }
  const parsedPackageJSON: { dependencies: Record<string, string> } =
    JSON.parse(currentPackageJSON);
  let packagesToInstall: Array<{ package: string; version: string }> = [];
  packages.forEach((p) => {
    if (!parsedPackageJSON.dependencies[p.package]?.match(p.version)) {
      packagesToInstall.push(p);
    }
  });
  checking.succeed();
  if (packagesToInstall.length > 0) {
    const installing = ora('Installing packages').start();
    installSync(packagesToInstall.map((p) => `${p.package}@${p.version}`));
    installing.succeed();
  }
  return;
};
const filterBoolean = <T>(o: T | undefined): o is T => Boolean(o);

const extractNpmPackages = (c: StuccoConfig) => {
  const packages = Object.entries(c.resolvers)
    .map(([k, v]) => {
      if (v.noCode) {
        return v.noCode;
      }
    })
    .filter(filterBoolean);
  return packages.filter(
    (p, i) => i === packages.findIndex((pp) => pp.package === p.package),
  );
};
