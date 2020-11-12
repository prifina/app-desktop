import React from "react";
import AppDetailRightContainer from "../src/components/AppDetailRightContainer";

export default { title: "AppDetail Right Container" };

export const container = () => (
  <AppDetailRightContainer progress={33} />
);
container.story = {
  name: "AppDetailRightContainer",
};
