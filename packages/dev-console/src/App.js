// /* global localStorage */

import React, { useEffect, useReducer, useRef } from "react";

import { withRouter, useLocation, useHistory } from "react-router-dom";
import Routes from "./routes/AppRouterDynamic";

import { API, Auth } from "aws-amplify";
import {
  ThemeProvider,
  baseStyles,
  theme as defaultTheme,
} from "@blend-ui/core";
import { createGlobalStyle } from "styled-components";

import sha512 from "crypto-js/sha512";
import Base64 from "crypto-js/enc-base64";

import {
  addPrifinaSessionMutation,
  getPrifinaSessionQuery,
  deletePrifinaSessionMutation,
  AppContext,
  cognitoCredentials,
} from "@prifina-apps/utils";

import config, { REFRESH_TOKEN_EXPIRY } from "./config";

// import { default as newTheme } from "./theme/theme";

import { default as newTheme } from "./theme/theme";
import { ToastContextProvider } from "@blend-ui/toast";

import { S3Client } from "@aws-sdk/client-s3";

//import {Remote} from "@prifina-apps/remote";

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
  region: config.auth_region,
  identityPoolRegion: config.main_region,
};

function App() {
  //console.log("REMOTE TEST ",Remote);
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
      mobileApp = true;
    }
  }

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      isAuthenticating: true,
      currentUser: {},
      isAuthenticated: false,
      s3UploadClient: {},
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

        console.log("APP AUTH ", _currentSession, Auth._config);
        let _s3Client = {};

        if (_currentSession) {
          const currentCredentials = await Auth.currentCredentials();
          const token = _currentSession.getIdToken().payload;
          _currentUser = {
            username: token["cognito:username"],
            organization: token["custom:organization"] || "",
            /* given_name: token["given_name"],*/
            client: token["aud"],
            prifinaID: token["custom:prifina"],
            identity: currentCredentials.identityId,
            identityPool: Auth._config.identityPoolId,
          };

          const currentCognitoCredentials = await cognitoCredentials(
            _currentSession,
          );
          const region = currentCognitoCredentials.identityId.split(":")[0];

          _s3Client = new S3Client({
            credentials: currentCognitoCredentials,
            region: region,
          });

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

        setState({
          isAuthenticating: false,
          currentUser: _currentUser,
          isAuthenticated: _currentSession ? true : false,
          s3UploadClient: _s3Client,
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
          s3UploadClient: {},
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

  const { currentUser, isAuthenticating, isAuthenticated, s3UploadClient } =
    state;

  function mergeDeep(...objects) {
    const isObject = obj => obj && typeof obj === "object";

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }

  const mergedTheme = mergeDeep(defaultTheme, newTheme);
  //const remoteRef=useRef();
/*
  <Remote ref={remoteRef}
  componentProps={{ schema: { test: "cra works2" } }}
  system={{
    remote: "mfeApp2",
    url: "https://cdn.jsdelivr.net/gh/data-modelling/builder-plugins@main/packages/json-view/dist/remoteEntry.js",
    module: "./App",
  }} />


            <Remote ref={remoteRef}
  componentProps={{ schema: { test: "cra works2" } }}
  system={{
    remote: "mfeApp2",
    url: "https://cdn.jsdelivr.net/gh/data-modelling/builder-plugins@main/packages/json-view/dist/remoteEntry.js",
    module: "./App",
  }} />
*/
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
        s3UploadClient,
      }}
    >
      <ThemeProvider theme={mergedTheme}>
        <React.Fragment>
          <ToastContextProvider>
            <GlobalStyle />
            
            
            {!isAuthenticating && <Routes />}
            {isAuthenticating && <div>Loading...</div>}
          </ToastContextProvider>
        </React.Fragment>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default withRouter(App);
