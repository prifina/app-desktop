import React, { useRef,  } from "react";
import {Remote} from "@prifina-apps/remote";


const RemoteTest = props => {

  const remoteRef=useRef();

  return (
    <>
    <div>Remote Host</div>
    
    <Remote ref={remoteRef}
  componentProps={{ schema: { test: "cra works2" } }}
  system={{
    remote: "mfeApp2",
    url:"dist/remoteEntry.js",
    //url:"http://internal.prifina.com.s3-website-us-east-1.amazonaws.com/dist/remoteEntry.js",
    //url: "https://cdn.jsdelivr.net/gh/data-modelling/builder-plugins@main/packages/json-view/dist/remoteEntry.js",
    module: "./App",
  }} />
  
        
    </>
  )
}    


export default RemoteTest