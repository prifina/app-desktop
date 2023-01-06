import React from "react";
//import { ReactComponent as AppMarket } from "../assets/app-market.svg";
import AppMarket from "../assets/app-market";
import AppIcon from "./AppIcon";

import { useTranslate } from "@prifina-apps/utils";
//import { i18n } from "@prifina-apps/utils";

//i18n.init();

//const { __ } = useTranslate();

const AppMarketIcon = () => {
  const { __ } = useTranslate();
  return (
    <AppIcon title={__("App Market")} icon={AppMarket} />
  )
}

AppMarketIcon.displayName = "AppMarket";
export default AppMarketIcon;
