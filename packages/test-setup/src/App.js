// /* global localStorage */

import React, { useEffect, useReducer, useRef } from "react";

//import Test from "./Test";
import Routes from "./AppRouterDynamic";
function App() {
  const wRef = useRef();
  return (<>
    <div>TESTING </div>
    <Routes />
    {/* 
    <Test ref={wRef} />
*/}
  </>
  );
}

export default App;
