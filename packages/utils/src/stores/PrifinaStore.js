/* eslint-disable react/prop-types */
import React from "react";
import create from "zustand";

import sha512 from "crypto-js/sha512";
import Base64 from "crypto-js/enc-base64";
import createContext from "zustand/context";
// see below...not working with povider
//import { mountStoreDevtool } from "simple-zustand-devtools";
import { useGraphQLContext } from "../graphql/GraphQLContext";
import {
  sendVerification, changeUserPassword, addPrifinaSession, deletePrifinaSession,
  updateUserProfile, updateUserActivity, updateCognitoUser, installWidget, updatePrifinaUser,
  addUserToCognitoGroup, newAppVersion, deleteAppVersion, updateAppVersion
} from "../graphql/mutations";
import {
  getPrifinaUser, listAppMarket, getSystemNotificationCount, listDataSources,
  listSystemNotificationsByDate, listNotificationsByDate, getCountryCode, checkUsername,
  checkCognitoAttribute, getVerification, getRequestToken, getLoginUserIdentityPool, getAddressBook,
  listApps, getAppVersion, getAIQuery, listDataconnectorsQuery, listDatasourceQuestionsQuery,
  getAIDataQuery, googleSearchQuery, userDataconnectorsQuery, getParserAIQuery
} from "../graphql/queries";
/*
import {
  getCognitoUserCount, getCognitoMetrics, getCognitoMetricImage, getCognitoUserDetails,
} from "../lib/queries";

import {
  updateCognitoUser,
} from "../lib/mutations";
*/

import config, { REFRESH_TOKEN_EXPIRY } from "../config";

const { Provider, useStore } = createContext(null);


// if (process.env.NODE_ENV === "development") {
//if (process.env.STORYBOOK_STATES) {
// doesn't work with provider...
// mountStoreDevtool("Store", useStore);
//}

const PrifinaStoreProvider = ({ children }) => {
  // const { user, authenticated } = useAppContext();
  // console.log("STORE CTX ", user, authenticated);

  const Test = useGraphQLContext();
  // const client = useGraphQLContext();
  console.log("STORE ", Test);
  const { AuthClient, CoreApiClient, UserApiClient } = useGraphQLContext();
  // const client = useGraphQLContext();
  console.log("AUTH ", AuthClient);
  console.log("GRAPHQL", CoreApiClient);

  return (
    <Provider createStore={() =>
      create((set, get) => ({
        user: {},
        activeUser: {},
        prifinaUser: {},
        refreshSession: false,
        //authenticated: config.MOCKUP_INIT_AUTH_STATE,
        //authenticated: false,
        authenticated: AuthClient.getAuthenticated(),
        authUser: {},
        mfaMethod: "SMS",
        poolID: "",
        getAuthUser: () => get().authUser,
        setAuthUser: aUser => {
          set({ authUser: aUser });
        },
        getUser: () => get().user,
        setUser: currentUser => {
          set({ user: currentUser });
        },
        getActiveUser: () => get().activeUser,
        setActiveUser: currentUser => {
          set({ activeUser: currentUser });
        },
        getPrifinaUser: () => get().prifinaUser,
        setPrifinaUser: initUser => {
          set({ prifinaUser: initUser });
        },
        setAuthStatus: status => {
          AuthClient.setAuthenticated(status);
          // set({ authenticated: status });
        },
        getAuthStatus: () => {
          //get().authenticated,
          return AuthClient.getAuthenticated();
        },

        currentAuthenticatedUser: async () => {
          return await AuthClient.currentAuthenticatedUser();
        },
        changePassword: async (vars) => {
          return await AuthClient.changePassword(vars);
        },
        isLoggedIn: async () => {
          //console.log(config.MOCKUP_INIT_AUTH_STATE);
          //console.log("TRACKER FINGERPRINT ", window.deviceFingerPrint);
          //const tracker = Base64.stringify(sha512(window.deviceFingerPrint));

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
            let refreshSession = get().refreshSession;
            let currentUser = {};
            if (
              lastIdentityPool !== null &&
              AuthClient.AuthConfig?.identityPoolId !== lastIdentityPool
            ) {
              console.log("CHANGE IDPOOL ", lastIdentityPool);
              let currentConfig = AuthClient.AuthConfig;
              currentConfig.identityPoolId = lastIdentityPool;
              currentConfig.identityPoolRegion = lastIdentityPool.split(":")[0];

              AuthClient.AUTHConfigure(currentConfig);
            }
            const currentAuthUser = await AuthClient.currentAuthenticatedUser();
            console.log("APP USER AUTH ", currentAuthUser);

            const currentSession = await AuthClient.currentSession();

            console.log("APP AUTH ", currentSession);
            if (currentSession) {
              //  console.log("SESSION OK");
              const token = currentSession.getIdToken().payload;
              console.log("TOKEN ", token);
              currentUser = {
                username: token["cognito:username"],
                organization: token["custom:organization"] || "",
                given_name: token.given_name,
                client: token.aud,
                prifinaID: token["custom:prifina"],
                group: token["cognito:groups"],
                email: token.email,
                phoneNumber: token.phone_number,
                loginUsername: token.preferred_username,
                exp: token.exp,
                poolID: token["custom:identityPool"]
              };

              // this.poolID = token["custom:identityPool"]
            }

            if (
              refreshSession ||
              currentIdToken !== currentSession.getIdToken().jwtToken
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

              refreshSession = false;

              const tracker = Base64.stringify(sha512(window.deviceFingerPrint));
              //const expire=REFRESH_TOKEN_EXPIRY * 24 * 60 * 60;
              const prifinaSession = await CoreApiClient.graphql(addPrifinaSession, {
                identityPool: AuthClient.AuthConfig.identityPoolId,
                tracker: tracker,
                tokens: JSON.stringify(tokens),
                expireToken: currentSession.getIdToken().getExpiration(),
                expire:
                  currentSession.getIdToken().getIssuedAt() +
                  REFRESH_TOKEN_EXPIRY * 24 * 60 * 60,
              });
              //console.log("SESSION ", prifinaSession);
            }

            // check if prifinaUser exists
            /* 
            const activeUser = {
              name: appProfile.name,
              initials: appProfile.initials,
              uuid: currentUser.id,
              endpoint: appProfile.endpoint,
              region: appProfile.region,
              dataSources: currentUser.dataSources
                ? JSON.parse(currentUser.dataSources)
                : {},
            }; */
            const updates = { authenticated: true, user: currentUser, refreshSession: refreshSession, poolID: currentUser.poolID, };
            if (get().prifinaUser?.id === undefined) {
              const pUser = await get().getPrifinaUserQuery(currentUser.prifinaID);
              const prifinaUserData = pUser.data.getPrifinaUser;
              let appProfile = JSON.parse(
                prifinaUserData.appProfile
              );
              const activeUser = {
                name: appProfile.name,
                initials: appProfile.initials,
                uuid: currentUser.prifinaID,
                endpoint: appProfile.endpoint,
                region: appProfile.region,
                dataSources: prifinaUserData.dataSources
                  ? JSON.parse(prifinaUserData.dataSources)
                  : {},
              };
              updates.prifinaUser = prifinaUserData;
              updates.activeUser = activeUser;
            }

            set(updates);
            return Promise.resolve(true);

          } catch (e) {
            console.log("ERR ", e);
            set({ authenticated: false, user: {} });
            if (typeof e === "string" && e === "No current user") {
              console.log("SESSION EXPIRED OR NOT FOUND...");
              return Promise.resolve(false);
            }

            return Promise.resolve(false);
          }
          //return Promise.resolve(true);
          /*
          try {
            const currentSession = await client.currentSession();

            console.log("APP AUTH ", currentSession);

            if (currentSession) {
              //  console.log("SESSION OK");
              const token = currentSession.getIdToken().payload;
              console.log("TOKEN ", token);

              const currentUser = {
                username: token["cognito:username"],
                organization: token["custom:organization"] || "",
                given_name: token.given_name,
                client: token.aud,
                prifinaID: token["custom:prifina"],
                group: token["cognito:groups"],
                email: token.email,
                phoneNumber: token.phone_number,
                loginUsername: token.preferred_username,
                exp: token.exp,
              };
              set({ authenticated: true, user: currentUser });
              return Promise.resolve(true);
            }

            set({ authenticated: false });
            return Promise.resolve(false);
          } catch (e) {
            set({ authenticated: false });
            if (typeof e === "string" && e === "No current user") {
              console.log("SESSION EXPIRED OR NOT FOUND...");
              return Promise.resolve(false);
            }
            console.log("ERROR ...", e);
            return Promise.resolve(false);
          }
          */
        },
        getPrifinaUserQuery: async (prifinaID) => {
          return await CoreApiClient.graphql(getPrifinaUser, { id: prifinaID });
        },
        // this is incorrect... endpoint can't be updated using stash values.. as each user can have own endpoint
        updateUserProfileMutation: async (prifinaID) => {
          return await CoreApiClient.graphql(updateUserProfile, prifinaID);
        },
        setAuthConfig: (authConfig) => {
          AuthClient.AUTHConfigure(authConfig);
        },
        setAppsyncConfig: (userConfig) => {
          UserApiClient.AppSyncConfigure(userConfig);
        },
        listAppMarketQuery: async (vars) => {
          /*
          variables: {
            filter: opts.filter || {},
            limit: opts.limit || 100,
            sortDirection: opts.sortDirection || "DESC",
            nextToken: opts.nextToken || null,
          },
          */

          return await CoreApiClient.graphql(listAppMarket, vars);
        },
        listAppsQuery: async (vars) => {

          return await CoreApiClient.graphql(listApps, vars);
        },
        getSystemNotificationCountQuery: async (vars) => {
          return await CoreApiClient.graphql(getSystemNotificationCount, vars);
        },
        updateUserActivityMutation: async (vars) => {
          // return await UserApiClient.mutation(updateActivity, vars, "AWS_IAM");
          // variables: { id: id, activeApp: app },
          return await CoreApiClient.graphql(updateUserActivity, vars, "AWS_IAM");
        },
        listDataSourcesQuery: async (vars) => {
          return await CoreApiClient.graphql(listDataSources, vars);
        },
        listSystemNotificationsByDateQuery: async (vars) => {
          return await CoreApiClient.graphql(listSystemNotificationsByDate, vars);
        },
        listNotificationsByDateQuery: async (vars) => {
          return await UserApiClient.query(listNotificationsByDate, vars);
        },
        sendVerificationMutation: async (subject, msg) => {
          return await CoreApiClient.graphql(sendVerification, { subject, message: msg }, "AWS_IAM");
        },
        checkUsernameQuery: async (userName, poolID) => {
          //variables: { attrName: "username", attrValue: userName, poolID: poolID },
          return await CoreApiClient.graphql(checkUsername, { attrName: "username", attrValue: userName, poolID: poolID }, "AWS_IAM");
        },
        getCountryCodeQuery: async (vars = {}) => {
          return await CoreApiClient.graphql(getCountryCode, vars, "AWS_IAM");
        },
        checkCognitoAttributeQuery: async (attrName, attrValue, poolID = get().poolID) => {
          //console.log("CHECK THIS ", await CoreApiClient.graphql(checkCognitoAttribute, vars))
          // variables: { attrName: attrName, attrValue: attrValue, poolID: poolID },
          return await CoreApiClient.graphql(checkCognitoAttribute, { attrName: attrName, attrValue: attrValue, poolID: poolID }, "AWS_IAM");
        },
        updateCognitoUserMutation: async (attrName, attrValue) => {
          //variables: { attrName: attrName, attrValue: attrValue },
          return await CoreApiClient.graphql(updateCognitoUser, { attrName: attrName, attrValue: attrValue });
        },
        getVerificationQuery: async (uname, source, code) => {
          /*
          currentUser.username,
          currentUser.client,
          "email",
          verificationFields.verificationCode,
        ].join("#");
*/
          //let verification = { result: "", user_code: variables.user_code };
          // console.log("TOKEN ", get().authUser)

          const userCode = [uname, AuthClient.AuthConfig.userPoolWebClientId, source, code].join("#");
          const variables = { user_code: userCode }
          const result = await CoreApiClient.graphql(getVerification, variables, "AWS_IAM");
          return Promise.resolve(result.data.getVerification.result);
          //return { data: { getVerification: verification } }
        },
        installWidgetMutation: async (vars) => {
          //variables: { id: id, widget: widget },
          return await CoreApiClient.graphql(installWidget, vars);
        },
        getRequestTokenQuery: async (prifinaID, source, status) => {
          //variables: { id: id, source: source, status: status },
          return await CoreApiClient.graphql(getRequestToken, { id: prifinaID, source, status });
        },
        getLoginUserIdentityPoolQuery: async (uname, poolID) => {

          return await CoreApiClient.graphql(getLoginUserIdentityPool, { username: uname, poolID: poolID }, "AWS_IAM");
        },
        signIn: async (uname, passwd) => {
          const aUser = await AuthClient.signIn(uname, passwd);
          set({ authUser: aUser });
          return aUser;
        },
        setPreferredMFA: async (mfaMethod) => {
          set({ mfaMethod });
          return await AuthClient.setPreferredMFA(get().authUser, mfaMethod);
        },
        confirmSignIn: async (code) => {
          // Optional, MFA Type e.g. SMS_MFA || SOFTWARE_TOKEN_MFA
          const mfa = get().mfaMethod === "SMS" ? "SMS_MFA" : "SOFTWARE_TOKEN_MFA";
          return await AuthClient.confirmSignIn(get().authUser, code, mfa);
        },
        signUp: async (vars) => {
          console.log("SIGNUP ", vars);
          return await AuthClient.signUp(vars);
        },
        logout: async (global = true) => {
          //await Auth.signOut({ global: true });
          return await Auth.signOut({ global });
        },
        getAddressBookQuery: async (vars) => {
          return await UserApiClient.query(getAddressBook, vars);
        },
        // Note this is returning string... but "pipe" (next) to receive push messages..
        /*
        getAthenaResultsSubscription: (vars) => {
          return UserApiClient.subscribe(getAthenaResults, vars);
        }*/
        updatePrifinaUserMutation: async (vars) => {
          // variables: { input: input },
          return await CoreApiClient.graphql(updatePrifinaUser, vars);
        },
        addUserToCognitoGroupMutation: async (id, newGroup) => {
          return await CoreApiClient.graphql(addUserToCognitoGroup, { id: id, group: newGroup });
        },
        newAppVersionMutation: async (vars) => {
          // variables: { input: input },
          return await CoreApiClient.graphql(newAppVersion, vars);
        },
        deleteAppVersionMutation: async (vars) => {
          // variables: { input: input },
          return await CoreApiClient.graphql(deleteAppVersion, vars);
        },
        updateAppVersionMutation: async (vars) => {
          // variables: { input: input },
          return await CoreApiClient.graphql(updateAppVersion, { input: vars });
        },
        getAppVersionQuery: async (vars) => {

          return await CoreApiClient.graphql(getAppVersion, vars);
        },
        subscribeWithSelector: (() => ({ paw: true, snout: true, fur: true })),
        getAIQuery: async (vars) => {
          //{ payload: JSON.stringify({ prompt: "this is a test" }) }
          // return await CoreApiClient.graphql(getAIQuery, { payload: JSON.stringify(vars) });

          return await UserApiClient.query(getAIQuery, { payload: JSON.stringify(vars) });
        },
        getAIDataQuery: async (vars) => {
          //{ payload: JSON.stringify({ prompt: "this is a test" }) }
          //return await CoreApiClient.graphql(getAIDataQuery, { payload: JSON.stringify(vars) });
          return await UserApiClient.query(getAIDataQuery, { payload: JSON.stringify(vars) });
        },
        googleSearch: async (vars) => {
          return await UserApiClient.query(googleSearchQuery, { payload: JSON.stringify(vars) });
        },
        listDataconnectorsQuery: async (vars) => {

          return await CoreApiClient.graphql(listDataconnectorsQuery, vars);
        },
        listDatasourceQuestionsQuery: async (vars) => {

          return await CoreApiClient.graphql(listDatasourceQuestionsQuery, vars);
        },
        listUserDataconnectorsQuery: async (vars) => {

          return await UserApiClient.query(userDataconnectorsQuery, vars);
        },
        getParserAIQuery: async (vars) => {
          return await UserApiClient.query(getParserAIQuery, vars);
        },


        /*
        variables: {
          id: id,
          prifinaId: prifinaId,
          name: opts.name || null,
          title: opts.title || null,
          version: opts.version || null,
          appType: opts.appType || 1,
          identity: opts.identity || null,
          identityPool: opts.identityPool || null,
        },
        */
        /*
        export const updatePrifinaUserMutation = (API, input) => {
          return API.graphql({
            query: updatePrifinaUser,
            variables: { input: input },
            authMode: "AMAZON_COGNITO_USER_POOLS",
          });
        };
        */

      }))}
    >
      {children}
    </Provider>

  );
};


export {
  Provider, useStore, PrifinaStoreProvider,
};
