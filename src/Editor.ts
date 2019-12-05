import { Gql } from './graphql-zeus';
/**
 * Provides connection to GraphQL Editor
 */
export class Editor {
  public static nameSpaceExists = async (accountName: string) => {
    const Query = await Gql.Query({
      getNamespace: [
        { slug: accountName },
        {
          slug: true,
        },
      ],
    });
    return !!Query.getNamespace;
  };
  public static fetchProjects = async (accountName: string) => {
    const Query = await Gql.Query({
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
                endpoint: {
                  uri: true,
                },
              },
            },
          ],
        },
      ],
    });
    return Query.getNamespace!.projects!.projects!.filter((p) => p.mocked);
  };
  public static getFakerURL = (endpointUri: string) => `https://faker.graphqleditor.com/${endpointUri}/graphql`;
}
