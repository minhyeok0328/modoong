import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { errorLink } from './links/errorLink';
import { mockLink } from '@/mocks/apollo';

// Compose links. Order matters: from left to right.
// Replace network HTTP link with local mock link for demo environment.
const link = ApolloLink.from([errorLink, mockLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
