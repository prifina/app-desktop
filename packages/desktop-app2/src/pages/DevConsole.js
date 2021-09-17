/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from "react";
import { Box, Flex, Text } from "@blend-ui/core";

const DevConsole = props => {
  console.log("DEV CONSOLE PROPS ", props);

  return (
    <Box width={"100vw"} height={"100vh"}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Text textAlign={"center"} textStyle={"h3"}>
          DevConsole
        </Text>
      </Flex>
    </Box>
  );
};

DevConsole.displayName = "DevConsole";

export default DevConsole;
