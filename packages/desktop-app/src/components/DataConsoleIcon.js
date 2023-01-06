import React from "react";
//import { ReactComponent as DataConsole } from "../assets/data-console.svg";
import DataConsole from "../assets/data-console";
import AppIcon from "./AppIcon";

import { useTranslate } from "@prifina-apps/utils";
//import { i18n } from "@prifina-apps/utils";
//i18n.init();

const DataConsoleIcon = () => {
  const { __ } = useTranslate();
  return (
    <AppIcon title={__("Data Cloud")} icon={DataConsole} />
  )
}

DataConsoleIcon.displayName = "DataConsole";
export default DataConsoleIcon;
