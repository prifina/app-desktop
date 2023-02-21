import React, { useState } from "react";
import { Box, Flex, Button, Image, Text, useTheme } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";

import bxUser from "@iconify/icons-bx/bx-user";

import { API, Auth } from "aws-amplify";

import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

import appStudioIcon from "../assets/app-studio-icon.svg";
import PrifinaIcon from "../assets/prifina-icon.svg";
import infinityIcon from "../assets/infinity-icon.svg";

import landingImage from "../assets/landingImage.svg";

import {
  getLoginUserIdentityPoolQuery,
  i18n,
  useFormFields,
  useFocus,
  useAppContext,
  validUsername,
  lowerCaseChars,
  upperCaseChars,
  hasSpaces,
  hasNonChars,
  digitChars,
  ConfirmAuth,
  PasswordField,
  sendVerificationMutation,
  ForgotPassword,
  RecoverUsername,
} from "@prifina-apps/utils";

import config from "../config";
import { useToast } from "@blend-ui/toast";

import styled from "styled-components";

i18n.init();

const InnerBox = styled(Box)`
  width: 354px;
  height: 118px;
  border: 1px solid #6b6669;
  background: #373436;
  border-radius: 4px;
  padding: 16px;
`;

const LoginContainer = styled(Box)`
  background: ${props => props.background || null};
  width: 534px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 105px;
`;

const ImageFlex = styled(Flex)`
  width: 85px;
  height: 25px;
  align-items: center;
  justify-content: space-between;
`;

const Login = () => {
  //const history = useHistory();

  const navigate = useNavigate();
  const location = useLocation();

  const { colors } = useTheme();

  const { userAuth } = useAppContext();
  const APIConfig = {
    aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
    aws_appsync_region: config.main_region,
    aws_appsync_authenticationType:
      config.appSync.aws_appsync_authenticationType,
  };
  // set default prifina api configs...
  API.configure(APIConfig);

  const appDebug =
    process.env.REACT_APP_DEBUG === "true" && location.search === "?debug=true";
  console.log("APP DEBUG ", appDebug, location);
  //history.location.search === "?debug=true";
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

  const [confirmCode, setConfirmCode] = useState(false);
  const [authOptions, setAuthOptions] = useState({});

  const [step, setStep] = useState(0);

  const loginClick = async () => {
    try {
      const prifinaUserIdPool = await getLoginUserIdentityPoolQuery(
        API,
        loginFields.username,
        config.cognito.USER_POOL_ID,
      );
      console.log("ID POOL ", prifinaUserIdPool);

      let userIdPool = config.cognito.USER_IDENTITY_POOL_ID;

      if (prifinaUserIdPool.data.getLoginUserIdentityPool !== "") {
        userIdPool = prifinaUserIdPool.data.getLoginUserIdentityPool;
      }

      let currentConfig = Auth._config;
      console.log("LOGIN CONFIG");

      currentConfig.identityPoolId = userIdPool;

      currentConfig.identityPoolRegion = userIdPool.split(":")[0];
      Auth.configure(currentConfig);

      let user = await Auth.signIn(loginFields.username, loginFields.password);
      console.log("LOGIN", user);

      localStorage.setItem(
        "LastSessionIdentityPool",
        currentConfig.identityPoolId,
      );
      /*   
      // Keep this in case there is a need to debug identity pool iam credentals
      const token = _currentSession.getIdToken().payload;
      //const provider='cognito-idp.'+userPoolRegion+'.amazonaws.com/'+userPoolId;
      const provider = token["iss"].replace("https://", "");
      let identityParams = {
        IdentityPoolId: userIdPool,
        //AccountId: process.env.REACT_APP_PRIFINA_ACCOUNT,
        //AccountId: "352681697435",
        Logins: {},
      };
      identityParams.Logins[provider] = _currentSession
        .getIdToken()
        .getJwtToken();

      const cognitoClient = new CognitoIdentityClient({
        //region: currentConfig.region,
        region: currentConfig.identityPoolRegion,
        //customUserAgent: getAmplifyUserAgent(),
      });
      // for a returning user, this will retrieve the previous identity assocaited with the logins
      //const { IdentityId } = await cognitoClient.send(
      console.log(identityParams);
      const cognitoIdentity = await cognitoClient.send(
        new GetIdCommand(identityParams),
      );

      //const cognitoIdentity=await cognitoidentity.getId(identityParams).promise();
      console.log(cognitoIdentity);

      //const credentials=await Auth.currentUserCredentials();
      //console.log('INIT AUTH CREDS ',credentials);
    
      const cognitoIdentity=await cognitoidentity.getId(identityParams).promise();
      console.log(cognitoIdentity);

      let credentialParams = {
        IdentityId: cognitoIdentity.IdentityId,
      Logins:{}};

    
    credentialParams.Logins[provider] = idToken;
    const cognitoIdentityCredentials=await cognitoClient.send(
        new GetCredentialsForIdentityCommand(credentialParams
        )
    //console.log(cognitoIdentityCredentials);
*/

      if (appDebug && user.preferredMFA === "NOMFA") {
        userAuth(true);
        //history.replace("/home");
        navigate("/home", { replace: true });
      } else {
        if (user.preferredMFA === "NOMFA") {
          const mfa = await Auth.setPreferredMFA(user, "SMS");
          console.log("MFA ", mfa);
          user = await Auth.signIn(loginFields.username, loginFields.password);
          console.log("LOGIN2", user);
        } else if (user.challengeName === "SMS_MFA") {
        }
        alerts.info(i18n.__("confirmationCodeSent"), {});
        setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
        setConfirmCode(true);
      }
    } catch (e) {
      console.log("ERR", e);
      if (
        e.code === "NotAuthorizedException" ||
        e.code === "UserNotFoundException"
      ) {
        alerts.error(i18n.__("invalidLogin"), {});

        setInputUsernameFocus();
      }
    }
  };

  const checkUsername = (username, checkLength = false) => {
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

  const createAccountClick = e => {
    //history.replace("/register");
    navigate("/register", { replace: true });
    e.preventDefault();
  };
  const backButtonClick = e => {
    setConfirmCode(false);
    e.preventDefault();
  };

  switch (step) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    default:
  }

  const getClientID = process.env.REACT_APP_APP_CLIENT_ID;

  const resendCode = async e => {
    try {
      await sendVerificationMutation(
        API,
        "phone",
        JSON.stringify({
          username: loginFields.username,
          clientId: getClientID,
        }),
      );
      alerts.info(i18n.__("phoneVerificatioSent"), {});
    } catch (e) {
      console.log("ERR", e);
    }
  };

  return (
    <>
      <Flex width="100vw" height="100vh">
        <Box
          flexGrow={1}
          style={{
            background: colors.landingGradient,
            paddingTop: 63,
          }}
        />
        <LoginContainer background={colors.baseTertiary}>
          {step === 0 && (
            <Box textAlign="start" width="354px">
              <Flex mb={57} alignSelf="flex-start">
                <Image src={appStudioIcon} width="25px" />
                <Text ml={3} fontWeight="600">
                  App Studio
                </Text>
              </Flex>
              {confirmCode ? (
                <ConfirmAuth
                  backButton={backButtonClick}
                  authOptions={authOptions}
                  appStudio
                  resendCode={resendCode}
                />
              ) : (
                <>
                  <Text mb={4} textStyle="h3">
                    Log in to your account
                  </Text>
                  <Text mb={32} color={colors.textMuted}>
                    Welcome back! Please enter your details.
                  </Text>
                  <InnerBox mb={32}>
                    <ImageFlex mb={16}>
                      <Image src={PrifinaIcon} />
                      <Image src={infinityIcon} height="13px" />
                      <Image src={appStudioIcon} />
                    </ImageFlex>
                    <Text mb={4}>Already have a Prifina account?</Text>
                    <Text fontSize="sm" color={colors.textMuted}>
                      Use the same credentials to log in here.
                    </Text>
                  </InnerBox>
                  <Box>
                    <Text fontWeight="600" fontSize="sm">
                      Username
                    </Text>
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
                        onChange={e => {
                          handleChange(e);
                        }}
                        ref={inputUsername}
                        error={usernameError.status}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            const userError = checkUsername(
                              e.target.value,
                              true,
                            );
                          }
                        }}
                        onBlur={e => {
                          if (e.target.value.length > 0) {
                            const userError = checkUsername(e.target.value);
                            if (userError !== "") {
                              setInputUsernameFocus();
                              e.preventDefault();
                            }
                          }
                        }}
                      />
                    </IconField>
                    {/* <Box
                      display={"inline-flex"}
                      justifyContent={"flex-end"}
                      width={[1]}
                      style={{
                        position: "relative",
                        top: "-4px",
                      }}
                    >
                      <Flex>
                        <Button
                          id="forgotUsernameButton"
                          variation={"link"}
                          fontSize="xs"
                          onClick={() => {
                            setStep(2);
                          }}
                        >
                          {i18n.__("forgotUsername")}
                        </Button>
                      </Flex>
                    </Box> */}
                  </Box>
                  <Box mt={32}>
                    <Text fontWeight="600" fontSize="sm">
                      Password
                    </Text>
                    <PasswordField
                      placeholder={i18n.__("passwordPlaceholder")}
                      id={"password"}
                      name={"password"}
                      onFocus={e => {
                        if (
                          loginFields.username.length === 0 ||
                          document.querySelector("input#username").value
                            .length === 0
                        ) {
                          console.log(
                            "PASSWORD ON FOCUS CHECK...",
                            loginFields.username.length,
                            document.querySelector("input#username").value
                              .length,
                          );
                          setInputUsernameFocus();
                          e.preventDefault();
                        }
                      }}
                      onChange={e => {
                        handleChange(e);
                      }}
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
                        if (
                          document.querySelector("input#username").value
                            .length > 0
                        ) {
                          const passwordError = checkPassword(
                            e.target.value,
                            true,
                          );

                          if (passwordError) {
                            const errorMsg = i18n.__("passwordQuality");
                            console.log("ALERTS ", alerts.check());
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
                        }
                      }}
                      ref={inputPassword}
                      error={passwordError.status}
                    />
                    {/* <Box
                      display={"inline-flex"}
                      justifyContent={"flex-end"}
                      width={[1]}
                      style={{
                        position: "relative",
                        top: "-4px",
                      }}
                    >
                      <Flex>
                        <Button
                          className={"ForgotPasswordButton"}
                          variation={"link"}
                          fontSize="xs"
                          onClick={() => {
                            setStep(1);
                          }}
                        >
                          {i18n.__("forgotPassword")}
                        </Button>
                      </Flex>
                    </Box> */}
                  </Box>
                  <Flex mt={85} flexDirection="column" alignItems="center">
                    <Button
                      width="100%"
                      className="LoginButton"
                      disabled={
                        passwordError.status ||
                        usernameError.status ||
                        loginFields.username.length < config.usernameLength ||
                        loginFields.password.length < config.passwordLength
                      }
                      onClick={loginClick}
                    >
                      {i18n.__("loginButton")}
                    </Button>

                    <Flex alignItems="baseline" mt={10}>
                      <Text
                        mr={3}
                        fontSize="xs"
                        textAlign="center"
                        color={colors.textMuted}
                      >
                        Don’t have an account?
                      </Text>
                      <Button
                        className="createAccountButton"
                        id="createAccountButton"
                        color={colors.textLink}
                        variation="link"
                        onClick={createAccountClick}
                      >
                        Create account
                      </Button>
                    </Flex>
                  </Flex>
                </>
              )}
            </Box>
          )}
          {step === 1 && (
            <ForgotPassword
              onBack={() => setStep(0)}
              onForward={() => setStep(2)}
            />
          )}
          {step === 2 && <RecoverUsername onBack={() => setStep(0)} />}
        </LoginContainer>
      </Flex>
    </>
  );
};

export default Login;
