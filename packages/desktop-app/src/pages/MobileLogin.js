import React, { useState } from "react";
import { Box, Flex, Button, Text, Image, IconField } from "@blend-ui/core";
import { StyledBox } from "../components/DefaultBackground";
import Background from "../assets/mobile-background.png";

import { ReactComponent as PrifinaText } from "../assets/prifina-text.svg";

import ProgressContainer from "../components/ProgressContainer";

import {
  i18n,
  useFormFields,
  useFocus,
  validUsername,
  lowerCaseChars,
  upperCaseChars,
  hasSpaces,
  hasNonChars,
  digitChars,
} from "@prifina-apps/utils";
//import i18n from "../lib/i18n";

import bxUser from "@iconify/icons-bx/bx-user";
import bxKey from "@iconify/icons-bx/bx-key";
import PasswordField from "../components/PasswordField";

import Amplify, { Auth } from "aws-amplify";
//import { useAppContext } from "../lib/contextLib";
import { useHistory } from "react-router-dom";
//import { useFormFields } from "../lib/formFields";
//import { useFocus } from "../lib/componentUtils";
import { useToast } from "@blend-ui/toast";
/*import {
  validUsername,
  lowerCaseChars,
  upperCaseChars,
  hasSpaces,
  hasNonChars,
  digitChars,
} from "../lib/utils"; */

import config from "../config";

i18n.init();

const titleText =
  "We are a team working on the future of personal applications. This is why we have created this personal cloud environment that will help you implement your boldest ideas while allowing individuals to keep their data.";

const MobileLogin = props => {
  const alerts = useToast();
  const [loginFields, handleChange] = useFormFields({
    username: "",
    password: "",
  });

  const [usernameError, setUsernameError] = useState({
    status: false,
    msg: "Error message",
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    msg: "Error message",
  });
  const [inputUsername, setInputUsernameFocus] = useFocus();
  const [inputPassword, setInputPasswordFocus] = useFocus();

  const [loginStep, setLoginStep] = useState(0);

  const checkUsername = (username, checkLength = false) => {
    //const username = e.target.value;
    console.log("USERNAME ", username);
    let userMsg = "";
    if (username.length === 0) {
      userMsg = i18n.__("invalidEntry");
    } else {
      const userState = validUsername(username, config.usernameLength);
      if (userState === "LENGTH") {
        userMsg = i18n.__("usernameError", { length: config.usernameLength });
      }
      if (userState === "SPACES") {
        userMsg = i18n.__("usernameError2");
      }
    }
    if (userMsg !== "") {
      if (!alerts.check().some(alert => alert.message === userMsg))
        alerts.error(userMsg, {});

      setUsernameError({ status: true });
    } else {
      setUsernameError({ status: false });
    }
    return userMsg;
  };
  const checkPassword = (password, onBlur = false) => {
    let checkResult = false;

    if (password.length < config.passwordLength && !onBlur) {
      checkResult = true;
    } else if (!(lowerCaseChars(password) && upperCaseChars(password))) {
      checkResult = true;
    } else if (
      !(digitChars(password) && hasNonChars(password) && !hasSpaces(password))
    ) {
      checkResult = true;
    }

    return checkResult;
  };

  let stepTitle = "";
  let stepProgress = 0;
  switch (loginStep) {
    case 1:
      stepTitle = "loginButton";
      stepProgress = 50;
      break;
    case 2:
      stepTitle = "confirmTitle";
      stepProgress = 100;
      break;
    default:
      stepTitle = "welcomeMessage";
      stepProgress = 50;
  }
  return (
    <React.Fragment>
      <StyledBox textAlign={"center"} pt={20} pb={20}>
        <PrifinaText height={"27px"} />
        <Image src={Background} />
        <ProgressContainer
          title={i18n.__(stepTitle)}
          progress={stepProgress}
          mobileApp={true}
        >
          {loginStep === 2 && (
            <Box ml={30} mr={30}>
              <Box>
                <Text textAlign={"left"} textStyle={"caption"} as={"p"} m={0}>
                  {i18n.__("authConfirmationText")}
                </Text>
              </Box>
              <Box mt={15}>
                <IconField width={"200px"}>
                  <IconField.LeftIcon
                    iconify={bxKey}
                    color={"componentPrimary"}
                    size={"17"}
                  />
                  <IconField.InputField
                    placeholder={i18n.__("codePropmt")}
                    id={"confirmationCode"}
                    name={"confirmationCode"}
                  />
                </IconField>
              </Box>
              <Box mt={35} display={"inline-flex"}>
                <Flex>
                  <Button
                    variation={"outline"}
                    onClick={() => {
                      setLoginStep(1);
                    }}
                  >
                    {i18n.__("backButton")}
                  </Button>
                </Flex>
                <Flex ml={45}>
                  <Button>{i18n.__("confirmButton")}</Button>
                </Flex>
              </Box>
            </Box>
          )}
          {loginStep === 1 && (
            <Box ml={30} mr={30}>
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
                  ref={inputUsername}
                  error={usernameError.status}
                  onChange={handleChange}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      const userError = checkUsername(e.target.value, true);
                    }
                  }}
                  onBlur={e => {
                    const userError = checkUsername(e.target.value);
                    if (userError !== "") {
                      setInputUsernameFocus();
                      e.preventDefault();
                    }
                  }}
                />
              </IconField>

              <Box
                display={"inline-flex"}
                justifyContent={"flex-end"}
                width={[1]}
                style={{
                  position: "relative",
                  top: "-2px",
                }}
              >
                <Flex>
                  <Button variation={"link"} fontSize={"10px"}>
                    {i18n.__("forgotUsername")}
                  </Button>
                </Flex>
              </Box>
              <Box mt={7}>
                <PasswordField
                  placeholder={i18n.__("passwordPlaceholder")}
                  id={"password"}
                  name={"password"}
                  ref={inputPassword}
                  error={passwordError.status}
                  onChange={handleChange}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      let errorMsg = "";
                      if (e.target.value.length === 0) {
                        errorMsg = i18n.__("invalidEntry");
                      } else {
                        const passwordError = checkPassword(e.target.value);
                        if (passwordError) {
                          errorMsg = i18n.__("passwordQuality");
                        }
                      }
                      if (errorMsg !== "") {
                        if (
                          !alerts
                            .check()
                            .some(alert => alert.message === errorMsg)
                        )
                          alerts.error(errorMsg, {});
                        setPasswordError({
                          status: true,
                        });
                      } else {
                        setPasswordError({
                          status: false,
                        });
                        checkUsername(loginFields.username);
                      }
                    }
                  }}
                  onBlur={e => {
                    const passwordError = checkPassword(e.target.value, true);
                    if (passwordError) {
                      const errorMsg = i18n.__("passwordQuality");
                      if (
                        !alerts
                          .check()
                          .some(alert => alert.message === errorMsg)
                      )
                        alerts.error(errorMsg, {});
                      setPasswordError({
                        status: true,
                      });

                      setInputPasswordFocus();
                      e.preventDefault();
                    } else {
                      setPasswordError({
                        status: false,
                      });
                    }
                  }}
                />
              </Box>
              <Box
                display={"inline-flex"}
                justifyContent={"flex-end"}
                width={[1]}
                style={{
                  position: "relative",
                  top: "-2px",
                }}
              >
                <Flex>
                  <Button variation={"link"} fontSize={"10px"}>
                    {i18n.__("forgotPassword")}
                  </Button>
                </Flex>
              </Box>
              <Box mt={35} display={"inline-flex"}>
                <Flex>
                  <Button
                    variation={"outline"}
                    onClick={() => {
                      setLoginStep(0);
                    }}
                  >
                    {i18n.__("backButton")}
                  </Button>
                </Flex>
                <Flex ml={45}>
                  <Button
                    onClick={() => {
                      setLoginStep(2);
                    }}
                  >
                    {i18n.__("loginButton")}
                  </Button>
                </Flex>
              </Box>
            </Box>
          )}

          {loginStep === 0 && (
            <React.Fragment>
              <Box mt={12} pl={35} pr={35}>
                <Text textStyle={"body"} style={{ wordBreak: "break-word" }}>
                  {titleText}
                </Text>
              </Box>

              <Box mt={35} textAlign={"center"}>
                <Box>
                  <Button
                    onClick={() => {
                      setLoginStep(1);
                    }}
                  >
                    {i18n.__("loginButton")}
                  </Button>
                </Box>
                <Box mt={20}>
                  <Button variation={"outline"}>
                    {i18n.__("registerButton")}
                  </Button>
                </Box>
              </Box>
            </React.Fragment>
          )}
        </ProgressContainer>
      </StyledBox>
    </React.Fragment>
  );
};

export default MobileLogin;
