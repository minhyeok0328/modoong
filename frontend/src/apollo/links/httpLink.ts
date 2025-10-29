import { createHttpLink } from '@apollo/client';

/**
 * HttpLink acts like the base link for all GraphQL HTTP requests.
 * We set `credentials: 'include'` so that browser cookies (e.g., access token)
 * are sent along with every request.
 */
export const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'include',
});
