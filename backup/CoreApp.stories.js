import React from "react";
import CoreApps from "../components/CoreApps";

import { AppContext } from "../lib/contextLib";

import config from "../config";

const APIConfig = {
  aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
  aws_appsync_region: config.main_region,
  aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
};

const AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.main_region,
};
export default { title: "CoreApps" };

export const coreApps = args => {
  return (
    <AppContext.Provider
      value={{
        isAuthenticated: true,
        currentUser: { name: "tero" },
        APIConfig,
        AUTHConfig,
        userAuth: () => {},
        mobileApp: false,
      }}
    >
      <CoreApps {...args} />
    </AppContext.Provider>
  );
};

coreApps.args = { app: "DisplayApp" };
coreApps.story = {
  name: "CoreApps",
};
