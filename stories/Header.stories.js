import React from "react";
import AppDetailHeaderContainer from "../src/components/AppDetailHeaderContainer";

export default { title: "AppDetail Header Container" };

export const container = () => (
  <AppDetailHeaderContainer title={"Create an account"} progress={33} />
);
container.story = {
  name: "AppDetailHeaderContainer",
};
