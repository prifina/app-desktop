import React from "react";

import { Box, Flex, Image } from "@blend-ui/core";
//import landingImage from "../assets/landingImage.png";

const Landing = ({ children, imageSrc = "", leftBackgroundColor, rightBackgroundColor, ...props }) => {
  //const { colors } = useTheme();
  return <Flex height={"100%"} {...props}>
    <Box width={"60%"} style={{
      background: leftBackgroundColor,
    }}>
      <Flex
        flexGrow={1}
        alignItems="center"
        justifyContent="center"

      >
        {imageSrc !== "" && <Image src={imageSrc} />}
      </Flex>

    </Box>
    <Box width={"40%"} style={{ minWidth: "480px", background: rightBackgroundColor, paddingLeft: "35px" }}>
      {children}
    </Box>
  </Flex>

}

export default Landing;