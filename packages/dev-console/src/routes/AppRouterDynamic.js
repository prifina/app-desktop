import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";

import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import AppliedRoute from "./AppliedRoute";
const Home = React.lazy(() => import("../pages/Home"));
const Logout = React.lazy(() => import("../pages/Logout"));
const Admin = React.lazy(() => import("../pages/Admin"));
const Sandbox = React.lazy(() => import("../pages/Sandbox"));
const NewApp = React.lazy(() => import("../pages/NewApp"));
const Register = React.lazy(() => import("../pages/Register"));
const Login = React.lazy(() => import("../pages/Login"));

const UploadApp = React.lazy(() => import("../components/UploadApp"));


//const RemoteTest = React.lazy(() => import("../pages/RemoteTest"));

import Landing from "../pages/Landing";

export default () => (

  <Routes>
    <AuthenticatedRoute path="/upload" exact>
      <UploadApp />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/new-app" exact>
      <NewApp />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/admin" exact>
      <Admin />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/sandbox" exact>
      <Sandbox />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/test" exact>
      <Landing />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/home" exact>
      <Home />
    </AuthenticatedRoute>

    <AppliedRoute path="/" exact>
      <Home />
    </AppliedRoute>
    <AuthenticatedRoute path="/register" exact>
      <Register />
    </AuthenticatedRoute>

    <UnauthenticatedRoute path="/login" exact>
      <Login />
    </UnauthenticatedRoute>
    {/* 
      <AuthenticatedRoute path="/remote" exact>
        <RemoteTest />
      </AuthenticatedRoute>
      
      <UnauthenticatedRoute path="/" exact>
        <Landing />
      </UnauthenticatedRoute>
      */}

    {/* <UnauthenticatedRoute path="/register" exact>
        <Landing />
      </UnauthenticatedRoute> */}
    {/* <AuthenticatedRoute path="/logout" exact>
        <Logout />
      </AuthenticatedRoute> */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
