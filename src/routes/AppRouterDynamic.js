import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";

import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";

//const Dashboard = React.lazy(() => import("../components/Dashboard"));
//const Login = React.lazy(() => import("../components/Login"));
import Landing from "../pages/Landing";

export default () => (
  <React.Suspense fallback={"Loading routing..."}>
    <Switch>
      <UnauthenticatedRoute path="/" exact>
        <Landing />
      </UnauthenticatedRoute>

      <Route component={NotFoundPage} />
    </Switch>
  </React.Suspense>
);
