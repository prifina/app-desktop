import React from "react";
import { Box, Flex, Text, useTheme } from "@blend-ui/core";
//import { ReactComponent as BackPlate } from "../assets/back-plate.svg";
import BackPlate from "../assets/plate.svg";
import { ReactComponent as PrifinaText } from "../assets/prifina-text.svg";
import { Background } from "../assets/background-image";

import { BlendIcon } from "@blend-ui/icons";
import bxChevronRight from "@iconify/icons-bx/bx-chevron-right";

import styled from "styled-components";

const backPlatePath = "../assets/back-plate.svg";

const StyledBox = styled(Box)`
  border-radius: 20px;
  border: 1px solid #f5f8f7;
  background-color: ${(props) =>
    props.colors ? props.colors.baseWhite : "#F5F8F7"};
`;

const StyledBackground = styled(Box)`
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  opacity: 0.3;
  position: relative;
  top: -854px;
  z-index: 1;
`;
const StyledPlate = styled(Box)`
  background-image: url(${BackPlate});
  background-repeat: no-repeat;
  background-size: cover;
  border-top-right-radius: 20px;
  z-index: 3;
`;

//background-position: 0 170px;
/*
<StyledBackground
mt={"170px"}
width={"100%"}
height={"960px"}
></StyledBackground>
*/

const texts = [
  {
    title: "Agreement",
    text:
      "By using or visiting any of Prifina’s websites, or any of our products, software, or applications, you signify your agreement to these Terms.",
  },
  {
    title: "The Service",
    text: "Some of the things you can do through the Service are listed below.",
  },
  {
    title: "Accounts",
    text:
      "To access Prifina’s Services, you will need to create an account (“Account”).",
  },
  {
    title: "Your Data",
    text:
      "Your data is fully in your control. Only you can access your data and your data profiles. Third parties can access your data only with your permission.",
  },
  {
    title: "Third Party Materials",
    text:
      "Certain portions of the Service may include, display, or make available content, data, information, applications, or materials from third parties (“Third-Party Materials”).",
  },
];
const Landing = (props) => {
  console.log("LANDING ", props);
  const { colors } = useTheme();
  //console.log("THEME ", colors);
  return (
    <React.Fragment>
      <StyledBox minWidth={"1440px"} maxHeight={"1024px"} minHeight={"1024px"}>
        <Box display={"inline-flex"} width={"100%"}>
          <Flex width={"44%"} height={"1024px"}>
            <Box display={"inline-block"} zIndex={2} ml={"63px"}>
              <Box mt={"24px"}>
                <PrifinaText width={"69px"} height={"27px"} />
              </Box>
              <Box mt={"283px"}>
                <Text fontSize={"74px"} lineHeight={"101px"}>
                  Hello
                </Text>
              </Box>
              <Box width={"533px"}>
                <Text as={"p"} fontSize={18} lineHeight={"144.5%"}>
                  We are a team of enthusiasts who understand how important web
                  security is. That is why we have created this environment that
                  will help you implement your boldest ideas without fear for
                  your data.
                </Text>
              </Box>
              <Box
                mt={"40px"}
                display={"inline-flex"}
                height={"26px"}
                alignItems={"center"}
              >
                <Text fontSize={18} color={colors.baseSecondary} pr={13}>
                  Fill the form on the right
                </Text>
                <BlendIcon
                  iconify={bxChevronRight}
                  color={colors.componentPrimary}
                  size={"17"}
                />
              </Box>
            </Box>
          </Flex>
          <Flex width={"56%"} height={"955px"}>
            <StyledPlate height={"955px"} width={"100%"} />
          </Flex>
        </Box>
        <StyledBackground width={"100%"} height={"854px"} />
      </StyledBox>
    </React.Fragment>
  );
};

export default Landing;
