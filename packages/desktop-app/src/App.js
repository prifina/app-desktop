// /* global localStorage */

import React, { useEffect, useReducer, useRef } from "react";

import Routes from "./routes/AppRouterDynamic";

import { ThemeProvider, baseStyles } from "@blend-ui/core";
import { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`
  body {
   ${baseStyles};
  }
`;

function App() {

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

  return (

    <ThemeProvider>
      <GlobalStyle />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
