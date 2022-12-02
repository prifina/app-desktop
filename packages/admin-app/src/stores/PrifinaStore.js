/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import create from "zustand";

import createContext from "zustand/context";

import { mountStoreDevtool } from "simple-zustand-devtools";
import { useGraphQLContext } from "../lib/GraphQLContext";
import {
  getCognitoUserCount, getCognitoMetrics, getCognitoMetricImage, getCognitoUserDetails,
} from "../lib/queries";

import {
  updateCognitoUser,
} from "../lib/mutations";

import config from "../config";

// import { useAppContext } from "@prifina-apps/utils";

// eslint-disable-next-line no-unused-vars

/*
import {
  deleteDataModel, createDataModel, updateDataModel, getDataModel, listDataModels, getCountryCode,
} from "@builder/lib";
import { useGraphQLContext } from "./GraphQLContext";
*/

const { Provider, useStore } = createContext(null);

// export const SchemaStoreProvider = Provider;
// export const useSchemaStore = useStore;

/*
const useStore: UseContextStore<TState> = <StateSlice>(
  selector?: StateSelector<TState, StateSlice>,
  equalityFn = Object.is
) => {
  const useProviderStore = useContext(ZustandContext)
  return useProviderStore(
    selector as StateSelector<TState, StateSlice>,
    equalityFn
  )
}
*/
/*
export const AccountContext = createContext(null);

export function useAccountContext() {
  return useContext(AccountContext);
}

const createStore = () =>
  create((set) => ({

*/
const testData = (data, opt) => {
  console.log(data, opt);
  return Promise.resolve(true);
};

const createStore = () => create((set, get) => ({
  schema: {},
  // init: entry => set(state => ({ schema: { ...state.schema, ...entry } })),
  // update: entry => set(state => ({ schema: { ...state.schema, ...entry } })),
  updateObj: entry => set(state => ({ schema: { ...state.schema, ...entry } })),
  archive: async () => Promise.resolve(true),
  newVersion: async () => {
    const currentSchema = get().schema;
    let majorDigit = currentSchema?.major || 0;
    majorDigit++;
    currentSchema.major = majorDigit;
    currentSchema.minor = 0;

    currentSchema.status = 2; // build
    await get().update(currentSchema);

    /*
  const _versionClick = async (event) => {
    console.log("Version ");
    event.preventDefault();

    let _schema = { uuid: schemaId };
    _schema["major"] = state.schemaInfo.major || 0;
    _schema["minor"] = 0;
    _schema["status"] = 2;
    _schema["major"]++;
    const result = await updateDataModelsMutation(_schema);
    console.log("SAVE ", result);
    //schemaUpdated(true);
    //history.replace("/build");
  };
*/
  },
  update: async data => {
    // store data somewhere...
    // const response = await fetch(pond)
    // set({ fishies: await response.json() })
    // localStorage.setItem("builderDefaultSchema", JSON.stringify(data));
    console.log("SCHEMA STORE ", data);
    if (data.name === "") {
      return Promise.reject(new Error("Empty values not allowed"));
      // return Promise.reject("Empty values not allowed");
    }
    const currentSchema = get().schema;
    console.log("CURRENT SCHEMA ", currentSchema);
    // object structure should be same...
    if (JSON.stringify(data) !== JSON.stringify(currentSchema)) {
      const changedKeys = {};
      Object.keys(data).forEach(k => {
        if (currentSchema[k] !== data[k]) {
          changedKeys[k] = data[k];
        }
      });
      if (Object.keys(changedKeys).length > 0) {
        set({ schema: { ...currentSchema, ...changedKeys } });
      }
    }

    return Promise.resolve(true);
  },
  create: async data => {
    // store data somewhere...
    // const response = await fetch(pond)
    // set({ fishies: await response.json() })
    // localStorage.setItem("builderDefaultSchema", JSON.stringify(data));
    if (data.name === "") {
      return Promise.reject(new Error("Empty values not allowed"));
      // return Promise.reject("Empty values not allowed");
    }

    // const result = await makeRequest("mutation", createDataModel, { input: data });
    // console.log("CREATE ", result);
    set({ schema: data });

    return Promise.resolve(true);
  },
  test: data => testData(data, get().schema),

  mockup: (key, entry) => set({ [key]: entry }),
}));

// if (process.env.NODE_ENV === "development") {
if (process.env.STORYBOOK_STATES) {
  // doesn't work with provider...
  // mountStoreDevtool("Store", useStore);
}

const SchemaStoreProvider = ({ defaultSchema, actions, children }) => {
  const { client } = useGraphQLContext();
  console.log("PROVIDER CLIENT ", client);
  console.log("PROVIDER ACTIONS ", actions);
  return (
    <Provider createStore={() =>
      create((set, get) => ({
        schema: defaultSchema || {},
        newVersion: async () => {
          // console.log("NEW VERSION");
          if (actions.versionClick) {
            actions.versionClick("SB mockup");
          }
          const currentSchema = get().schema;
          let majorDigit = currentSchema?.major || 0;
          majorDigit++;
          currentSchema.major = majorDigit;
          currentSchema.minor = 0;

          currentSchema.status = 2; // build
          currentSchema.modifiedAt = new Date().toISOString();
          currentSchema.createdAt = new Date().toISOString();
          currentSchema.versionId = currentSchema.id;
          set({ schema: currentSchema });

          const copySchema = { ...currentSchema };

          // these are not in schema input object
          delete copySchema.modifiedAt;
          delete copySchema.createdAt;
          // resolver will new create unique id
          delete copySchema.id;
          await client.mutation(createDataModel, { input: copySchema });
          // console.log(await client.query(getCountryCode));
          // console.log(await client.query(getDataModel));
        },
      }))}
    >
      {children}
    </Provider>
  );
};

/*
 return _remoteClient.mutate({
      mutation: gql(addNotification),
      variables: {
        input: {
          body: msg.body,
          owner: receiver,
          type: "MESSAGING",
          sender: msg.sender,
          app: coreApp,
        },
      },
    });

const currentPrifinaUser = await getPrifinaUserQuery(
  GRAPHQL,
  prifinaID,
);

export const addPrifinaSessionMutation = (API, input) => {
  return API.graphql({
    query: addPrifinaSession,
    variables: { input: input },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const getPrifinaUserQuery = (API, id) => {
  //console.log("API ", id);
  return API.graphql({
    query: getPrifinaUser,
    variables: { id: id },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const updateUserProfileMutation = (API, id, profile = null) => {
  return API.graphql({
    query: updateUserProfile,
    variables: { id: id, profile: profile },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

*/

const PrifinaStoreProvider = ({ children }) => {
  // const { user, authenticated } = useAppContext();
  // console.log("STORE CTX ", user, authenticated);
  const { client, GRAPHQL } = useGraphQLContext();
  // const client = useGraphQLContext();
  console.log("CLIENT ", client);
  console.log("GRAPHQL", GRAPHQL);

  return (

    <Provider createStore={() =>
      create((set, get) => ({
        getCognitoUserCount: async () => GRAPHQL.graphql(getCognitoUserCount, { poolID: config.cognito.USER_POOL_ID }),
        getCognitoMetrics: async () => GRAPHQL.graphql(getCognitoMetrics, {}),
        getCognitoMetricImage: async () => GRAPHQL.graphql(getCognitoMetricImage, {}),
        getCognitoUserDetails: async attrs => GRAPHQL.graphql(getCognitoUserDetails, attrs),
        updateCognitoUserDetails: async attrs => GRAPHQL.graphql(updateCognitoUser, attrs),

        user: {},
        authenticated: false,

        isLoggedIn: async () => {
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
        },
        getUser: () => get().user,
        setUser: currentUser => {
          set({ user: currentUser });
        },
        setAuthStatus: status => {
          set({ authenticated: status });
        },
        getAuthStatus: () =>
          // console.log("USER STORE ", get().userData);
          get().authenticated
        ,
      }))}
    >
      {children}
    </Provider>
  );
};

export {
  Provider, useStore, PrifinaStoreProvider,
};
