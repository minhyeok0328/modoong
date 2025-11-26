import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { errorLink } from './links/errorLink';
import { httpLink } from './links/httpLink';

// Compose links. Order matters: from left to right.
const link = ApolloLink.from([errorLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
