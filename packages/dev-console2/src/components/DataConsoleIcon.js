import React from "react";
import { ReactComponent as DataConsole } from "../assets/data-console.svg";
import AppIcon from "./AppIcon";

import i18n from "../lib/i18n";
i18n.init();

const DataConsoleIcon = () => (
  <AppIcon title={i18n.__("Data Cloud")} icon={DataConsole} />
);

DataConsoleIcon.displayName = "DataConsole";
export default DataConsoleIcon;
