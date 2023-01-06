import React from "react";

import shallow from "zustand/shallow";

import { GraphQLContext } from "../src/graphql/GraphQLContext";

import { AUTHClient, CoreGraphQLApi } from "../src/lib/MockClient";

import { PrifinaStoreProvider, useStore } from "../src/stores/PrifinaStore";

const CoreApiClient = new CoreGraphQLApi();

const AuthClient = new AUTHClient();

const MockApp = () => {

  const { authenticated, setAuthStatus, getAuthStatus, user, getUser, setUser } = useStore(
    state => ({
      authenticated: state.authenticated,
      setAuthStatus: state.setAuthStatus,
      getAuthStatus: state.getAuthStatus,
      user: state.user,
      getUser: state.getUser,
      setUser: state.setUser
    }),
    shallow,
  );
  //console.log("MOCK APP ");
  return <>
    {!authenticated && "AUTH FALSE"}
    {authenticated && "AUTH TRUE"}
    {getAuthStatus() ? "AUTH_STATUS_TRUE" : "AUTH_STATUS_FALSE"}
    {"USER_OBJ === " + JSON.stringify(user)}
    {"GET_USER === " + JSON.stringify(getUser())}
    <button role="clickSetAuthTrue" onClick={() => {
      setAuthStatus(true);
    }}>AUTH</button>
    <button role="clickSetAuthFalse" onClick={() => {
      setAuthStatus(false);
    }}>AUTH</button>
    <button role="clickSetUser" onClick={() => {
      console.log("SET USER ");
      setUser({ "test": "OK" });
    }}>USER</button>
    <div>{"READY"}</div>
  </>
}

export const MockProvider = () => <React.StrictMode>
  <GraphQLContext.Provider value={{ AuthClient, CoreApiClient }}>
    <PrifinaStoreProvider>
      <MockApp />
    </PrifinaStoreProvider>
  </GraphQLContext.Provider>
</React.StrictMode>
