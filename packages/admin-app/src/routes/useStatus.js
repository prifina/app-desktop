import { useState, useEffect, useRef } from "react";

import { useStore } from "../stores/PrifinaStore";

const UseStatus = () => {
  // console.log("CHECKED ", checked, checkedStatus);
  const isLoggedIn = useStore(state => state.isLoggedIn);
  /*
    const [status, setStatus] = useState(checkedStatus);
    const [error, setError] = useState(null);
    const [isChecking, setIsChecking] = useState(!checked);
    const checkOnce = useRef(checked);
  */
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

  return { status, error, isChecking };
};

export default UseStatus;
