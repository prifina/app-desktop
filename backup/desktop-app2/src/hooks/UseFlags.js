// npm install --save-dev @iconify/react @iconify-icons/emojione-v1
//import { Icon, InlineIcon } from '@iconify/react';
//import flagForFinland from '@iconify-icons/emojione-v1/"flag-for-finland';
import React, { useState, useEffect } from "react";
//import * as flagIcons from "./FlagIcons";

//import { countryList } from "../lib/utils";
import { Icon } from "@iconify/react";

function camelCase(s) {
  //return s.match(/[a-z]+/gi)
  const pascalCase = s
    .match(/[a-zA-Z0-9]+/gi)
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    .join("");

  return (
    (pascalCase.charAt(0).match(/[0-9]+/g) ? "_" : "") +
    pascalCase.charAt(0).toLowerCase() +
    pascalCase.substr(1)
  );
}

const UseFlags = cList => {
  const [isLoading, setIsLoading] = useState(true);

  const [icons, setIcons] = useState({});
  useEffect(() => {
    //console.log("SCHEMAJSON ", state.schemaJson);
    //const ComponentName = "@iconify-icons/emojione-v1/flag-for-finland";
    const flagIcons = "./FlagIcons.js";

    import(`${flagIcons}`).then(iconList => {
      //console.log("EXPORT COMP ", ExportComponent);
      //console.log("IMPORT ICON ", iconList);
      let flags = {};
      cList.forEach((n, i) => {
        if (n.flag !== "") {
          //console.log("FLAG ", n);
          const flag = iconList[camelCase(n.flag) + "Icon"];
          //console.log(typeof flag);
          if (typeof flag !== "undefined") {
            flags[n.regionCode] = <Icon icon={flag} key={"flag-" + i} />;
          }
          //return null;
        }
      });
      /*   
      const flags = iconList.map(icon => {
        return <Icon icon={icon} />;
      });
      */
      setIcons(flags);
      setIsLoading(false);
    });
  }, []);

  return { icons, isLoading };
};

export default UseFlags;
