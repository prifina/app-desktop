import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import TermsOfUse from "./TermsOfUse";
import EmailVerification from "./EmailVerification";
import PhoneVerification from "./PhoneVerification";
import Login from "./Login";

import { useAppContext } from "../lib/contextLib";

import { useHistory } from "react-router-dom";

import NotFoundPage from "../components/NotFoundPage";
import Logout from "./Logout";

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
  top: -632px;
  z-index: 1;
`;
const StyledPlate = styled(Box)`
  background-image: url(${Plate});
  background-repeat: no-repeat;
  background-size: cover;
  border-top-right-radius: 20px;
  z-index: 3;
  border-left: 1px solid rgba(255, 255, 255, 0); // chrome bug of showing border on transparent image
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
  const history = useHistory();
  const { isAuthenticated, userAuth } = useAppContext();
  const { pathname, search } = useLocation();
  console.log("LOCATION ", pathname, search);
  const { colors } = useTheme();
  //console.log("THEME ", colors);
  let initStep = 5;
  if (pathname === "/verify-email") {
    initStep = 3;
  } else if (pathname === "/verify-phone") {
    initStep = 4;
  } else if (pathname === "/login") {
    initStep = 5;
  } else if (pathname === "/register") {
    initStep = 1;
  } else if (pathname === "/" && isAuthenticated) {
    initStep = 6;
  }

  //console.log("STEP ", initStep);
  const [stepCounter, setStepCounter] = useState(initStep);
  //const [accountFields, setAccountFields] = useState({});
  /*
  const [accountFields, setAccountFields] = useState({
    email: { value: "tro9999@gmail.com" },
    firstName: { value: "Tero" },
    lastName: { value: "Ahola" },
    password: { value: "Huuhaa12!#" },
    phone: { value: "407077102" },
    regionCode: "+358",
    username: { value: "tero-testing3" },
  });
  */
  const [accountFields, setAccountFields] = useState({});

  useEffect(() => {
    if (stepCounter !== initStep) {
      setStepCounter(initStep);
    }
    // stepCounter is missing dependency... fix this logic later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initStep]);

  const checkAction = (action, fields) => {
    switch (action) {
      case "register":
        console.log("ACCOUNT FIELDS ", fields);
        setAccountFields(fields);
        setStepCounter(2);
        break;
      case "terms":
        setStepCounter(1);
        break;
      case "email":
        userAuth(true);
        history.replace("/verify-email");
        // use route instead
        //setStepCounter(3);
        break;
      case "phone":
        //history.replace("/verify-phone");
        // use route instead
        setStepCounter(4);
        break;
      default:
        setStepCounter(0);
    }
  };

  console.log("STEP COUNTER ", stepCounter);
  let topMargin = "62px";
  if (stepCounter === 5) {
    topMargin = "162px";
  }
  return (
    <React.Fragment>
      <StyledBox minWidth={"1440px"} maxHeight={"792px"} minHeight={"792px"}>
        <Box display={"inline-flex"} width={"100%"}>
          <Flex width={"44%"} height={"792px"}>
            <Box display={"inline-block"} zIndex={2} ml={"63px"}>
              <Box mt={"24px"}>
                <PrifinaText width={"69px"} height={"27px"} />
              </Box>
              <Box mt={"283px"}>
                <Text fontSize={"74px"} lineHeight={"101px"}>
                  {stepCounter > 4 && i18n.__("loginWelcomeMessage")}
                  {stepCounter < 5 && i18n.__("welcomeMessage")}
                </Text>
              </Box>
              <Box width={"533px"}>
                <Text as={"p"} fontSize={18} lineHeight={"144.5%"}>
                  {stepCounter > 4 && i18n.__("loginLandingPage")}
                  {stepCounter < 5 && i18n.__("landingPage")}
                </Text>
              </Box>
              <Box
                mt={"40px"}
                display={"inline-flex"}
                height={"26px"}
                alignItems={"center"}
              >
                {stepCounter < 5 && (
                  <React.Fragment>
                    <Text fontSize={18} color={colors.baseSecondary} pr={13}>
                      {i18n.__("landingPageInfo")}
                    </Text>
                    <BlendIcon
                      iconify={bxChevronRight}
                      color={colors.componentPrimary}
                      size={"17"}
                    />
                  </React.Fragment>
                )}
              </Box>
            </Box>
          </Flex>
          <Flex width={"56%"} height={"730px"} justifyContent={"flex-end"}>
            <StyledPlate height={"730px"} width={"753px"}>
              <Flex justifyContent={"flex-end"}>
                <Box
                  position={"relative"}
                  right={"64px"}
                  top={topMargin}
                  key={"step-" + stepCounter}
                >
                  {stepCounter === 0 && <NotFoundPage />}
                  {stepCounter === 1 && !isAuthenticated && (
                    <CreateAccount onAction={checkAction} />
                  )}
                  {stepCounter === 6 && isAuthenticated && <Logout />}
                  {stepCounter === 2 && (
                    <TermsOfUse onAction={checkAction} fields={accountFields} />
                  )}
                  {stepCounter === 3 && (
                    <EmailVerification onAction={checkAction} />
                  )}
                  {stepCounter === 4 && (
                    <PhoneVerification onAction={checkAction} />
                  )}
                  {stepCounter === 5 && <Login />}
                </Box>
              </Flex>
            </StyledPlate>
          </Flex>
        </Box>
        <StyledBackground width={"100%"} height={"631px"} />
      </StyledBox>
    </React.Fragment>
  );
};

//<img src={Plate} height={"920px"} width={"795px"} />
export default Landing;
