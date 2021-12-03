import React from "react";
import { ReactComponent as DisplayApp } from "../assets/display-app.svg";
import AppIcon from "./AppIcon";

//import i18n from "../lib/i18n";
import { i18n } from "@prifina-apps/utils";
i18n.init();

const DisplayAppIcon = () => (
  <AppIcon title={i18n.__("Display App")} icon={DisplayApp} />
);

DisplayAppIcon.displayName = "DisplayApp";
export default DisplayAppIcon;
