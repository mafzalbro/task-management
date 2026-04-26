import { Auth0Provider } from "@auth0/auth0-react";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo-client';
import './index.css';
import App from './App.tsx';

const domain = import.meta.env.VITE_AUTH0_DOMAIN || "your-domain.auth0.com";
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }}
    >
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Auth0Provider>
  </StrictMode>,
);
