import React from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:" + process.env.REACT_APP_MOCKUP_SERVER_PORT;

const getSubscriptionData = (cb, vars, event) => {
  console.log("EVENT ", event);
  const socket = socketIOClient(ENDPOINT);
  socket.on("FromAPI", data => {
    console.log("FromAPI ", data)
    //setResponse(JSON.stringify(data));
    cb(data);
  });
  return socket;
  // CLEAN UP THE EFFECT
  //return () => socket.disconnect();

  /*
  const timer = setInterval(() => {
    // generate mockup notification.... 
    cb({ "data": "OK" });
  }, 2 * 1000 * 60);
  */

}


export { getSubscriptionData };