import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";

//import AuthenticatedRoute from "./AuthenticatedRoute";
//import UnauthenticatedRoute from "./UnauthenticatedRoute";
//import AppliedRoute from "./AppliedRoute";
import AuthLayout from "./AuthLayout";
import UnAuthLayout from "./UnAuthLayout";

const Home = React.lazy(() => import("../pages/Home"));
const Logout = React.lazy(() => import("../pages/Logout"));
const Admin = React.lazy(() => import("../pages/Admin"));
const Sandbox = React.lazy(() => import("../pages/Sandbox"));
const NewApp = React.lazy(() => import("../pages/NewApp"));
const Register = React.lazy(() => import("../pages/Register"));
const Login = React.lazy(() => import("../pages/Login"));

const Landing = React.lazy(() => import("../pages/Landing"));

const UploadApp = React.lazy(() => import("../components/UploadApp"));

//const RemoteTest = React.lazy(() => import("../pages/RemoteTest"));

//import Landing from "../pages/Landing";

import { ToastContextProvider } from "@blend-ui/toast";

export default () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/upload" element={<UploadApp />} />
      <Route path="/new-app" element={<NewApp />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/sandbox" element={<Sandbox />} />
      <Route path="/home" element={<Home />} />
      <Route path="/project/:app" element={<Home />} />
      <Route path="/register-role" element={<Register />} />
    </Route>
    <Route element={<UnAuthLayout />}>
      <Route
        path="/login"
        element={
          <ToastContextProvider>
            <Login />
          </ToastContextProvider>
        }
      />
      <Route path="/register" element={<Landing />} />
      <Route path="/" element={<Landing />} />
    </Route>
    {/* <Route
      path="/"
      element={
        <React.Suspense fallback={"Loading routing..."}>
          <Home />
        </React.Suspense>
      }
    /> */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
