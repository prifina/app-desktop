import React from "react";

import { render } from "react-dom";
import { default as App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
//import { ThemeProvider } from "@blend-ui/core";
import 'flexboxgrid/dist/flexboxgrid.css';
render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
