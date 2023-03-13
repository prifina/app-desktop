import { useState, useEffect, useRef } from "react";


import shallow from "zustand/shallow";



import { useStore, } from "@prifina-apps/utils";
//import { useStore } from "../utils-v2/stores/PrifinaStore";

const UseStatus = () => {
  // console.log("CHECKED ", checked, checkedStatus);

  const { isLoggedIn, authenticated } = useStore(
    state => ({
      isLoggedIn: state.isLoggedIn,
      authenticated: state.authenticated
    }),
    shallow,
  );

  const [status, setStatus] = useState(false);
  const [error, setError] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const checkOnce = useRef(false);
  useEffect(() => {
    // console.log("STATUS ", checkOnce.current, isChecking);
    if (!checkOnce.current && isChecking) {
      checkOnce.current = true;
      isLoggedIn().then(res => {
        setIsChecking(false);
        setStatus(res);
      }).catch(err => {
        setIsChecking(false);
        setError(err);
      });
    }
  }, [isLoggedIn, isChecking]);

  return { status, error, isChecking, authenticated };
};

export default UseStatus;
