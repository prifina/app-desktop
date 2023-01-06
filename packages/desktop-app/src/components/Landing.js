import React from "react";

import { Box, Flex, Image, useTheme } from "@blend-ui/core";
import landingImage from "../assets/landingImage.png";

const Landing = ({ children, ...props }) => {

  const { colors } = useTheme();
  return <Flex height={"100%"} {...props}>
    <Box width={"60%"} style={{
      background: colors.baseTertiary,
    }}>
      <Flex
        flexGrow={1}
        alignItems="center"
        justifyContent="center"

      >
        <Image src={landingImage} />
      </Flex>

    </Box>
    <Box width={"40%"}>
      {children}
    </Box>
  </Flex>

}

export default Landing;