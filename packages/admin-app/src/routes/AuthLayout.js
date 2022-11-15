import React from "react";
import { Navigate, useOutlet, useLocation } from "react-router-dom";

// import { useAppContext } from "@prifina-apps/utils";

// import { useStore } from "../stores/PrifinaStore";
import useStatus from "./useStatus";

export default function AuthenticatedRoute() {
  // const checked = useRef(false);
  // const checkedStatus = useRef(false);
  const { pathname, search } = useLocation();
  const { status, error, isChecking } = useStatus();
  // eslint-disable-next-line max-len
  // const { status, error, isChecking } = useStatus({ checked: checked.current, checkedStatus: checkedStatus.current });
  // const isLoggedIn = useStore(state => state.isLoggedIn);

  // const [isChecking, setIsChecking] = useState(true);
  // const [authenticated, setAuthenticated] = useState(false);
  const outlet = useOutlet();
  /*
    useEffect(() => {
      async function checking() {
        if (isChecking) {
          const status = await isLoggedIn();
          setAuthenticated(status);
          setIsChecking(false);
        }
      }
      checking();
    }, [isChecking, isLoggedIn, setAuthenticated, setIsChecking]);
    */
  // const authenticated = useStore(state => state.authenticated);
  // const getAuthStatus = useStore(state => state.getAuthStatus);
  // const authenticated = getAuthStatus();
  console.log("AUTH LAYOUT ", isChecking, status);

  const getStatus = () => {
    // checkedStatus.current = status;
    if (error) return <h2>Error while checking: {error}</h2>;
    if (!status && isChecking) return <h2>Checking...</h2>;
    if (!status) return <Navigate replace to={`/login?redirect=${pathname}${search}`} />;
    // checked.current = true;
    return <React.Suspense fallback="Loading ...">{outlet}</React.Suspense>;
  };

  /*
    if (!authenticated) {
      return <Navigate replace to={`/login?redirect=${pathname}${search}`} />;
    }

    return (
      <React.Suspense fallback="Loading routing...">
        {outlet}
      </React.Suspense>
    );
    */

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{!isChecking && getStatus()}</>;
}

/*
const getStatus = () => {
  if (error) return <h2>Error while checking: {error}</h2>;
  if (!status && isChecking) return <h2>Checking...</h2>;
  if (!status) return <Navigate replace to={`/login?redirect=${pathname}${search}`} />

return <React.Suspense fallback={"Loading routing..."}>{children}</React.Suspense>
}
//const isLoggedIn = userStore((state) => state.isLoggedIn);
//const { isAuthenticated, currentUser } = useAppContext();

//const isAuthenticated=isLoggedIn();

//console.log("AUTH ROUTE ", isAuthenticated);  // promise ???

return <>
    {!isChecking && getStatus()}
    </>

}
*/
