import React, { useState } from "react";
import { Box, Flex, Button, Text, IconField } from "@blend-ui/core";

import bxUser from "@iconify/icons-bx/bx-user";

import ProgressContainer from "../components/ProgressContainer";
import { useFormFields } from "../lib/formFields";

import { API, Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { useHistory } from "react-router-dom";
import PasswordField from "../components/PasswordField";
import ConfirmAuth from "./ConfirmAuth";

import ForgotPassword from "./ForgotPassword";
import RecoverUsername from "./RecoverUsername";

import {
  validUsername,
  lowerCaseChars,
  upperCaseChars,
  hasSpaces,
  hasNonChars,
  digitChars,
} from "../lib/utils";

import { useFocus } from "../lib/componentUtils";
import i18n from "../lib/i18n";
import config from "../config";
import { useToast } from "@blend-ui/toast";

//import PropTypes from "prop-types";
i18n.init();
/*
function useIsMountedRef() {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });
  return isMountedRef;
}
*/

const Login = () => {
  //console.log("Phone ", props);
  const history = useHistory();
  const { APIConfig, userAuth } = useAppContext();
  API.configure(APIConfig);
  //const isMountedRef = useIsMountedRef();
  //console.log("ENV ", process.env);
  //console.log("HISTORY ", history.location.search);
  //REACT_APP_DEBUG: "true"
  const appDebug =
    process.env.REACT_APP_DEBUG === "true" &&
    history.location.search === "?debug=true";
  console.log("APP DEBUG ", appDebug);

  const alerts = useToast();
  //console.log("USE ", useToast);

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

  const [invalidLogin, setInvalidLogin] = useState(0);
  const [confirmCode, setConfirmCode] = useState(false);
  const [authOptions, setAuthOptions] = useState({});

  const [step, setStep] = useState(0);

  const loginClick = async () => {
    setInvalidLogin(0);
    try {
      //this.setState({loading: true, disabled: true});
      let user = await Auth.signIn(loginFields.username, loginFields.password);
      console.log("LOGIN", user);
      /*
      localStorage.setItem(
        "LastSessionIdentityPool",
        "us-east-1:37a1a326-618e-4e3f-bf8f-a0bbd06a25b3",
      );
      */
      /*
      let currentConfig = Auth._config;
      console.log("AUTH CONFIG ", currentConfig);
      currentConfig.identityPoolId =
        "us-east-1:37a1a326-618e-4e3f-bf8f-a0bbd06a25b3";
      Auth.configure(currentConfig);
      const _currentSession = await Auth.currentSession();
      console.log("LOGIN SESSION ", _currentSession);
      */
      //setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
      //setConfirmCode(true);
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
          //normal login...
          //setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
        }
        alerts.info(i18n.__("confirmationCodeSent"), {});
        setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
        setConfirmCode(true);
      }
      //userAuth(true);
      //history.replace("/home");
      //authOptions.setAuth(true);
      //preferredMFA: "NOMFA"
      //challengeName: "SMS_MFA"
      /*
      challengeParam:
CODE_DELIVERY_DELIVERY_MEDIUM: "SMS"
CODE_DELIVERY_DESTINATION: "+********7102"
*/
    } catch (e) {
      console.log("ERR", e);
      if (
        e.code === "NotAuthorizedException" ||
        e.code === "UserNotFoundException"
      ) {
        alerts.error(i18n.__("invalidLogin"), {});
        setInvalidLogin(2);
        setInputUsernameFocus();
      }
    }
  };

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
    //const userState = validUsername(username, config.usernameLength);
    //config.passwordLength
    let checkResult = false;
    //const password = e.target.value;

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

  /*
  useEffect(() => {
    if (isMountedRef.current) {
      console.log(
        "START ",
        document.getElementById("username").value,
        loginFields
      );
      
    }
  }, [isMountedRef]);
*/
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
                    //console.log("USER ", e.target.value);
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
                  /* top: usernameError.status ? "-33px" : "-7px", */
                }}
              >
                <Flex>
                  <Button
                    className={"ForgotUsernameButton"}
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
            {/* 
            <Box mt={usernameError.status ? -19 : 9}> */}

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
                    //checkUsername("");
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
                  //console.log("PASS ", e.target.value);
                  handleChange(e);
                  /*
                  const passwordError = checkPassword(e.target.value);
                  if (passwordError) {
                    setPasswordError({
                      status: true,
                    });
                    //alerts.error(i18n.__("passwordQuality"), {});
                    const errorMsg = i18n.__("passwordQuality");
                    if (
                      !alerts
                        .check()
                        .some((alert) => alert.message === errorMsg)
                    )
                      alerts.error(errorMsg, {});
                  } else if (e.target.value.length > 7) {
                    setPasswordError({
                      status: false,
                    });
                    const userError = checkUsername(loginFields.username, true);
                    if (userError !== "") {
                      //alerts.error(userError, {});

                      if (
                        !alerts
                          .check()
                          .some((alert) => alert.message === userError)
                      )
                        alerts.error(userError, {});
                      setUsernameError({ status: true });
                    } else {
                      setUsernameError({ status: false });
                      setInvalidLogin(1);
                    }
                  }
                  */
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
                  /* top: passwordError.status ? "-33px" : "-7px", */
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
            {/* 
            <Box mt={passwordError.status ? 49 : 77} display={"inline-flex"}> */}
            <Box mt={77} display={"inline-flex"}>
              <Flex>
                <Button
                  className={"CreateAccountButton"}
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
