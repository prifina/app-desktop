import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";

export default function AuthenticatedRoute({ children, ...rest }) {
  const { pathname, search } = useLocation();
  const { isAuthenticated, currentUser } = useAppContext();
  //const schemaId = localStorage.getItem("builderDefaultSchemaId");
  console.log("AUTH ROUTE ", isAuthenticated, currentUser);
  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={`/login?redirect=${pathname}${search}`} />
      )}
    </Route>
  );
}
