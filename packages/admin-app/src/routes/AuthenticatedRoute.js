import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
// import { useAppContext } from "@prifina-apps/utils";
import PropTypes from "prop-types";
import { useStore } from "../stores/PrifinaStore";

// import shallow from 'zustand/shallow'

export default function AuthenticatedRoute({ children, ...rest }) {
  const { pathname, search } = useLocation();
  const authenticated = useStore(state => state.authenticated);
  // const getAuthStatus = useStore(state => state.getAuthStatus);
  // const authenticated = getAuthStatus();
  // const { isAuthenticated, currentUser } = useAppContext();
  /*
   const { getCountryCodeQuery, resendCode, verifyCode } = useStore((state) => ({ getCountryCodeQuery: state.getCountryCodeQuery, verifyCode: state.verifyCode, resendCode: state.resendCode }),
   shallow
  );
  */

  console.log("AUTH ROUTE ", authenticated);
  return (
    <Route {...rest}>
      {authenticated ? (
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
