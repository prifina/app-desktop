import React from "react";
import { ReactComponent as SmartSearch } from "../assets/smart-search.svg";
import AppIcon from "./AppIcon";

import i18n from "../lib/i18n";
i18n.init();

const SmartSearchIcon = () => (
  <AppIcon title={i18n.__("Smart Search")} icon={SmartSearch} />
);

SmartSearchIcon.displayName = "SmartSearch";
export default SmartSearchIcon;
