import React from "react";


//import { render } from "react-dom";
import ReactDOM from "react-dom/client";
import { default as App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";

import ErrorBoundary from "./ErrorBoundary";


import { GraphQLContext } from "./utils-v2/graphql/GraphQLContext";

import { PrifinaStoreProvider } from "./utils-v2/stores/PrifinaStore";

import config, { REFRESH_TOKEN_EXPIRY } from "./config";


//import { AUTHClient, CoreGraphQLApi, AppSyncClient } from "./utils-v2/lib/MockClient";


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


let CoreApiClient;
let AuthClient;
let UserApiClient;

const root = ReactDOM.createRoot(document.getElementById("root"));

(async () => {
  let Client;
  // dynamic import of environment clients
  if (process.env.REACT_APP_MOCKUP_CLIENT === "true") {
    Client = await import("./utils-v2/lib/MockClient");
  } else {
    Client = await import("./utils-v2/lib/ProdClient");
  }

  const {
    AUTHClient, CoreGraphQLApi, AppSyncClient
  } = Client;

  CoreApiClient = new CoreGraphQLApi({ config: APIConfig });
  AuthClient = new AUTHClient({ AuthConfig: AUTHConfig });
  //UserApiClient = new AppSyncClient({ AppSyncConfig: { url: APIConfig.aws_appsync_graphqlEndpoint, reqion: APIConfig.aws_appsync_region } })
  UserApiClient = new AppSyncClient({ AppSyncConfig: APIConfig })

  //console.log("CLIENT ", CoreApiClient, AuthClient, UserApiClient);

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        {AuthClient &&
          <GraphQLContext.Provider value={{ AuthClient, CoreApiClient, UserApiClient }}>
            <PrifinaStoreProvider>
              <Router>
                <App />
              </Router>
            </PrifinaStoreProvider>
          </GraphQLContext.Provider>
        }
        {!AuthClient && <div>Initializing Error...</div>}
      </ErrorBoundary>
    </React.StrictMode>,
  );
})();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
