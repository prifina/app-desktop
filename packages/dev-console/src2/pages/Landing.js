import React, { useState } from "react";

//import { useAppContext } from "../lib/contextLib";

import { useHistory, useLocation } from "react-router-dom";

import { ToastContextProvider } from "@blend-ui/toast";

import Login from "./Login";

import Home from "./Home";

import { useAppContext, i18n } from "@prifina-apps/utils";

//import i18n from "../lib/i18n";
i18n.init();

const Landing = props => {
  console.log("LANDING ", props);
  const history = useHistory();
  const { isAuthenticated, mobileApp } = useAppContext();
  const { pathname, search } = useLocation();
  let initStep = 5;
  if (pathname === "/login") {
    initStep = 5;
  } else if (pathname === "/register") {
    initStep = 1;
  } else if (pathname === "/home" && isAuthenticated) {
    initStep = 6;
  }
  const [stepCounter, setStepCounter] = useState(initStep);
  return (
    <React.Fragment>
      <ToastContextProvider>
        {stepCounter === 5 && <Login />}
        {stepCounter === 6 && <Home />}
        {stepCounter === 1 && (
          <div>
            Landing {isAuthenticated ? "Authenticated" : "Unauthenticated"}{" "}
          </div>
        )}
      </ToastContextProvider>
    </React.Fragment>
  );
};

//<img src={Plate} height={"920px"} width={"795px"} />
export default Landing;
