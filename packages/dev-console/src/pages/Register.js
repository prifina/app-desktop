import React, { useState, useReducer, useEffect } from "react";
import { Flex, Box, Text, Button, Image, useTheme } from "@blend-ui/core";

import { useHistory } from "react-router-dom";

import {
  useAppContext,
  i18n,
  addUserToCognitoGroupMutation,
  getPrifinaUserQuery,
  AccountContext,
} from "@prifina-apps/utils";

import TermsOfUse from "../components/TermsOfUse";

import avatarDefault from "../assets/avatarDefault.svg";

import { API as GRAPHQL } from "aws-amplify";

import config from "../config";

import * as C from "../components/components";

import formPrifinaLogo from "../assets/formPrifina.svg";

i18n.init();

const Register = props => {
  const history = useHistory();

  const { userAuth, currentUser, isAuthenticated, mobileApp } = useAppContext();

  const [user, setUser] = useState("User");

  function setCookie(cname, cvalue) {
    let d = new Date();
    d.setTime(d.getTime() + 1 * 3600 * 1000);
    let expires = "expires=" + d.toUTCString();

    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  }

  const prifinaID = currentUser.prifinaID;

  const newGroup = "DEV";
  /*
  const addUserRole = async () => {
    try {
      await addUserToCognitoGroupMutation(GRAPHQL, prifinaID, newGroup);
    } catch (e) {
      console.log("error ", e);
    }
  };
*/
  useEffect(async () => {
    const currentPrifinaUser = await getPrifinaUserQuery(GRAPHQL, prifinaID);

    console.log("CURRENT USER ", currentPrifinaUser);
    let appProfile = JSON.parse(
      currentPrifinaUser.data.getPrifinaUser.appProfile,
    );

    setUser(appProfile.name);
  }, []);

  const { colors } = useTheme();

  const [step, setStep] = useState(0);

  const nextStepAction = step => {
    if (step === 2) {
      // all these were "visible" here...
      //console.log("ADD GROUP ", GRAPHQL, prifinaID, newGroup);
      addUserToCognitoGroupMutation(GRAPHQL, prifinaID, newGroup)
        .then(res => {
          window.location.href = "/home"; // browser-back is /core/dev-console
        })
        .catch(err => {
          console.log("ADD GROUP ERROR ", err);
        });
      //addUserRole();
      //setCookie("developerAccount", "true");
      //window.location.href = "/home"; // browser-back is /core/dev-console
    } else if (step === 0) {
      // terms declined...
      // toast.info(i18n.__("acceptTerms"), {});
      // window.location.href = config.APP_URL;
      setStep(0);
    }
  };

  const accountContext = { nextStepAction };

  return (
    <>
      <AccountContext.Provider value={accountContext}>
        <Flex width={"100vw"} height={"100vh"} flexDirection="row">
          <Box
            alt="left-side"
            width="610px"
            style={{ background: colors.brandAccentGradient }}
          />
          <Box alt="center" bg="basePrimary" width="296px">
            <Image src={formPrifinaLogo} />

            <Box alt="menu" alignContent="flex-start">
              <C.MenuButton
                borderColor={colors.brandAccent}
                color={colors.textMuted}
                mt={30}
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
              bg="baseTertiary"
              width="490px"
              flexDirection="column"
              alignItems="center"
              flexGrow={1}
            >
              <Box mt={160} mb={40}>
                <Text fontSize="xl">
                  {i18n.__("welcomeBack")} {user}!
                </Text>
              </Box>
              <C.DeveloperCard
                currentUser={user}
                avatar={avatarDefault}
                text={i18n.__("welcomeBackText")}
              />
              <C.Card
                mt={42}
                mb={140}
                bg="baseMuted"
                leftbordercolor={colors.brandAccent}
              >
                <Box ml={23} mt={13} mr={23} mb={13}>
                  <Text fontSize="md">{i18n.__("loginCardTitle")}</Text>
                  <Text fontSize="xs" textStyle={"normal"}>
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
                {i18n.__("continueAs")} {user}
              </C.StyledButton>
              <Flex alignItems="baseline">
                <Text fontSize="xs" mr="5px">
                  {i18n.__("notYou")}
                </Text>
                <Button variation="link"> {i18n.__("logoutButton")}</Button>
              </Flex>
            </Flex>
          )}
          {step === 1 && (
            <Flex
              alt="form-container"
              bg={colors.baseTertiary}
              flexDirection="column"
              alignItems="center"
              paddingTop={117}
              flexGrow={1}
            >
              <TermsOfUse />
            </Flex>
          )}
        </Flex>
      </AccountContext.Provider>
    </>
  );
};

export default Register;
