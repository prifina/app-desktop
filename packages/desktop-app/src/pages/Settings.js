//SETTINGS
import React, { useState, useReducer, useEffect, useRef } from "react";
import {
  Flex,
  Box,
  Text,
  Button,
  Divider,
  ThemeProvider,
  theme as defaultTheme,
  useTheme,
} from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import { IconField } from "@blend-ui/icon-field";

import { API, Auth } from "aws-amplify";
import config from "../config";

import {
  checkUsernameQuery,
  validUsername,
  SidebarMenu,
  getCountryCodeQuery,
  checkCognitoAttributeQuery,
  useFocus,
  useAppContext,
  validEmail,
  isValidNumber,
  countryList,
  lowerCaseChars,
  addRegionCode,
  Navbar,
  sendVerificationMutation,
  updateCognitoUserMutation,
  i18n,
  checkPassword,
  PhoneNumberField,
} from "@prifina-apps/utils";

import useFlags from "../hooks/UseFlags";

import { useToast, ToastContextProvider } from "@blend-ui/toast";

import * as C from "./settings-app/components";

import { ReactComponent as SettingsLogo } from "../assets/settings-app/settings-logo.svg";

import styled from "styled-components";

import mdiAccount from "@iconify/icons-mdi/account";
import mdiShieldAccount from "@iconify/icons-mdi/shield-account";
import mdiClose from "@iconify/icons-mdi/close";

import mdiShieldLock from "@iconify/icons-mdi/shield-lock";
import mdiLockOutline from "@iconify/icons-mdi/lock-outline";
import mdiEmailOutline from "@iconify/icons-mdi/email-outline";
import mdiCellphone from "@iconify/icons-mdi/cellphone";

// import mdiShieldAccount from "@iconify/icons-mdi/shield-account";
import mdiKeyOutline from "@iconify/icons-mdi/key-outline";

import bxUser from "@iconify/icons-bx/bx-user";
import bxEnvelope from "@iconify/icons-bx/bx-envelope";

import newTheme from "../theme/settingsTheme";

import VerificationModal from "../components/VerificationModal";

import PasswordField from "../components/PasswordField";

const Container = styled(Flex)`
  flex-direction: column;
  padding-left: 350px;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-right: 64px;
`;

const ContentContainer = styled(Box)`
  border: 1px solid #eaebeb;
  position: relative;
  border-radius: 16px;
  margin-bottom: 24px;
`;

const SectionContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px 16px 44px;
  min-height: 120px;
  border: 0;
  border-top: 1px solid #eaebeb;
`;

const Badge = styled.span`
  border: 2px solid white;
  padding: 0px 8px;
  background: #dbdff0;
  border-radius: 20px;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: #072545;
  text-transform: uppercase;
  display: flex;
  align-items: center;
`;

const IconBox = styled(Box)`
  position: absolute;
  top: 22px;
  left: 16px;
`;

const UnorderedList = styled.ul`
  /* */
  list-style-type: none;
  margin: 0;
  list-style-position: outside;
  padding-inline-start: 20px;
  margin-block-start: 0px;
  padding: 0;
  padding-left: 20px;
`;

const ListItem = styled.li`
  /* */
  ::before {
    content: "•";
    color: ${props => (props.verified ? "#80BF45" : "gray")}; // from theme
    display: inline-block;
    width: 0.9em;
    margin-left: -0.9em;
    font-size: 2em;
  }
  span {
    position: relative;
    top: -5px;
  }
`;

const BorderIcon = ({ iconify, size, color, border, height, width }) => {
  return (
    <Box
      height={height}
      width={width}
      style={{
        textAlign: "center",
        borderRadius: 100,
        border: border,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <BlendIcon
        iconify={iconify}
        color={color}
        style={{ position: "absolute" }}
        size={size}
      />
    </Box>
  );
};

const Settings = props => {
  console.log("SETTINGS PROPS ", props);

  const { currentUser } = useAppContext();
  console.log("USER INFO", currentUser);

  const { colors } = useTheme();

  const alerts = useToast();

  const [inputSelect, setSelectFocus] = useFocus();
  const [inputEmail, setInputEmailFocus] = useFocus();
  const [inputPhone, setInputPhoneFocus] = useFocus();

  const [inputUsername, setInputUsernameFocus] = useFocus();

  const [inputPassword, setInputPasswordFocus] = useFocus();

  const items = [
    // {
    //   label: "Profiles",
    //   icon: mdiAccount,
    //   onClick: () => {
    //     setStep(0);
    //   },
    //   disabled: true,
    // },
    {
      label: "Account Settings",
      icon: mdiShieldAccount,
      onClick: () => {
        setStep(0);
      },
    },
    // {
    //   label: "Billing & plan",
    //   icon: mdiClose,
    //   disabled: true,
    // },
  ];

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

  const selectOptions = useRef([]);

  const { cList, nList } = countryList(continents, popularList);
  const { icons, isLoading } = useFlags(nList);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      email: {
        status: false,
        msg: "",
        valid: false,
        value: currentUser.email,
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
      newPassword: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      username: {
        status: false,
        msg: "",
        valid: false,
        value: currentUser.loginUsername,
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
        value: currentUser.given_name,
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

  // console.log("state", state);

  const [flags, setFlags] = useState(false);

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

  function mergeDeep(...objects) {
    const isObject = obj => obj && typeof obj === "object";

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }

  const mergedTheme = mergeDeep(defaultTheme, newTheme);

  const [modalOpen, setModalOpen] = useState(false);

  const onDialogClose = e => {
    setModalOpen(false);
    e.preventDefault();
  };

  const [changeNumber, setChangeNumber] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changeUsername, setChangeUsername] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

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
        },
        regionCode: phoneOpts.region,
      });
    } else {
      setState({ phoneNumber: { ...state.phoneNumber, status: !phoneState } });
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

    setState({ email: { ...state.email, status: !emailState } });
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

  const [verificationType, setVerificationType] = useState("");

  const sendCodeEmail = async e => {
    try {
      await sendVerificationMutation(
        API,
        "email",
        JSON.stringify({
          userId: currentUser.loginUsername,
          clientId: currentUser.client,
          email: state.email.value,
          given_name: currentUser.given_name,
        }),
      );
      setVerificationType("email");
      setModalOpen(true);
      alerts.info(i18n.__("emailVerificatioSent"), {});
    } catch (e) {
      console.log("ERR", e);
    }
  };

  const sendCodePhone = async e => {
    try {
      await sendVerificationMutation(
        API,
        "phone",
        JSON.stringify({
          userId: currentUser.loginUsername,
          clientId: currentUser.client,
          phone_number: state.regionCode + state.phoneNumber.value,
          given_name: currentUser.given_name,
        }),
      );
      setVerificationType("phone");
      setModalOpen(true);
      console.log("success send code", e);

      alerts.info(i18n.__("phoneVerificatioSent"), {});
    } catch (e) {
      console.log("ERR", e);
    }
  };

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

  const [passwordVerification, setPasswordVerification] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

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
    const checkResult = checkPassword(password, config.passwordLength, [
      state.firstName.value,
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

  useEffect(() => {}, [state]);

  // console.log("state email", state.email.value);
  // console.log("state phoneNumber", state.phoneNumber.value);
  // console.log("state region Code", state.regionCode);

  // console.log("state username", state.username.value);
  // console.log("state password", state.accountPassword.value);

  // console.log("state new password", state.newPassword.value);

  const updateUsername = () => {
    updateCognitoUserMutation(
      API,
      "preferred_username",
      state.username.value,
    ).then(res => {
      alerts.success(i18n.__("Username changed"), {});
      console.log("SUCCESS", res);
    });
  };

  const handleChangePassword = () => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(
          user,
          state.accountPassword.value,
          state.newPassword.value,
        );
      })
      .then(data => {
        console.log(data);
        //need toast verification success
      })
      .catch(err => {
        return console.log(err), alerts.error("Password change failed", {});
      });
  };

  const checkPasswordChangePossibility = () => {
    if (
      passwordVerification.includes(false) !== true &&
      state.accountPassword.value === state.newPassword.value
    ) {
      return false;
    } else {
      return true;
    }
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const checkUsernameChangePossibility = () => {
      if (!checkUsername(state.username.value, false) === true) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    };
    checkUsernameChangePossibility();
  }, [state.username.value]);

  useEffect(() => {
    checkPasswordChangePossibility();
  }, [state.accountPassword.value, state.newPassword.value]);

  return (
    <ThemeProvider theme={mergedTheme}>
      <SidebarMenu items={items} />
      <Navbar backgroundColor="baseWhite">
        <SettingsLogo />
      </Navbar>
      {modalOpen && (
        <VerificationModal
          onClose={onDialogClose}
          state={state}
          verificationType={verificationType}
        />
      )}
      <Container bg={colors.backgroundLight}>
        <Text textStyle="h3" mb={36}>
          Account security
        </Text>
        <ContentContainer className="account-credentials">
          <SectionContainer
            className="info-container"
            style={{
              position: "relative",
              border: 0,
              minHeight: 66,
            }}
          >
            <IconBox>
              <BorderIcon
                iconify={mdiShieldAccount}
                size="14px"
                color="#0D2177"
                border="12px solid #DBDFF0"
                height="24px"
                width="24px"
              />
            </IconBox>

            <Box ml={10}>
              <Text textStyle="h4" mr={10}>
                Account Credentials
              </Text>
            </Box>
          </SectionContainer>
          <SectionContainer className="change-number">
            {changeUsername ? (
              <>
                <Box ml={24}>
                  <Text mr={16} mb={5}>
                    Username
                  </Text>
                  <Box className="phone-number" width="378px">
                    <IconField>
                      <IconField.LeftIcon
                        iconify={bxUser}
                        color={"componentPrimary"}
                        size={"17"}
                      />
                      <IconField.InputField
                        placeholder="New username"
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
                      />
                    </IconField>
                  </Box>
                  <Text fontSize="xs" color={colors.textMuted}>
                    Must be longer than 6 characters, no spaces available
                  </Text>
                </Box>
                <Flex>
                  <Button
                    variation="outline"
                    mr={8}
                    onClick={() => setChangeUsername(value => !value)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={disabled} onClick={updateUsername}>
                    Change username
                  </Button>
                </Flex>
              </>
            ) : (
              <>
                <Flex>
                  <BorderIcon
                    iconify={mdiCellphone}
                    size="20px"
                    color="#0D2177"
                    border="16px solid #DBDFF0"
                    height="32px"
                    width="32px"
                  />
                  <Box ml={24}>
                    <Flex>
                      <Text mr={16} fontWeight="600">
                        Username
                      </Text>
                      {/* <Badge>verified</Badge> */}
                    </Flex>
                    <Flex>
                      <Text fontSize="xs" color={colors.textMuted}>
                        Used with your password to access your account. Current
                        username
                      </Text>
                      <Text fontWeight="600" fontSize="xs" ml={3}>
                        {currentUser.loginUsername}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
                <Button onClick={() => setChangeUsername(value => !value)}>
                  Change username
                </Button>
              </>
            )}
          </SectionContainer>
          <SectionContainer className="change-email">
            {changePassword ? (
              <>
                <Box ml={24}>
                  <Text mr={16} mb={8} fontWeight="600">
                    Password
                  </Text>
                  <Box className="password" width="378px">
                    <PasswordField
                      placeholder={i18n.__("passwordPlaceholder")}
                      onFocus={e => {
                        if (e.target.value.length > 0) {
                          if (passwordCheck(e.target.value)) {
                          } else {
                            e.preventDefault();
                          }
                        } else {
                        }
                      }}
                      id={"accountPassword"}
                      name={"accountPassword"}
                      onChange={e => {
                        handleChange(e);
                        checkInputPassword(e);
                      }}
                      ref={inputPassword}
                      defaultValue={state.accountPassword.value}
                      error={state.accountPassword.status}
                      onBlur={e => {
                        if (e.target.value.length > 0) {
                          if (passwordCheck(e.target.value)) {
                          } else {
                            console.log("PREVENT BLUR:....");
                            setInputPasswordFocus();
                            e.preventDefault();
                          }
                        } else {
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === "Enter" && e.target.value.length > 4) {
                          console.log("CHECKING PASSWORD ", e.target.value);
                          const checkStatus = passwordCheck(e.target.value);
                          console.log("CHECK STATUS ", checkStatus);
                          if (checkStatus) {
                          }
                        }
                      }}
                      autoComplete="new-password"
                      tabIndex="3"
                    />
                  </Box>
                  <Text mr={16} mb={8} mt={16} fontWeight="600">
                    Confirm password
                  </Text>
                  <Box className="newPassword" width="378px">
                    <PasswordField
                      placeholder={i18n.__("confirmPlaceholder")}
                      onFocus={e => {
                        if (state.accountPassword.value.length === 0) {
                          setInputPasswordFocus();
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      id={"newPassword"}
                      name={"newPassword"}
                      defaultValue={state.passwordConfirm.value}
                      onChange={e => {
                        handleChange(e);
                      }}
                      error={
                        state.accountPassword.status ||
                        state.passwordConfirm.status
                      }
                      onBlur={e => {
                        if (
                          e.target.value.length ===
                          state.accountPassword.value.length
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
                </Box>
                <Box>
                  <Text fontSize={"xs"} bold>
                    Create a password that:
                    <UnorderedList>
                      <ListItem
                        verified={passwordVerification[0]}
                        theme={mergedTheme}
                      >
                        <Text as={"span"} fontSize={"xxs"}>
                          Contains at least {config.passwordLength} characters
                        </Text>
                      </ListItem>
                      <ListItem
                        verified={passwordVerification[1]}
                        theme={mergedTheme}
                      >
                        <Text as={"span"} fontSize={"xxs"}>
                          Contains both lower (a-z) and upper case letters (A-Z)
                        </Text>
                      </ListItem>

                      <ListItem
                        verified={passwordVerification[2]}
                        theme={mergedTheme}
                      >
                        <Text as={"span"} fontSize={"xxs"}>
                          Contains at least one number (0-9) and a symbol
                        </Text>
                      </ListItem>
                      <ListItem
                        verified={passwordVerification[3]}
                        theme={mergedTheme}
                      >
                        <Text as={"span"} fontSize={"xxs"}>
                          Does not contain your name or email address
                        </Text>
                      </ListItem>
                      <ListItem
                        verified={passwordVerification[4]}
                        theme={mergedTheme}
                      >
                        <Text as={"span"} fontSize={"xxs"}>
                          Is not commonly used
                        </Text>
                      </ListItem>
                    </UnorderedList>
                  </Text>
                </Box>
                <Flex>
                  <Button
                    variation="outline"
                    mr={8}
                    onClick={() => setChangePassword(value => !value)}
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={checkPasswordChangePossibility()}
                    onClick={() => handleChangePassword()}
                  >
                    Change password
                  </Button>
                </Flex>
              </>
            ) : (
              <>
                <Flex>
                  <BorderIcon
                    iconify={mdiEmailOutline}
                    size="20px"
                    color="#0D2177"
                    border="16px solid #DBDFF0"
                    height="32px"
                    width="32px"
                  />
                  <Box ml={24}>
                    <Flex>
                      <Text mr={16} fontWeight="600">
                        Password
                      </Text>
                      {/* <Badge>verified</Badge> */}
                    </Flex>
                    <Text fontSize="xs" color={colors.textMuted}>
                      It's a good idea to use a strong password that you're not
                      using elsewhere
                    </Text>
                  </Box>
                </Flex>
                <Button onClick={() => setChangePassword(value => !value)}>
                  Change password
                </Button>
              </>
            )}
          </SectionContainer>
        </ContentContainer>

        <ContentContainer className="securing-account">
          <SectionContainer
            className="info-container"
            style={{
              position: "relative",
              border: 0,
            }}
          >
            <IconBox>
              <BorderIcon
                iconify={mdiShieldLock}
                size="14px"
                color="#0D2177"
                border="12px solid #DBDFF0"
                height="24px"
                width="24px"
              />
            </IconBox>

            <Box ml={10}>
              <Flex mb={8}>
                <Text textStyle="h4" mr={10}>
                  Securing Your Account
                </Text>
                <Badge>
                  <BlendIcon
                    iconify={mdiLockOutline}
                    color="#0D2177"
                    size="10px"
                  />
                  <Text ml={6}>always on</Text>
                </Badge>
              </Flex>
              <Text>
                Primary communication channels used for multifactor
                authentication, to verify changes in account credentials and
                other account related communication.
              </Text>
            </Box>
          </SectionContainer>
          <SectionContainer className="change-number">
            {changeNumber ? (
              <>
                <Box ml={24}>
                  <Text mr={16} mb={5}>
                    Mobile Phone Number
                  </Text>
                  <Box className="phone-number" width="378px">
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
                        placeholder="555_555_555"
                        id={"phoneNumber"}
                        name="phoneNumber"
                        onChange={e => {
                          handleChange(e);
                        }}
                        promptMsg={
                          state.phoneNumber.valid ? i18n.__("phonePrompt") : ""
                        }
                        error={state.phoneNumber.status}
                        ref={inputPhone}
                        defaultValue={state.phoneNumber.value}
                        onBlur={e => {
                          // weird problem... password autofill changes phonenumber...
                          if (
                            !(
                              e.target.id === "phoneNumber" &&
                              (document.activeElement.id ===
                                "accountPassword" ||
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
                            const checkResult = checkPhone(
                              state.regionCode,
                              e.target.value,
                              true,
                            );
                          }
                        }}
                      />
                    </PhoneNumberField>
                  </Box>
                  <Text fontSize="xs" color={colors.textMuted}>
                    Number must accept SMS
                  </Text>
                </Box>
                <Flex>
                  <Button
                    variation="outline"
                    mr={8}
                    onClick={() => setChangeNumber(value => !value)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={sendCodePhone}>Change number</Button>
                </Flex>
              </>
            ) : (
              <>
                <Flex>
                  <BorderIcon
                    iconify={mdiCellphone}
                    size="20px"
                    color="#0D2177"
                    border="16px solid #DBDFF0"
                    height="32px"
                    width="32px"
                  />
                  <Box ml={24}>
                    <Flex>
                      <Text mr={16} fontWeight="600">
                        Mobile Phone Number
                      </Text>
                      <Badge>verified</Badge>
                    </Flex>
                    <Flex>
                      <Text fontSize="xs" color={colors.textMuted}>
                        We will send an one time SMS code to your verified phone
                        number
                      </Text>
                      <Text fontWeight="600" fontSize="xs" ml={3}>
                        {currentUser.phoneNumber}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
                <Button onClick={() => setChangeNumber(value => !value)}>
                  Change number
                </Button>
              </>
            )}
          </SectionContainer>
          <SectionContainer className="change-email">
            {changeEmail ? (
              <>
                <Box ml={24}>
                  <Text mr={16} mb={5} fontWeight="600">
                    Email
                  </Text>
                  <Box className="email" width="378px">
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
                        promptMsg={
                          state.email.valid ? i18n.__("emailPrompt") : ""
                        }
                        error={state.email.status}
                        ref={inputEmail}
                        onBlur={e => checkEmail(e.target.value)}
                        defaultValue={state.email.value}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            checkEmail(e.target.value, true);
                          }
                        }}
                      />
                    </IconField>
                  </Box>
                </Box>
                <Flex>
                  <Button
                    variation="outline"
                    mr={8}
                    onClick={() => setChangeEmail(value => !value)}
                  >
                    Cancel
                  </Button>

                  <Button onClick={sendCodeEmail}>Change email</Button>
                </Flex>
              </>
            ) : (
              <>
                <Flex>
                  <BorderIcon
                    iconify={mdiEmailOutline}
                    size="20px"
                    color="#0D2177"
                    border="16px solid #DBDFF0"
                    height="32px"
                    width="32px"
                  />
                  <Box ml={24}>
                    <Flex>
                      <Text mr={16} fontWeight="600">
                        Primary email
                      </Text>
                      <Badge>verified</Badge>
                    </Flex>
                    <Flex>
                      <Text fontSize="xs" color={colors.textMuted}>
                        We will send an one time code to your verified email
                        address
                      </Text>
                      <Text fontWeight="600" fontSize="xs" ml={3}>
                        {currentUser.email}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
                <Button onClick={() => setChangeEmail(value => !value)}>
                  Change email
                </Button>
              </>
            )}
          </SectionContainer>
        </ContentContainer>
      </Container>
    </ThemeProvider>
  );
};

Settings.displayName = "Settings";

export default Settings;
