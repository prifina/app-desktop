import React from "react";
import { Navigate, useOutlet } from "react-router-dom";

import Loading from "./Loading";
import useStatus from "./useStatus";
// import { useAppContext } from "@prifina-apps/utils";
function querystring(name, url = window.location.href) {
  // eslint-disable-next-line no-param-reassign
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default function UnauthenticatedRoute() {
  // const { isAuthenticated } = useAppContext();

  const { status, error, isChecking } = useStatus();
  const outlet = useOutlet();

  const redirect = querystring("redirect");

  let landingPage = "/home";

  const getStatus = () => {
    if (error) return <h2>Error while checking: {error}</h2>;
    if (!status && isChecking) return <h2>Checking...</h2>;

    //if (!status) return <React.Suspense fallback={<Loading />}>{outlet} </React.Suspense>;
    if (!status) return <React.Suspense>{outlet} </React.Suspense>;

    if (status && redirect !== null && redirect !== "") {
      landingPage = redirect;
    }

    return <Navigate replace to={landingPage} />;
  };

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{!isChecking && getStatus()}</>;
}

/*
  const outlet = useOutlet();
  const redirect = querystring("redirect");

  console.log("UN AUTH LAYOUT ", authenticated);

  let landingPage = "/home";

  if (authenticated && redirect !== null && redirect !== "") {
    landingPage = redirect;
  }
  if (authenticated) {
    return <Navigate replace to={landingPage} />;
  }

  return (
    <React.Suspense fallback="Loading routing...">
      {outlet}
    </React.Suspense>
  );
}

*/
