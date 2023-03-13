/* eslint-disable react/display-name */
import React from "react";
import { Route, Routes } from "react-router-dom";

import { NotFoundPage } from "@prifina-apps/ui-lib";
import AuthLayout from "./AuthLayout";
import UnAuthLayout from "./UnAuthLayout";

const Home = React.lazy(() => import("../pages/Home"));
const CoreApps = React.lazy(() => import("../components/CoreApps"));

const Login = React.lazy(() => import("../pages/Login"));
const CreateAccount = React.lazy(() => import("../pages/CreateAccount-v2"));
import TestPage from "./TestPage";
//const TestPage = () => <div>TEST OK</div>;
//const AuthenticatedPage = () => <div>AUTH OK</div>;
//const UnAuthenticatedPage = () => <div>UNAUTH OK</div>;

export default (props) => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/test" element={<TestPage />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/system/:app"
        element={
          <CoreApps {...props} />
        }
      />
    </Route>

    <Route element={<UnAuthLayout />}>
      <Route path="/" element={<Login />} />
      <Route path="/login/*" element={<Login />} />
      <Route path="/register/*" element={<CreateAccount />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
