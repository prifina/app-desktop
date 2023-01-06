import React from "react";
import {
  Flex,
  Box,
  Text,
  Button,
  Divider,
  useTheme,
} from "@blend-ui/core";

//import { i18n, useAppContext } from "@prifina-apps/utils";

import { useTranslate } from "@prifina-apps/utils";

import config from "../config";

import styled from "styled-components";

import shallow from "zustand/shallow";

import { useStore } from "../utils-v2/stores/PrifinaStore";

import PrifinaIcon from "../assets/prifina-icon";
import InfinityIcon from "../assets/infinity-icon";
import DataCloudIcon from "../assets/data-console";

const PageContainer = styled(Flex)`
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Container = styled(Box)`
  width: 506px;
  height: 680px;
  box-shadow: 0px 2px 8px rgba(91, 92, 91, 0.2);
  padding-right: 33px;
  padding-left: 33px;
  padding-top: 86px;
  border-radius: 20px;
`;

const ImageFlex = styled(Flex)`
  height: 158px;
  justify-content: center;
  align-items: center;
`;

const Callout = styled(Flex)`
  flex-direction: column;
  height: 211px;
  justify-content: center;
  padding-right: 16px;
  padding-left: 16px;
  background: ${props => props.theme.colors.baseTertiary};
`;

const Disclaimer = styled(Flex)`
  height: 102px;
  padding-right: 16px;
  padding-left: 16px;
  justify-content: center;
  align-items: center;
`;

const HeaderImage = () => <ImageFlex>
  <PrifinaIcon />
  <InfinityIcon />
  <DataCloudIcon />
</ImageFlex>

const DevConsole = props => {
  console.log("DEV CONSOLE PROPS ", props);

  const { colors } = useTheme();
  const { __ } = useTranslate();

  const { user } = useStore(
    state => ({
      user: state.user

    }),
    shallow,
  );

  //const { currentUser } = useAppContext();
  console.log("USER GROUP", user.group);

  function setCookie(cname, cvalue) {
    let d = new Date();
    d.setTime(d.getTime() + 1 * 3600 * 1000);
    let expires = "expires=" + d.toUTCString();

    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  }
  const cookieString = getCookie("developerAccount");
  const groupCheck = user.group.indexOf("DEV");

  return (
    <>
      <PageContainer>
        {groupCheck === -1 && cookieString === "" ? (
          <Container>
            <Divider mt={-4}>
              <Text textStyle={"h4"}>{__("createAppStudioAccount")}</Text>
            </Divider>
            <HeaderImage />
            <Callout>
              <Text
                mb={16}
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.brandAccent}
              >
                {__("redirectNecessary")}
              </Text>
              <Text color={colors.brandAccent}>
                {__("accountCreationText")}
              </Text>
            </Callout>
            <Disclaimer>
              <Text fontSize="xs">{__("appStudioDisclaimer")}</Text>
            </Disclaimer>
            <Flex mt={24} alignItems="center" justifyContent="space-between">
              <Button
                variation="outline"
                onClick={() => {
                  window.location.href = config.APP_URL;
                }}
              >
                {__("noThanks")}
              </Button>
              <Button
                onClick={() => {
                  setCookie("developerAccount", "true");
                  window.location.href = config.DEV_URL + "/register-role";
                }}
              >
                {__("createAccount")}
              </Button>
            </Flex>
          </Container>
        ) : (
          <Container>
            <Divider mt={-4}>
              <Text textStyle={"h4"}>{__("appStudioAccount")}</Text>
            </Divider>
            <HeaderImage />
            <Callout>
              <Text
                mb={16}
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.brandAccent}
              >
                {__("redirectNecessary")}
              </Text>
              <Text color={colors.brandAccent}>
                {__("accountCreationText")}
              </Text>
            </Callout>
            <Disclaimer>
              <Text fontSize="xs">{__("appStudioDisclaimer")}</Text>
            </Disclaimer>
            <Flex mt={24} alignItems="center" justifyContent="space-between">
              <Button
                variation="outline"
                onClick={() => {
                  window.location.href = config.APP_URL;
                }}
              >
                {__("closeButton")}
              </Button>
              <Button
                onClick={() => {
                  window.location.href = config.DEV_URL;
                }}
              >
                {__("proceedButton")}
              </Button>
            </Flex>
          </Container>
        )}
      </PageContainer>
    </>
  );
};

DevConsole.displayName = "DevConsole";

export default DevConsole;
