import React from "react";
import ListingLeftMainSide from "../src/components/ListingLeftMainSide";

export default { title: "Listing Left Side bar Container" };

export const container = () => (
  <ListingLeftMainSide progress={33} />
);
container.story = {
  name: "ListingLeftMainSide",
};