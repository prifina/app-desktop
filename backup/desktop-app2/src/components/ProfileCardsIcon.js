import React from "react";
import { ReactComponent as ProfileCards } from "../assets/profile-cards.svg";
import AppIcon from "./AppIcon";

import i18n from "../lib/i18n";
i18n.init();

const ProfileCardsIcon = () => (
  <AppIcon title={i18n.__("Profile Cards")} icon={ProfileCards} />
);

ProfileCardsIcon.displayName = "ProfileCards";
export default ProfileCardsIcon;
