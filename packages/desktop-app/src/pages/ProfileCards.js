import React from "react";
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
          {i18n.__("appNameProfileCards")}
        </Text>
      </Flex>
    </Box>
  );
};

ProfileCards.displayName = "ProfileCards";

export default ProfileCards;
