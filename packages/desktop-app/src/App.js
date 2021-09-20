// /* global localStorage */

import React, { useEffect, useReducer, useRef } from "react";
//import { useHistory } from "react-router-dom";

import { withRouter, useLocation, useHistory } from "react-router-dom";
import Routes from "./routes/AppRouterDynamic";
//import { AppContext } from "./lib/contextLib";
import { API, Auth } from "aws-amplify";
import { ThemeProvider, baseStyles } from "@blend-ui/core";
import { createGlobalStyle } from "styled-components";

import sha512 from "crypto-js/sha512";
import Base64 from "crypto-js/enc-base64";
/*
import {
  addPrifinaSessionMutation,
  getPrifinaSessionQuery,
  deletePrifinaSessionMutation,
} from "./graphql/api";
*/
import {
  addPrifinaSessionMutation,
  getPrifinaSessionQuery,
  deletePrifinaSessionMutation,
  AppContext,
} from "@prifina-apps/utils";

//import { getPrifinaSessionQuery as graphqlTEST } from "@prifina-apps/utils";
import config, { REFRESH_TOKEN_EXPIRY } from "./config";

//import { countryList } from "./lib/utils";

const GlobalStyle = createGlobalStyle`
  body {
   ${baseStyles};
  }
`;
const APIConfig = {
  aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
  aws_appsync_region: config.main_region,
  aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
};

let AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.main_region,
};
/*
async function initAuth(newAuth = false) {
  Auth.configure(AUTHConfig);
  Amplify.configure(APIConfig);
  console.log(AUTHConfig);
  console.log(APIConfig);

  console.log("INIT AUTH ", new Date(), Auth);
  let session;
  if (newAuth) {
    try {
      await Auth.signIn("tero-test", "xxxxxx");
    } catch (e) {
      console.log("ERR", e);
    }
  }
  session = await Auth.currentSession();

  return session;
}
*/

function App() {
  //const history = useHistory();

  console.log("APP START");
  console.log("CONFIG ", config);

  const lastIdentityPool = localStorage.getItem("LastSessionIdentityPool");
  if (lastIdentityPool !== null) {
    AUTHConfig.identityPoolId = lastIdentityPool;
    AUTHConfig.region = lastIdentityPool.split(":")[0];
  }

  Auth.configure(AUTHConfig);
  API.configure(APIConfig);
  const { pathname, search } = useLocation();
  const history = useHistory();
  //console.log(JSON.stringify(countryList()));
  //window.matchMedia('(max-width: 600px)');
  const userAgent =
    typeof window.navigator === "undefined" ? "" : navigator.userAgent;
  const mobile = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );

  console.log("USER AGENT MOBILE", mobile);
  let mobileApp = false;
  if (mobile) {
    const maxD = Math.max(window.screen.availWidth, window.screen.availHeight);
    const minD = Math.min(window.screen.availWidth, window.screen.availHeight);
    if (minD / maxD < 0.7) {
      //console.log('NOT TABLET....');
      mobileApp = true;
    }
  }

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      isAuthenticating: true,
      currentUser: {},
      isAuthenticated: false,
    },
  );

  const refreshSession = useRef(false);

  useEffect(() => {
    async function onLoad() {
      let _currentUser = {};
      const tracker = Base64.stringify(sha512(window.deviceFingerPrint));
      const lastAuthUser = localStorage.getItem(
        "CognitoIdentityServiceProvider." +
          config.cognito.APP_CLIENT_ID +
          ".LastAuthUser",
      );
      const currentIdToken = localStorage.getItem(
        "CognitoIdentityServiceProvider." +
          config.cognito.APP_CLIENT_ID +
          "." +
          lastAuthUser +
          ".idToken",
      );
      const lastIdentityPool = localStorage.getItem("LastSessionIdentityPool");

      try {
        if (
          lastIdentityPool !== null &&
          Auth._config.identityPoolId !== lastIdentityPool
        ) {
          console.log("CHANGE IDPOOL ", lastIdentityPool);
          let currentConfig = Auth._config;
          currentConfig.identityPoolId = lastIdentityPool;
          currentConfig.region = lastIdentityPool.split(":")[0];
          Auth.configure(currentConfig);
        }
        const _currentSession = await Auth.currentSession();

        //const _currentSession = await initAuth(false);
        //console.log("AUTH ", Auth);
        //const _currentSession = await Auth.currentSession();
        //Auth.currentAuthenticatedUser().then((user) => console.log(user));
        //Auth.currentCredentials().then((creds) => console.log(creds));
        // Auth.currentSession() does not currently support federated identities. Please store the auth0 session info manually(for example, store tokens into the local storage).Auth.currentAuthenticatedUser().then(user => console.log(user));
        Auth.currentCredentials().then(c => {
          console.log("USER IAM CREDENTIALS ", c);
        });
        console.log("APP AUTH ", _currentSession, Auth._config);
        if (_currentSession) {
          const token = _currentSession.getIdToken().payload;
          _currentUser = {
            username: token["cognito:username"],
            organization: token["custom:organization"] || "",
            /* given_name: token["given_name"],*/
            client: token["aud"],
            prifinaID: token["custom:prifina"],
          };
          /*
          console.log(
            "EXISTING APP SESSION  ",
            currentIdToken === _currentSession.getIdToken().jwtToken,
            currentIdToken,
          );
          */
          if (
            refreshSession.current ||
            currentIdToken !== _currentSession.getIdToken().jwtToken
          ) {
            const localStorageKeys = Object.keys(window.localStorage);
            let tokens = {};
            localStorageKeys.forEach(key => {
              if (
                key.startsWith(
                  "CognitoIdentityServiceProvider." +
                    config.cognito.APP_CLIENT_ID +
                    "." +
                    lastAuthUser,
                )
              ) {
                tokens[key] = localStorage.getItem(key);
              }
              if (key.startsWith("CognitoIdentityId")) {
                tokens[key] = localStorage.getItem(key);
              }

              if (
                key.startsWith(
                  "CognitoIdentityServiceProvider." +
                    config.cognito.APP_CLIENT_ID +
                    ".LastAuthUser",
                )
              ) {
                tokens[key] = localStorage.getItem(key);
              }
            });

            //CognitoIdentityId-us-east-1:27d0bb9c-b563-497b-ad0f-82b0ceb9eb0c
            refreshSession.current = false;
            console.log(
              "UPDATE SESSION...",
              {
                identityPool: Auth._config.identityPoolId,
                tracker: tracker,
                tokens: JSON.stringify(tokens),
                expireToken: _currentSession.getIdToken().getExpiration(),
                expire:
                  _currentSession.getIdToken().getIssuedAt() +
                  REFRESH_TOKEN_EXPIRY * 24 * 60 * 60,
              },
              _currentSession.getIdToken().getIssuedAt(),
            );

            const prifinaSession = await addPrifinaSessionMutation(API, {
              identityPool: Auth._config.identityPoolId,
              tracker: tracker,
              tokens: JSON.stringify(tokens),
              expireToken: _currentSession.getIdToken().getExpiration(),
              expire:
                _currentSession.getIdToken().getIssuedAt() +
                REFRESH_TOKEN_EXPIRY * 24 * 60 * 60,
            });
            console.log("SESSION ", prifinaSession);
          }
        }
        //const prifinaID = session.idToken.payload["custom:prifina"];
        setState({
          isAuthenticating: false,
          currentUser: _currentUser,
          isAuthenticated: _currentSession ? true : false,
        });
      } catch (e) {
        console.log("ERR ", e);
        if (typeof e === "string" && e === "No current user") {
          console.log("GET SESSION....");
          const prifinaSession = await getPrifinaSessionQuery(API, tracker);
          console.log("AUTH SESSION ", prifinaSession);
          if (prifinaSession.data.getSession === null) {
            localStorage.removeItem("LastSessionIdentityPool");
            refreshSession.current = true;
            //setLogin(false);
            // redirect to login page with path+query...
            console.log("REDIRECT PATH", pathname);
            console.log("REDIRECT SEARCH", search);
            // ?redirect=/
            if (search.startsWith("?redirect")) {
              history.replace("/login" + search);
            } else if (
              pathname.startsWith("/login") &&
              search.startsWith("?debug")
            ) {
              history.replace("/login" + search);
            } else if (
              pathname.startsWith("/register") &&
              search.startsWith("?debug")
            ) {
              history.replace("/register" + search);
            } else {
              history.replace("/login?redirect=" + pathname + search);
            }
          } else {
            let tokens = JSON.parse(prifinaSession.data.getSession.tokens);
            Object.keys(tokens).forEach(key => {
              localStorage.setItem(key, tokens[key]);
            });
            //CognitoIdentityId-us-east-1:27d0bb9c-b563-497b-ad0f-82b0ceb9eb0c
            localStorage.setItem(
              "LastSessionIdentityPool",
              prifinaSession.data.getSession.identityPool,
            );

            console.log("AUTH OBJ ", Auth);
            window.location.reload();
          }
        }
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

  const userAuth = auth => {
    console.log("AUTH SET ", state.isAuthenticated, auth);
    if (state.isAuthenticated && !auth) {
      const tracker = Base64.stringify(sha512(window.deviceFingerPrint));
      deletePrifinaSessionMutation(API, tracker).then(() => {
        Auth.signOut().then(() => {
          setState({ isAuthenticated: auth });
          history.replace("/");
        });
      });
    } else {
      setState({ isAuthenticated: auth });
    }
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
        mobileApp,
        Auth,
      }}
    >
      <ThemeProvider>
        <React.Fragment>
          <GlobalStyle />
          {!isAuthenticating && <Routes />}
          {isAuthenticating && <div>Loading...</div>}
        </React.Fragment>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default withRouter(App);
