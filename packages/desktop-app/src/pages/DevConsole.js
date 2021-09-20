/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Button } from "@blend-ui/core";

import { PrifinaLogo } from "../components/PrifinaLogo";
import config from "../config";

const DevConsole = props => {
  console.log("DEV CONSOLE PROPS ", props);

  /* checking if user is registered as developer.... */
  return (
    <Box width={"100vw"} height={"100vh"}>
      <PrifinaLogo title={"Dev Console"} />
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Box>
          <Text textAlign={"center"} textStyle={"h3"}>
            DevConsole
          </Text>
          <Box mt={20}>
            <Button
              onClick={() => {
                //console.log("DEV CONSOLE...", config.DEV_URL);
                // redirect....
                window.location.href = config.DEV_URL; // browser-back is /core/dev-console
                // window.location.replace(config.DEV_URL); // browser-back is / (home)
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

DevConsole.displayName = "DevConsole";

export default DevConsole;
