/* eslint-disable react/display-name */
import React from "react";
import { Route, Routes } from "react-router-dom";

import { NotFoundPage } from "@prifina-apps/utils";
import AuthLayout from "./AuthLayout";
import UnAuthLayout from "./UnAuthLayout";

import { useStore } from "../stores/PrifinaStore";
/*
const Home = React.lazy(() => import("../pages/Home"));
const CoreApps = React.lazy(() => import("../components/CoreApps"));
const Landing = React.lazy(() => import("../pages/Landing"));
const Logout = React.lazy(() => import("../pages/Logout"));
const Login = React.lazy(() => import("../pages/Login"));
*/
const AuthenticatedPage = () => <div>AUTH OK</div>;
const UnAuthenticatedPage = () => <div>UNAUTH OK</div>;
const LoginPage = () => {
  const getAuthStatus = useStore(state => state.getAuthStatus);
  console.log("LOGIN PAGE ", getAuthStatus());
  return <div>LOGIN OK</div>;
};
const UsersPage = () => <div>Users</div>;
const TablesPage = () => <div>Tables</div>;

export default () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/" element={<AuthenticatedPage />} />
      <Route path="/dashboard" element={<UsersPage />} />
      <Route path="/users/*" element={<TablesPage />} />
      <Route path="/tables/*" element={<AuthenticatedPage />} />
    </Route>

    <Route element={<UnAuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<UnAuthenticatedPage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
