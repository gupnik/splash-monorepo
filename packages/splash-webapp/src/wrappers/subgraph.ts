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
      supply
      tags
      consumers {
        project {
          id
          uri
          price
          name
          image 
          description
          supply
          tags
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
          supply
          tags
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
    supply
    consumers {
      project {
        id
        uri
        price
        name
        image 
        description
        supply
        tags
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
        supply
        tags
      }
    }
  }
}
`
