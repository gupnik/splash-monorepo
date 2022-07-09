import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

export const clientFactory = (uri: string) =>
  new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });
