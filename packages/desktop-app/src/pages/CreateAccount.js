import React, { useState, useReducer, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Box,
  Flex,
  Text,
  useTheme,
  Divider,
} from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";

import bxUser from "@iconify/icons-bx/bx-user";
import bxEnvelope from "@iconify/icons-bx/bx-envelope";
import ProgressContainer from "../components/ProgressContainer";
import PasswordField from "../components/PasswordField";
import PhoneNumberField from "../components/PhoneNumberField";

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import config from "../config";

import {
  checkUsernameQuery,
  getCountryCodeQuery,
  checkCognitoAttributeQuery,
  i18n,
  useFocus,
  useAppContext,
  AccountContext,
  checkPassword,
  validEmail,
  validUsername,
  isValidNumber,
  countryList,
  lowerCaseChars,
  addRegionCode,
  SimpleProgress,
} from "@prifina-apps/utils";

import { API, Auth } from "aws-amplify";

import { v4 as uuidv4 } from "uuid";

import TermsOfUse from "./TermsOfUse";

import EmailVerification from "./EmailVerification";
import PhoneVerification from "./PhoneVerification";
import { useToast } from "@blend-ui/toast";

import useFlags from "../hooks/UseFlags";

import PropTypes from "prop-types";

import styled from "styled-components";

i18n.init();

const continents = {
  XX: { name: "", order: 0 }, //popular...
  AF: { name: "Africa", order: 5 },
  AN: { name: "Antarctica", order: 7 },
  AS: { name: "Asia", order: 3 },
  EU: { name: "Europe", order: 2 },
  NA: { name: "North America", order: 1 },
  OC: { name: "Oceania", order: 6 },
  SA: { name: "South America", order: 4 },
  ZZ: { name: "", order: 8 }, //unknowns...
};
const popularList = ["US", "GB", "FI"];

const StyledSimpleProgress = styled(SimpleProgress)`
  .tracker li {
    background: #eaebeb;
    border-radius: 20px;
    border: 0;
    padding: 2px;
  }

  .tracker li.is-active {
    background: #1fb2a6;
  }

  .tracker li.is-ready {
    background: #0d776e;
    height: 1px;
  }
`;

const CreateAccount = props => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const alerts = useToast();

  const { AUTHConfig } = useAppContext();

  const APIConfig = {
    aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
    aws_appsync_region: config.main_region,
    aws_appsync_authenticationType:
      config.appSync.aws_appsync_authenticationType,
  };

  API.configure(APIConfig);
  Auth.configure(AUTHConfig);

  const uuid = uuidv4();

  const searchKeys = new URLSearchParams(search);

  const appDebug =
    process.env.REACT_APP_DEBUG === "true" &&
    searchKeys.get("debug") === "true";
  //history.location.search === "?debug=true";
  console.log("APP DEBUG ", appDebug);

  const { colors } = useTheme();
  const { cList, nList } = countryList(continents, popularList);
  const { icons, isLoading } = useFlags(nList);
  const [flags, setFlags] = useState(false);

  const selectOptions = useRef([]);

  const initUser = {
    username: uuid,
    given_name: "",
    client: AUTHConfig.userPoolWebClientId,
    email: "",
    phone_number: "",
  };
  const [currentUser, setCurrentUser] = useState(initUser);

  const [registerStep, setRegisterStep] = useState(0);

  const [passwordVerification, setPasswordVerification] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      email: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      phoneNumber: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
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
      passwordConfirm: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      regionCode: "000",
      termsAccepted: false,
      emailVerified: "",
      phoneVerified: "",
    },
  );

  const [inputSelect, setSelectFocus] = useFocus();
  const [inputUsername, setInputUsernameFocus] = useFocus();
  const [inputEmail, setInputEmailFocus] = useFocus();
  const [inputPhone, setInputPhoneFocus] = useFocus();
  const [inputPassword, setInputPasswordFocus] = useFocus();
  const [inputFirstname, setInputFirstnameFocus] = useFocus();
  const [inputLastname, setInputLastnameFocus] = useFocus();

  const [addPopper, setAddPopper] = useState(false);
  const onPopper = (e, status) => {
    console.log("POPPER");
    e.preventDefault();
    setAddPopper(status);
  };

  const checkPhoneAttr = (region, phone, phoneOpts = {}) => {
    console.log("CHECK PHONE APP-DEBUG ", appDebug);
    if (appDebug) {
      return Promise.resolve({});
    } else {
      let phoneNumber = addRegionCode(region, phone);
      if (phoneOpts.hasOwnProperty("region")) {
        phoneNumber = phoneOpts.region + phoneOpts.phoneNumber;
      }
      return checkCognitoAttributeQuery(
        API,
        "phone_number",
        phoneNumber,
        config.cognito.USER_POOL_ID,
      );
    }
  };
  const phoneAlert = (errorMsg, phoneState, phoneOpts = {}) => {
    if (
      !phoneState &&
      !alerts.check().some(alert => alert.message === errorMsg)
    )
      alerts.error(errorMsg, {});
    if (phoneOpts.hasOwnProperty("region")) {
      console.log("CHANGE NUMBER ", phoneOpts);
      setState({
        phoneNumber: {
          ...state.phoneNumber,
          status: !phoneState,
          value: phoneOpts.phoneNumber,
          msg: errorMsg,
        },
        regionCode: phoneOpts.region,
      });
    } else {
      setState({
        phoneNumber: {
          ...state.phoneNumber,
          status: !phoneState,
          msg: errorMsg,
        },
      });
    }
  };

  const checkPhone = (region, phone, check = false, changeNumber = true) => {
    console.log(phone, region);

    const errorMsg = i18n.__("invalidPhoneNumber");

    if (lowerCaseChars(phone.toLowerCase())) {
      phoneAlert(errorMsg, false);
      return false;
    }
    let checkResult = {};
    if (phone.startsWith("+")) {
      checkResult = isValidNumber(phone);
    } else {
      checkResult = isValidNumber(region + phone);
    }
    let phoneState = Object.keys(checkResult).length > 0;
    console.log("PHONE ", checkResult);
    let phoneOpts = {};
    if (phone.startsWith("+") && changeNumber && phoneState) {
      phoneOpts = {
        region: "+" + checkResult.regionCode,
        phoneNumber: checkResult.nationalNumber,
      };
      inputPhone.current.value = checkResult.nationalNumber;
      inputSelect.current.value = checkResult.regionCode;
    }

    if (phoneState && check) {
      checkPhoneAttr(region, phone, phoneOpts).then(res => {
        if (typeof res.data !== "undefined" && res.data.checkCognitoAttribute) {
          phoneAlert(errorMsg, false, phoneOpts);
        } else {
          if (phoneOpts.hasOwnProperty("region")) {
            console.log("CHANGE NUMBER2 ", phoneOpts);

            setState({
              phoneNumber: {
                ...state.phoneNumber,
                status: !phoneState,
                value: phoneOpts.phoneNumber,
              },
              regionCode: phoneOpts.region,
            });
          } else {
            setState({ phoneNumber: { ...state.phoneNumber, status: false } });
          }
        }
      });
    } else {
      phoneAlert(errorMsg, phoneState, phoneOpts);
    }

    const returnState = check ? !phoneState : phoneState;
    console.log("PHONE CHECK STATE ", check, phoneState, "===>", returnState);
    return returnState;
  };

  const checkEmailAttr = email => {
    return checkCognitoAttributeQuery(
      API,
      "email",
      email,
      config.cognito.USER_POOL_ID,
    );
  };

  const emailAlert = (errorMsg, emailState) => {
    if (
      !emailState &&
      !alerts.check().some(alert => alert.message === errorMsg)
    )
      alerts.error(errorMsg, {});

    setState({ email: { ...state.email, status: !emailState, msg: errorMsg } });
  };

  const checkEmail = (email, check = false) => {
    let emailState = validEmail(email);
    console.log("EMAIL ", emailState);

    const errorMsg = i18n.__("invalidEmail");

    if (emailState && check) {
      console.log("CHECKING EMAIL");
      checkEmailAttr(email).then(res => {
        console.log("EMAIL ATTR CHECK ", res);
        if (typeof res.data !== "undefined" && res.data.checkCognitoAttribute) {
          emailAlert(errorMsg, false);
        } else {
          setState({ email: { ...state.email, status: false } });
        }
      });
    } else {
      emailAlert(errorMsg, emailState);
    }

    return check ? emailState : !emailState;
  };

  const userNameAlert = (userError, userMsg) => {
    if (userError && !alerts.check().some(alert => alert.message === userMsg))
      alerts.error("Form has errors", {});

    setState({
      username: { ...state.username, status: userError, msg: userMsg },
    });
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

    // check if email

    // const checkResult = checkEmail(username);

    // if (!checkResult) {
    //   userNameAlert(true, "Cant be email");
    // }

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
      console.log("check username alert", userNameAlert(userError, userMsg));
    }

    return userError;
  };

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
    return false;
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
        passwordConfirm: {
          ...state.passwordConfirm,
          status: false,
          // msg: errorMsg,
        },
      });
    }

    return checkResult;
  };
  const checkInputPassword = (password, updateVerification = true) => {
    const checkResult = checkPassword(password, config.passwordLength, [
      state.firstName.value,
      state.lastName.value,
      state.username.value,
    ]);
    console.log("PASS CHECK ", checkResult);
    setPasswordVerification(checkResult);
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

  useEffect(() => {
    if (!icons && isLoading) selectOptions.current = [];
    if (!icons && !isLoading) selectOptions.current = [];
    if (isLoading && icons) {
      let items = [];
      cList.forEach(item => {
        const l = Object.keys(item)[0];
        if (item[l].length > 0) {
          if (l !== "XX") {
            items.push({
              key: "XX",
              value: "XX",
              regionCode: "000",
              component: (
                <React.Fragment>
                  <Text mt={18}>{continents[l].name}</Text>
                  <Divider mb={10} />
                </React.Fragment>
              ),
            });
          }
          item[l].forEach(cc => {
            const flag = icons[cc.regionCode] || null;
            items.push({
              key: "+" + cc.countryCode,
              value: cc.regionName,
              regionCode: cc.regionCode,
              searchValue: cc.regionName + " +" + cc.countryCode,
              component: (
                <React.Fragment>
                  <Flex mb={6} alignContent={"center"}>
                    {flag}
                    <Text
                      ml={flag === null ? 22 : 6}
                      as="span"
                      fontSize={"xs"}
                      lineHeight={"16px"}
                    >
                      {cc.regionName}
                    </Text>
                    <Text
                      as="span"
                      color={colors.textMuted}
                      fontSize={"xs"}
                      pl={4}
                      lineHeight={"16px"}
                    >
                      +{cc.countryCode}
                    </Text>
                  </Flex>
                </React.Fragment>
              ),
            });
          });
        }
      });
      console.log(items);
      selectOptions.current = items;

      setFlags(true);
    }
  }, [isLoading, icons]);

  useEffect(() => {
    async function onLoad() {
      try {
        if (flags) {
          const userCountry = await getCountryCodeQuery(API);
          console.log("COUNTRY ", userCountry.data.getCountryCode);
          if (userCountry.data) {
            const cIndex = selectOptions.current.findIndex(
              c => c.regionCode === userCountry.data.getCountryCode,
            );
            if (cIndex > -1) {
              setState({ regionCode: selectOptions.current[cIndex].key });
            }
          }
        }
      } catch (e) {
        console.log("ERR ", e);
      }
    }
    onLoad();
  }, [flags]);

  const handleChange = event => {
    console.log(event.target.id, document.activeElement.id);
    if (event.target) {
      console.log(
        "HANDLE CHANGE ",
        event.target.id,
        event.target.value,
        document.activeElement.id,
        document.activeElement.value,
      );
      if (
        event.target.id === "phoneNumber" &&
        (document.activeElement.id === "accountPassword" ||
          document.activeElement.id === "passwordConfirm")
      ) {
      } else {
        let id = event.target.id;

        // autofill messes up the onChange event logic...
        let fld = undefined;
        if (id !== "regionCode") {
          fld = Object.assign({}, state[id]);
          fld.value = event.target.value;
          fld.valid = false;
        } else {
          fld = event.target.value;
        }

        if (["firstName", "lastName"].indexOf(id) > -1) {
          fld.status = event.target.value.length === 0;
        }

        console.log("CHANGE ID ", id, fld);
        setState({
          [id]: fld,
        });
      }
    }
  };
  const loginLink = e => {
    //history.replace("/login");
    navigate("/login", { replace: true });
    e.preventDefault();
  };

  //create acc 0                  -0
  // terms 1                      -1
  //new page phome amd email 5    -2
  //phone 2                       -3
  ///email ver 3                  -4

  const nextStepAction = step => {
    console.log("ACTION STEP ", step);

    console.log("CURRENT USER ", currentUser);
    let _currentUser = Object.assign({}, state);
    console.log("CURRENT USER UPDATED", _currentUser);

    if (step === 5) {
      _currentUser.phoneVerified = currentUser.phone_number;
      _currentUser.emailVerified = currentUser.email;
      _currentUser.termsAccepted = true;
      _currentUser.uuid = currentUser.username;
      _currentUser.client = currentUser.client;
      props.finalStep(_currentUser);
    } else if (step === 2) {
      setState({ termsAccepted: true });
      setRegisterStep(step);
    } else if (step === 3) {
      setState({ emailVerified: currentUser.email });
      setRegisterStep(step);
    } else if (step === 4) {
      setState({ phoneVerified: currentUser.phone_number });
      setRegisterStep(step);
    } else if (step === 0) {
      // terms declined...

      // alerts.info(i18n.__("acceptTerms"), {});

      setRegisterStep(step);
    }
  };

  const nextButtonClick3 = e => {
    let valuesChecked = true;
    let emailChecked = false;
    let phoneChecked = false;
    let usernameChecked = false;

    if (!isPasswordPossible()) {
      console.log("CONTROL 1");
      valuesChecked = false;
    } else if (checkConfirmPassword(state.passwordConfirm.value, false)) {
      console.log("CONTROL 2");

      valuesChecked = false;
    } else {
      console.log("PASSWORD CHECKS ");
      const passwordCheckResult = checkInputPassword(
        state.accountPassword.value,
        false,
      );
      const passwordError = checkPasswordQuality(passwordCheckResult);
      if (passwordError) {
        valuesChecked = false;
        const errorMsg = i18n.__("passwordQuality");
        if (!alerts.check().some(alert => alert.message === errorMsg))
          alerts.error(errorMsg, {});
      }
    }

    if (valuesChecked) {
      if (!checkUsername(state.username.value, false)) {
        usernameChecked = true;
      } else {
        console.log("CONTROL 3");

        valuesChecked = false;
      }

      if (!checkEmail(state.email.value, false)) {
        emailChecked = true;
      } else {
        console.log("CONTROL 4");

        valuesChecked = false;
      }

      const checkingPhone = checkPhone(
        state.regionCode,
        state.phoneNumber.value,
        false,
        false,
      );

      if (checkingPhone) {
        phoneChecked = true;
      } else {
        console.log("CONTROL 5");

        valuesChecked = false;
      }
    }

    let promises = [];
    promises[0] = Promise.resolve(valuesChecked);

    if (usernameChecked) {
      promises.push(
        checkUsernameQuery(
          API,
          state.username.value,
          config.cognito.USER_POOL_ID,
        ),
      );
    } else {
      promises.push(Promise.resolve({}));
    }

    if (emailChecked) {
      promises.push(checkEmailAttr(state.email.value));
    } else {
      promises.push(Promise.resolve({}));
    }
    if (phoneChecked) {
      promises.push(checkPhoneAttr(state.regionCode, state.phoneNumber.value));
    } else {
      promises.push(Promise.resolve({}));
    }
    return promises;
  };

  const nextButtonClick = e => {
    let valuesChecked = true;

    let usernameChecked = false;

    if (!isPasswordPossible()) {
      console.log("CONTROL 1");
      valuesChecked = false;
    } else if (checkConfirmPassword(state.passwordConfirm.value, false)) {
      console.log("CONTROL 2");

      valuesChecked = false;
    } else {
      console.log("PASSWORD CHECKS ");
      const passwordCheckResult = checkInputPassword(
        state.accountPassword.value,
        false,
      );
      const passwordError = checkPasswordQuality(passwordCheckResult);
      if (passwordError) {
        valuesChecked = false;
        const errorMsg = i18n.__("passwordQuality");
        if (!alerts.check().some(alert => alert.message === errorMsg))
          alerts.error(errorMsg, {});
      }
    }

    if (valuesChecked) {
      if (!checkUsername(state.username.value, false)) {
        usernameChecked = true;
      } else {
        console.log("CONTROL 3");

        valuesChecked = false;
      }
    }

    let promises = [];
    promises[0] = Promise.resolve(valuesChecked);

    if (usernameChecked) {
      promises.push(
        checkUsernameQuery(
          API,
          state.username.value,
          config.cognito.USER_POOL_ID,
        ),
      );
    } else {
      promises.push(Promise.resolve({}));
    }

    return promises;
  };

  const nextButtonClick2 = e => {
    let valuesChecked = true;

    let emailChecked = false;
    let phoneChecked = false;

    if (valuesChecked) {
      if (!checkEmail(state.email.value, false)) {
        emailChecked = true;
      } else {
        console.log("CONTROL 4");

        valuesChecked = false;
      }

      const checkingPhone = checkPhone(
        state.regionCode,
        state.phoneNumber.value,
        false,
        false,
      );

      if (checkingPhone) {
        phoneChecked = true;
      } else {
        console.log("CONTROL 5");

        valuesChecked = false;
      }
    }

    let promises = [];
    promises[0] = Promise.resolve(valuesChecked);

    if (emailChecked) {
      promises.push(checkEmailAttr(state.email.value));
    } else {
      promises.push(Promise.resolve({}));
    }
    if (phoneChecked) {
      promises.push(checkPhoneAttr(state.regionCode, state.phoneNumber.value));
    } else {
      promises.push(Promise.resolve({}));
    }
    return promises;
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

  const subtitles = [
    "1. Account information",
    "2. Prifina terms of use",
    "3. Set up two-factor authentication",
    "4. Verify your phone number",
    "5. Verify your email address",
  ];

  console.log("state", state);

  const accountContext = { nextStepAction, currentUser, state };
  console.log("PHONE STATE ", state.phoneNumber);
  return (
    <AccountContext.Provider value={accountContext}>
      <Text mb={16} textStyle="h3">
        Create your account
      </Text>
      <StyledSimpleProgress
        variation="tracker"
        steps={5}
        active={registerStep}
        w="62px"
      />
      <Box mt={38}>
        <Text fontWeight="600" fontSize="lgx">
          {subtitles[registerStep]}
        </Text>
      </Box>

      {registerStep === 3 && (
        <Box mt={80}>
          <PhoneVerification invalidLink={config.invalidVerificationLink} />
        </Box>
      )}
      {registerStep === 4 && (
        <Box mt={80}>
          <EmailVerification invalidLink={config.invalidVerificationLink} />
        </Box>
      )}
      {registerStep === 1 && <TermsOfUse />}

      {registerStep === 0 && (
        <>
          <Box mt={40} display="inline-flex">
            <Box width="169px">
              <Text fontWeight="600" fontSize="sm">
                Fist name
              </Text>
              <Box>
                <Input
                  autoFocus={true}
                  // placeholder={i18n.__("firstNamePlaceholder")}
                  placeholder="Arlene"
                  id={"firstName"}
                  name={"firstName"}
                  onChange={handleChange}
                  ref={inputFirstname}
                  error={state.firstName.status}
                  defaultValue={state.firstName.value}
                  tabIndex="0"
                  // errorMsg={
                  //   state.firstName.value !== "" ? "" : "Enter a first name"
                  // }
                />
              </Box>
            </Box>
            <Box ml={16} width="169px">
              <Text fontWeight="600" fontSize="sm">
                Last name
              </Text>

              <Box>
                <Input
                  // placeholder={i18n.__("lastNamePlaceholder")}
                  placeholder="McCoy"
                  id={"lastName"}
                  name={"lastName"}
                  onChange={handleChange}
                  ref={inputLastname}
                  error={state.lastName.status}
                  defaultValue={state.lastName.value}
                  tabIndex="1"
                  // errorMsg={
                  //   state.lastName.value !== "" ? "" : "Enter a last name"
                  // }
                />
              </Box>
            </Box>
          </Box>
          <Box mt={28}>
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
                placeholder={i18n.__("usernamePlaceholder")}
                id={"username"}
                name={"username"}
                onChange={handleChange}
                onBlur={e => checkUsername(e.target.value)}
                error={state.username.status}
                ref={inputUsername}
                defaultValue={state.username.value}
                onKeyDown={e => {
                  if (e.key === "Enter" && e.target.value.length > 4) {
                    checkUsername(e.target.value, true);
                  }
                }}
                tabIndex="2"
                promptMsg={
                  state.username.msg === ""
                    ? "Can not be email address. Minimum length 6 characters."
                    : ""
                }
                errorMsg={state.username.msg !== "" ? state.username.msg : ""}
              />
            </IconField>
          </Box>

          <Box mt={28}>
            <Text fontWeight="600" fontSize="sm">
              Password
            </Text>
            <PasswordField
              placeholder={i18n.__("passwordPlaceholder")}
              onFocus={e => {
                const passwordCheckStatus = isPasswordPossible();
                if (!passwordCheckStatus) {
                  e.preventDefault();
                  e.stopPropagation();
                } else if (
                  !state.accountPassword.valid ||
                  state.accountPassword.value.length === 0
                ) {
                  console.log("OPEN POPUP ");
                  setAddPopper(true);
                }
              }}
              addPopper={addPopper}
              verifications={passwordVerification}
              id={"accountPassword"}
              name={"accountPassword"}
              onChange={e => {
                handleChange(e);
                /* check password popup */
                checkInputPassword(e.target.value);
                if (
                  state.phoneNumber.value !==
                  document.getElementById("phoneNumber").value
                ) {
                  // autofill changes phone number even the state value is correct....
                  document.getElementById("phoneNumber").value =
                    state.phoneNumber.value;
                }
              }}
              ref={inputPassword}
              defaultValue={state.accountPassword.value}
              error={state.accountPassword.status}
              onBlur={e => {
                if (e.target.value.length > 0) {
                  if (passwordCheck(e.target.value)) {
                    setAddPopper(false);
                  } else {
                    console.log("PREVENT BLUR:....");
                    setInputPasswordFocus();
                    e.preventDefault();
                  }
                } else {
                  setAddPopper(false);
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && e.target.value.length > 4) {
                  console.log("CHECKING PASSWORD ", e.target.value);
                  const checkStatus = passwordCheck(e.target.value);
                  console.log("CHECK STATUS ", checkStatus);
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
            <Text fontWeight="600" fontSize="sm">
              Confirm password
            </Text>
            <PasswordField
              placeholder={i18n.__("confirmPlaceholder")}
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

          <Box mt={66} textAlign={"center"}>
            <Button
              width="100%"
              id="nextButton"
              onClick={e => {
                Promise.all(nextButtonClick()).then(res => {
                  console.log("PROMISE ", res);
                  let checkResult = true;

                  if (
                    typeof res[1].data !== "undefined" &&
                    res[1].data.checkCognitoAttribute
                  ) {
                    userNameAlert(true, i18n.__("usernameExists"));
                    checkResult = false;
                  } else {
                    setState({
                      username: { ...state.username, status: false },
                    });
                  }

                  // next check failed, possible password condition reason...
                  if (checkResult && !res[0]) {
                    checkResult = false;
                  }

                  if (checkResult) {
                    let _currentUser = Object.assign({}, currentUser);
                    _currentUser.given_name = state.firstName.value;

                    console.log("NEXT CURRENT USER ", _currentUser);

                    setCurrentUser(_currentUser);

                    if (!state.termsAccepted) {
                      setRegisterStep(1);
                    } else {
                      setRegisterStep(2);
                    }
                  }
                });
              }}
            >
              {i18n.__("nextButton")}
            </Button>
            <Box mt={10}>
              <Box display={"inline-flex"}>
                <Flex alignItems={"center"}>
                  <Text textStyle={"caption2"} mr={5}>
                    {i18n.__("existingAccount")}
                  </Text>
                  <Button
                    className="loginLinkButton"
                    id="loginLinkButton"
                    variation={"link"}
                    fontSize={"10px"}
                    lineHeight={"normal"}
                    onClick={loginLink}
                  >
                    {i18n.__("loginLink")}
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {registerStep === 2 && (
        <>
          <Box mt={117}>
            <Text fontWeight="600" fontSize="sm">
              Phone Number
            </Text>
            <PhoneNumberField>
              <PhoneNumberField.RegionField
                key={state.regionCode}
                defaultValue={state.regionCode}
                options={flags ? selectOptions.current : []}
                searchLength={2}
                showList={true}
                maxHeight={"200px"}
                ref={inputSelect}
                /* id="select-search" */
                onChange={(e, code) => {
                  console.log("REGION SELECT ", e, code);
                  handleChange({
                    target: {
                      id: "regionCode",
                      value: code,
                    },
                  });
                }}
              />
              <PhoneNumberField.InputField
                placeholder={i18n.__("phoneNumberPlaceholder2")}
                id={"phoneNumber"}
                name={"phoneNumber"}
                onChange={e => {
                  handleChange(e);
                }}
                promptMsg={
                  !state.phoneNumber.valid ? i18n.__("phonePrompt") : ""
                }
                errorMsg={
                  state.phoneNumber.msg !== "" ? state.phoneNumber.msg : ""
                }
                error={state.phoneNumber.status}
                ref={inputPhone}
                defaultValue={state.phoneNumber.value}
                onBlur={e => {
                  // weird problem... password autofill changes phonenumber...
                  if (
                    !(
                      e.target.id === "phoneNumber" &&
                      (document.activeElement.id === "accountPassword" ||
                        document.activeElement.id === "passwordConfirm")
                    )
                  ) {
                    if (e.target.value.length > 4) {
                      checkPhone(state.regionCode, e.target.value);
                    }
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && e.target.value.length > 4) {
                  }
                }}
                tabIndex="6"
              />
            </PhoneNumberField>
          </Box>
          <Box mt={28}>
            <Text fontWeight="600" fontSize="sm">
              Email
            </Text>
            <IconField>
              <IconField.LeftIcon
                iconify={bxEnvelope}
                color={"componentPrimary"}
                size={"17"}
              />
              <IconField.InputField
                // placeholder={i18n.__("emailPlaceholder")}
                placeholder="arlene.M@example.com"
                id={"email"}
                name={"email"}
                // onChange={handleChange}
                onChange={e => {
                  handleChange(e);
                }}
                promptMsg={!state.email.valid ? i18n.__("emailPrompt") : ""}
                errorMsg={state.email.msg !== "" ? state.email.msg : ""}
                error={state.email.status}
                ref={inputEmail}
                onBlur={e => checkEmail(e.target.value)}
                defaultValue={state.email.value}
                tabIndex="5"
              />
            </IconField>
          </Box>

          <Box mt={141} textAlign={"center"}>
            <Button
              width="100%"
              id="nextButton"
              onClick={e => {
                Promise.all(nextButtonClick2()).then(res => {
                  console.log("PROMISE ", res);
                  let checkResult = true;

                  console.log("RES", res);
                  //email
                  if (
                    typeof res[0].data !== "undefined" &&
                    res[0].data.checkCognitoAttribute
                  ) {
                    emailAlert(i18n.__("invalidEmail"), false);
                    checkResult = false;
                  } else {
                    setState({ email: { ...state.email, status: false } });
                  }

                  //phonenumber

                  if (
                    typeof res[1].data !== "undefined" &&
                    res[1].data.checkCognitoAttribute
                  ) {
                    phoneAlert(i18n.__("invalidPhoneNumber"), false);
                    checkResult = false;
                  } else {
                    setState({
                      phoneNumber: { ...state.phoneNumber, status: false },
                    });
                  }

                  if (checkResult) {
                    console.log("NEXT....", currentUser);
                    let phoneNumber = addRegionCode(
                      state.regionCode,
                      state.phoneNumber.value,
                    );

                    let _currentUser = Object.assign({}, currentUser);

                    let emailVerified = state.emailVerified !== "";
                    let phoneVerified = state.phoneVerified !== "";

                    if (_currentUser.email !== state.email.value) {
                      _currentUser.email = state.email.value;
                      emailVerified = false;
                    }

                    if (_currentUser.phone_number !== phoneNumber) {
                      _currentUser.phone_number = phoneNumber;
                      phoneVerified = false;
                    }

                    console.log("NEXT CURRENT USER ", _currentUser);

                    setCurrentUser(_currentUser);

                    if (
                      state.emailVerified !== _currentUser.email ||
                      !emailVerified
                    ) {
                      setRegisterStep(4);
                    }
                    if (
                      state.phoneVerified !== _currentUser.phone_number ||
                      !phoneVerified
                    ) {
                      setRegisterStep(3);
                    }
                    if (
                      state.emailVerified !== "" &&
                      state.phoneVerified !== ""
                    ) {
                      setRegisterStep(5);
                    }
                  }
                });
              }}
            >
              {i18n.__("nextButton")}
            </Button>
          </Box>
        </>
      )}
    </AccountContext.Provider>
  );
};

CreateAccount.propTypes = {
  finalStep: PropTypes.func.isRequired,
};

export default CreateAccount;
