import { Chain, GraphQLTypes, HOST, ValueTypes } from '@/zeus/index.js';
import { Config } from '@/Configuration/index.js';
import fetch from 'node-fetch';
import { COMMON_FILES } from '@/gshared/constants/index.js';
import ora from 'ora';
import { mergeSDLs } from 'graphql-js-tree';

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
  return Chain(HOST, {
    headers,
  });
};

/**
 * Provides connection to GraphQL Editor
 */
export class Editor {
  public static nameSpaceExists = async (accountName: string) => {
    const Query = await jolt()('query')({
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
  public static fetchWorkspaces = async () => {
    const Query = await jolt()('query')({
      myTeams: [
        { limit: 100 },
        { teams: { namespace: { slug: true }, name: true } },
      ],
    });
    return Query.myTeams?.teams;
  };
  public static fetchProjects = async (accountName: string) => {
    const Query = await jolt()('query')({
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
    const namespace = Query.getNamespace;
    if (!namespace) {
      throw new Error(`Namespace "${accountName}" does not exist.`);
    }
    return namespace.projects?.projects || [];
  };
  public static fetchProject = async ({
    accountName,
    projectName,
  }: {
    accountName: string;
    projectName: string;
  }) => {
    const checking = ora(`Downloading project ${accountName}/${projectName}`);
    const Query = await jolt()('query')({
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
              team: {
                id: true,
              },
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
      checking.fail();
      throw new Error(
        `Project "${projectName}" does not exist in "${accountName}" namespace. Consider changing project in config`,
      );
    }
    checking.succeed();
    return project;
  };
  public static getFakerURL = (endpointUri: string) =>
    `https://faker.graphqleditor.com/${endpointUri}/graphql`;
  public static getCompiledSchema = async ({
    namespace,
    project,
    projectVersion,
  }: {
    namespace: string;
    project: string;
    projectVersion: string;
  }) => {
    const p = await Editor.fetchProject({
      accountName: namespace,
      projectName: project,
    });
    const cmnFiles = COMMON_FILES(projectVersion);
    const graphqlURL = p.sources!.sources!.find(
      (s) => s.filename === cmnFiles.code,
    )!;
    const libraryURL = p.sources!.sources!.find(
      (s) => s.filename === cmnFiles.libraries,
    )!;
    const [graphqlFile, libraryFile] = await Promise.all([
      (await fetch(graphqlURL.getUrl!)).text(),
      libraryURL
        ? (await fetch(libraryURL.getUrl!)).text()
        : new Promise<string>((resolve) => resolve('')),
    ]);
    const sdlMerge = mergeSDLs(graphqlFile, libraryFile);
    if (sdlMerge.__typename === 'error')
      throw new Error(
        sdlMerge.errors
          .map((e) => `Conflict on: ${e.conflictingNode}.${e.conflictingField}`)
          .join('\n'),
      );
    return sdlMerge.sdl;
  };

  public static getSchema = async (resolve: {
    namespace: string;
    project: string;
    version: string;
  }) => {
    const p = await Editor.fetchProject({
      accountName: resolve.namespace,
      projectName: resolve.project,
    });

    const cmnFiles = COMMON_FILES(resolve.version);
    const schemaSource = p.sources?.sources?.find(
      (s) => s.filename === cmnFiles.code,
    );

    if (!schemaSource?.getUrl) {
      throw new Error(
        `Project "${resolve.project}" does not have a version "${resolve.version}"`,
      );
    }

    const schema = await Editor.getSource(schemaSource.getUrl);
    return schema;
  };

  public static removeFiles = async (
    teamId: string,
    projectId: string,
    files: string[],
  ) => {
    const response = await jolt()('mutation')({
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

  public static renameFiles = async (
    teamId: string,
    projectId: string,
    files: Array<{ src: string; dst: string }>,
  ) => {
    const response = await jolt()('mutation')({
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
  public static saveFilesToCloud = async (
    projectId: string,
    fileArray: FileArray[],
  ) => {
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

    const response = await jolt()('mutation')({
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
  public static getDeviceCode = async () => {
    const response = await fetch(
      'https://auth.graphqleditor.com/oauth/device/code',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 'pNh9rJhjO2qnD1gAlfKtQFnlxN88LCil',
          scope: 'profile offline_access openid email write:cloud_deployment',
          audience: 'https://auth.graphqleditor.com',
        }),
      },
    );
    const result = (await response.json()) as {
      device_code: string;
      user_code: string;
      verification_uri: string;
      expires_in: number;
      interval: number;
      verification_uri_complete: string;
    };
    return result;
  };
  public static getDeviceToken = async (deviceCode: string) => {
    const response = await fetch('https://auth.graphqleditor.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        client_id: 'pNh9rJhjO2qnD1gAlfKtQFnlxN88LCil',
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: deviceCode,
      }),
    });
    const result = (await response.json()) as {
      access_token: string;
      refresh_token: string;
      id_token: string;
      scope: string;
      expires_in: number;
      token_type: string;
    };
    return result;
  };
}
