import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
//import { useAppContext } from "../lib/contextLib";

export default function AuthenticatedRoute({ children, ...rest }) {
  const { pathname, search } = useLocation();
  //const { isAuthenticated } = useAppContext();
  //const schemaId = localStorage.getItem("builderDefaultSchemaId");
  //console.log("AUTH ROUTE ", isAuthenticated, schemaId);
  const isAuthenticated = false;
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
/*

import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }) => {
    console.log('AUTH...',cProps);
    return (<Route
        {...rest}
        render={props =>
            cProps.isAuthenticated
                ? <C {...props} {...cProps} />
                : <Redirect
                    to={`/signin?redirect=${props.location.pathname}${props.location
                        .search}`}
                />}
    />);
}
*/
