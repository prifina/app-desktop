import React from "react";
//import { ReactComponent as DisplayApp } from "../assets/display-app.svg";
import DisplayApp from "../assets/display-app";
import AppIcon from "./AppIcon";

import { useTranslate } from "@prifina-apps/utils";
//import { i18n } from "@prifina-apps/utils";
//i18n.init();

const DisplayAppIcon = () => {
  const { __ } = useTranslate();
  return (
    <AppIcon title={__("Display App")} icon={DisplayApp} />
  )
}

DisplayAppIcon.displayName = "DisplayApp";
export default DisplayAppIcon;
