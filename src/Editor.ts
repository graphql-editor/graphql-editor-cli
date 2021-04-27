import { Chain } from './zeus';
import { Config } from './Configuration';
import fetch from 'node-fetch';

const jolt = () => {
  const token = Config.getTokenOptions('token');
  const headers: Record<string, string> = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
  return Chain('https://project-api.graphqleditor.com/graphql', {
    headers,
  });
};

/**
 * Provides connection to GraphQL Editor
 */
export class Editor {
  public static nameSpaceExists = async (accountName: string) => {
    const Query = await jolt().query({
      getNamespace: [
        { slug: accountName },
        {
          slug: true,
        },
      ],
    });
    return !!Query.getNamespace;
  };
  public static getSource = async (url: string) => {
    return (await fetch(url)).text();
  };
  public static fetchProjects = async (accountName: string) => {
    const Query = await jolt().query({
      getNamespace: [
        { slug: accountName },
        {
          projects: [
            {},
            {
              projects: {
                name: true,
                description: true,
                mocked: true,
                sources: [
                  {},
                  {
                    sources: {
                      filename: true,
                      getUrl: true,
                    },
                  },
                ],
                endpoint: {
                  uri: true,
                },
              },
            },
          ],
        },
      ],
    });
    return Query.getNamespace!.projects!.projects!;
  };
  public static fetchProject = async ({ accountName, projectName }: { accountName: string; projectName: string }) => {
    const Query = await jolt().query({
      getNamespace: [
        { slug: accountName },
        {
          project: [
            { name: projectName },
            {
              name: true,
              description: true,
              mocked: true,
              sources: [
                {},
                {
                  sources: {
                    filename: true,
                    getUrl: true,
                  },
                },
              ],
              endpoint: {
                uri: true,
              },
            },
          ],
        },
      ],
    });
    return Query.getNamespace?.project;
  };
  public static getFakerURL = (endpointUri: string) => `https://faker.graphqleditor.com/${endpointUri}/graphql`;
  public static getCompiledSchema = async ({
    namespace,
    project,
    version,
  }: {
    namespace: string;
    project: string;
    version: string;
  }) => {
    const p = await Editor.fetchProject({
      accountName: namespace,
      projectName: project,
    });
    if (!p) {
      throw new Error("Project doesn't exist");
    }
    const graphqlURL = p.sources!.sources!.find((s) => s.filename === `schema-${version}.graphql`)!;
    const libraryURL = p.sources!.sources!.find((s) => s.filename === `stitch-${version}.graphql`)!;
    const [graphqlFile, libraryFile] = await Promise.all([
      (await fetch(graphqlURL.getUrl!)).text(),
      libraryURL ? (await fetch(libraryURL.getUrl!)).text() : new Promise<string>((resolve) => resolve('')),
    ]);
    return [libraryFile, graphqlFile].join('\n\n');
  };

  public static getSchema = async (resolve: { namespace: string; project: string; version: string }) => {
    const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
    if (!p) {
      throw new Error(`Project "${resolve.project}" does not exist in "${resolve.namespace}" namespace`);
    }

    const schemaSource = p.sources?.sources?.find((s) => s.filename === `schema-${resolve.version}.graphql`);

    if (!schemaSource?.getUrl) {
      throw new Error(`Project "${resolve.project}" does not have a version "${resolve.version}"`);
    }

    const schema = await Editor.getSource(schemaSource.getUrl);
    return schema;
  };
}
