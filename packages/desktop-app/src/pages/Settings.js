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

//import { API, Auth } from "aws-amplify";
import config from "../config";

import {
  SidebarMenu,
  Navbar,
  useToast,
  UsernameField, PasswordField, EmailField, PhoneNumberField, useComponentFlagList
} from "@prifina-apps/ui-lib";

/*
checkUsernameQuery,
getCountryCodeQuery,
checkCognitoAttributeQuery,

sendVerificationMutation,
updateCognitoUserMutation,
*/

//import useFlags from "../hooks/UseFlags";

import {
  validUsername,
  validEmail,
  isValidNumber,
  countryList,
  lowerCaseChars,
  addRegionCode,
  checkPassword,
  useTranslate
} from "@prifina-apps/utils";

//import { useToast, ToastContextProvider } from "@blend-ui/toast";

import * as C from "./settings-app/components";

//import { ReactComponent as SettingsLogo } from "../assets/settings-app/settings-logo.svg";
import SettingsLogo from "../assets/settings-app/SettingsLogo";

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
import shallow from "zustand/shallow";


import { useStore, mergeDeep } from "@prifina-apps/utils";

//import { useStore } from "../utils-v2/stores/PrifinaStore";


/*
const withToast = () => WrappedComponent => {
  const WithToast = props => {
    return (
      <ToastContextProvider>
        <WrappedComponent {...props} />
      </ToastContextProvider>
    );
  };

  WithToast.displayName = `WithToast(${WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

  return WithToast;
};
*/


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
list - style - type: none;
margin: 0;
list - style - position: outside;
padding - inline - start: 20px;
margin - block - start: 0px;
padding: 0;
padding - left: 20px;
`;

const ListItem = styled.li`
  /* */
  ::before {
  content: "•";
  color: ${props => (props.verified ? "#80BF45" : "gray")}; // from theme
  display: inline - block;
  width: 0.9em;
  margin - left: -0.9em;
  font - size: 2em;
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

const CurrentSettings = ({ icon, title, info, currentValue, buttonPrompt, verified = false, onClick }) => {

  const { colors } = useTheme();
  return <>
    <Flex>
      <BorderIcon
        iconify={icon}
        size="20px"
        color="#0D2177"
        border="16px solid #DBDFF0"
        height="32px"
        width="32px"
      />
      <Box ml={24}>
        <Flex>
          <Text mr={16} fontWeight="600">
            {title}
          </Text>
          {verified && <Badge>verified</Badge>}
        </Flex>
        <Flex>
          <Text fontSize="xs" color={colors.textMuted}>
            {info}
          </Text>
          <Text fontWeight="600" fontSize="xs" ml={3}>
            {currentValue}
          </Text>
        </Flex>
      </Box>
    </Flex>
    <Button width={"150px"} onClick={onClick}>
      {buttonPrompt}
    </Button>
  </>
}

const ChangeUseremail = ({ inputRefs, currentValue, onCancel, updateUseremail }) => {

  const { __ } = useTranslate();
  const [changeDisabled, setChangeDisabled] = useState(true);

  const emailArgs = {
    id: "email",
    name: "email",
    ref: useRef(),
    options: {
      checkExists: true,
      toast: true,
      value: currentValue,
      txt: inputRefs.current["emailTxt"]
    },
    inputState: (input, validation = false) => {
      // console.log("STATE UPDATE", input, input.dataset);

      console.log("STATE UPDATE EMAIL ", input, input.dataset, inputRefs);
      inputRefs.current = { ...inputRefs.current, [input.id]: input };

      console.log(input?.value);
      console.log(input?.dataset);
      if (changeDisabled && inputRefs.current?.['email']?.dataset['isvalid']) {

        console.log("UPDATE CHANGE EMAIL ", input.dataset['isvalid'])
        setChangeDisabled(!input.dataset['isvalid']);
      }
    }
  }
  return <>
    <Box width={"100%"}>
      <Text fontWeight="600" fontSize="sm">
        Email
      </Text>
      <Flex flexDirection={"row"} flexWrap="wrap">
        <Box width="50%">
          <EmailField autoFocus={true} {...emailArgs} />
        </Box>
        <Flex height="33px" width="50%" justifyContent={"end"} alignItems="center">
          <Button size={"sm"}
            variation="outline"
            mr={8}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button size={"sm"} disabled={changeDisabled} onClick={updateUseremail}>
            Change email
          </Button>
        </Flex>
      </Flex>
    </Box>
  </>

}
const ChangeUsername = ({ inputRefs, currentValue, onCancel, updateUsername }) => {

  const { __ } = useTranslate();
  const [changeDisabled, setChangeDisabled] = useState(true);

  const usernameArgs = {
    id: "username",
    name: "username",
    ref: useRef(),
    options: {
      checkExists: true,
      toast: true,
      value: currentValue,
      txt: inputRefs.current["usernameTxt"]
    },
    inputState: (input) => {
      console.log("STATE UPDATE USERNAME ", input, input.dataset, inputRefs);
      inputRefs.current = { ...inputRefs.current, [input.id]: input };
      if (changeDisabled && inputRefs.current?.['username']?.dataset['isvalid']) {

        console.log("UPDATE CHANGE USERNAME ", input.dataset['isvalid'])
        setChangeDisabled(!input.dataset['isvalid']);
      }
    }
  }

  return <>
    <Box width={"100%"}>
      <Text fontWeight="600" fontSize="sm">
        Username
      </Text>
      <Flex flexDirection={"row"} flexWrap="wrap">
        <Box width="50%">
          <UsernameField autoFocus={true} {...usernameArgs} />
        </Box>
        <Flex height="33px" width="50%" justifyContent={"end"} alignItems="center">
          <Button size={"sm"}
            variation="outline"
            mr={8}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button size={"sm"} disabled={changeDisabled} onClick={updateUsername}>
            Change username
          </Button>
        </Flex>
      </Flex>
    </Box>
  </>
}

const ChangeUserPassword = ({ inputRefs, onCancel, updateUserpassword }) => {

  const { __ } = useTranslate();
  const [changeDisabled, setChangeDisabled] = useState(true);

  const newPasswordArgs = {
    id: "newPassword",
    name: "newPassword",
    ref: useRef(),
    options: {
      addPopup: true,
      checkList: () => {
        return [];
      },
      toast: false,
      txt: inputRefs.current["passwordTxt"]
    },
    inputState: (input, validation = false) => {

      console.log("STATE UPDATE PASSWORD ", input, input.dataset, inputRefs);
      inputRefs.current = { ...inputRefs.current, [input.id]: input };

      /*
      console.log("PASSWD STATE UPDATE ", input);
      console.log(input?.value);
      console.log(input?.dataset);
      console.log(inputRefs, inputRefs?.password);
      if (typeof input !== 'undefined') {

        if (inputRefs?.password === undefined) {
          inputRefs[input.id] = input
        }
        if (validation) {
          let checks = { password: true, passwordConfirm: true };
          if (typeof input === 'undefined') {
            checks["password"] = false;
            return false;
          } else if (inputRefs?.passwordConfirm === undefined) {
            checks["password"] = false
            checks["passwordConfirm"] = false;
            return false;
          }

          setStateCheck(checks)
          return checks.password && checks.passwordConfirm;
        }
      } else {
        setStateCheck({ password: false })
      }
        */
    }
  }

  const getAccountPassword = () => {
    //passwordArgs.ref, // note, this is useRef() variable... 
    if (passwordArgs.ref?.current) {

      return passwordArgs.ref.current.value;
    } else {
      return "";
    }
  }

  const oldPasswordArgs = {
    id: "oldPassword",
    name: "oldPassword",
    ref: useRef(),
    options: {
      addPopup: false,
      checkList: () => [],
      toast: false,
      txt: inputRefs.current["passwordTxt"]

    },
    inputState: (input) => {

      console.log("STATE UPDATE OLD PASSWORD ", input, input.dataset, inputRefs);
      inputRefs.current = { ...inputRefs.current, [input.id]: input };
      /*
      if (inputRefs?.passwordConfirm === undefined) {
        //console.log("UNDEF ");
        inputRefs[input.id] = input
      }
      */
    }
  }


  return <>
    <Box width={"100%"}>
      <Text fontWeight="600" fontSize="sm">
        Password
      </Text>
      <Flex flexDirection={"row"} flexWrap="wrap">
        <Box width={"50%"}>
          <Box mt={18}>
            <PasswordField  {...oldPasswordArgs} />
          </Box>
          <Box mt={18}>
            <PasswordField  {...newPasswordArgs} />
          </Box>
        </Box>

        <Flex width="50%" justifyContent={"end"} alignItems="center">
          <Box height="34px">
            <Button size={"sm"}
              variation="outline"
              mr={8}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button size={"sm"} disabled={changeDisabled} onClick={updateUserpassword}>
              Change password
            </Button>
          </Box>
        </Flex>

      </Flex>

    </Box>
  </>

}

const ChangePhoneNumber = ({ inputRefs, currentValue, onCancel, updatePhoneNumber }) => {

  //const { __ } = useTranslate();
  const [changeDisabled, setChangeDisabled] = useState(true);

  const phoneArgs = {
    id: "phoneNumber",
    name: "phoneNumber",
    ref: useRef(),
    selectOptions: inputRefs.current["selectOptions"],
    options: {
      defaultRegion: inputRefs.current["defaultRegion"],
      searchLength: 3,
      showList: true,
      selectOption: "key",
      value: currentValue,
      checkExists: true,
      toast: false,
      txt: inputRefs.current["phoneNumberTxt"]
      // txt: { "invalidTxt": __("invalidPhoneNumber"), "placeholderTxt": __("phoneNumberPlaceholder"), "promptTxt": __("phonePrompt") }

    },
    inputState: (input, validation = false) => {

      console.log("STATE UPDATE PHONE NUM ", input, input.dataset, inputRefs);
      inputRefs.current = { ...inputRefs.current, [input.id]: input };

      // console.log(input?.nationalNumber);
      // // console.log(input?.dataset);
      // console.log(inputRefs, inputRefs?.phoneNumber);
      // if (typeof input !== 'undefined' && input?.nationalNumber) {

      //   if (inputRefs?.phoneNumber === undefined) {
      //     //console.log("HAVE NUMBER ", input?.nationalNumber)
      //     inputRefs['phoneNumber'] = input
      //   }
      //   if (validation) {
      //     //console.log("VALIDATION ", input['nationalNumber'] !== null && input?.['nationalNumber'] && input['nationalNumber'] !== "")
      //     setStateCheck({ phoneNumber: input['nationalNumber'] !== null && input?.['nationalNumber'] && input['nationalNumber'] !== "" })
      //     return input['nationalNumber'] !== null && input?.['nationalNumber'] && input['nationalNumber'] !== ""
      //   }
      // } else {
      //   setStateCheck({ phoneNumber: false })
      // }

    }
  }

  return <>
    <Box width={"100%"}>
      <Text fontWeight="600" fontSize="sm">
        Phone number
      </Text>
      <Flex flexDirection={"row"} flexWrap="wrap">
        <Box width={"50%"}>
          <Box mt={18}>

            <PhoneNumberField  {...phoneArgs} />

          </Box>
        </Box>
        <Flex width="50%" justifyContent={"end"} alignItems="center">
          <Box height="34px">
            <Button size={"sm"}
              variation="outline"
              mr={8}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button size={"sm"} disabled={changeDisabled} onClick={updatePhoneNumber}>
              Change number
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Box>
  </>
}


const Settings = props => {
  console.log("SETTINGS PROPS ", props);

  //const { currentUser } = useAppContext();
  //console.log("USER INFO", currentUser);

  const { __ } = useTranslate();
  const { user: currentUser, checkUsernameQuery,
    getCountryCodeQuery,
    checkCognitoAttributeQuery,
    sendVerificationMutation,
    updateCognitoUserMutation,
    currentAuthenticatedUser,
    changePassword,
    getVerificationQuery
  } = useStore(
    state => ({
      user: state.user,
      sendVerificationMutation: state.sendVerificationMutation,
      checkUsernameQuery: state.checkUsernameQuery,
      getCountryCodeQuery: state.getCountryCodeQuery,
      checkCognitoAttributeQuery: state.checkCognitoAttributeQuery,
      updateCognitoUserMutation: state.updateCognitoUserMutation,
      currentAuthenticatedUser: state.currentAuthenticatedUser,
      changePassword: state.changePassword,
      getVerificationQuery: state.getVerificationQuery
    }),
    shallow,
  );

  const { colors } = useTheme();
  const alerts = useToast();

  console.log("ALERTS...", alerts);

  const inputRefs = useRef({});

  const [changeUsername, setChangeUsername] = useState(false);

  const [changeUserPassword, setChangePassword] = useState(false);
  const [changeNumber, setChangeNumber] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);

  const [verificationType, setVerificationType] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [dataReady, setDataReady] = useState(false);

  const { selectOptions, flagsLoading } = useComponentFlagList();
  const effectCalled = useRef(false);

  const onDialogClose = e => {
    setModalOpen(false);
    e.preventDefault();
  };

  const mergedTheme = mergeDeep(defaultTheme, newTheme);
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
        //setStep(0);
      },
    },
    // {
    //   label: "Billing & plan",
    //   icon: mdiClose,
    //   disabled: true,
    // },
  ];
  /*
    useEffect(() => {
      async function getCountryCode() {
        effectCalled.current = true;
        const countryCode = await getCountryCodeQuery();
        if (countryCode.data.getCountryCode !== null && countryCode.data?.getCountryCode) {
          //setState({ countryCode: countryCode.data.getCountryCode });
          inputRefs.current["countryCode"] = countryCode.data.getCountryCode;
        }
      }
      if (!effectCalled.current) {
        getCountryCode();
      }
    }, []);
    */

  useEffect(() => {

    async function init() {
      if (!flagsLoading) {
        const countryCode = await getCountryCodeQuery();
        if (countryCode.data.getCountryCode !== null && countryCode.data?.getCountryCode) {
          //setState({ countryCode: countryCode.data.getCountryCode });
          inputRefs.current["countryCode"] = countryCode.data.getCountryCode;
        }

        console.log("FLAGS ", inputRefs.current["countryCode"], selectOptions);

        const cIndex = selectOptions.findIndex(
          c => c.regionCode === inputRefs.current["countryCode"],
        );
        if (cIndex > -1) {
          // console.log("FOUND COUNTRY ", cIndex);
          const defaultOption = selectOptions[cIndex].key;
          // console.log("FOUND COUNTRY ", cIndex, defaultOption);
          inputRefs.current["defaultRegion"] = defaultOption;
          //setDefaultRegion(defaultOption);
        }
        inputRefs.current["selectOptions"] = selectOptions;
        inputRefs.current["phoneNumberTxt"] = { "invalidTxt": __("invalidPhoneNumber"), "placeholderTxt": __("phoneNumberPlaceholder"), "promptTxt": __("phonePrompt") }
        inputRefs.current["passwordTxt"] = {
          "invalidTxt": __("invalidPassword"), "invalidEntry": __("invalidEntry"),
          "passwordQuality": __("passwordQuality"), "placeholderTxt": __("passwordPlaceholder"),
          "promptTxt": '\u00a0'
        };
        inputRefs.current["usernameTxt"] = {
          "invalidTxt": "", "usernameError": __("usernameError", { length: config.usernameLength }),
          "usernameError2": __("usernameError2"), "usernameExists": __("usernameExists"),
          "placeholderTxt": __("usernamePlaceholder"), "promptTxt": ' Must be longer than 6 characters, no spaces available'
        };

        inputRefs.current["emailTxt"] = { "invalidTxt": __("invalidEmail"), "placeholderTxt": __("emailPlaceholder"), "promptTxt": __("emailPrompt") }
        setDataReady(true);
      }
    }
    init();
  }, [flagsLoading])

  const updateUsername = () => {
    console.log("UPDATE ", inputRefs.current['username'].value);

    // better add extra validations here.... 
    updateCognitoUserMutation(
      "preferred_username",
      inputRefs.current['username'].value
    ).then(res => {
      setChangeUsername(value => !value)
      alerts.success(__("Username changed"), {});
      console.log("SUCCESS", res);
    });

  };

  const updateUseremail = () => {
    console.log("UPDATE ", inputRefs.current['email'].value);
    setChangeEmail(value => !value)
    // better add extra validations here.... 
    sendVerificationMutation(
      "email",
      JSON.stringify({
        userId: currentUser.loginUsername,
        clientId: currentUser.client,
        email: inputRefs.current['email'].value,
        given_name: currentUser.given_name,
      }),
    ).then(() => {
      setVerificationType("email");
      setModalOpen(true);
      // alerts.info(__("emailVerificatioSent"), {});
    })
  };

  const updatePhoneNumber = () => {
    console.log("UPDATE ", inputRefs.current['phoneNumber'].value);
    setChangeNumber(value => !value)
    // better add extra validations here.... 
    sendVerificationMutation(
      "phone",
      JSON.stringify({
        userId: currentUser.loginUsername,
        clientId: currentUser.client,
        email: inputRefs.current['phoneNumber'].value,
        given_name: currentUser.given_name,
      }),
    ).then(() => {
      setVerificationType("phone");
      setModalOpen(true);
      // alerts.info(__("emailVerificatioSent"), {});
    })
  };

  const updateUserpassword = () => {
    console.log("UPDATE ", inputRefs.current['newPassword'].value);
    console.log("UPDATE ", inputRefs.current['oldPassword'].value);

    // better add extra validations here.... 
    // is the logic here correct.... function expects both old and new password, but new password is not "confirmed"
    currentAuthenticatedUser()
      .then(user => {
        return changePassword(
          user,
          inputRefs.current['oldPassword'].value,
          inputRefs.current['newPassword'].value
        );
      })
      .then(data => {
        console.log(data);
        setChangePassword(value => !value)
        alerts.success(__("Password changed"), {});
      })
      .catch(err => {
        return console.log(err), alerts.error("Password change failed", {});
      });


  }
  return <>
    {dataReady &&
      <ThemeProvider theme={mergedTheme}>
        <SidebarMenu items={items} />
        <Navbar backgroundColor="baseWhite">
          <SettingsLogo />
        </Navbar>
        {modalOpen && (
          <VerificationModal
            onClose={onDialogClose}
            options={{
              email: inputRefs.current['email'],
              phoneNumber: inputRefs.current['phoneNumber'],
              regionCode: ""
            }}
            verificationType={verificationType}
            currentUser={currentUser}
            sendVerificationMutation={sendVerificationMutation}
            updateCognitoUserMutation={updateCognitoUserMutation}
            getVerificationQuery={getVerificationQuery}

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
            <SectionContainer className="change-number" >
              {!changeUsername && <>
                <CurrentSettings icon={mdiCellphone} title={"Username"} info={"Used with your password to access your account. Currentusername"} currentValue={currentUser.loginUsername} buttonPrompt={"Change username"} onClick={() => {
                  setChangeUsername(value => !value)
                }} />
              </>
              }
              {changeUsername && <>
                <ChangeUsername inputRefs={inputRefs} currentValue={currentUser.loginUsername} onCancel={() => {
                  setChangeUsername(value => !value)
                }} updateUsername={updateUsername} />
              </>}
            </SectionContainer>
            <SectionContainer className="change-email" >
              {!changeUserPassword && <>
                <CurrentSettings icon={mdiEmailOutline} title={"Password"} info={"It's a good idea to use a strong password that you're not using elsewhere"} currentValue={""} buttonPrompt={"Change password"} onClick={() => {
                  setChangePassword(value => !value)
                }} />
              </>
              }
              {changeUserPassword && <>
                <ChangeUserPassword inputRefs={inputRefs} onCancel={() => {
                  setChangePassword(value => !value)
                }} updateUserpassword={updateUserpassword} />
              </>
              }
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
            <SectionContainer className="change-number" >
              {!changeNumber && <>
                <CurrentSettings verified={true} icon={mdiCellphone} title={"Mobile Phone Number"} info={"We will send an one time SMS code to your verified phonenumber"} currentValue={currentUser.phoneNumber} buttonPrompt={"Change number"} onClick={() => setChangeNumber(value => !value)} />
              </>
              }
              {changeNumber && <>
                <ChangePhoneNumber inputRefs={inputRefs} currentValue={currentUser.phoneNumber} onCancel={() => {
                  setChangeNumber(value => !value)
                }} updatePhoneNumber={updatePhoneNumber} />
              </>}
            </SectionContainer>
            <SectionContainer className="change-email" >
              {!changeEmail && <>
                <CurrentSettings verified={true} icon={mdiEmailOutline} title={"Primary email"} info={"We will send an one time code to your verified email address"} currentValue={currentUser.email} buttonPrompt={"Change email"} onClick={() => setChangeEmail(value => !value)} />
              </>
              }
              {changeEmail && <>
                <ChangeUseremail inputRefs={inputRefs} currentValue={currentUser.email} onCancel={() => {
                  setChangeEmail(value => !value)
                }} updateUseremail={updateUseremail} />
              </>}
            </SectionContainer>
          </ContentContainer>
        </Container>
      </ThemeProvider>
    }
  </>
}

Settings.displayName = "Settings";


//export default withToast()(Settings);
export default Settings;
