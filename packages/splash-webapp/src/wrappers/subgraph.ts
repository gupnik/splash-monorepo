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
      name
      image
      description
      consumers {
        project {
          id
          uri
          price
          name
          image 
          description
        }
      }
      constituents {
        constituent {
          id
          uri
          price
          name
          image 
          description
        }
      }
    }
  }
}
`

export const searchQuery = (query: string) => gql`
{
  search(text: \"${query.toLowerCase()}\") {
    id
    uri
    price
    name
    image
    description
    consumers {
      project {
        id
        uri
        price
        name
        image 
        description
      }
    }
    constituents {
      constituent {
        id
        uri
        price
        name
        image 
        description
      }
    }
  }
}
`
