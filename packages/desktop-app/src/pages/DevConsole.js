/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useReducer } from "react";
import { Box, Flex, Text, Button } from "@blend-ui/core";

import { i18n, AccountContext } from "@prifina-apps/utils";

import config from "../config";

import TermsOfUse from "../pages/TermsOfUse";

import { PrifinaLogo } from "../components/PrifinaLogo";
import avatarDefault from "../assets/dev-console/avatarDefault.png";

import * as C from "./dev-console/components";

const DevConsole = props => {
  console.log("DEV CONSOLE PROPS ", props);
  /* checking if user is registered as developer.... */

  const [step, setStep] = useState(0);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      username: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },

      termsAccepted: false,
      emailVerified: "",
      phoneVerified: "",
    },
  );

  switch (step) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    default:
  }

  const nextStepAction = step => {
    console.log("ACTION STEP ", step);
    if (step === 3) {
      //await Auth.signOut();
      //history.replace("/");
      //setState({ phoneVerified: currentUser.phone_number });
      //setRegisterStep(step);
      _currentUser.termsAccepted = true;
    } else if (step === 2) {
      setState({ termsAccepted: true });
      // setRegisterStep(step);
      window.location.href = config.DEV_URL; // browser-back is /core/dev-console
    } else if (step === 0) {
      // terms declined...
      // alerts.info(i18n.__("acceptTerms"), {});
      setStep(0);
    }
  };

  const accountContext = { nextStepAction, state };

  return (
    <>
      <AccountContext.Provider value={accountContext}>
        {step === 0 && (
          <Box
            width={"100vw"}
            height={"100vh"}
            display="flex"
            flexDirection="row"
          >
            <Box alt="left-side" width="610px" bg="brandAccent" />
            <Box alt="center" bg="brandSecondary" width="296px">
              <Box alt="menu" alignContent="flex-start">
                <C.MenuButton mt={157}>
                  {/* 01 {i18n.__("accountDetails")} */}
                  01 Account Details
                </C.MenuButton>
                <C.MenuButton
                  style={{ color: "grey", border: 0 }}
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  {/* 02 {i18n.__("developerAgreement")} */}
                  02 Developer Agreement
                </C.MenuButton>
              </Box>
            </Box>
            <Box
              alt="form-container"
              bg="brandPrimary"
              width="534px"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box mt={160} mb={40}>
                <Text fontSize="xl" color="textPrimary">
                  Welcome back Jane!
                </Text>
              </Box>
              <C.DeveloperCard name="JaneDoe23" avatar={avatarDefault} />
              <C.Card mt={42} mb={140} bg="baseMuted">
                <Box ml={23} mt={13} mr={23} mb={13}>
                  <Text fontSize="md" color="textPrimary">
                    Great News!
                  </Text>
                  <Text fontSize="xs" color="textPrimary" textStyle={"normal"}>
                    Because you have an existing individual Prifina account, you
                    can use it to log in, and we’ll connect it to your new
                    developer account.
                  </Text>
                </Box>
              </C.Card>
              <C.StyledButton
                mb={8}
                onClick={() => {
                  setStep(1);
                }}
              >
                Continue as Jane
              </C.StyledButton>
              <Flex alignItems="baseline">
                <Text color="textPrimary" fontSize="xs" mr="5px">
                  Not You?
                </Text>
                <Button variation="link">Logout</Button>
              </Flex>
            </Box>
          </Box>
        )}
        {step === 1 && (
          <Box
            width={"100vw"}
            height={"100vh"}
            display="flex"
            flexDirection="row"
          >
            <Box alt="left-side" width="610px" bg="brandAccent" />
            <Box alt="center" bg="brandSecondary" width="296px">
              <Box alt="menu" alignContent="flex-start">
                <C.MenuButton
                  mt={157}
                  style={{ color: "grey", border: 0 }}
                  onClick={() => {
                    setStep(0);
                  }}
                >
                  {/* 01 {i18n.__("accountDetails")} */}
                  01 Account Details
                </C.MenuButton>
                <C.MenuButton style={{ color: "white" }}>
                  {/* 02 {i18n.__("developerAgreement")} */}
                  02 Developer Agreement
                </C.MenuButton>
              </Box>
            </Box>
            <Box
              alt="form-container"
              bg="brandPrimary"
              width="534px"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box mt={160}>
                <TermsOfUse />
              </Box>
            </Box>
          </Box>
        )}
      </AccountContext.Provider>
    </>
  );
};

DevConsole.displayName = "DevConsole";

export default DevConsole;
