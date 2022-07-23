import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const clientFactory = (uri: string) =>
  new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });

export const projectsQuery = (account?: string) => gql`
{
  splashAccount(id: \"${account?.toLowerCase()}\") {
    id
    projects {
      id
      uri
      price
    }
  }
}
`
