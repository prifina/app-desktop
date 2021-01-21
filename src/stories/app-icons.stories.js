import React from "react";

import { ReactComponent as AppMarket } from "../assets/app-market.svg";

import AppIcon from "../components/AppIcon";
import AppMarketIcon from "../components/AppMarketIcon";
export default { title: "App icons" };

export const appIcon = () => (
  <div>
    <AppMarket />
  </div>
);
appIcon.story = {
  name: "AppIcon",
};

export const appIcon2 = () => (
  <div>
    <AppIcon title={"App Market"} icon={AppMarket} />
  </div>
);
appIcon2.story = {
  name: "AppIcon component",
};

export const appIcon3 = () => <AppMarketIcon />;
appIcon3.story = {
  name: "AppMarketIcon",
};
