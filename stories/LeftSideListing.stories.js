import React from "react";
import ListingLeftContainer from "../src/components/ListingLeftContainer";

export default { title: "Listing Left Container" };

export const container = () => (
  <ListingLeftContainer colors={#fff} progress={33} />
);
container.story = {
  name: "ListingLeftContainer",
};