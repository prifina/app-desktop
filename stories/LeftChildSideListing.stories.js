import React from "react";
import ListingLeftChildSide from "../src/components/ListingLeftChildSide";

export default { title: "Listing Left Child Side bar Container" };

export const container = () => (
  <ListingLeftChildSide progress={33} />
);
container.story = {
  name: "ListingLeftChildSide",
};