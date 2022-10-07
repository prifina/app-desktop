// npm install --save-dev @iconify/react @iconify-icons/emojione-v1

import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";

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
const Flags = props => {
  const { cList } = props;
  const [icons, setIcons] = useState([]);
  useEffect(() => {
    const flagIcons = "./FlagIcons";
    import(`${flagIcons}`).then(iconList => {
      let flags = [];
      cList.forEach((n, i) => {
        if (n.flag !== "") {
          const flag = iconList[camelCase(n.flag) + "Icon"];
          flags.push(<Icon icon={flag} key={"flag-" + i} />);
        }
      });

      setIcons(flags);
    });
  }, []);

  return <React.Suspense fallback={"Loading ..."}>{icons}</React.Suspense>;
};

Flags.propTypes = {
  cList: PropTypes.func,
};

export default Flags;
