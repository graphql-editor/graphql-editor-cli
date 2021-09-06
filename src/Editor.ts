import { Chain, DeployCodeToCloudEnv, DeployCodeToCloudURIKind, GraphQLTypes, ValueTypes } from './zeus';
import { Config } from './Configuration';
import fetch from 'node-fetch';

export interface FileArray {
  name: string;
  content: Buffer;
  type: string;
}

const jolt = () => {
  const token = Config.getTokenOptions('token');
  const headers: Record<string, string> = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
  return Chain('https://api.staging.project.graphqleditor.com/graphql', {
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
                inCloud: true,
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
    const namespace = Query.getNamespace;
    if (!namespace) {
      throw new Error(`Namespace "${accountName}" does not exist.`);
    }
    return namespace.projects?.projects || [];
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
              id: true,
              description: true,
              mocked: true,
              inCloud: true,
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
    const project = Query.getNamespace?.project;
    if (!project) {
      throw new Error(`Project "${projectName}" does not exist in "${accountName}" namespace`);
    }
    return project;
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

    const schemaSource = p.sources?.sources?.find((s) => s.filename === `schema-${resolve.version}.graphql`);

    if (!schemaSource?.getUrl) {
      throw new Error(`Project "${resolve.project}" does not have a version "${resolve.version}"`);
    }

    const schema = await Editor.getSource(schemaSource.getUrl);
    return schema;
  };

  public static removeFiles = async (teamId: string, projectId: string, files: string[]) => {
    const response = await jolt().mutation({
      team: [
        {
          id: teamId,
        },
        {
          project: [
            {
              id: projectId,
            },
            {
              removeSources: [
                {
                  files,
                },
                true,
              ],
            },
          ],
        },
      ],
    });

    return response.team!.project?.removeSources;
  };

  public static renameFiles = async (teamId: string, projectId: string, files: Array<{ src: string; dst: string }>) => {
    const response = await jolt().mutation({
      team: [
        {
          id: teamId,
        },
        {
          project: [
            {
              id: projectId,
            },
            {
              renameSources: [
                {
                  files,
                },
                true,
              ],
            },
          ],
        },
      ],
    });
    return response.team!.project?.renameSources;
  };
  public static saveFilesToCloud = async (projectId: string, fileArray: FileArray[]) => {
    const sources: Array<{
      file: Buffer;
      source: GraphQLTypes['NewSource'];
    }> = fileArray.map((f, i) => ({
      file: fileArray[i].content,
      source: {
        filename: f.name,
        contentLength: fileArray[i].content.byteLength,
        contentType: f.type,
      },
    }));

    const response = await jolt().mutation({
      updateSources: [
        {
          project: projectId,
          sources: sources.map((s) => s.source),
        },
        {
          filename: true,
          headers: {
            key: true,
            value: true,
          },
          putUrl: true,
        },
      ],
    });

    if (!response.updateSources) {
      throw new Error(`Cannot update sources, try logging in again`);
    }
    return Promise.all(
      response.updateSources
        .map((s) => s!)
        .map(({ putUrl, headers, filename }) => {
          if (!headers) {
            throw new Error(`Headers required for "${putUrl}" `);
          }
          return fetch(putUrl, {
            method: 'PUT',
            headers: headers.reduce<Record<string, any>>((a, b) => {
              a[b.key] = b.value;
              return a;
            }, {}),
            body: sources.find((s) => s.source.filename! === filename)!.file,
          });
        }),
    );
  };
  public static deployProjectToCloud = async (projectId: string) => {
    const response = await jolt().mutation({
      createCloudDeployment: [{ id: projectId }, true],
    });
    return response.createCloudDeployment;
  };
  public static deployRepoToSharedWorker = async (
    projectId: string,
    zipURI: string,
    opts: Pick<ValueTypes['DeployCodeToCloudInput'], 'node14Opts' | 'secrets'>,
  ) => {
    const response = await jolt().mutation({
      deployCodeToCloud: [
        {
          id: projectId,
          opts: {
            codeURI: zipURI,
            env: DeployCodeToCloudEnv.NODE14,
            kind: DeployCodeToCloudURIKind.ZIP,
            ...opts,
          },
        },
        true,
      ],
    });
    const deploymentId = response.deployCodeToCloud;
    if (!deploymentId) {
      throw new Error('Cannot deploy project');
    }
    return deploymentId;
  };
  public static showDeploymentLogs = async (streamID: string) => {
    const response = await jolt().subscription({
      watchLogs: [{ streamID }, true],
    });
    return response;
  };
}
