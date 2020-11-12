import React from "react";
import TableListing from "../src/components/TableListing";

export default { title: "Table Listing" };

export const container = () => (
  <TableListing progress={33} />
);
container.story = {
  name: "TableListing",
};