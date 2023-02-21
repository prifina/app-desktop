/* eslint-disable react/display-name */
import React from "react";
import { Route, Routes } from "react-router-dom";

import { NotFoundPage } from "@prifina-apps/utils";
import AuthLayout from "./AuthLayout";
import UnAuthLayout from "./UnAuthLayout";

//const Home = React.lazy(() => import("../pages/Home-v2"));
//const CoreApps = React.lazy(() => import("../components/CoreApps"));

const Login = React.lazy(() => import("../pages/Login"));
const CreateAccount = React.lazy(() => import("../pages/CreateAccount-v2"));

//const ProjectDetails = React.lazy(() => import("../pages/ProjectDetails-v2"));
const Landing = React.lazy(() => import("../pages/Landing-v2"));

import Sandbox
  from "../pages/Sandbox-v2";
//import TestPage from "./TestPage";
const TestPage = () => <div>TEST OK</div>;
const AuthenticatedPage = () => <div>AUTH OK</div>;
const UnAuthenticatedPage = () => <div>UNAUTH OK</div>;
export default (props) => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/test" element={<TestPage />} />
      <Route path="/app/*" element={<Landing />} />
      <Route path="/sandbox/:app" element={<Sandbox />} />
      <Route path="/register/role/*" element={<CreateAccount />} />
    </Route>

    <Route element={<UnAuthLayout />}>
      <Route path="/" element={<UnAuthenticatedPage />} />

      <Route path="/login/*" element={<Login />} />

      <Route path="/register/*" element={<CreateAccount />} />

    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
