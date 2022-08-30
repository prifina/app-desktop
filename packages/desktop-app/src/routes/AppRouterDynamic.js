/* eslint-disable react/display-name */
import React from "react";
import { Route, Switch } from "react-router-dom";

import { NotFoundPage } from "@prifina-apps/utils";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import { ToastContextProvider } from "@blend-ui/toast";

const Home = React.lazy(() => import("../pages/Home"));

const Logout = React.lazy(() => import("../pages/Logout"));
import CoreApps from "../components/CoreApps";
import Landing from "../pages/Landing";

const Login = React.lazy(() => import("../pages/Login"));

export default props => (
  <React.Suspense fallback={"Loading routing..."}>
    <Switch>
      <AuthenticatedRoute path="/core/:app" exact>
        <CoreApps {...props} />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/home" exact>
        <Home />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/" exact>
        <Home />
      </AuthenticatedRoute>
      <UnauthenticatedRoute path="/" exact>
        <Landing />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute path="/login" exact>
        {/* TOAST CONTEXT PROVIDER TEMPORARY HERE */}
        <ToastContextProvider>
          <Login />
        </ToastContextProvider>
      </UnauthenticatedRoute>
      <UnauthenticatedRoute path="/register" exact>
        <Landing />
      </UnauthenticatedRoute>
      <AuthenticatedRoute path="/logout" exact>
        <Logout />
      </AuthenticatedRoute>
      <Route component={NotFoundPage} />
    </Switch>
  </React.Suspense>
);
