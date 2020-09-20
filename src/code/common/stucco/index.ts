import fs from 'fs';
import path from 'path';
export const addStucco = ({
  basePath,
  stuccoResolverName,
  resolverLibPath,
}: {
  basePath: string;
  stuccoResolverName: string;
  resolverLibPath: string;
}) => {
  const stuccoPath = path.join(basePath, 'stucco.json');
  const stuccoFile = fs.existsSync(stuccoPath) ? JSON.parse(fs.readFileSync(stuccoPath).toString()) : { resolvers: {} };
  const stuccoFileContent = {
    ...stuccoFile,
    resolvers: {
      ...stuccoFile.resolvers,
    },
  };
  stuccoFileContent.resolvers[stuccoResolverName] = {
    resolve: {
      name: resolverLibPath,
    },
  };
  fs.writeFileSync(stuccoPath, JSON.stringify(stuccoFileContent, null, 4));
};
