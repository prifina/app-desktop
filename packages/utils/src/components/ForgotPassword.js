import React, { useState, useReducer } from "react";

import config from "../config";

import bxUser from "@iconify/icons-bx/bx-user";
import bxKey from "@iconify/icons-bx/bx-key";

import {
  checkUsernameQuery,
  i18n,
  useFormFields,
  useFocus,
  checkPassword,
  validUsername,
  sendVerificationMutation,
  changeUserPasswordMutation,
  PasswordField,
} from "../";

import { BlendIcon } from "@blend-ui/icons";

import bxCheckCircle from "@iconify/icons-bx/bx-check-circle";

import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";

import { useToast } from "@blend-ui/toast";

import { API } from "aws-amplify";

const ForgotPassword = ({ onBack, onForward, ...props }) => {
  const { colors } = useTheme();

  const [passwordVerification, setPasswordVerification] = useState([
    false,
    false,
    false,
    true,
    false,
  ]);

  const [inputUsername, setInputUsernameFocus] = useFocus();
  const [inputPassword, setInputPasswordFocus] = useFocus();

  const alerts = useToast();

  const [usernameError, setUsernameError] = useState({
    status: false,
    msg: "",
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    msg: "",
  });

  const [passwordConfirmError, setPasswordConfirmError] = useState({
    status: false,
    msg: "",
  });

  const [addPopper, setAddPopper] = useState(false);

  const onPopper = (e, status) => {
    console.log("POPPER");
    e.preventDefault();
    setAddPopper(status);
  };

  const [step, setStep] = useState(2);

  const [loginFields, handleChange] = useFormFields({
    username: "",
    password: "",
    passwordConfirm: "",
    confirmationCode: "",
  });

  console.log("input", loginFields.password);

  const [inputCode, setInputCodeFocus] = useFocus();
  const [inputError, setInputError] = useState({ status: false, msg: "" });

  //----------------USERNAME------------------------------

  const userNameAlert = (userError, userMsg) => {
    if (userError && !alerts.check().some(alert => alert.message === userMsg))
      alerts.error("Form has errors", {});

    // setState({
    //   username: { ...loginFields.username, status: userError, msg: userMsg },
    // });

    setUsernameError({ status: userError, msg: userMsg });
  };
  const checkUsername = (username, check = false) => {
    const userState = validUsername(username, config.usernameLength);
    let userError = userState !== "";
    let userMsg = "";

    if (userState === "LENGTH") {
      userMsg = i18n.__("usernameError", { length: config.usernameLength });
    }
    if (userState === "SPACES") {
      userMsg = i18n.__("usernameError2");
    }

    console.log("USER ", username, userError);
    if (!userError && check) {
      console.log("CHECKING USER");
      checkUsernameQuery(API, username, config.cognito.USER_POOL_ID).then(
        res => {
          if (
            typeof res.data !== "undefined" &&
            res.data.checkCognitoAttribute
          ) {
            userNameAlert(true, i18n.__("usernameExists"));
          } else {
            // setState({ username: { ...loginFields.username, status: false } });\
            setUsernameError({ status: userError, msg: userMsg });
          }
        },
      );
    } else {
      userNameAlert(userError, userMsg);
      console.log("check username alert", userNameAlert(userError, userMsg));
    }

    return userError;
  };

  //--------------------------INVITE CODE--------------------------

  const checkInput = code => {
    const checkResult = onlyDigitChars(code);

    let validCode = true;
    if (!checkResult) {
      setInputError({ status: true, msg: i18n.__("codeDigitsError") });

      const errorMsg = i18n.__("codeDigitsError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      validCode = false;
    }
    if (code.length > 1 && code.length !== 6) {
      setInputError({ status: true, msg: i18n.__("codeLengthError") });

      const errorMsg = i18n.__("codeLengthError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      validCode = false;
    }
    if (validCode) {
      setInputError({ status: false, msg: "" });
    }
  };

  //------------------

  const checkConfirmPassword = (password, onBlur = false) => {
    console.log("Confirm ", password);
    const confirmStatus = loginFields.password === password;
    console.log(confirmStatus, loginFields.password, password);
    let checkResult = false;

    const errorMsg = i18n.__("invalidPassword");
    if (!confirmStatus && !onBlur) {
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      checkResult = true;
    } else if (confirmStatus) {
      // setState({
      //   accountPassword: { ...state.accountPassword, status: false },
      //   passwordConfirm: {
      //     ...state.passwordConfirm,
      //     status: false,
      //     // msg: errorMsg,
      //   },
      // });

      setPasswordError({ status: false });
      setPasswordConfirmError({ status: false });
    }

    return checkResult;
  };
  const checkInputPassword = (password, updateVerification = true) => {
    const checkResult = checkPassword(password, config.passwordLength, [
      "firstname",
      "lastname",
      loginFields.username,
    ]);
    console.log("PASS CHECK ", checkResult);
    setPasswordVerification(checkResult);
    // if(///// check result[3] is false set it to true)
    // ch[3] = true;
    return checkResult;
  };

  const checkPasswordQuality = verifications => {
    console.log(
      "Checking password quality... ",
      passwordVerification,
      verifications,
    );
    const verifyList = verifications || passwordVerification;
    const invalidPasswordStatus = verifyList.some((v, i) => {
      console.log("STEP ", v, i);
      return v === false;
    });
    return invalidPasswordStatus;
  };

  const passwordCheck = password => {
    const passwordCheckResult = checkInputPassword(password);
    const passwordError = checkPasswordQuality(passwordCheckResult);
    if (passwordError) {
      const errorMsg = i18n.__("passwordQuality");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      return false;
    } else {
      return true;
    }
  };

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

  const getClientID = process.env.REACT_APP_APP_CLIENT_ID;

  console.log("input", loginFields);
  console.log("input", getClientID);

  const sendCode = async e => {
    try {
      await sendVerificationMutation(
        API,
        "both",
        JSON.stringify({
          username: loginFields.username,
          clientId: getClientID,
        }),
      );
      alerts.info(i18n.__("phoneVerificatioSent"), {});
      setStep(1);
    } catch (e) {
      console.log("ERR", e);
    }
  };

  const changePassword = () => {
    changeUserPasswordMutation(
      API,
      loginFields.username +
        "#" +
        getClientID +
        "#both#" +
        loginFields.confirmationCode,

      loginFields.passwordConfirm,
    ).then(res => {
      alerts.success(i18n.__("success"), {});

      console.log("SUCCESS", res);
    });
  };

  console.log("Username and password errors", usernameError, passwordError);

  return (
    <React.Fragment>
      <Box width="354px" textAlign="center">
        <Text textStyle="h3" mb={30}>
          {i18n.__("resetPasswordTitle")}
        </Text>
        {step === 0 && (
          <Box mt={120}>
            <Box mt={20}>
              <Text fontSize={16} textAlign={"center"}>
                {i18n.__("resetPasswordText")}
              </Text>
            </Box>
            <Box mt={62}>
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
                  onChange={handleChange}
                  onBlur={e => {
                    if (e.target.value.length > 0) {
                      const userError = checkUsername(e.target.value);
                      if (userError !== "") {
                        setInputUsernameFocus();
                        e.preventDefault();
                      }
                    }
                  }}
                  error={usernameError.status}
                  ref={inputUsername}
                  defaultValue={loginFields.username}
                  onKeyDown={e => {
                    if (e.key === "Enter" && e.target.value.length >= 6) {
                      checkUsername(e.target.value, true);
                    }
                  }}
                  tabIndex="2"
                  errorMsg={usernameError.msg !== "" ? usernameError.msg : ""}
                />
              </IconField>
            </Box>
            <Flex mt={28} justifyContent={"center"}>
              <Text textAlign={"center"} fontSize={10}>
                {i18n.__("forgotUsername2")}
              </Text>
              <Button
                variation={"link"}
                size="xs"
                paddingLeft={5}
                onClick={onForward}
              >
                {i18n.__("sendAgainLinkText")}
              </Button>
            </Flex>
            <Box mt={45} mb={30} display={"inline-flex"}>
              <Flex>
                <Button
                  className="backButton"
                  variation={"outline"}
                  onClick={onBack}
                >
                  {i18n.__("Back")}
                </Button>
              </Flex>
              <Flex ml={99}>
                <Button
                  onClick={async e => {
                    if (usernameError.status) {
                      e.preventDefault();
                      await sendCode();
                    }
                  }}
                >
                  {i18n.__("nextButton")}
                </Button>
              </Flex>
            </Box>
          </Box>
        )}
        {step === 1 && (
          <Box mt={120}>
            <Box mt={70}>
              <Text fontSize={16} textAlign={"center"}>
                {i18n.__("sentCodeText")}
              </Text>
            </Box>
            <Flex mt={66} justifyContent={"center"}>
              <Text textAlign={"center"} fontSize={10}>
                {i18n.__("codeMissing2")}
              </Text>
              <Button
                variation="link"
                size="xs"
                paddingLeft={5}
                // onClick={onForward}
                //need resend code
              >
                {i18n.__("sendAgainLinkText2")}
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
          </Box>
        )}
        {step === 2 && (
          <Box mt={40}>
            <Box mt={20}>
              <Text fontSize={16} textAlign={"center"}>
                {i18n.__("resetPasswordText2")}
              </Text>
            </Box>

            <Box mt={52}>
              <IconField>
                <IconField.LeftIcon
                  iconify={bxKey}
                  color={"componentPrimary"}
                  size={"17"}
                />
                <IconField.InputField
                  autoFocus={true}
                  placeholder={i18n.__("codePropmt")}
                  id={"confirmationCode"}
                  name={"confirmationCode"}
                  onChange={handleChange}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      checkInput(loginFields.confirmationCode);
                    }
                  }}
                  errorMsg={inputError.msg}
                  error={inputError.status}
                  ref={inputCode}
                />
              </IconField>
            </Box>
            <Box mt={28}>
              <PasswordField
                placeholder={i18n.__("newPassword")}
                onFocus={e => {
                  const passwordCheckStatus = true;
                  if (!passwordCheckStatus) {
                    e.preventDefault();
                    e.stopPropagation();
                  } else if (
                    !passwordError.status ||
                    loginFields.password.length === 0
                  ) {
                    setAddPopper(true);
                  }
                }}
                addPopper={addPopper}
                verifications={passwordVerification}
                id={"accountPassword"}
                name={"accountPassword"}
                onChange={e => {
                  handleChange(e);
                  checkInputPassword(e.target.value);
                }}
                ref={inputPassword}
                defaultValue={loginFields.password}
                error={usernameError.status}
                onBlur={e => {
                  if (e.target.value.length > 0) {
                    if (passwordCheck(e.target.value)) {
                      setAddPopper(false);
                    } else {
                      setInputPasswordFocus();
                      e.preventDefault();
                    }
                  } else {
                    setAddPopper(false);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && e.target.value.length > 4) {
                    const checkStatus = passwordCheck(e.target.value);
                    if (checkStatus) {
                      setAddPopper(false);
                    }
                  }
                }}
                autoComplete="new-password"
                tabIndex="3"
              />
            </Box>
            <Box mt={28}>
              <PasswordField
                placeholder={i18n.__("confirmNewPassword")}
                onFocus={e => {
                  if (loginFields.passwordConfirm.length === 0) {
                    setInputPasswordFocus();
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                id={"passwordConfirm"}
                name={"passwordConfirm"}
                defaultValue={loginFields.passwordConfirm}
                onChange={handleChange}
                error={passwordConfirmError.status || passwordError.status}
                onBlur={e => {
                  if (e.target.value.length === loginFields.password.length) {
                    checkConfirmPassword(e.target.value, false);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && e.target.value.length > 4) {
                    checkConfirmPassword(e.target.value, false);
                  }
                }}
                autoComplete="new-password"
                tabIndex="4"
              />
            </Box>
            <Box mt={50} display="flex" justifyContent="center">
              <Button
                disabled={
                  inputError.status ||
                  passwordError.status ||
                  usernameError.status ||
                  loginFields.confirmationCode.length !== 6 ||
                  loginFields.username.length < config.usernameLength ||
                  loginFields.password.length < config.passwordLength
                }
                onClick={e => {
                  // setStep(3);
                  changePassword();
                  e.preventDefault();
                }}
              >
                {i18n.__("doneButton")}
              </Button>
            </Box>
          </Box>
        )}
        {step === 3 && (
          <Box mt={120}>
            <Box mt={20}>
              <Text fontSize={16} textAlign="center">
                {i18n.__("resetPasswordText3")}
              </Text>
            </Box>
            <Box mt={50} display="flex" justifyContent="center">
              <BlendIcon
                iconify={bxCheckCircle}
                color={colors.componentPrimary}
                size="89"
              />
            </Box>
            <Box mt={65} mb={30} display="flex" justifyContent="center">
              <Button
                onClick={() => {
                  setStep(0);
                }}
              >
                {i18n.__("loginButton")}
                {/* Leads to first page of this flow - to be implemented... */}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
};

export default ForgotPassword;
