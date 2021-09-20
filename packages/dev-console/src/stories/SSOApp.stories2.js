/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
//import HmacSHA1 from "crypto-js/hmac-sha1";
import sha512 from "crypto-js/sha512";
import Base64 from "crypto-js/enc-base64";
import React, { useRef, useState, useEffect } from "react";

import { Auth, API as GRAPHQL } from "aws-amplify";
import config, { REFRESH_TOKEN_EXPIRY } from "../config";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

import {
  getPrifinaUserQuery,
  addPrifinaSessionMutation,
  getPrifinaSessionQuery,
} from "../graphql/api";

//import { default as DefaultApp } from "../pages/AppMarket";

import { useFormFields } from "../lib/formFields";
//import { getTokens } from "../lib/utils";

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
  //identityPoolId: "us-east-1:863ad65a-5219-40c2-847f-4d550447e289",
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.main_region,
};

const S3Config = {
  AWSS3: {
    bucket: config.S3.bucket, //REQUIRED -  Amazon S3 bucket name
    region: config.S3.region, //OPTIONAL -  Amazon service region
  },
};

export default { title: "SSO DefaultApp" };

export const defaultSSOApp = props => {
  console.log("WINDOW ", window.deviceFingerPrint);
  console.log("COMPONENT ---> ", props);
  console.log("CONFIG ", config);
  const [settingsReady, setSettingsReady] = useState(false);
  const clientHandler = useRef(null);

  const prifinaID = useRef("");
  const [login, setLogin] = useState(true);

  const [loginFields, handleChange] = useFormFields({
    username: "",
    password: "",
  });

  const refreshSession = useRef(false);

  Auth.configure(AUTHConfig);
  GRAPHQL.configure(APIConfig);
  console.log("AUTH CONFIG ", AUTHConfig);

  const createClient = (endpoint, region) => {
    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },
      /*
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () =>
        (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    */
      disableOffline: true,
    });
    return client;
  };

  // get user auth...
  useEffect(async () => {
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

    console.log("LOGIN STATUS ", login);
    try {
      if (login) {
        console.log(lastAuthUser);
        console.log(currentIdToken);
        if (
          lastIdentityPool !== null &&
          Auth._config.identityPoolId !== lastIdentityPool
        ) {
          console.log("CHANGE IDPOOL");
          let currentConfig = Auth._config;
          currentConfig.identityPoolId = lastIdentityPool;
          Auth.configure(currentConfig);
        }
        const session = await Auth.currentSession();

        console.log("SESSION ", session);
        //console.log("TOKEN EXPIRE ", session.getIdToken().getExpiration());
        if (!session) {
          console.log("NO CURRENT SESSION FOUND");
        }
        console.log("PRIFINA-ID", session.idToken.payload["custom:prifina"]);
        prifinaID.current = session.idToken.payload["custom:prifina"];

        console.log("AUTH OBJ2", Auth);
        const currentPrifinaUser = await getPrifinaUserQuery(
          GRAPHQL,
          prifinaID.current,
        );

        console.log("CURRENT USER ", currentPrifinaUser);

        const appProfile = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.appProfile,
        );
        console.log("CURRENT USER ", appProfile, appProfile.initials);

        let clientEndpoint =
          "https://kxsr2w4zxbb5vi5p7nbeyfzuee.appsync-api.us-east-1.amazonaws.com/graphql";
        let clientRegion = "us-east-1";
        if (appProfile.hasOwnProperty("endpoint")) {
          clientEndpoint = appProfile.endpoint;
          clientRegion = appProfile.region;
        }

        clientHandler.current = createClient(clientEndpoint, clientRegion);
        if (
          refreshSession.current ||
          currentIdToken !== session.getIdToken().jwtToken
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

          const prifinaSession = await addPrifinaSessionMutation(GRAPHQL, {
            tracker: tracker,
            tokens: JSON.stringify(tokens),
            expireToken: session.getIdToken().getExpiration(),
            expire:
              session.getIdToken().getIssuedAt() +
              REFRESH_TOKEN_EXPIRY * 24 * 60 * 60,
          });
          console.log("SESSION ", prifinaSession);
        }
        //console.log(Base64.stringify(sha512("Message")));
        // const hashDigest = sha256(nonce + message);
        // const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));

        //console.log(Base64.stringify(HmacSHA1("Message", "Key")));
        //ss.replace(/\"/g,'').split(":")
        setSettingsReady(true);
      }
    } catch (e) {
      if (typeof e === "string" && e === "No current user") {
        const prifinaSession = await getPrifinaSessionQuery(GRAPHQL, tracker);
        console.log("AUTH SESSION ", prifinaSession);
        if (prifinaSession.data.getSession === null) {
          localStorage.removeItem("LastSessionIdentityPool");
          refreshSession.current = true;
          setLogin(false);
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
          // rest is not used...
          //setSSOLogin(true);
          //console.log("TOKENS ", tokens);
          console.log("TOKENS ", prifinaSession.data.getSession);
          const expireToken = 0 * 1000;
          const ts = new Date().getTime();
          // check if refreshToken is needed....
          if (expireToken < ts) {
            //console.log("AUTH OBJ ", Auth._config);
            const currentConfig = Auth._config;
            const tokenKeys = Object.keys(tokens);

            const refreshIndex = tokenKeys.findIndex(n => {
              return n.indexOf("refreshToken") > -1;
            });

            // console.log(tokenKeys, refreshIndex);

            //console.log(tokens[tokenKeys[refreshIndex]]);
            //CognitoIdentityServiceProvider.45df1gh1njvjqrr3hiva2mnh3b.f940861e-646d-4969-a0c4-a516bb8de7ab.refreshToken
            if (refreshIndex > -1) {
              /*
              const newTokens = await getTokens(
                currentConfig.identityPoolRegion || currentConfig.region,
                currentConfig.userPoolWebClientId,
                tokens[tokenKeys[refreshIndex]],
              );
              //console.log("NEW TOKENS ", newTokens);
              const idIndex = tokenKeys.findIndex(n => {
                return n.indexOf("idToken") > -1;
              });
              const accessIndex = tokenKeys.findIndex(n => {
                return n.indexOf("accessToken") > -1;
              });

              tokens[tokenKeys[idIndex]] =
                newTokens.AuthenticationResult.IdToken;
              tokens[tokenKeys[accessIndex]] =
                newTokens.AuthenticationResult.AccessToken;
              //console.log("TOKENS ", tokens);
              Object.keys(tokens).forEach(key => {
                localStorage.setItem(key, tokens[key]);
              });
              refreshSession.current = true;
              setSSOLogin(true);
              */
            }
          }
          /*
          console.log("TOKENS ", tokens);
          Object.keys(tokens).forEach(key => {
            localStorage.setItem(key, tokens[key]);
          });
          console.log("Current AUTH OBJ ", Auth);
          const session = await Auth.currentSession();
          console.log("SESSION ", session);

          const user = await Auth.currentAuthenticatedUser();
          console.log("USER ", user);
          //Auth.currentAuthenticatedUser()

          console.log(
            "EXPIRES ",
            prifinaSession.data.getSession.expire,
            session.getIdToken().getExpiration(),
          );
          console.log(
            "COMPARE TOKENS ",
            currentIdToken === session.getIdToken().jwtToken,
          );

          prifinaID.current = session.idToken.payload["custom:prifina"];

          const currentPrifinaUser = await getPrifinaUserQuery(
            GRAPHQL,
            prifinaID.current,
          );

          console.log("CURRENT USER ", currentPrifinaUser);

          const appProfile = JSON.parse(
            currentPrifinaUser.data.getPrifinaUser.appProfile,
          );
          console.log("CURRENT USER ", appProfile, appProfile.initials);

          let clientEndpoint =
            "https://kxsr2w4zxbb5vi5p7nbeyfzuee.appsync-api.us-east-1.amazonaws.com/graphql";
          let clientRegion = "us-east-1";
          if (appProfile.hasOwnProperty("endpoint")) {
            clientEndpoint = appProfile.endpoint;
            clientRegion = appProfile.region;
          }

          clientHandler.current = createClient(clientEndpoint, clientRegion);
          console.log("ALL GOOD....");
          setSettingsReady(true);
          */
        }
        //setLogin(false);
        //const user = await Auth.signIn("tahola", "xxxx");
        //console.log("AUTH ", user);
        //console.log("APP DEBUG ", appCode);
      }

      console.log("AUTH ", e);
    }
  }, [login]);

  return (
    <>
      {!login && (
        <div>
          <div>
            Username:
            <input id={"username"} name={"username"} onChange={handleChange} />
          </div>
          <div>
            Password:
            <input id={"password"} name={"password"} onChange={handleChange} />
          </div>
          <div>
            <button
              onClick={e => {
                //console.log(loginFields);
                Auth.signIn(loginFields.username, loginFields.password).then(
                  () => {
                    setLogin(true);
                  },
                );
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
      {login && settingsReady && <div>OK</div>}
      {!settingsReady && <div />}
    </>
  );
};

defaultSSOApp.story = {
  name: "Default App",
};

defaultSSOApp.story = {
  name: "SSO Default APP",
};
