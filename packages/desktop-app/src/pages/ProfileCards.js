/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from "react";
import { Box, Flex, Text } from "@blend-ui/core";

const ProfileCards = props => {
  console.log("PROFILE CARDS PROPS ", props);

  return (
    <Box width={"100vw"} height={"100vh"}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Text textAlign={"center"} textStyle={"h3"}>
          ProfileCards
        </Text>
      </Flex>
    </Box>
  );
};

ProfileCards.displayName = "ProfileCards";

export default ProfileCards;
