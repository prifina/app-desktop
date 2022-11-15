import React from "react";
import { Route, Redirect } from "react-router-dom";
// import { useAppContext } from "@prifina-apps/utils";

import PropTypes from "prop-types";
import { useStore } from "../stores/PrifinaStore";

function querystring(name, url = window.location.href) {
  // eslint-disable-next-line no-param-reassign
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, "i");
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
  // const { isAuthenticated } = useAppContext();
  const redirect = querystring("redirect");

  const authenticated = useStore(state => state.authenticated);
  // const getAuthStatus = useStore(state => state.getAuthStatus);
  // const authenticated = getAuthStatus();
  console.log("UN AUTH ", authenticated);
  const landingPage = "/";

  return (
    <Route {...rest}>
      {!authenticated ? (
        children
      ) : (
        <Redirect
          to={redirect === "" || redirect === null ? landingPage : redirect}
        />
      )}
    </Route>
  );
}

UnauthenticatedRoute.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
};
