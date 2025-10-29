import { onError } from '@apollo/client/link/error';
import { ServerError } from '@apollo/client';
import { goTo } from '@/utils/navigation';
import { Observable } from '@apollo/client';
import { REFRESH_TOKEN } from '@/graphql/mutations/auth';
import { getDefaultStore } from 'jotai';
import { appInitializationAtom } from '@/atoms/user';

/**
 * Apollo ErrorLink acts like an interceptor for errors.
 * It captures GraphQL & Network errors and performs side-effects such as logging
 * or redirecting the user.
 */
export const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Log GraphQL errors
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      // eslint-disable-next-line no-console
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );
    });
  }

  // Handle network errors
  if (networkError) {
    // eslint-disable-next-line no-console
    console.error(`[Network error]: ${networkError}`);
  }

  const hasAuthError =
    (networkError as ServerError)?.statusCode === 401 ||
    graphQLErrors?.some((err) => err.extensions?.code === 'UNAUTHENTICATED');

  if (hasAuthError) {
    const isRegisterPage = window.location.pathname.startsWith('/register');
    const store = getDefaultStore();

    if (operation.operationName === 'RefreshToken') {
      store.set(appInitializationAtom, {
        isInitializing: false,
        isInitialized: true,
      });

      if (!isRegisterPage) {
        goTo('/register');
      }
      return;
    }

    return new Observable((observer) => {
      fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          operationName: 'RefreshToken',
          query: REFRESH_TOKEN.loc?.source.body,
        }),
      })
        .then((res) => {
          if (res.status === 401) {
            throw new Error('Refresh token failed');
          }
          return res.json();
        })
        .then((result) => {
          if (result.errors) {
            throw new Error('Refresh token failed');
          }

          const operationSubscriber = {
            next: (value: any) => observer.next(value),
            error: (error: any) => observer.error(error),
            complete: () => observer.complete(),
          };

          forward(operation).subscribe(operationSubscriber);
        })
        .catch(() => {
          store.set(appInitializationAtom, {
            isInitializing: false,
            isInitialized: true,
          });

          if (!isRegisterPage) {
            goTo('/register');
          }
          observer.error(networkError || new Error('Token refresh failed'));
        });
    });
  }

  return forward(operation);
});
