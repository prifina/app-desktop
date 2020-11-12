import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";

import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import AppliedRoute from "./AppliedRoute";

//const Dashboard = React.lazy(() => import("../components/Dashboard"));
//const Login = React.lazy(() => import("../components/Login"));
import Landing from "../pages/Landing";

export default () => (
  <React.Suspense fallback={"Loading routing..."}>
    <Switch>
      <AppliedRoute path="/" exact>
        <Landing />
      </AppliedRoute>
      <UnauthenticatedRoute path="/login" exact>
        <Landing />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute path="/register" exact>
        <Landing />
      </UnauthenticatedRoute>
      <AuthenticatedRoute path="/verify-email" exact>
        <Landing />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/verify-phone" exact>
        <Landing />
      </AuthenticatedRoute>

      <Route component={NotFoundPage} />
    </Switch>
  </React.Suspense>
);
