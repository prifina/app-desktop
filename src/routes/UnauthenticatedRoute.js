import React from "react";
import { Route, Redirect } from "react-router-dom";
//import { useAppContext } from "../lib/contextLib";

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default function UnauthenticatedRoute({ children, ...rest }) {
  console.log('children',children)
  //const { isAuthenticated } = useAppContext();
  const isAuthenticated = false;
  const redirect = querystring("redirect");
  //const schemaId = localStorage.getItem("builderDefaultSchemaId");

  let landingPage = "/";

  return (
    <Route {...rest}>
      {!isAuthenticated ? (
        children
      ) : (
        <Redirect
          to={redirect === "" || redirect === null ? landingPage : redirect}
        />
      )}
    </Route>
  );
}
