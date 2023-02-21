import React from "react";

//import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client';
import { default as App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";


import ErrorBoundary from "./ErrorBoundary";

import { GraphQLContext } from "./utils-v2/graphql/GraphQLContext";

import { PrifinaStoreProvider } from "./utils-v2/stores/PrifinaStore";

import config, { REFRESH_TOKEN_EXPIRY } from "./config";

import "./normalize.css";

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

/* 
let CoreApiClient;
let AuthClient;
let UserApiClient;
let Client;

let container = null; */


//let container = null;

function importBuildClient() {
  // dynamic import of environment clients
  if (process.env.REACT_APP_MOCKUP_CLIENT === "true") {
    return import("./utils-v2/lib/MockClient");
  } else {
    return import("./utils-v2/lib/ProdClient");
  }

}
/* 
function renderContent(step = 0) {
  console.log("RENDER ", step);

}
 */
importBuildClient().then(Client => {

  const {
    AUTHClient, CoreGraphQLApi, AppSyncClient, S3Storage
  } = Client;

  //const CoreApiClient = new CoreGraphQLApi({ config: APIConfig, Options: process.env.REACT_APP_MOCKUP_CLIENT === "true" ? { appIndex: 4 } : null });
  const CoreApiClient = new CoreGraphQLApi({ config: APIConfig });
  const AuthClient = new AUTHClient({ AuthConfig: AUTHConfig });
  //UserApiClient = new AppSyncClient({ AppSyncConfig: { url: APIConfig.aws_appsync_graphqlEndpoint, reqion: APIConfig.aws_appsync_region } })
  const UserApiClient = new AppSyncClient({ AppSyncConfig: APIConfig })
  const S3StorageClient = new S3Storage({ S3Config: { bucket: config.S3.bucket, region: config.S3.region } })

  /* 
    if (container) {
      console.log("ROOT RENDER EXISTS", container);
      // not shown, but still getting weird warning... 
    }
  
    if (document.readyState === 'loading') {  // Loading hasn't finished yet
      document.addEventListener('DOMContentLoaded', (ev) => {
        console.log("EVENT LOADED", ev);
        console.log("CONTAINER", container);
        renderContent(1);
      });
    } else {  // `DOMContentLoaded` has already fired
      renderContent(2);
    } */
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        {AuthClient &&
          <GraphQLContext.Provider value={{ AuthClient, CoreApiClient, UserApiClient, S3Storage: S3StorageClient }}>
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

});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
