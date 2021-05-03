/* eslint-disable react/display-name */
import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";

import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
//import AppliedRoute from "./AppliedRoute";

//const Dashboard = React.lazy(() => import("../components/Dashboard"));
//const Login = React.lazy(() => import("../components/Login"));
const Home = React.lazy(() => import("../pages/Home"));
//import Home from "../pages/Home";
//const Settings = React.lazy(() => import("../pages/Settings"));
const Logout = React.lazy(() => import("../pages/Logout"));
import CoreApps from "../components/CoreApps";
import Landing from "../pages/Landing";

export default props => (
  <React.Suspense fallback={"Loading routing..."}>
    <Switch>
      {/* 
      <AppliedRoute path="/" exact>
        <Landing />
      </AppliedRoute>
      <AppliedRoute path="/home" exact>
        <Home />
      </AppliedRoute>
      */}
      <AuthenticatedRoute path="/core/:app" exact>
        <CoreApps {...props} />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/home" exact>
        <Home />
      </AuthenticatedRoute>
      {/* 
      <AuthenticatedRoute path="/settings" exact>
        <Settings />
      </AuthenticatedRoute>
      */}
      <AuthenticatedRoute path="/" exact>
        <Home />
      </AuthenticatedRoute>
      <UnauthenticatedRoute path="/" exact>
        <Landing />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute path="/login" exact>
        <Landing />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute path="/register" exact>
        <Landing />
      </UnauthenticatedRoute>
      <AuthenticatedRoute path="/logout" exact>
        <Logout />
      </AuthenticatedRoute>
      {/*
      <AuthenticatedRoute path="/verify-email" exact>
        <Landing />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/verify-phone" exact>
        <Landing />
      </AuthenticatedRoute>
      */}

      <Route component={NotFoundPage} />
    </Switch>
  </React.Suspense>
);
