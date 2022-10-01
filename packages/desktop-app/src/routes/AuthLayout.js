import React from "react";
import { Navigate, useOutlet, useLocation } from "react-router-dom";

import { useAppContext } from "@prifina-apps/utils";


export default function AuthenticatedRoute() {
  const { pathname, search } = useLocation();
  const { isAuthenticated, currentUser } = useAppContext();
  const outlet = useOutlet();

  console.log("AUTH ROUTE ", isAuthenticated, currentUser);

  if (!isAuthenticated) {

    return <Navigate replace to={`/login?redirect=${pathname}${search}`} />
  }

  return (<React.Suspense fallback={"Loading routing..."}>
    {outlet}
  </React.Suspense>
  );
}
