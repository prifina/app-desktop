import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4001";

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      console.log("FromAPI ", data)
      setResponse(JSON.stringify(data));
    });

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();

  }, []);

  return (
    <>
      <p>
        It's <time dateTime={response}>{response}</time>
      </p>
      <button onClick={() => {

        console.log("CLICK ");
        fetch(ENDPOINT + "/new-notification", { mode: 'no-cors' }).then(response => response.json())
          .then(data => {
            console.log("FETCH ", data);

          })
          .catch(error => {
            console.error("FETCH ", error)
          });
      }}>GET NOTIFICATION</button>
    </>
  );
}

export default App;