/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from "react";
import { Box, Flex, Text } from "@blend-ui/core";

const AppMarket = props => {
  console.log("APP MARKET PROPS ", props);

  return (
    <Box width={"100vw"} height={"100vh"}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Text textAlign={"center"} textStyle={"h3"}>
          AppMarket
        </Text>
      </Flex>
    </Box>
  );
};

AppMarket.displayName = "AppMarket";

export default AppMarket;
