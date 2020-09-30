/* global localStorage */

import React, { useEffect, useState, useRef, useReducer } from "react";
import { useHistory } from "react-router-dom";

import { withRouter } from "react-router-dom";
import Routes from "./routes/AppRouterDynamic";
//import { createTheme } from "@blend-ui/core";
//import { default as builderTheme } from "./theme";
//import { ThemeProvider } from "styled-components";
import { ThemeProvider } from "@blend-ui/core";

//import { AppContext } from "./lib/contextLib";

//import { Auth } from "aws-amplify";

//const theme = createTheme(builderTheme);

function App() {
  const history = useHistory();
  console.log("APP START");
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      isAuthenticating: false,
      currentUser: {},
      isAuthenticated: false,
    }
  );
  // const isMountedRef = useIsMountedRef();
  /*
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      schemaInfo: {},
      isUpdated: true,
      isAuthenticating: true,
      currentUser: {},
      isAuthenticated: false,
    }
  );
  */

  /*
  useEffect(() => {
    async function onLoad() {
      let _currentUser = {};
      try {
        //await Auth.currentSession();
        // console.log("AUTH CHECK ", isAuthenticating);
        initAuth(false);
        const _currentSession = await Auth.currentSession();
       
        console.log("APP AUTH ", _currentSession);
        //console.log("USER ", _currentSession.getIdToken().payload);
        const token = _currentSession.getIdToken().payload;
        _currentUser = {
          username: token["cognito:username"],
          organization: token["custom:organization"] || "",
        };
     

        const _defaultSchema = await emptySchema();
        //setDefaultSchema(_defaultSchema);
        localStorage.setItem(
          "builderDefaultSchema",
          JSON.stringify(_defaultSchema)
        );
        //localStorage.setItem('builderDefaultSchemaId', 'unique-id');
        setState({
          isAuthenticating: false,
          currentUser: _currentUser,
          isAuthenticated: true,
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
      //setState({ isAuthenticating: false, currentUser: _currentUser });
      //setIsAuthenticating(false);
    }

    onLoad();
  }, [state.isAuthenticated]);
*/

  /*
  const _userAuth = (auth) => {
    initAuth(false);
    //userHasAuthenticated(auth);
    setState({ isAuthenticated: auth });
  };
  const _updateContent = (update) => {
    setState({ isUpdated: update });
  };
  */
  /*
  const {
    schemaInfo,
    isUpdated,
    currentUser,
    isAuthenticating,
    isAuthenticated,
  } = state;
  */
  const { currentUser, isAuthenticating, isAuthenticated } = state;

  //console.log("AUTH CHECK ", isAuthenticating, isUpdated, schemaId);
  //{(!isAuthenticating && !isUpdated) || (schemaId === null && <Routes />)}
  return (
    <ThemeProvider>
      {!isAuthenticating && <Routes />}
      {isAuthenticating && <div>Loading...</div>}
    </ThemeProvider>
  );
}

export default withRouter(App);
