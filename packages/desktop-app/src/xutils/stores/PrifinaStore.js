/* eslint-disable react/prop-types */
import React from "react";
import create from "zustand";

import createContext from "zustand/context";

// see below...not working with povider
//import { mountStoreDevtool } from "simple-zustand-devtools";
import { useGraphQLContext } from "../graphql/GraphQLContext";
/*
import {
  getCognitoUserCount, getCognitoMetrics, getCognitoMetricImage, getCognitoUserDetails,
} from "../lib/queries";

import {
  updateCognitoUser,
} from "../lib/mutations";
*/

import config from "../../config";

const { Provider, useStore } = createContext(null);


// if (process.env.NODE_ENV === "development") {
//if (process.env.STORYBOOK_STATES) {
// doesn't work with provider...
// mountStoreDevtool("Store", useStore);
//}

const PrifinaStoreProvider = ({ children }) => {
  // const { user, authenticated } = useAppContext();
  // console.log("STORE CTX ", user, authenticated);
  const { AuthClient, CoreApiClient } = useGraphQLContext();
  // const client = useGraphQLContext();
  console.log("AUTH ", AuthClient);
  console.log("GRAPHQL", CoreApiClient);

  return (
    <Provider createStore={() =>
      create((set, get) => ({
        user: {},
        authenticated: false,
        getUser: () => get().user,
        setUser: currentUser => {
          set({ user: currentUser });
        },
        setAuthStatus: status => {
          set({ authenticated: status });
        },
        getAuthStatus: () => get().authenticated,

        isLoggedIn: async () => {
          return Promise.resolve(true);
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

      }))}
    >
      {children}
    </Provider>

  );
};


export {
  Provider, useStore, PrifinaStoreProvider,
};
