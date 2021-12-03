import React from "react";
import Layout from "../components/Layout";

import { Flex, Text } from "@blend-ui/core";

export default { title: "Layout" };

export const layout = () => (
  <Layout height={"100vh"} backgroundColor={"#FFFFFF"} rowGap={"0px"}>
    <Layout.Header>
      <Flex alignItems={"center"} height={"100%"}>
        <Text bold fontSize={"18px"} color={"baseDividers"}>
          Header
        </Text>
      </Flex>
    </Layout.Header>
    <Layout.Sidebar position="left">Sidebar</Layout.Sidebar>
    <Layout.Content mb={2}>Content HERE</Layout.Content>
  </Layout>
);

/*
export const layout = () => (
  <Layout height={"100vh"} backgroundColor={"#FFFFFF"} rowGap={"0px"} />
);
*/
layout.story = {
  name: "Layout",
};
