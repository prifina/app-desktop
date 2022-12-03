// npm install --save-dev @iconify/react @iconify-icons/emojione-v1

import React, { useState, useEffect } from "react";

import { Icon } from "@iconify/react";

function camelCase(s) {
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
    const flagIcons = "./FlagIcons.js";

    import(`${flagIcons}`).then(iconList => {
      let flags = {};
      cList.forEach((n, i) => {
        if (n.flag !== "") {
          const flag = iconList[camelCase(n.flag) + "Icon"];

          if (typeof flag !== "undefined") {
            flags[n.regionCode] = <Icon icon={flag} key={"flag-" + i} />;
          }
        }
      });

      setIcons(flags);
      setIsLoading(false);
    });
  }, []);

  return { icons, isLoading };
};

export default UseFlags;
