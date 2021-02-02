import React, { useState } from "react";
import { Box, Flex, Button, Text, Image } from "@blend-ui/core";
import { StyledBox } from "../components/DefaultBackground";
import Background from "../assets/mobile-background.png";

import { ReactComponent as PrifinaText } from "../assets/prifina-text.svg";
const titleText =
  "We are a team working on the future of personal applications. This is why we have created this personal cloud environment that will help you implement your boldest ideas while allowing individuals to keep their data.";

const MobileLogin = (props) => {
  return (
    <React.Fragment>
      <StyledBox textAlign={"center"} pt={20} pb={20}>
        <PrifinaText height={"27px"} />
        <Image src={Background} />
        <Box mt={22} textAlign={"center"}>
          <Text textStyle={"h2"}>Hello</Text>
        </Box>
        <Box mt={12} pl={35} pr={35}>
          <Text textStyle={"body"} style={{ wordBreak: "break-word" }}>
            {titleText}
          </Text>
        </Box>
        <Box mt={35} pl={115} pr={115}>
          <Box>
            <Button style={{ width: "100%" }}>Login</Button>
          </Box>
          <Box mt={20}>
            <Button variation={"outline"} style={{ width: "100%" }}>
              Register
            </Button>
          </Box>
        </Box>
      </StyledBox>
    </React.Fragment>
  );
};

export default MobileLogin;
