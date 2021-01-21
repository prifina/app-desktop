import React from "react";
import { Divider, Text } from "@blend-ui/core";

export default { title: "Divider" };

export const divider = () => (
  <Divider foo={"bar"} height={"5px"} ml={3} color={"red"} />
);
divider.story = {
  name: "Divider",
};

export const divider2 = () => (
  <Divider as={"div"} color={"green"} height={"5px"} ml={3} />
);
divider2.story = {
  name: "Divider variation",
};

export const divider3 = () => (
  <Divider>
    <Text textStyle={"h6"}>Title Text</Text>
  </Divider>
);
divider3.story = {
  name: "Title Divider",
};
