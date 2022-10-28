import React from "react";
import { Box, Flex, Text } from "@blend-ui/core";

const SmartSearch = props => {
  console.log("SMART SEARCH PROPS ", props);

  return (
    <Box width={"100vw"} height={"100vh"}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Text textAlign={"center"} textStyle={"h3"}>
          {i18n.__("appNameSmartSearch")}
        </Text>
      </Flex>
    </Box>
  );
};

SmartSearch.displayName = "SmartSearch";

export default SmartSearch;
