import React from "react";


//import { render } from "react-dom";
import ReactDOM from "react-dom/client";
import { default as App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";

import ErrorBoundary from "./ErrorBoundary";


import { GraphQLContext } from "./utils-v2/graphql/GraphQLContext";
import { AUTHClient, CoreGraphQLApi, AppSyncClient } from "./utils-v2/lib/MockClient";

import { PrifinaStoreProvider } from "./utils-v2/stores/PrifinaStore";


import config, { REFRESH_TOKEN_EXPIRY } from "./config";

let AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.auth_region,
  identityPoolRegion: config.main_region,
  //region: config.main_region,
};

const APIConfig = {
  aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
  aws_appsync_region: config.main_region,
  aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
};

const CoreApiClient = new CoreGraphQLApi();

const AuthClient = new AUTHClient({ AuthConfig: AUTHConfig });

const UserApiClient = new AppSyncClient({ AppSyncConfig: APIConfig })
//import { ThemeProvider } from "@blend-ui/core";


//import reportWebVitals from "./reportWebVitals";
/*
render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <GraphQLContext.Provider value={{ AuthClient, CoreApiClient, UserApiClient }}>
        <PrifinaStoreProvider>
          <Router>
            <App />
          </Router>
        </PrifinaStoreProvider>
      </GraphQLContext.Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/*
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('_host-root'));
*/