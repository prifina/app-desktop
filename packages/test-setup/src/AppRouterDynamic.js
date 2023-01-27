import React from "react";
import { Route, Routes } from "react-router-dom";

import Test from "./Test";

//const Test = React.lazy(() => import("./Test"));


export default () => (
  <Routes>
    <Route path="/test/*" element={<Test />} />
  </Routes>
);
