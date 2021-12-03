import React from "react";
import Layout from "../src/components/Layout";

import { Flex, Text } from "@blend-ui/core";

export const layout = () => (
  <Layout height={"100vh"} backgroundColor={"#FFFFFF"} rowGap={"0px"}>
    <Layout.Header>
      <Flex alignItems={"center"} height={"100%"}>
        <Text bold fontSize={"18px"} color={"baseDividers"}>
          Data Model Builder
        </Text>
      </Flex>
    </Layout.Header>
    <Layout.Sidebar position="left">Sidebar</Layout.Sidebar>
    <Layout.Content mb={2}>Content HERE</Layout.Content>
  </Layout>
);

layout.story = {
  name: "Layout",
};
