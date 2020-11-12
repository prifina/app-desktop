import React from "react";
import Listing from "../src/pages/Listing";

export default { title: "Listing" };

export const container = () => (
  <Listing progress={33} />
);
container.story = {
  name: "Listing",
};