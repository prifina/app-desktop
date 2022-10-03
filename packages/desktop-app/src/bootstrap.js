import React from "react";


//import { render } from "react-dom";
import ReactDOM from "react-dom/client";
import { default as App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";

import ErrorBoundary from "./ErrorBoundary";
//import { ThemeProvider } from "@blend-ui/core";


//import reportWebVitals from "./reportWebVitals";
/*
render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/*
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('_host-root'));
*/