import React from "react";
import AppDetail from "../src/pages/AppDetail";

export default { title: "AppDetail" };

export const container = () => (
  <AppDetail progress={33} />
);
container.story = {
  name: "AppDetail",
};