/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React, { useRef, useState, useEffect } from "react";

import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";
import config from "../config";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

import { getPrifinaUserQuery } from "../graphql/api";

import { default as DefaultApp } from "../pages/AppMarket";

import { useFormFields } from "../lib/formFields";

import bxUser from "@iconify/icons-bx/bx-user";

import i18n from "../lib/i18n";

import { Box, Flex, Button, Text, IconField } from "@blend-ui/core";
import ProgressContainer from "../components/ProgressContainer";
import PasswordField from "../components/PasswordField";

const APIConfig = {
  aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
  aws_appsync_region: config.main_region,
  aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
};

const AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.main_region,
};

const S3Config = {
  AWSS3: {
    bucket: config.S3.bucket, //REQUIRED -  Amazon S3 bucket name
    region: config.S3.region, //OPTIONAL -  Amazon service region
  },
};

export default { title: "Forgot Password" };

export const defaultApp = props => {
  console.log("COMPONENT ---> ", props);
  console.log("CONFIG ", config);
  const [settingsReady, setSettingsReady] = useState(false);
  const clientHandler = useRef(null);

  const prifinaID = useRef("");
  const [login, setLogin] = useState(true);

  const [step, setStep] = useState(0);

  const [loginFields, handleChange] = useFormFields({
    username: "",
    password: "",
  });

  Auth.configure(AUTHConfig);
  Amplify.configure(APIConfig);
  Amplify.configure(S3Config);
  console.log("AUTH CONFIG ", AUTHConfig);

  const createClient = (endpoint, region) => {
    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },
      /*
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () =>
        (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    */
      disableOffline: true,
    });
    return client;
  };

  // get user auth...
  useEffect(async () => {
    try {
      if (login) {
        const session = await Auth.currentSession();

        console.log("SESSION ", session);
        if (!session) {
          console.log("NO CURRENT SESSION FOUND");
        }
        console.log("PRIFINA-ID", session.idToken.payload["custom:prifina"]);
        prifinaID.current = session.idToken.payload["custom:prifina"];

        const currentPrifinaUser = await getPrifinaUserQuery(
          GRAPHQL,
          prifinaID.current,
        );

        console.log("CURRENT USER ", currentPrifinaUser);

        const appProfile = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.appProfile,
        );
        console.log("CURRENT USER ", appProfile, appProfile.initials);

        let clientEndpoint =
          "https://kxsr2w4zxbb5vi5p7nbeyfzuee.appsync-api.us-east-1.amazonaws.com/graphql";
        let clientRegion = "us-east-1";
        if (appProfile.hasOwnProperty("endpoint")) {
          clientEndpoint = appProfile.endpoint;
          clientRegion = appProfile.region;
        }

        clientHandler.current = createClient(clientEndpoint, clientRegion);

        setSettingsReady(true);
      }
    } catch (e) {
      if (typeof e === "string" && e === "No current user") {
        setLogin(false);
        //const user = await Auth.signIn("tahola", "xxxx");
        //console.log("AUTH ", user);
        //console.log("APP DEBUG ", appCode);
      }

      console.log("AUTH ", e);
    }
  }, [login]);

  let stepProgress = 0;
  switch (step) {
    case 0:
      stepProgress = 25;
      break;
    case 1:
      stepProgress = 50;
      break;
    case 2:
      stepProgress = 75;
      break;
    case 3:
      stepProgress = 100;
      break;
    default:
      stepProgress = 50;
  }

  return (
    <React.Fragment>
      {step === 0 && (
        <Box mt={120}>
          <ProgressContainer
            title={i18n.__("resetPasswordTitle")}
            progress={50}
            pr={19}
            minHeight={406}
            progress={stepProgress}
          >
            <Box mt={20}>
              <Text fontSize={12} textAlign={"center"}>
                {i18n.__("resetPasswordText")}
              </Text>
            </Box>
            <Box mt={55}>
              <IconField>
                <IconField.LeftIcon
                  iconify={bxUser}
                  color={"componentPrimary"}
                  size={"17"}
                />
                <IconField.InputField
                  autoFocus={true}
                  placeholder={i18n.__("usernamePlaceholder")}
                  id={"username"}
                  name={"username"}
                />
              </IconField>
            </Box>
            <Flex mt={28} justifyContent={"center"}>
              <Text textAlign={"center"} fontSize={10}>
                Forgot your username?
              </Text>
              <Button variation={"link"} size="xs" paddingLeft={5}>
                Click Here.
              </Button>
            </Flex>
            <Box mt={45} mb={30} display={"inline-flex"}>
              <Flex>
                <Button variation={"outline"}>{i18n.__("Back")}</Button>
              </Flex>
              <Flex ml={99}>
                <Button
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  {i18n.__("Next")}
                </Button>
              </Flex>
            </Box>
          </ProgressContainer>
        </Box>
      )}
      {step === 1 && (
        <Box mt={120}>
          <ProgressContainer
            title={i18n.__("resetPasswordTitle")}
            progress={stepProgress}
            pr={19}
            minHeight={406}
          >
            <Box mt={25}>
              <Text fontSize={12} textAlign={"center"}>
                {i18n.__("sentCodeText")}
              </Text>
            </Box>
            <Flex mt={62} justifyContent={"center"}>
              <Text textAlign={"center"} fontSize={10}>
                Didn't recieve your code?
              </Text>
              <Button variation="link" size="xs" paddingLeft={5}>
                Click here to resend.
              </Button>
            </Flex>
            <Box mt={45} display={"inline-flex"}>
              <Flex>
                <Button
                  variation={"outline"}
                  onClick={() => {
                    setStep(0);
                  }}
                >
                  {i18n.__("Back")}
                </Button>
              </Flex>
              <Flex ml={99}>
                <Button
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  {i18n.__("Next")}
                </Button>
              </Flex>
            </Box>
          </ProgressContainer>
        </Box>
      )}
      {step === 2 && (
        <Box mt={120}>
          <ProgressContainer
            title={i18n.__("resetPasswordTitle")}
            progress={50}
            pr={19}
            minHeight={526}
            progress={stepProgress}
          >
            <Box mt={20}>
              <Text fontSize={12} textAlign={"center"}>
                {i18n.__(
                  "Please check your phone for your verification code. Your code is six digits long. Complete the fields below to reset your password.",
                )}
              </Text>
            </Box>
            <Box mt={55}>
              <IconField>
                <IconField.LeftIcon
                  iconify={bxUser}
                  color={"componentPrimary"}
                  size={"17"}
                />
                <IconField.InputField
                  autoFocus={true}
                  placeholder={i18n.__("usernamePlaceholder")}
                  id={"username"}
                  name={"username"}
                />
              </IconField>
            </Box>
            <Box mt={28}>
              <PasswordField
                placeholder={i18n.__("Enter new code")}
                id={"password"}
                name={"password"}
              />
            </Box>
            <Box mt={28}>
              <PasswordField
                placeholder={i18n.__("New password")}
                id={"password"}
                name={"password"}
              />
            </Box>
            <Box mt={28}>
              <PasswordField
                placeholder={i18n.__("Confirm new password")}
                id={"password"}
                name={"password"}
              />
            </Box>
            <Box mt={45} mb={30} display={"inline-flex"}>
              <Flex ml={99}>
                <Button
                  onClick={() => {
                    setStep(3);
                  }}
                >
                  {i18n.__("Done")}
                </Button>
              </Flex>
            </Box>
          </ProgressContainer>
        </Box>
      )}
      {step === 3 && (
        <Box mt={120}>
          <ProgressContainer
            title={i18n.__("resetPasswordTitle")}
            progress={50}
            pr={19}
            minHeight={406}
            progress={stepProgress}
          >
            <Box mt={20}>
              <Text fontSize={12} textAlign={"center"}>
                {i18n.__(
                  "Your password has been reset. Please login with your new password.",
                )}
              </Text>
            </Box>

            <Box mt={45} mb={30} display={"inline-flex"}>
              <Flex>
                <Button
                  onClick={() => {
                    setStep(0);
                  }}
                >
                  {i18n.__("Login")}
                </Button>
              </Flex>
            </Box>
          </ProgressContainer>
        </Box>
      )}
    </React.Fragment>
  );
};

defaultApp.story = {
  name: "Forgot Password",
  /*
  decorators: [
    Story => {
      //console.log("PROVIDER ", PrifinaProvider);
      return (
        <PrifinaProvider
          stage={"alpha"}
          Context={PrifinaContext}
          activeUser={{
            name: "Active user tero",
            uuid: "13625638c207ed2fcd5a7b7cfb2364a04661",
          }}
        >
          <Story />
        </PrifinaProvider>
      );
    },
  ],
  */
};
