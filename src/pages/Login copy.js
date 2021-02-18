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
import { useFocus } from "../lib/componentUtils";
import i18n from "../lib/i18n";
import config from "../config";

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
  const [inputUsername, setInputUsernameFocus] = useFocus();
  const [inputPassword, setInputPasswordFocus] = useFocus();

  const [invalidLogin, setInvalidLogin] = useState(0);
  const [confirmCode, setConfirmCode] = useState(false);
  const [authOptions, setAuthOptions] = useState({});

  const loginClick = async () => {
    setInvalidLogin(0);
    try {
      //this.setState({loading: true, disabled: true});
      let user = await Auth.signIn(loginFields.username, loginFields.password);
      console.log("LOGIN", user);

      if (
        user.hasOwnProperty("preferredMFA") &&
        user.preferredMFA === "NOMFA"
      ) {
        if (!user.attributes.phone_number_verified) {
          await Auth.signOut();
          setUsernameError({
            status: true,
            msg: "User has unverified phone number",
          });
          console.log("ERROR PHONE NUMBER UNVERIFIED...", user);
        } else {
          const mfa = await Auth.setPreferredMFA(user, "SMS");
          console.log("MFA ", mfa);
          user = await Auth.signIn(loginFields.username, loginFields.password);
        }
      }
      if (
        user.hasOwnProperty("challengeName") &&
        user.challengeName === "SMS_MFA"
      ) {
        setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
        setConfirmCode(true);
      }

      /*
      if (user.preferredMFA === "NOMFA") {
        //const mfa = await Auth.setPreferredMFA(user, "SMS");
        //console.log("MFA ", mfa);
        history.replace("/");
        userAuth(true);
      } else if (user.challengeName === "SMS_MFA") {
        setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
        setConfirmCode(true);
      }
*/
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
            <Box mt={60 - (invalidLogin === 2 ? 22 : 0)} textAlign={"center"}>
              {invalidLogin === 2 && (
                <Text colorStyle={"error"} fontSize={"xs"}>
                  {i18n.__("invalidLogin")}
                </Text>
              )}
            </Box>
            <Box>
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
                        setUsernameError({ status: true, msg: userError });
                      } else {
                        setUsernameError({ status: false, msg: "" });
                        setPasswordError({
                          status: false,
                          msg: "",
                        });
                        setInvalidLogin(1);
                      }
                    }
                  }}
                  errorMsg={usernameError.msg}
                  error={usernameError.status}
                  ref={inputUsername}
                  onBlur={(e) => {
                    const userError = checkUsername(e.target.value);
                    if (userError !== "") {
                      console.log(userError);
                      setUsernameError({ status: true, msg: userError });
                      setInputUsernameFocus();
                      e.preventDefault();
                    } else {
                      setUsernameError({ status: false, msg: "" });
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
                  top: usernameError.status ? "-33px" : "-7px",
                }}
              >
                <Flex>
                  <Button variation={"link"} fontSize={"10px"}>
                    {i18n.__("forgotUsername")}
                  </Button>
                </Flex>
              </Box>
            </Box>

            <Box mt={usernameError.status ? -19 : 9}>
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
                      msg: i18n.__("passwordQuality"),
                    });
                  } else if (e.target.value.length > 7) {
                    setPasswordError({
                      status: false,
                      msg: "",
                    });
                    const userError = checkUsername(loginFields.username, true);
                    if (userError !== "") {
                      setUsernameError({ status: true, msg: userError });
                    } else {
                      setUsernameError({ status: false, msg: "" });
                      setInvalidLogin(1);
                    }
                  }
                }}
                errorMsg={passwordError.msg}
                error={passwordError.status}
                ref={inputPassword}
              />
              <Box
                display={"inline-flex"}
                justifyContent={"flex-end"}
                width={[1]}
                style={{
                  position: "relative",
                  top: passwordError.status ? "-33px" : "-7px",
                }}
              >
                <Flex>
                  <Button variation={"link"} fontSize={"10px"}>
                    {i18n.__("forgotPassword")}
                  </Button>
                </Flex>
              </Box>
            </Box>

            <Box mt={passwordError.status ? 49 : 77} display={"inline-flex"}>
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
