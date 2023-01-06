import React from "react";
//import { ReactComponent as Settings } from "../assets/settings.svg";
import Settings from "../assets/settings";
import AppIcon from "./AppIcon";

import { useTranslate } from "@prifina-apps/utils";
//import { i18n } from "@prifina-apps/utils";
//i18n.init();

const SettingsIcon = () => {
  const { __ } = useTranslate();
  return (
    <AppIcon title={__("Settings")} icon={Settings} />
  )
}

SettingsIcon.displayName = "Settings";
export default SettingsIcon;
