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
}
