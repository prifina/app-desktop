/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { GraphQLContext } from "./lib/GraphQLContext";
import { GraphQLClient, API } from "./lib/Client";
import { PrifinaStoreProvider } from "./stores/PrifinaStore";
import reportWebVitals from "./reportWebVitals";

// here can select mockup client instead.... :)
const PrifinaClient = new GraphQLClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GraphQLContext.Provider value={{ client: PrifinaClient, GRAPHQL: API }}>
      <PrifinaStoreProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PrifinaStoreProvider>
    </GraphQLContext.Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
