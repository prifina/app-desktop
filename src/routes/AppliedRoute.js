import React from "react";
import { Route } from "react-router-dom";

export default function AppliedRoute({ children, ...rest }) {
  return <Route {...rest}>{children}</Route>;
}
