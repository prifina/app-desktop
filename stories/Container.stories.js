import React from "react";
import ProgressContainer from "../src/components/ProgressContainer";

export default { title: "Container" };

export const container = () => (
  <ProgressContainer title={"Create an account"} progress={33} />
);
container.story = {
  name: "Container",
};
