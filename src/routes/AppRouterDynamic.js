import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";

import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";

//const Dashboard = React.lazy(() => import("../components/Dashboard"));
//const Login = React.lazy(() => import("../components/Login"));
import Landing from "../pages/Landing";
import AppDetail from "../pages/AppDetail";
import Listing from "../pages/Listing";

export default () => (
  <React.Suspense fallback={"Loading routing..."}>
    <Switch>
      <UnauthenticatedRoute path="/" exact component={Landing}/>
      <UnauthenticatedRoute path="/detail" exact component={AppDetail}/>
      <UnauthenticatedRoute path="/listing" exact component={Listing}/>
     

      <Route component={NotFoundPage} />
    </Switch>
  </React.Suspense>
);
