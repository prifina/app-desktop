import React, { useState } from "react";
import { Box, Flex, Button, Text, IconField } from "@blend-ui/core";

import bxUser from "@iconify/icons-bx/bx-user";

import ProgressContainer from "../components/ProgressContainer";
import { useFormFields } from "../lib/formFields";

import Amplify, { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { useHistory } from "react-router-dom";
import PasswordField from "../components/PasswordField";
import ConfirmAuth from "./ConfirmAuth";

import {
  validUsername,
  lowerCaseChars,
  upperCaseChars,
  hasSpaces,
  hasNonChars,
  digitChars,
} from "../lib/utils";
import { UseFocus } from "../lib/componentUtils";
import i18n from "../lib/i18n";
import config from "../config";
import { useToast } from "@blend-ui/toast";

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

const Login = ({ onAction, ...props }) => {
  //console.log("Phone ", props);
  const history = useHistory();
  const { APIConfig, userAuth } = useAppContext();
  Amplify.configure(APIConfig);
  //const isMountedRef = useIsMountedRef();
  const alerts = useToast();
  //console.log("USE ", useToast);

  const [loginFields, _handleChange] = useFormFields({
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
  const [inputUsername, setInputUsernameFocus] = UseFocus();
  const [inputPassword, setInputPasswordFocus] = UseFocus();

  const [invalidLogin, setInvalidLogin] = useState(0);
  const [confirmCode, setConfirmCode] = useState(false);
  const [authOptions, setAuthOptions] = useState({});

  const loginClick = async () => {
    setInvalidLogin(0);
    try {
      //this.setState({loading: true, disabled: true});
      let user = await Auth.signIn(loginFields.username, loginFields.password);
      console.log("LOGIN", user);

      //setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
      //setConfirmCode(true);

      if (user.preferredMFA === "NOMFA") {
        const mfa = await Auth.setPreferredMFA(user, "SMS");
        console.log("MFA ", mfa);
        user = await Auth.signIn(loginFields.username, loginFields.password);
        console.log("LOGIN2", user);
      } else if (user.challengeName === "SMS_MFA") {
        //setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
      }
      setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
      setConfirmCode(true);

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

    let userMsg = "";
    if (username.length > 4) {
      const userState = validUsername(username, config.usernameLength);
      if (userState === "LENGTH") {
        userMsg = i18n.__("usernameError", { length: config.usernameLength });
      }
      if (userState === "SPACES") {
        userMsg = i18n.__("usernameError2");
      }
    } else if (checkLength && username.length === 0) {
      userMsg = i18n.__("invalidEntry");
    }

    return userMsg;
  };
  const checkPassword = (password) => {
    //const userState = validUsername(username, config.usernameLength);
    //config.passwordLength
    let checkResult = true;
    //const password = e.target.value;
    if (password.length > 7) {
      if (password.length < config.passwordLength) {
        checkResult = false;
      } else if (!(lowerCaseChars(password) && upperCaseChars(password))) {
        checkResult = false;
      } else if (
        !(digitChars(password) && hasNonChars(password) && !hasSpaces(password))
      ) {
        checkResult = false;
      }
    }
    return !checkResult;
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
  const createAccountClick = (e) => {
    history.replace("/register");
    e.preventDefault();
  };
  const backButtonClick = (e) => {
    setConfirmCode(false);
    e.preventDefault();
  };

  return (
    <React.Fragment>
      {confirmCode && (
        <Box mt={100}>
          <ConfirmAuth backButton={backButtonClick} authOptions={authOptions} />
        </Box>
      )}
      {!confirmCode && (
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
                  onChange={(e) => {
                    //console.log("USER ", e.target.value);
                    _handleChange(e);
                    if (
                      loginFields.password.length > 7 &&
                      !passwordError.status
                    ) {
                      const userError = checkUsername(e.target.value, true);

                      if (userError !== "") {
                        if (
                          !alerts
                            .check()
                            .some((alert) => alert.message === userError)
                        )
                          alerts.error(userError, {});
                        //alerts.error(userError, {});
                        //console.log(alerts.check());
                        setUsernameError({ status: true });
                      } else {
                        setUsernameError({ status: false });
                        setPasswordError({
                          status: false,
                        });
                        setInvalidLogin(1);
                      }
                    }
                  }}
                  ref={inputUsername}
                  error={usernameError.status}
                  onBlur={(e) => {
                    const userError = checkUsername(e.target.value);
                    if (userError !== "") {
                      if (
                        !alerts
                          .check()
                          .some((alert) => alert.message === userError)
                      )
                        alerts.error(userError, {});
                      //alerts.error(userError, {});
                      //console.log(alerts.check());
                      setUsernameError({ status: true });
                      setInputUsernameFocus();
                      e.preventDefault();
                    } else {
                      setUsernameError({ status: false });
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
                  <Button variation={"link"} fontSize={"10px"}>
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
                onChange={(e) => {
                  //console.log("PASS ", e.target.value);
                  _handleChange(e);
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
                  <Button variation={"link"} fontSize={"10px"}>
                    {i18n.__("forgotPassword")}
                  </Button>
                </Flex>
              </Box>
            </Box>
            {/* 
            <Box mt={passwordError.status ? 49 : 77} display={"inline-flex"}> */}
            <Box mt={77} display={"inline-flex"}>
              <Flex>
                <Button variation={"outline"} onClick={createAccountClick}>
                  {i18n.__("createAccount")}
                </Button>
              </Flex>
              <Flex ml={99}>
                <Button
                  disabled={
                    passwordError.status ||
                    usernameError.status ||
                    invalidLogin === 0
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
    </React.Fragment>
  );
};

export default Login;
