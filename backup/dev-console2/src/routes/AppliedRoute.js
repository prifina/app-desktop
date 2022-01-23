import React from "react";
import { Route } from "react-router-dom";

import PropTypes from "prop-types";
export default function AppliedRoute({ children, ...rest }) {
  return <Route {...rest}>{children}</Route>;
}

AppliedRoute.propTypes = {
  children: PropTypes.elementType.isRequired,
};
