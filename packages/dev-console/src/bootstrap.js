import React from "react";

//import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client';
import { default as App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";


import * as UTILS from "@prifina-apps/utils";

import ErrorBoundary from "./ErrorBoundary";

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
  aws_appsync_region: config.auth_region,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"
  //aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
};

let CoreGraphQLApi;
let AUTHClient;
let AppSyncClient;
let S3Storage;

// dynamic import of environment clients
if (process.env.REACT_APP_MOCKUP_CLIENT === "true") {
  //Client = await import("./utils-v2/lib/MockClient");
  // Client = await import("@prifina-apps/utils").MockClient;
  CoreGraphQLApi = UTILS.MockCoreGraphQLApi;
  AUTHClient = UTILS.MockAUTHClient;
  AppSyncClient = UTILS.MockAppSyncClient;
  S3Storage = UTILS.MockS3Storage;

  ///export { MockAUTHClient, MockCoreGraphQLApi, MockAppSyncClient, MockS3Storage };
} else {
  //Client = await import("./utils-v2/lib/ProdClient");
  // Client = await import("@prifina-apps/utils").ProdClient;
  CoreGraphQLApi = UTILS.CoreGraphQLApi;
  AUTHClient = UTILS.AUTHClient;
  AppSyncClient = UTILS.AppSyncClient;
  S3Storage = UTILS.S3Storage
}


const CoreApiClient = new CoreGraphQLApi({ config: APIConfig });
const AuthClient = new AUTHClient({ AuthConfig: AUTHConfig });
const UserApiClient = new AppSyncClient()
const S3StorageClient = new S3Storage({ S3Config: { bucket: config.S3.bucket, region: config.S3.region } })


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      {AuthClient &&
        <UTILS.GraphQLContext.Provider value={{ AuthClient, CoreApiClient, UserApiClient, S3Storage: S3StorageClient }}>
          <UTILS.PrifinaStoreProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </UTILS.PrifinaStoreProvider>
        </UTILS.GraphQLContext.Provider>
      }
      {!AuthClient && <div>Initializing Error...</div>}
    </ErrorBoundary>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
