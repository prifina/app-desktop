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

const UserApps = React.lazy(() => import("../pages/UserApps"));
import TestPage from "./TestPage";
const TestPage2 = () => <div>TEST OK</div>;
//const AuthenticatedPage = () => <div>AUTH OK</div>;
//const UnAuthenticatedPage = () => <div>UNAUTH OK</div>;

const prod = {
  APP_URL: process.env.REACT_APP_ALPHA_APP,
  DEV_URL: process.env.REACT_APP_ALPHA_APP_STUDIO,
};
const dev = {
  APP_URL: "http://localhost:3000",
  DEV_URL: "http://localhost:3001",
};
// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

const Logout = () => {

  const { logout } = useStore(
    state => ({
      logout: state.logout
    }),
    shallow,
  );
  const effectCalled = useRef(false);
  useEffect(() => {
    if (!effectCalled.current) {
      effectCalled.current = true;
      logout();
      window.location.replace(config.APP_URL);
    }
  }, []);

  return null;
}


export default (props) => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/logout" element={<Logout />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/app/:id" element={<UserApps />} />
      <Route
        path="/system/:app"
        element={
          <CoreApps {...props} />
        }
      />
    </Route>

    <Route element={<UnAuthLayout />}>

      <Route path="/login/*" element={<Login />} />
      <Route path="/register/*" element={<CreateAccount />} />
      <Route path="/*" element={<Login />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
