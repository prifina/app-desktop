import React from "react";
import { ReactComponent as DevConsole } from "../assets/dev-console.svg";
import AppIcon from "./AppIcon";

import { i18n } from "@prifina-apps/utils";
i18n.init();

const DevConsoleIcon = () => (
  <AppIcon title={i18n.__("App Studio")} icon={DevConsole} />
);

DevConsoleIcon.displayName = "DevConsole";
export default DevConsoleIcon;
