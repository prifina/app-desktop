import React from "react";

import { ReactComponent as AppMarket } from "../src/assets/app-market.svg";

import AppIcon from "../src/components/AppIcon";

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
