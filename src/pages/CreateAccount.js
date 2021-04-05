import React, { useState, useReducer, useEffect } from "react";
import {
  IconField,
  Button,
  Input,
  Box,
  Flex,
  Text,
  useTheme,
} from "@blend-ui/core";

import { useAppContext } from "../lib/contextLib";
import bxUser from "@iconify/icons-bx/bx-user";
import bxEnvelope from "@iconify/icons-bx/bx-envelope";
import ProgressContainer from "../components/ProgressContainer";
import PasswordField from "../components/PasswordField";
import PhoneNumberField from "../components/PhoneNumberField";
import { useHistory } from "react-router-dom";

//import { useFormFields } from "../lib/formFields";
import {
  checkPassword,
  validEmail,
  validUsername,
  isValidNumber,
  countryList,
  lowerCaseChars,
  addRegionCode,
} from "../lib/utils";

import { useFocus } from "../lib/componentUtils";
import config from "../config";
import {
  checkUsernameQuery,
  getCountryCodeQuery,
  checkCognitoAttributeQuery,
} from "../graphql/api";
import Amplify, { API, Auth } from "aws-amplify";

import { v4 as uuidv4 } from "uuid";

//import strings from "../lib/locales/en";

//const { i18n } = require("../lib/i18n");
import i18n from "../lib/i18n";
import TermsOfUse from "./TermsOfUse";

import EmailVerification from "./EmailVerification";
import PhoneVerification from "./PhoneVerification";
import { useToast } from "@blend-ui/toast";

import { AccountContext } from "../lib/contextLib";

import PropTypes from "prop-types";
i18n.init();

const CreateAccount = props => {
  const history = useHistory();
  const alerts = useToast();
  const { APIConfig, AUTHConfig } = useAppContext();
  Amplify.configure(APIConfig);
  Auth.configure(AUTHConfig);

  const uuid = uuidv4();

  //console.log("ENV ", process.env);
  //console.log("HISTORY ", history.location.search);
  //REACT_APP_DEBUG: "true"
  const appDebug =
    process.env.REACT_APP_DEBUG === "true" &&
    history.location.search === "?debug=true";
  console.log("APP DEBUG ", appDebug);

  //console.log(i18n.__("Testing"));

  //console.log(i18n.__("testMessage"));
  const { colors } = useTheme();
  const selectOptions = countryList().map(cc => {
    return {
      key: "+" + cc.countryCode,
      value: cc.regionName,
      regionCode: cc.regionCode,
      searchValue: cc.regionName + " +" + cc.countryCode,
      component: (
        <React.Fragment>
          <Text as="span">{cc.regionName}</Text>
          <Text as="span" color={colors.textMuted} fontSize={"xs"} pl={4}>
            (+{cc.countryCode})
          </Text>
        </React.Fragment>
      ),
    };
  });
  //console.log(selectOptions);

  const initUser = {
    username: uuid,
    given_name: "",
    client: AUTHConfig.userPoolWebClientId,
    email: "",
    phone_number: "",
  };
  const [currentUser, setCurrentUser] = useState(initUser);
  const [seconds, setSeconds] = useState(0);
  const [registerStep, setRegisterStep] = useState(0);

  const [nextDisabled, setNextDisabled] = useState(true);
  //const [passwordConfirmEntered, setPasswordConfirmEntered] = useState(false);

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

  const checkPhoneAttr = (region, phone) => {
    //console.log("DEBUG ", appDebug);
    if (appDebug) {
      return Promise.resolve({});
    } else {
      let phoneNumber = addRegionCode(region, phone);
      return checkCognitoAttributeQuery(
        API,
        "phone_number",
        phoneNumber,
        config.cognito.USER_POOL_ID,
      );
    }
  };
  const phoneAlert = (errorMsg, phoneState) => {
    if (
      !phoneState &&
      !alerts.check().some(alert => alert.message === errorMsg)
    )
      alerts.error(errorMsg, {});

    setState({ phoneNumber: { ...state.phoneNumber, status: !phoneState } });
  };

  const checkPhone = async (region, phone, onBlur = false) => {
    //console.log("FIELDS ", fields);
    console.log(phone, region);
    const errorMsg = i18n.__("invalidPhoneNumber");

    if (lowerCaseChars(phone.toLowerCase())) {
      phoneAlert(errorMsg, false);
      return false;
    }
    const checkResult = isValidNumber(region + phone);
    let phoneState = Object.keys(checkResult).length > 0;
    console.log("PHONE ", checkResult);

    if (phoneState && onBlur) {
      console.log("CHECKING PHONE NUMBER");

      //let phoneNumber = addRegionCode(region, phone);
      checkPhoneAttr(region, phone).then(res => {
        if (typeof res.data !== "undefined" && res.data.checkCognitoAttribute) {
          phoneAlert(errorMsg, false);
        } else {
          setState({ phoneNumber: { ...state.phoneNumber, status: false } });
        }
      });
    } else {
      phoneAlert(errorMsg, phoneState);
    }

    return !phoneState;
  };
  /*
  const checkEmailAttr = async (email) => {
    let checkResult = false;
    const emailExists = await checkCognitoAttributeQuery(
      API,
      "email",
      email,
      config.cognito.USER_POOL_ID
    );
    if (
      typeof emailExists.data !== "undefined" &&
      emailExists.data.checkCognitoAttribute
    ) {
      checkResult = true;
    }
    console.log("EMAIL ATTR CHECK ", emailExists, checkResult);

    return checkResult;
  };
*/
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

    setState({ email: { ...state.email, status: !emailState } });
  };

  const checkEmail = (email, onBlur = false) => {
    //console.log("FIELDS ", fields);
    let emailState = validEmail(email);
    console.log("EMAIL ", emailState);

    const errorMsg = i18n.__("invalidEmail");

    if (emailState && onBlur) {
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

    return onBlur ? emailState : !emailState;
  };

  const userNameAlert = (userError, userMsg) => {
    if (userError && !alerts.check().some(alert => alert.message === userMsg))
      alerts.error(userMsg, {});

    setState({ username: { ...state.username, status: userError } });
  };
  const checkUsername = (username, onBlur = false) => {
    //console.log("FIELDS2 ", fields);
    //console.log(await checkUsernameQuery(API, "tero-test"));
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
    if (!userError && onBlur) {
      console.log("CHECKING USER");
      checkUsernameQuery(API, username).then(res => {
        if (typeof res.data !== "undefined" && res.data.checkUsername) {
          userNameAlert(true, i18n.__("usernameExists"));
        } else {
          setState({ username: { ...state.username, status: false } });
        }
      });
    } else {
      userNameAlert(userError, userMsg);
    }

    return userError;
  };

  const isPasswordPossible = () => {
    const errorMsg = i18n.__("invalidEntry");
    if (state.firstName.value.length === 0) {
      setState({ firstName: { ...state.firstName, status: true } });
      setInputFirstnameFocus();
    } else if (state.lastName.value.length === 0) {
      setState({ lastName: { ...state.lastName, status: true } });
      setInputLastnameFocus();
    } else if (state.username.value.length === 0) {
      setState({ username: { ...state.username, status: true } });
      setInputUsernameFocus();
    } else if (state.email.value.length === 0) {
      setState({ email: { ...state.email, status: true } });
      setInputEmailFocus();
    } else if (state.username.status) {
      setInputUsernameFocus();
    } else if (state.email.status) {
      setInputEmailFocus();
    } else if (state.firstName.status) {
      setInputFirstnameFocus();
    } else if (state.lastName.status) {
      setInputLastnameFocus();
    } else if (state.phoneNumber.status) {
      //console.log("PHONE NUM FAILED...");
      setInputPhoneFocus();
    } else {
      //console.log("ALL GOOD...");
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
    if (
      (!confirmStatus && password.length >= config.passwordLength) ||
      (!confirmStatus && !onBlur && !nextDisabled)
    ) {
      //setState({...state.password,})
      setState({
        accountPassword: { ...state.accountPassword, status: true },
        passwordConfirm: { ...state.passwordConfirm, status: true },
      });

      setNextDisabled(true);

      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      checkResult = true;
    } else if (confirmStatus) {
      setState({
        accountPassword: { ...state.accountPassword, status: false },
        passwordConfirm: { ...state.passwordConfirm, status: false },
      });

      setNextDisabled(false);
    }

    if (!confirmStatus && onBlur) {
      setInputPasswordFocus();
    }
    return checkResult;
  };
  const checkInputPassword = (password, updateVerification = true) => {
    //console.log(password);
    const checkResult = checkPassword(password, config.passwordLength, [
      state.firstName.value,
      state.lastName.value,
      state.username.value,
      state.email.value,
    ]);
    console.log("PASS CHECK ", checkResult);
    setPasswordVerification(checkResult);
    return checkResult;
  };

  const checkPasswordQuality = verifications => {
    //checkInputPassword(password);
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
    async function onLoad() {
      try {
        const userCountry = await getCountryCodeQuery(API);
        console.log("COUNTRY ", userCountry.data.getCountryCode);
        if (userCountry.data) {
          const cIndex = selectOptions.findIndex(
            c => c.regionCode === userCountry.data.getCountryCode,
          );
          console.log("INDEX ", cIndex);
          if (cIndex > -1) {
            //console.log(selectOptions[cIndex]);
            setState({ regionCode: selectOptions[cIndex].key });
          }
        }
      } catch (e) {
        console.log("ERR ", e);
      }
    }
    onLoad();
  }, []);
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
        //console.log("SPECIAL ", state.phoneNumber);
      } else {
        let id = event.target.id;
        // autofill messes up the onChange event logic...
        let fld = Object.assign({}, state[id]);
        fld.value = event.target.value;
        fld.valid = false;
        if (["firstName", "lastName"].indexOf(id) > -1) {
          fld.status = event.target.value.length === 0;
        }
        /*
        if (id === "passwordConfirm") {
          const cPassword = event.target.value;
          const confirmStatus = state.accountPassword.value === cPassword;
          if (
            (!confirmStatus && cPassword.length >= config.passwordLength) ||
            (!confirmStatus && !nextDisabled)
          ) {
            const errorMsg = i18n.__("invalidPassword");
            setNextDisabled(true);
            fld.status = true;

            if (!alerts.check().some((alert) => alert.message === errorMsg))
              alerts.error(errorMsg, {});
          } else {
            fld.status = false;
            setNextDisabled(false);
          }
        }
        */
        console.log("CHANGE ID ", id, fld);
        setState({
          [id]: fld,
        });
      }
    }
  };
  const loginLink = e => {
    history.replace("/login");
    e.preventDefault();
  };
  const nextStepAction = step => {
    console.log("ACTION STEP ", step);

    if (step === 4) {
      //await Auth.signOut();
      //history.replace("/");
      //setState({ phoneVerified: currentUser.phone_number });
      //setRegisterStep(step);
      console.log("CURRENT USER ", currentUser);
      let _currentUser = Object.assign({}, state);
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
    } else if (step === 0) {
      // terms declined...

      alerts.info(i18n.__("acceptTerms"), {});

      setRegisterStep(step);
    }
  };

  const nextButtonClick = e => {
    let valuesChecked = true;
    let emailChecked = false;
    let phoneChecked = false;
    let usernameChecked = false;

    if (!isPasswordPossible()) {
      valuesChecked = false;
    } else if (checkConfirmPassword(state.passwordConfirm.value, false)) {
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
      if (!checkUsername(state.username.value)) {
        usernameChecked = true;
      } else {
        valuesChecked = false;
      }

      if (!checkEmail(state.email.value)) {
        emailChecked = true;
      } else {
        valuesChecked = false;
      }

      if (checkPhone(state.regionCode, state.phoneNumber.value)) {
        phoneChecked = true;
      } else {
        valuesChecked = false;
      }
    }

    let promises = [];
    promises[0] = Promise.resolve(valuesChecked);

    if (usernameChecked) {
      promises.push(checkUsernameQuery(API, state.username.value));
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
    /*
    // async validations...
    if (emailChecked) {
      console.log("ASYNC EMAIL START");
      await checkEmailAttr(state.email.value);
      console.log("ASYNC EMAIL END");
    } else {
      console.log("NEXT BUTTON CLICK ", valuesChecked);
      return valuesChecked;
    }
*/
  };

  const passwordCheck = password => {
    const passwordCheckResult = checkInputPassword(password);
    const passwordError = checkPasswordQuality(passwordCheckResult);
    if (passwordError) {
      const errorMsg = i18n.__("passwordQuality");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      //e.preventDefault();
      return false;
    } else {
      //setAddPopper(false);
      return true;
    }
  };
  const accountContext = { nextStepAction, currentUser, state };
  return (
    <AccountContext.Provider value={accountContext}>
      {registerStep === 3 && (
        <Box mt={80}>
          <PhoneVerification invalidLink={config.invalidVerificationLink} />
        </Box>
      )}
      {registerStep === 2 && (
        <Box mt={80}>
          <EmailVerification invalidLink={config.invalidVerificationLink} />
        </Box>
      )}
      {registerStep === 1 && <TermsOfUse />}
      {registerStep === 0 && (
        <ProgressContainer title={i18n.__("createAccountTitle")} progress={33}>
          <Box mt={40} display="inline-flex">
            <Flex width={"168px"}>
              <Input
                autoFocus={true}
                placeholder={i18n.__("firstNamePlaceholder")}
                id={"firstName"}
                name={"firstName"}
                onChange={handleChange}
                ref={inputFirstname}
                error={state.firstName.status}
                defaultValue={state.firstName.value}
              />
            </Flex>
            <Flex ml={25} width={"168px"}>
              <Input
                placeholder={i18n.__("lastNamePlaceholder")}
                id={"lastName"}
                name={"lastName"}
                onChange={handleChange}
                ref={inputLastname}
                error={state.lastName.status}
                defaultValue={state.lastName.value}
              />
            </Flex>
          </Box>
          <Box mt={28}>
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
                onBlur={e => checkUsername(e.target.value, true)}
                error={state.username.status}
                ref={inputUsername}
                defaultValue={state.username.value}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    checkUsername(e.target.value, true);
                  }
                }}
              />
            </IconField>
          </Box>
          <Box mt={28}>
            <IconField>
              <IconField.LeftIcon
                iconify={bxEnvelope}
                color={"componentPrimary"}
                size={"17"}
              />
              <IconField.InputField
                placeholder={i18n.__("emailPlaceholder")}
                id={"email"}
                name={"email"}
                onChange={handleChange}
                promptMsg={state.email.valid ? i18n.__("emailPrompt") : ""}
                error={state.email.status}
                ref={inputEmail}
                onBlur={e => checkEmail(e.target.value, true)}
                defaultValue={state.email.value}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    checkEmail(e.target.value, true);
                  }
                }}
              />
            </IconField>
          </Box>

          <Box mt={28}>
            <PhoneNumberField>
              <PhoneNumberField.RegionField
                key={state.regionCode}
                defaultValue={state.regionCode}
                options={selectOptions}
                searchLength={2}
                showList={false}
                ref={inputSelect}
                /* id="select-search" */
                onChange={(e, code) => {
                  //console.log("REGION", e);
                  //console.log("REGION", code);
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
                placeholder={i18n.__("phoneNumberPlaceholder")}
                id={"phoneNumber"}
                name={"phoneNumber"}
                onChange={handleChange}
                promptMsg={
                  state.phoneNumber.valid ? i18n.__("phonePrompt") : ""
                }
                error={state.phoneNumber.status}
                ref={inputPhone}
                defaultValue={state.phoneNumber.value}
                onBlur={e => {
                  /*
                    console.log(
                      "BLUR CHANGE ",
                      e.target.id,
                      e.target.value,
                      document.activeElement.id,
                      document.activeElement.value
                    )
                    */
                  // weird problem... password autofill changes phonenumber...
                  if (
                    !(
                      e.target.id === "phoneNumber" &&
                      (document.activeElement.id === "accountPassword" ||
                        document.activeElement.id === "passwordConfirm")
                    )
                  ) {
                    checkPhone(state.regionCode, e.target.value, true);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    checkPhone(state.regionCode, e.target.value, true);
                  }
                }}
                //onBlur={(e) => checkInputField("phone", e)}

                /* disabled={regionCode === "000"} */
              />
            </PhoneNumberField>
          </Box>
          <Box mt={28}>
            <PasswordField
              placeholder={i18n.__("passwordPlaceholder")}
              onFocus={e => {
                //console.log("PASSWORD FOCUES ", state);
                //console.log("PASS ", e.target.id, document.activeElement.id);
                if (
                  isPasswordPossible() &&
                  (!state.accountPassword.valid ||
                    state.accountPassword.value.length === 0)
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
                /* check password popup */
                checkInputPassword(e.target.value);
                /*
                console.log(
                  "PASSWORD CHANGE ",
                  state,
                  document.getElementById("phoneNumber").value
                );
                console.log(
                  "PASS CHANGE",
                  e.target.id,
                  document.activeElement.id
                );
                */
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
                if (passwordCheck(e.target.value)) {
                  setAddPopper(false);
                } else {
                  console.log("PREVENT BLUR:....");
                  setInputPasswordFocus();
                  e.preventDefault();
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (passwordCheck(e.target.value)) {
                    setAddPopper(false);
                  }
                }
              }}
              autoComplete="new-password"
            />
          </Box>
          <Box mt={28}>
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
              onChange={e => {
                handleChange(e);
                checkConfirmPassword(e.target.value, false);
              }}
              error={
                state.accountPassword.status || state.passwordConfirm.status
              }
              onKeyDown={e => {
                if (e.key === "Enter") {
                  const cPassword = e.target.value;
                  const confirmStatus =
                    state.accountPassword.value === cPassword;
                  if (
                    (!confirmStatus &&
                      cPassword.length >= config.passwordLength) ||
                    (!confirmStatus && !nextDisabled)
                  ) {
                    const errorMsg = i18n.__("invalidPassword");
                    setNextDisabled(true);

                    if (
                      !alerts.check().some(alert => alert.message === errorMsg)
                    )
                      alerts.error(errorMsg, {});
                  } else {
                    setNextDisabled(false);
                  }
                }
              }}
              autoComplete="new-password"
            />
          </Box>

          <Box mt={66} textAlign={"center"}>
            <Button
              disabled={nextDisabled}
              onClick={e => {
                Promise.all(nextButtonClick()).then(res => {
                  console.log("PROMISE ", res);
                  let checkResult = true;

                  if (
                    typeof res[1].data !== "undefined" &&
                    res[1].data.checkUsername
                  ) {
                    userNameAlert(true, i18n.__("usernameExists"));
                    checkResult = false;
                  } else {
                    setState({
                      username: { ...state.username, status: false },
                    });
                  }
                  if (
                    typeof res[2].data !== "undefined" &&
                    res[2].data.checkCognitoAttribute
                  ) {
                    emailAlert(i18n.__("invalidEmail"), false);
                    checkResult = false;
                  } else {
                    setState({ email: { ...state.email, status: false } });
                  }
                  if (
                    typeof res[3].data !== "undefined" &&
                    res[3].data.checkCognitoAttribute
                  ) {
                    phoneAlert(i18n.__("invalidPhoneNumber"), false);
                    checkResult = false;
                  } else {
                    setState({
                      phoneNumber: { ...state.phoneNumber, status: false },
                    });
                  }
                  // next check failed, possible password condition reason...
                  if (checkResult && !res[0]) {
                    checkResult = false;
                  }

                  if (checkResult) {
                    console.log("NEXT....", currentUser);
                    let phoneNumber = addRegionCode(
                      state.regionCode,
                      state.phoneNumber.value,
                    );

                    let _currentUser = Object.assign({}, currentUser);
                    _currentUser.given_name = state.firstName.value;

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

                    if (!state.termsAccepted) {
                      //console.log("STEP 1");
                      setRegisterStep(1);
                    } else {
                      if (
                        state.emailVerified !== _currentUser.email ||
                        !emailVerified
                      ) {
                        setRegisterStep(2);
                        //console.log("STEP 2");
                      }
                      if (
                        state.phoneVerified !== _currentUser.phone_number ||
                        !phoneVerified
                      ) {
                        setRegisterStep(3);
                        //console.log("STEP 3");
                      }
                      if (
                        state.emailVerified !== "" &&
                        state.phoneVerified !== ""
                      ) {
                        setRegisterStep(4);
                        //console.log("STEP 4");
                      }
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
        </ProgressContainer>
      )}
    </AccountContext.Provider>
  );
};

CreateAccount.propTypes = {
  finalStep: PropTypes.func.isRequired,
};

export default CreateAccount;
