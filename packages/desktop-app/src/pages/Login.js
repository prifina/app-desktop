import React, { useState } from "react";
import { Box, Flex, Button } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";

import bxUser from "@iconify/icons-bx/bx-user";

import ProgressContainer from "../components/ProgressContainer";

import { API, Auth } from "aws-amplify";

import { useHistory } from "react-router-dom";
import PasswordField from "../components/PasswordField";
import ConfirmAuth from "./ConfirmAuth";

import ForgotPassword from "./ForgotPassword";
import RecoverUsername from "./RecoverUsername";

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
} from "@prifina-apps/utils";

import config from "../config";
import { useToast } from "@blend-ui/toast";

i18n.init();

const Login = () => {
  const history = useHistory();

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
    process.env.REACT_APP_DEBUG === "true" &&
    history.location.search === "?debug=true";
  console.log("APP DEBUG ", appDebug);

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
        history.replace("/home");
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
    history.replace("/register");
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
    default:
  }

  return (
    <React.Fragment>
      {confirmCode && (
        <Box mt={100}>
          <ConfirmAuth backButton={backButtonClick} authOptions={authOptions} />
        </Box>
      )}
      {!confirmCode && step === 0 && (
        <Box mt={120}>
          <ProgressContainer
            title={i18n.__("loginPage")}
            progress={50}
            pr={19}
            minHeight={406}
          >
            <Box mt={60}>
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
                      const userError = checkUsername(e.target.value, true);
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

              <Box
                display={"inline-flex"}
                justifyContent={"flex-end"}
                width={[1]}
                style={{
                  position: "relative",
                  top: "-7px",
                }}
              >
                <Flex>
                  <Button
                    id="forgotUsernameButton"
                    variation={"link"}
                    fontSize={"10px"}
                    onClick={() => {
                      setStep(2);
                    }}
                  >
                    {i18n.__("forgotUsername")}
                  </Button>
                </Flex>
              </Box>
            </Box>
            <Box mt={9}>
              <PasswordField
                placeholder={i18n.__("passwordPlaceholder")}
                id={"password"}
                name={"password"}
                onFocus={e => {
                  if (
                    loginFields.username.length === 0 ||
                    document.querySelector("input#username").value.length === 0
                  ) {
                    console.log(
                      "PASSWORD ON FOCUS CHECK...",
                      loginFields.username.length,
                      document.querySelector("input#username").value.length,
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
                    document.querySelector("input#username").value.length > 0
                  ) {
                    const passwordError = checkPassword(e.target.value, true);

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
              <Box
                display={"inline-flex"}
                justifyContent={"flex-end"}
                width={[1]}
                style={{
                  position: "relative",
                  top: "-7px",
                }}
              >
                <Flex>
                  <Button
                    className={"ForgotPasswordButton"}
                    variation={"link"}
                    fontSize={"10px"}
                    onClick={() => {
                      setStep(1);
                    }}
                  >
                    {i18n.__("forgotPassword")}
                  </Button>
                </Flex>
              </Box>
            </Box>
            <Box mt={77} display={"inline-flex"}>
              <Flex>
                <Button
                  className="createAccountButton"
                  id="createAccountButton"
                  variation={"outline"}
                  onClick={createAccountClick}
                >
                  {i18n.__("createAccount")}
                </Button>
              </Flex>
              <Flex ml={99}>
                <Button
                  className={"LoginButton"}
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
              </Flex>
            </Box>
          </ProgressContainer>
        </Box>
      )}
      {step === 1 && <ForgotPassword />}
      {step === 2 && <RecoverUsername />}
    </React.Fragment>
  );
};

export default Login;
