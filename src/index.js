import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { Auth0Provider } from "@auth0/auth0-react";
import { ConvexReactClient } from "convex/react";
import authConfig from './convex/auth.config'; // Import the auth config

const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={authConfig.providers[0].domain} // Use domain from auth config
      clientId={authConfig.providers[0].applicationID} // Use applicationID from auth config
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        <App />
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();