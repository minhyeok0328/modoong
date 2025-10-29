import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { routes } from './routes';
import './styles/index.css';
import { TokenLoader } from './utils/NavigationSetter';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <TokenLoader />
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
