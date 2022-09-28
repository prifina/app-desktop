/* eslint-disable react/display-name */
import React from "react";
import { Route, Routes } from "react-router-dom";

import AuthLayout from "./AuthLayout";
import UnAuthLayout from "./UnAuthLayout";

import { NotFoundPage } from "@prifina-apps/utils";
import { ToastContextProvider } from "@blend-ui/toast";

const Home = React.lazy(() => import("../pages/Home"));
//import Home from "../pages/Home";

const CoreApps = React.lazy(() => import("../components/CoreApps"));
const Landing = React.lazy(() => import("../pages/Landing"));

const Logout = React.lazy(() => import("../pages/Logout"));
//import CoreApps from "../components/CoreApps";
//import Landing from "../pages/Landing";

const Login = React.lazy(() => import("../pages/Login"));

export default (props) => (
  <Routes>
    <Route element={<AuthLayout />} >
      <Route path="/system/:app" element={<CoreApps {...props} />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/logout" element={<Logout />} />
    </Route>

    <Route element={<UnAuthLayout />} >
      <Route path="/login" element={<ToastContextProvider><Login /></ToastContextProvider>} />
      <Route path="/register" element={<Landing />} />
      <Route path="/" element={<Landing />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
