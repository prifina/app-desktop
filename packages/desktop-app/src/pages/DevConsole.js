import React, { useState } from "react";
import { Flex, Text, Button, Image, Divider, useTheme } from "@blend-ui/core";

import { i18n, useAppContext } from "@prifina-apps/utils";

i18n.init();

import config from "../config";

import prifinaIcon from "../assets/prifina-icon.svg";
import infinityIcon from "../assets/infinity-icon.svg";
import dataCloudIcon from "../assets/data-console.svg";

const DevConsole = props => {
  console.log("DEV CONSOLE PROPS ", props);
  /* checking if user is registered as developer.... */

  const { colors } = useTheme();

  const { currentUser } = useAppContext();

  console.log("USER GROUP", currentUser.group);

  return (
    <>
      <Flex
        width={"100vw"}
        height={"100vh"}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        {currentUser.group[0] === "DEV" ? (
          <Flex
            style={{
              width: 506,
              height: 680,
              flexDirection: "column",
              borderRadius: 20,
              boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
              paddingTop: 86,
              paddingRight: 33,
              paddingLeft: 33,
            }}
          >
            <Divider mt={-4}>
              <Text textStyle={"h4"}>{i18n.__("createAppStudioAccount")}</Text>
            </Divider>
            <Flex
              style={{
                height: 158,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image src={prifinaIcon} />
              <Image src={infinityIcon} />
              <Image src={dataCloudIcon} />
            </Flex>
            <Flex
              bg={colors.baseTertiary}
              style={{
                height: 211,
                justifyContent: "center",
                flexDirection: "column",
                paddingRight: 16,
                paddingLeft: 16,
              }}
            >
              <Text
                mb={16}
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.brandAccent}
              >
                {i18n.__("redirectNecessary")}
              </Text>
              <Text
                textStyle="normal"
                fontWeight="regular"
                color={colors.brandAccent}
              >
                {i18n.__("accountCreationText")}
              </Text>
            </Flex>
            <Flex
              style={{
                height: 102,
                paddingRight: 16,
                paddingLeft: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text fontSize="xxs">{i18n.__("appStudioDisclaimer")}</Text>
            </Flex>
            <Flex
              mt={24}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                variation="outline"
                onClick={() => {
                  window.location.href = config.APP_URL;
                }}
              >
                {i18n.__("noThanks")}
              </Button>
              <Button
                onClick={() => {
                  window.location.href = config.DEV_URL;
                }}
              >
                {i18n.__("createAccount")}
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Flex
            style={{
              width: 506,
              height: 380,
              flexDirection: "column",
              borderRadius: 20,
              boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
              paddingTop: 86,
              paddingBottom: 33,
              paddingRight: 33,
              paddingLeft: 33,
            }}
          >
            <Divider mt={-4}>
              <Text textStyle={"h4"}>Proceed to your account</Text>
            </Divider>
            <Flex
              style={{
                height: 158,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image src={prifinaIcon} />
              <Image src={infinityIcon} />
              <Image src={dataCloudIcon} />
            </Flex>
            <Flex
              bg={colors.baseTertiary}
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                paddingRight: 16,
                paddingLeft: 16,
              }}
            >
              <Text
                mb={16}
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.brandAccent}
              >
                {i18n.__("redirectNecessary")}
              </Text>
            </Flex>
            <Flex
              mt={24}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                variation="outline"
                onClick={() => {
                  window.location.href = config.APP_URL;
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.location.href = config.DEV_URL;
                }}
              >
                Proceed
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  );
};

DevConsole.displayName = "DevConsole";

export default DevConsole;
