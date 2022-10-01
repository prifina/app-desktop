import React from "react";
import { Navigate, useOutlet, useLocation } from "react-router-dom";


import { useAppContext } from "@prifina-apps/utils";
function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
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
  const { isAuthenticated } = useAppContext();

  const outlet = useOutlet();
  const redirect = querystring("redirect");

  console.log("UN AUTH ", isAuthenticated);

  let landingPage = "/home";

  if (isAuthenticated && redirect !== null && redirect !== "") {
    landingPage = redirect;
  }
  if (isAuthenticated) {
    return <Navigate replace to={landingPage} />
  }

  return (<React.Suspense fallback={"Loading routing..."}>
    {outlet}
  </React.Suspense>
  );
}
