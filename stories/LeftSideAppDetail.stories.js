import React from "react";
import AppDetailLeftContainer from "../src/components/AppDetailLeftContainer";

export default { title: "AppDetail Left Container" };

export const container = () => (
  <AppDetailLeftContainer progress={33} />
);
container.story = {
  name: "AppDetailLeftContainer",
};