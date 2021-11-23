/* eslint-disable react/no-multi-comp */
import React, { useState, useReducer } from "react";
import { Box, Flex, Text, Button, useTheme } from "@blend-ui/core";

import { i18n, AccountContext } from "@prifina-apps/utils";

i18n.init();

import config from "../config";

import TermsOfUse from "../pages/TermsOfUse";

import avatarDefault from "../assets/dev-console/avatarDefault.png";

import * as C from "./dev-console/components";

const DevConsole = props => {
  console.log("DEV CONSOLE PROPS ", props);
  /* checking if user is registered as developer.... */

  const { colors } = useTheme();

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
      // setStep(0);
      window.location.href = config.APP_URL; // browser-back is /home
    }
  };

  const accountContext = { nextStepAction, state };

  return (
    <>
      <AccountContext.Provider value={accountContext}>
        <Flex width={"100vw"} height={"100vh"} flexDirection="row">
          <Box alt="left-side" width="610px" bg="brandAccent" />
          <Box alt="center" bg="brandSecondary" width="296px">
            <Box alt="menu" alignContent="flex-start">
              <C.MenuButton
                borderColor={colors.brandAccent}
                color={colors.textMuted}
                mt={157}
                onClick={() => {
                  setStep(0);
                }}
              >
                01 {i18n.__("accountDetails")}
              </C.MenuButton>
              <C.MenuButton
                borderColor={colors.brandAccent}
                color={colors.textMuted}
                onClick={() => {
                  setStep(1);
                }}
              >
                02 {i18n.__("developerAgreement")}
              </C.MenuButton>
            </Box>
          </Box>
          {step === 0 && (
            <Flex
              alt="form-container"
              bg="brandPrimary"
              width="534px"
              flexDirection="column"
              alignItems="center"
              flexGrow={1}
            >
              <Box mt={160} mb={40}>
                <Text fontSize="xl" color="textPrimary">
                  {i18n.__("welcomeBack")} User!
                </Text>
              </Box>
              <C.DeveloperCard
                currentUser="User23"
                avatar={avatarDefault}
                text={i18n.__("welcomeBackText")}
              />
              <C.Card
                mt={42}
                mb={140}
                bg="baseMuted"
                leftBorderColor={colors.brandAccent}
              >
                <Box ml={23} mt={13} mr={23} mb={13}>
                  <Text fontSize="md" color="textPrimary">
                    {i18n.__("loginCardTitle")}
                  </Text>
                  <Text fontSize="xs" color="textPrimary" textStyle={"normal"}>
                    {i18n.__("loginCardText")}
                  </Text>
                </Box>
              </C.Card>
              <C.StyledButton
                mb={8}
                onClick={() => {
                  setStep(1);
                }}
              >
                {i18n.__("continueAs")} User
              </C.StyledButton>
              <Flex alignItems="baseline">
                <Text color="textPrimary" fontSize="xs" mr="5px">
                  {i18n.__("notYou")}
                </Text>
                <Button variation="link"> {i18n.__("logoutButton")}</Button>
              </Flex>
            </Flex>
          )}
          {step === 1 && (
            <Flex
              alt="form-container"
              bg="brandPrimary"
              flexDirection="column"
              alignItems="center"
              flexGrow={1}
            >
              <Box mt={160}>
                <TermsOfUse />
              </Box>
            </Flex>
          )}
        </Flex>
      </AccountContext.Provider>
    </>
  );
};

DevConsole.displayName = "DevConsole";

export default DevConsole;
