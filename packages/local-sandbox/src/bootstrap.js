import React from "react";

//import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client';
import { default as App } from "./App";
import * as serviceWorker from "./serviceWorker";

import ErrorBoundary from "./ErrorBoundary";

import { PrifinaProvider, PrifinaContext } from "@prifina/hooks-v2";
import "./normalize.css";


const container = document.getElementById("root");
const root = createRoot(container);

// stage dev===offline data from data connector
// stage sandbox=== real endpoint request, response mockup generated data
// stage prod=== real endpoint request and response 

const prifinaID = "6145b3af07fa22f66456e20eca49e98bfe35";
root.render(
  <React.StrictMode>
    <ErrorBoundary>

      <PrifinaProvider
        stage={"sandbox"}
        Context={PrifinaContext}
        activeUser={{ uuid: prifinaID }}
        activeApp={"Sandbox"}
      >
        <App />
      </PrifinaProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
