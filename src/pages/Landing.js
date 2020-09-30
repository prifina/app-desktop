import React from "react";
import { Box, Flex, Text, useTheme } from "@blend-ui/core";
//import { ReactComponent as BackPlate } from "../assets/back-plate.svg";
//import BackPlate from "../assets/plate.svg";
import { ReactComponent as PrifinaText } from "../assets/prifina-text.svg";
import { Background } from "../assets/background-image";
//import { Plate } from "../assets/back-plate-png";
import Plate from "../assets/back-plate.png";

import { BlendIcon } from "@blend-ui/icons";
import bxChevronRight from "@iconify/icons-bx/bx-chevron-right";

import styled from "styled-components";

import CreateAccount from "./CreateAccount";
import i18n from "../lib/i18n";
i18n.init();

//const backPlatePath = "../assets/back-plate.svg";

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
  background-image: url(${Plate});
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
                  {i18n.__("welcomeMessage")}
                </Text>
              </Box>
              <Box width={"533px"}>
                <Text as={"p"} fontSize={18} lineHeight={"144.5%"}>
                  {i18n.__("landingPage")}
                </Text>
              </Box>
              <Box
                mt={"40px"}
                display={"inline-flex"}
                height={"26px"}
                alignItems={"center"}
              >
                <Text fontSize={18} color={colors.baseSecondary} pr={13}>
                  {i18n.__("landingPageInfo")}
                </Text>
                <BlendIcon
                  iconify={bxChevronRight}
                  color={colors.componentPrimary}
                  size={"17"}
                />
              </Box>
            </Box>
          </Flex>
          <Flex width={"56%"} height={"920px"} justifyContent={"flex-end"}>
            <StyledPlate height={"920px"} width={"795px"}>
              <Flex justifyContent={"flex-end"}>
                <Box position={"relative"} right={"64px"} top={"135px"}>
                  <CreateAccount />
                </Box>
              </Flex>
            </StyledPlate>
          </Flex>
        </Box>
        <StyledBackground width={"100%"} height={"854px"} />
      </StyledBox>
    </React.Fragment>
  );
};

//<img src={Plate} height={"920px"} width={"795px"} />
export default Landing;
