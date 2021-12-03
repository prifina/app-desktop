import React from "react";
import { ReactComponent as Settings } from "../assets/settings.svg";
import AppIcon from "./AppIcon";

//import i18n from "../lib/i18n";
import { i18n } from "@prifina-apps/utils";
i18n.init();

const SettingsIcon = () => (
  <AppIcon title={i18n.__("Settings")} icon={Settings} />
);

SettingsIcon.displayName = "Settings";
export default SettingsIcon;
