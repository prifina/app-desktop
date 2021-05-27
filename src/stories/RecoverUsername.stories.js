import React, { useState, useReducer, useEffect, useRef } from "react";

import config from "../config";

import { useFocus } from "../lib/componentUtils";

import { addRegionCode, isValidNumber } from "../lib/utils";
import {
  getCountryCodeQuery,
  checkCognitoAttributeQuery,
} from "../graphql/api";

import { BlendIcon } from "@blend-ui/icons";

import bxCheckCircle from "@iconify/icons-bx/bx-check-circle";

import i18n from "../lib/i18n";

import { Box, Flex, Button, Text } from "@blend-ui/core";
import { useToast } from "@blend-ui/toast";
import ProgressContainer from "../components/ProgressContainer";
import PhoneNumberField from "../components/PhoneNumberField";

import PhoneVerification from "../pages/PhoneVerification";

export default { title: "Recover Username" };

export const RecoverUsername = props => {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      phoneNumber: {
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

  const selectOptions = useRef([]);

  const [inputSelect, setSelectFocus] = useFocus();
  const [inputPhone, setInputPhoneFocus] = useFocus();

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

  //   const [loginFields, handleChange] = useFormFields({
  //     username: "",
  //     password: "",
  //     confirmationCode: "",
  //   });

  const [inputError, setInputError] = useState({ status: false, msg: "" });

  //----------------PHONE NUMBER------------------------------

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
      //let phoneNumber = addRegionCode(region, phone);
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

  //---------------------------------------------------------------------------
  useEffect(() => {
    async function onLoad() {
      try {
        selectOptions.current = countryList().map(cc => {
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

        const userCountry = await getCountryCodeQuery(API);
        console.log("COUNTRY ", userCountry.data.getCountryCode);
        if (userCountry.data) {
          const cIndex = selectOptions.current.findIndex(
            c => c.regionCode === userCountry.data.getCountryCode,
          );
          console.log("INDEX ", cIndex);
          if (cIndex > -1) {
            setState({ regionCode: selectOptions.current[cIndex].key });
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

  //------------------

  let stepProgress = 0;
  switch (step) {
    case 0:
      stepProgress = 50;
      break;
    case 1:
      stepProgress = 100;
      break;
    default:
      stepProgress = 50;
  }

  return (
    <React.Fragment>
      {/* {step === 4 && <Login />} */}
      {step === 0 && (
        <Box mt={120}>
          <ProgressContainer
            title={i18n.__("recoverUsernameTitle")}
            pr={19}
            minHeight={406}
            progress={stepProgress}
          >
            <Box mt={20}>
              <Text fontSize={16} textAlign={"center"}>
                {i18n.__("recoverUsernameText1")}
              </Text>
            </Box>
            <Box mt={55}>
              <PhoneNumberField>
                <PhoneNumberField.RegionField
                  key={state.regionCode}
                  defaultValue={state.regionCode}
                  options={selectOptions.current}
                  searchLength={2}
                  showList={false}
                  ref={inputSelect}
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
                    if (e.target.value.length > 4) {
                      setNextDisabled(false);
                    }
                  }}
                  promptMsg={
                    state.phoneNumber.valid ? i18n.__("phonePrompt") : ""
                  }
                  error={state.phoneNumber.status}
                  ref={inputPhone}
                  defaultValue={state.phoneNumber.value}
                  onBlur={e => {
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
                      const checkResult = checkPhone(
                        state.regionCode,
                        e.target.value,
                        true,
                      );
                      if (checkResult) {
                        setNextDisabled(false);
                      }
                    }
                  }}
                  tabIndex="6"
                />
              </PhoneNumberField>
            </Box>
            <Flex mt={28} justifyContent={"center"}>
              <Text textAlign={"center"} fontSize={10}>
                {i18n.__("useEmail")}
              </Text>
              <Button variation={"link"} size="xs" paddingLeft={5}>
                {i18n.__("sendAgainLinkText")}
              </Button>
            </Flex>
            <Box mt={45} mb={30} display={"inline-flex"}>
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
                  //   disabled={
                  //     usernameError.status ||
                  //     loginFields.username.length < config.usernameLength
                  //   }
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
            title={i18n.__("recoverUsernameTitle")}
            progress={50}
            pr={19}
            minHeight={406}
            progress={stepProgress}
          >
            <Box mt={20}>
              <Text fontSize={12} textAlign="center">
                {i18n.__("recoverUsernameText2")}
              </Text>
            </Box>
            <Box mt={50} display="flex" justifyContent="center">
              <BlendIcon iconify={bxCheckCircle} color="#00847A" size="89" />
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

RecoverUsername.story = {
  name: "Recover Username",
};
