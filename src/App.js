// /* global localStorage */

import React, { useEffect, useReducer } from "react";
//import { useHistory } from "react-router-dom";

import { withRouter } from "react-router-dom";
import Routes from "./routes/AppRouterDynamic";
import { AppContext } from "./lib/contextLib";
import Amplify, { Auth } from "aws-amplify";
import { ThemeProvider } from "@blend-ui/core";

import config from "./config";

//import { countryList } from "./lib/utils";

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

async function initAuth(newAuth = false) {
  Auth.configure(AUTHConfig);
  Amplify.configure(APIConfig);
  console.log(AUTHConfig);
  console.log(APIConfig);

  console.log("INIT AUTH ", new Date(), Auth);
  let session;
  if (newAuth) {
    try {
      await Auth.signIn("tero-test", "Huuhaa12!#");
    } catch (e) {
      console.log("ERR", e);
    }
  }
  session = await Auth.currentSession();

  return session;
}

function App() {
  //const history = useHistory();
  console.log("APP START");
  //console.log(JSON.stringify(countryList()));
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      isAuthenticating: true,
      currentUser: {},
      isAuthenticated: false,
    }
  );

  useEffect(() => {
    async function onLoad() {
      let _currentUser = {};

      try {
        //await Auth.currentSession();
        // console.log("AUTH CHECK ", isAuthenticating);
        const _currentSession = await initAuth(false);
        //console.log("AUTH ", Auth);
        //const _currentSession = await Auth.currentSession();
        //Auth.currentAuthenticatedUser().then((user) => console.log(user));
        //Auth.currentCredentials().then((creds) => console.log(creds));
        // Auth.currentSession() does not currently support federated identities. Please store the auth0 session info manually(for example, store tokens into the local storage).Auth.currentAuthenticatedUser().then(user => console.log(user));

        console.log("APP AUTH ", _currentSession);
        if (_currentSession) {
          const token = _currentSession.getIdToken().payload;
          _currentUser = {
            username: token["cognito:username"],
            organization: token["custom:organization"] || "",
            given_name: token["given_name"],
            client: token["aud"],
          };
        }
        setState({
          isAuthenticating: false,
          currentUser: _currentUser,
          isAuthenticated: _currentSession ? true : false,
        });
      } catch (e) {
        console.log("ERR ", e);
        if (e !== "No current user") {
        }
        //userHasAuthenticated(true);
        setState({
          isAuthenticating: false,
          currentUser: _currentUser,
          isAuthenticated: false,
        });
      }
    }

    onLoad();
  }, [state.isAuthenticated]);

  const userAuth = (auth) => {
    setState({ isAuthenticated: auth });
  };

  const { currentUser, isAuthenticating, isAuthenticated } = state;

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        APIConfig,
        AUTHConfig,
        userAuth,
      }}
    >
      <ThemeProvider>
        {!isAuthenticating && <Routes />}
        {isAuthenticating && <div>Loading...</div>}
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default withRouter(App);
