import React from "react";
import { CoreApps } from "../components/CoreApps";

export default { title: "CoreApps" };

export const coreApps = args => <CoreApps {...args} />;

coreApps.args = { app: "DisplayApp" };
coreApps.story = {
  name: "CoreApps",
};
