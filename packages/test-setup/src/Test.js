// /* global localStorage */

import React, { forwardRef, useRef } from "react";

import { Remote } from "@prifina-apps/remote";

import { Route, Routes } from "react-router-dom";

const RemotePage = () => {
  const settingsInit = { data: { settings: { "field": "city", "value": "Pori" } } };
  const wRef = useRef();
  return (<>
    <Remote
      ref={wRef}
      componentProps={{ ...settingsInit }}
      system={{
        remote: "o3CH1e2kbrLgBxjbG2iLzd",
        url: "dist/remoteEntry.js",
        module: "./App",
      }}
    />

  </>)
}
//const Test = forwardRef((props, ref) => {
const Test = () => {

  return (<>
    <div>TEST </div>
    <RemotePage />
  </>
  );
}

export default Test;
