import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";

import { useAppContext } from "@prifina-apps/utils";

import PropTypes from "prop-types";

export default function AuthenticatedRoute({ children, ...rest }) {
  const { pathname, search } = useLocation();
  const { isAuthenticated, currentUser } = useAppContext();

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

AuthenticatedRoute.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
};
