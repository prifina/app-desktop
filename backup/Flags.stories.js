import React, { useState, useEffect } from "react";
//import Flags from "../components/Flags";

import { countryList } from "../lib/utils";
import useFlags from "../hooks/UseFlags";
export default { title: "Flags" };

export const flags = () => {
  const cList = countryList();
  const { icons, isLoading } = useFlags(cList);
  const [flags, setFlags] = useState([]);
  useEffect(() => {
    if (!icons && isLoading) setFlags(<h2>LOADING...</h2>);
    if (!icons && !isLoading) setFlags(null);
    if (icons) {
      const items = Object.keys(icons).map((item, i) => {
        return icons[item];
      });
      setFlags(items);
    }
  }, [isLoading, icons]);

  return <>{flags}</>;
};
flags.story = {
  name: "Flags",
};
