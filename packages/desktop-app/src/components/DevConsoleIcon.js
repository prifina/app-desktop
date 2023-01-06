import React from "react";
//import { ReactComponent as DevConsole } from "../assets/dev-console.svg";
import DevConsole from "../assets/dev-console";
import AppIcon from "./AppIcon";

import { useTranslate } from "@prifina-apps/utils";

//import { i18n } from "@prifina-apps/utils";
//i18n.init();

const DevConsoleIcon = () => {
  const { __ } = useTranslate();
  return (
    <AppIcon title={__("App Studio")} icon={DevConsole} />
  )
}

DevConsoleIcon.displayName = "DevConsole";
export default DevConsoleIcon;
