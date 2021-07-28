import React, { useState, useReducer } from "react";

import config from "../config";

import { useFormFields } from "../lib/formFields";

import { useFocus } from "../lib/componentUtils";

import bxUser from "@iconify/icons-bx/bx-user";
import bxKey from "@iconify/icons-bx/bx-key";

import { checkPassword, validUsername } from "../lib/utils";

import { checkUsernameQuery } from "../graphql/api";

import { BlendIcon } from "@blend-ui/icons";

import bxCheckCircle from "@iconify/icons-bx/bx-check-circle";

import i18n from "../lib/i18n";

import Login from "./Login";

import { Box, Flex, Button, Text, IconField, useTheme } from "@blend-ui/core";
import { useToast } from "@blend-ui/toast";
import ProgressContainer from "../components/ProgressContainer";
import PasswordField from "../components/PasswordField";

const ForgotPassword = props => {
  const { colors } = useTheme();

  const [passwordVerification, setPasswordVerification] = useState([
    false,
    false,
    false,
    true,
    false,
  ]);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      accountPassword: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      username: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      passwordConfirm: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      lastName: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      firstName: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
    },
  );

  const [inputSelect, setSelectFocus] = useFocus();
  const [inputUsername, setInputUsernameFocus] = useFocus();
  const [inputEmail, setInputEmailFocus] = useFocus();
  const [inputPhone, setInputPhoneFocus] = useFocus();
  const [inputPassword, setInputPasswordFocus] = useFocus();
  const [inputFirstname, setInputFirstnameFocus] = useFocus();
  const [inputLastname, setInputLastnameFocus] = useFocus();

  const alerts = useToast();

  const [usernameError, setUsernameError] = useState({
    status: false,
    msg: "Error message",
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    msg: "Error message",
  });

  const [addPopper, setAddPopper] = useState(false);

  const onPopper = (e, status) => {
    console.log("POPPER");
    e.preventDefault();
    setAddPopper(status);
  };

  const [step, setStep] = useState(0);

  const [loginFields, handleChange] = useFormFields({
    username: "",
    password: "",
    confirmationCode: "",
  });

  // const [confirmationFields, handleChange] = useFormFields({
  //   confirmationCode: "",
  // });
  const [inputCode, setInputCodeFocus] = useFocus();
  const [inputError, setInputError] = useState({ status: false, msg: "" });

  //----------------USERNAME------------------------------

  const userNameAlert = (userError, userMsg) => {
    if (userError && !alerts.check().some(alert => alert.message === userMsg))
      alerts.error(userMsg, {});

    setState({ username: { ...state.username, status: userError } });
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
            setState({ username: { ...state.username, status: false } });
          }
        },
      );
    } else {
      userNameAlert(userError, userMsg);
    }

    return userError;
  };

  //------------------------------------PASSWORD---------------------------------------

  const isPasswordPossible = () => {
    const errorMsg = i18n.__("invalidEntry");
    if (state.firstName.value.length === 0) {
      console.log("check 1");
      setState({ firstName: { ...state.firstName, status: true } });
      setInputFirstnameFocus();
    } else if (state.lastName.value.length === 0) {
      console.log("check 2");
      setState({ lastName: { ...state.lastName, status: true } });
      setInputLastnameFocus();
    } else if (state.username.value.length === 0) {
      console.log("check 3");
      setState({ username: { ...state.username, status: true } });
      setInputUsernameFocus();
    } else if (state.username.status) {
      console.log("check 5");
      setInputUsernameFocus();
    } else if (state.email.status && state.email.value.length === 0) {
      console.log("check 6");
      setInputEmailFocus();
    } else if (state.firstName.status) {
      console.log("check 7");
      setInputFirstnameFocus();
    } else if (state.lastName.status) {
      console.log("check 8");
      setInputLastnameFocus();
    } else if (
      state.phoneNumber.status &&
      state.phoneNumber.value.length === 0
    ) {
      console.log("check 8");

      setInputPhoneFocus();
    } else {
      console.log("ALL GOOD...");
      return true;
    }
    if (!alerts.check().some(alert => alert.message === errorMsg))
      alerts.error(errorMsg, {});
    // had to set to true, couldn't check firstName, email....
    return true;
  };

  const checkPasswordQuality = verifications => {
    const verifyList = verifications || passwordVerification;
    const invalidPasswordStatus = verifyList.some((v, i) => {
      return v === false;
    });
    return invalidPasswordStatus;
  };

  const checkConfirmPassword = (password, onBlur = false) => {
    console.log("Confirm ", password, state);
    const confirmStatus = state.accountPassword.value === password;
    console.log(confirmStatus, state.accountPassword, password);
    let checkResult = false;

    const errorMsg = i18n.__("invalidPassword");
    if (!confirmStatus && !onBlur) {
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      checkResult = true;
    } else if (confirmStatus) {
      setState({
        accountPassword: { ...state.accountPassword, status: false },
        passwordConfirm: { ...state.passwordConfirm, status: false },
      });
    }

    return checkResult;
  };

  const checkInputPassword = (password, updateVerification = true) => {
    //console.log(password);
    const checkResult = checkPassword(password, config.passwordLength, [
      // state.firstName.value,

      state.username.value,
      /* state.email.value, */
    ]);
    console.log("PASS CHECK ", checkResult);
    setPasswordVerification(checkResult);
    return checkResult;
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

  //--------------------------INVITE CODE--------------------------

  const checkInput = code => {
    const checkResult = onlyDigitChars(code);
    //console.log(checkResult);
    let validCode = true;
    if (!checkResult) {
      setInputError({ status: true, msg: i18n.__("codeDigitsError") });
      //alerts.error(i18n.__("codeDigitsError"), {});
      const errorMsg = i18n.__("codeDigitsError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      validCode = false;
    }
    if (code.length > 1 && code.length !== 6) {
      setInputError({ status: true, msg: i18n.__("codeLengthError") });
      //alerts.error(i18n.__("codeLengthError"), {});
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
      {step === 4 && <Login />}
      {step === 0 && (
        <Box mt={120}>
          <ProgressContainer
            title={i18n.__("resetPasswordTitle")}
            pr={19}
            minHeight={406}
            progress={stepProgress}
          >
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
                  error={state.username.status}
                  ref={inputUsername}
                  defaultValue={state.username.value}
                  onKeyDown={e => {
                    if (e.key === "Enter" && e.target.value.length > 4) {
                      checkUsername(e.target.value, true);
                    }
                  }}
                  tabIndex="2"
                />
              </IconField>
            </Box>
            <Flex mt={28} justifyContent={"center"}>
              <Text textAlign={"center"} fontSize={10}>
                {i18n.__("forgotUsername2")}
              </Text>
              <Button variation={"link"} size="xs" paddingLeft={5}>
                {i18n.__("sendAgainLinkText")}
              </Button>
            </Flex>
            <Box mt={45} mb={30} display={"inline-flex"}>
              <Flex>
                <Button
                  className="BackButton"
                  variation={"outline"}
                  onClick={() => {
                    setStep(4);
                  }}
                >
                  {i18n.__("Back")}
                </Button>
              </Flex>
              <Flex ml={99}>
                <Button
                  disabled={
                    usernameError.status ||
                    loginFields.username.length < config.usernameLength
                  }
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  {i18n.__("nextButton")}
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
            <Box mt={70}>
              <Text fontSize={16} textAlign={"center"}>
                {i18n.__("sentCodeText")}
              </Text>
            </Box>
            <Flex mt={66} justifyContent={"center"}>
              <Text textAlign={"center"} fontSize={10}>
                {i18n.__("codeMissing2")}
              </Text>
              <Button variation="link" size="xs" paddingLeft={5}>
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
          </ProgressContainer>
        </Box>
      )}
      {step === 2 && (
        <Box mt={40}>
          <ProgressContainer
            title={i18n.__("resetPasswordTitle")}
            progress={50}
            pr={19}
            minHeight={580}
            progress={stepProgress}
          >
            <Box mt={20}>
              <Text fontSize={16} textAlign={"center"}>
                {i18n.__("resetPasswordText2")}
              </Text>
            </Box>
            <Box mt={52}>
              <IconField>
                <IconField.LeftIcon
                  iconify={bxUser}
                  color={"componentPrimary"}
                  size={"17"}
                />
                <IconField.InputField
                  // autoFocus={true}
                  placeholder={i18n.__("usernamePlaceholder")}
                  id={"username"}
                  name={"username"}
                  value={loginFields.username}
                  readOnly
                />
              </IconField>
            </Box>
            <Box mt={28}>
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
                  // errorMsg={inputError.msg}
                  // error={inputError.status}
                  ref={inputCode}
                />
              </IconField>
            </Box>
            <Box mt={28}>
              <PasswordField
                placeholder={i18n.__("newPassword")}
                onFocus={e => {
                  const passwordCheckStatus = isPasswordPossible();
                  if (!passwordCheckStatus) {
                    e.preventDefault();
                    e.stopPropagation();
                  } else if (
                    !state.accountPassword.valid ||
                    state.accountPassword.value.length === 0
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
                defaultValue={state.accountPassword.value}
                error={state.accountPassword.status}
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
                  if (state.accountPassword.value.length === 0) {
                    setInputPasswordFocus();
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                id={"passwordConfirm"}
                name={"passwordConfirm"}
                defaultValue={state.passwordConfirm.value}
                onChange={handleChange}
                error={
                  state.accountPassword.status || state.passwordConfirm.status
                }
                onBlur={e => {
                  if (
                    e.target.value.length === state.accountPassword.value.length
                  ) {
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
            <Box mt={37} display="flex" justifyContent="center">
              <Button
                disabled={
                  inputError.status ||
                  passwordError.status ||
                  usernameError.status ||
                  loginFields.confirmationCode.length !== 6 ||
                  loginFields.username.length < config.usernameLength ||
                  loginFields.password.length < config.passwordLength
                }
                onClick={() => {
                  setStep(3);
                }}
              >
                {i18n.__("doneButton")}
              </Button>
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
          </ProgressContainer>
        </Box>
      )}
    </React.Fragment>
  );
};

export default ForgotPassword;
