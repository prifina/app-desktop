/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  useEffect, useState, useRef,
} from "react";

import { ThemeProvider, baseStyles } from "@blend-ui/core";
import { createGlobalStyle } from "styled-components";
// import { AppContext } from "@prifina-apps/utils";
// import { PrifinaStoreProvider } from "./stores/PrifinaStore";
import shallow from "zustand/shallow";
// import { GraphQLContext } from "./lib/GraphQLContext";
// import { GraphQLClient } from "./lib/Client";

// import { mountStoreDevtool } from "simple-zustand-devtools";
// import { useGraphQLContext } from "./lib/GraphQLContext";
import Routes from "./routes/AppRouterDynamic";

import { useStore } from "./stores/PrifinaStore";

const GlobalStyle = createGlobalStyle`
  body {
   ${baseStyles};
  }
`;
function App() {
  // const memoizedClient = useMemo(() => new GraphQLClient(), []);

  // const { client } = useGraphQLContext();

  const { /* setAuthStatus, setUser, */ isLoggedIn, authenticated, getCognitoUserCount } = useStore(
    state => ({
      // setUser: state.setUser,
      // setAuthStatus: state.setAuthStatus,
      isLoggedIn: state.isLoggedIn,
      authenticated: state.authenticated,
      getCognitoUserCount: state.getCognitoUserCount,
    }),
    shallow,
  );
  const [isAuthenticating, setIsAuthenticating] = useState(!authenticated);
  const effectCalled = useRef(false);
  // const isMountedRef = useIsMountedRef();

  // eslint-disable-next-line no-unused-vars
  /*
  const [state, setState] = useReducer(
    (prev, newState) => ({ ...prev, ...newState }),
    {
      isAuthenticating: true,
      currentUser: {},
      isAuthenticated: false,
    },
  );
  */
  /*
      useEffect(() => {
        let ignore = false;
        console.log("OPEN CHANGE ", isVisible);
        return () => {
          ignore = true;
        };
      }, [isVisible]);
    */

  useEffect(() => {
    async function onLoad() {
      effectCalled.current = true;
      // if (!loaded) {
      // SSO requires session token info...
      console.log("SESSION ", effectCalled.current);

      console.log(await getCognitoUserCount());
      await isLoggedIn();
      setIsAuthenticating(false);
      /*
      const currentSession = await client.currentSession();
      console.log("SESSION ", loaded, currentSession);
      if (currentSession) {
        const token = currentSession.getIdToken().payload;
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
        setAuthStatus(true);
        setUser(currentUser);
        setIsAuthenticating(false);
        // setState({ isAuthenticating: false, currentUser, isAuthenticated: true });
      }
      */
    }
    if (!effectCalled.current) {
      onLoad();
    }
    /*
    return () => {
      loaded = true;
    };
    */
  }, [isLoggedIn, setIsAuthenticating]);

  // const { currentUser, isAuthenticating, isAuthenticated } = state;

  return (

    <ThemeProvider>
      <>
        <GlobalStyle />
        {!isAuthenticating && <Routes />}
        {isAuthenticating && <div>Loading...</div>}
      </>
    </ThemeProvider>

  );
}

export default App;
