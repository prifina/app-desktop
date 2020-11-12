import React from "react";
import ListingRightContainer from "../src/components/ListingRightContainer";

export default { title: "Listing Right Container" };

export const container = () => (
  <ListingRightContainer progress={33} />
);
container.story = {
  name: "ListingRightContainer",
};
