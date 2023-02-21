import React, { useRef, useState } from "react";

import ReactJson from "react-json-view";

import shallow from "zustand/shallow";
import { useAppStudioStore } from "../hooks/UseAppStudio";

import styled from "styled-components";
import { Box, } from "@blend-ui/core";

const DebugContainer = styled(Box)`
height:352px;
border: 1px solid white;
width: 100%;
overflow-y: auto;
scrollbar-width: 12px;
scrollbar-color: #D62929 #F5F5F5;

::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar
{
  width: 12px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #D62929;
}
`

const SandboxDebugger = () => {


  const { debugInfo } = useAppStudioStore((state) => ({
    debugInfo: state.debugInfo
  }),
    shallow);

  const currentDebugInfo = useRef(debugInfo);
  const [debuggerData, setDebuggerData] = useState(debugInfo);


  const unsubStore = useAppStudioStore.subscribe((state) => {
    console.log("STORE DEBUG SUBSCRIBE ", state.debugInfo);
    //[{ "label": "City", "field": "city", "type": "text", "value": "Pori" }]
    if (JSON.stringify(currentDebugInfo.current) !== JSON.stringify(state.debugInfo)) {

      console.log("UPDATE DEBUGGER... ", state.debugInfo);
      currentDebugInfo.current = JSON.parse(JSON.stringify(state.debugInfo));
    }


  })


  return <>
    <DebugContainer >
      <ReactJson src={debuggerData} theme={"monokai"} />
    </DebugContainer>
  </>
}

export default SandboxDebugger;
