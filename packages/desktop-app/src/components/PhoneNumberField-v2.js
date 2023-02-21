import React, { useState, useReducer, useEffect, useRef, forwardRef } from "react";

import { SearchSelect } from "@blend-ui/search-select";
import { BlendIcon } from "@blend-ui/icons";

import { Input, Text, Box, useTheme } from "@blend-ui/core";

import { useToast } from "@blend-ui/toast";
import styled from "styled-components";
import { space } from "styled-system";
import bxPhone from "@iconify/icons-bx/bx-phone";

import { isValidNumber, onlyDigitChars } from "../lib/utils";

import shallow from 'zustand/shallow';
import { useStore } from "../stores/PrifinaStore";
//import { useStore } from "../stores/PrifinaStore";
import PropTypes from "prop-types";

const StyledBox = styled("div")`
  ${space}
  /* remove flex and safari works....  */ 
  display: flex;
  opacity: 0.999;

  height: ${props =>
    props.height
      ? props.height
      : props.theme.componentStyles.input.base.height};

  background-color: #f5f8f7;

  /*
      background-color: ${props =>
    props.disabled
      ? props.theme.colors.text.muted
      : props.theme.componentStyles.input.base.backgroundColor ||
      "transparent"};
            */
  border: ${props =>
    typeof props.borders !== "undefined"
      ? props.borders
      : props.errorinput
        ? props.theme.borders.input.error
        : props.theme.componentStyles.input.base.border};
  border-radius: ${props =>
    typeof props.borderRadius !== "undefined"
      ? props.borderRadius
      : props.theme.componentStyles.input.base.borderRadius};

  &:focus,
  &:not([disabled]):hover {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: ${props => props.theme.borders.input.active};
  }

  /*
  &:disabled {
    background: ${props => props.theme.colors.text.muted};
    border: ${props => props.theme.borders.input.disabled};
     pointer-events: none; 
  }
  
  &:invalid {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: props.theme.borders.input.error};
  }
  */
`;

const LeftIcon = styled(props => {
  const { disabled, inputError, ...rest } = props;
  const theme = useTheme();

  return (
    <BlendIcon
      {...rest}
      fill={disabled ? theme.colors.baseMuted : "transparent"}
      color={
        inputError
          ? theme.colors.baseError
          : props.color || theme.colors.baseSecondary
      }
      theme={theme}
      style={{
        marginLeft: theme.sizeOptions[10],
        marginRight: theme.sizeOptions[10],
      }}
    />
  );
})`
  flex: none;
  align-self: center;
  pointer-events: none;
  position: relative;
`;

const PhoneNumberField = forwardRef(
  ({
    options,
    selectOptions,
    disabled, inputState, initState = true, ...props }, ref) => {

    console.log("PHONE OPTIONS ", options, selectOptions);

    const { checkCognitoAttributeQuery } = useStore((state) => ({ checkCognitoAttributeQuery: state.checkCognitoAttributeQuery }),
      shallow
    );

    //const checkCognitoAttributeQuery = useStore(state => state.checkCognitoAttributeQuery);

    const boxRef = useRef();
    const theme = useTheme();
    const alerts = useToast();
    const selectRef = useRef();
    const [inputError, setInputError] = useState(!initState);
    const isPhoneNumber = useRef({});

    // const [isPhoneNumber, setIsPhoneNumber] = inputState;
    // const setIsPhoneNumber = inputState;
    /*
    useEffect(() => {
      console.log("RENDER....");
      setIsPhoneNumber({ test: "OK" });
    })
    */
    //setIsPhoneNumber({ test: "OK" });
    //console.log("STATES INIT ", inputState, setIsPhoneNumber);

    //const [isValid, setIsValid] = useState(true)

    const [phoneNumber, setPhoneNumber] = useState("");

    const [promptTxt, setPromptTxt] = useState(options.txt.promptTxt);
    const [invalidTxt, setInvalidTxt] = useState(options.txt.invalidTxt);
    //const [showOptions, setShowOptions] = useState(false);
    /*
        useEffect(() => {
          console.log("UPDATE ", inputError);
          ref.current.dataset['isvalid'] = !inputError;
          inputState(isPhoneNumber.current);
        }, [inputError])
    */
    useEffect(() => {

      if (!initState !== inputError) {
        console.log("NEW INIT STATE", initState, isPhoneNumber.current);
        inputState(isPhoneNumber.current);
        setInputError(!initState);
      }

    }, [initState]);

    const selectOnChange = (e, code) => {
      console.log("CODE ", code);
      ref.current.value = code;
      ref.current.focus();
      setPhoneNumber(code);
      //console.log("REF ", ref)
    }
    /*
    const validatePhoneNumberRegex = /^\+?[1-9][0-9]{7,14}$/;
    validatePhoneNumberRegex.test('+12223334444'); // Returns true
    */


    /*
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
      */


    //console.log("FLAGS ", selectOptions);
    //console.log(isValidNumber("+35804007077102"))
    const handleChange = (e) => {
      const entry = e.target.value;
      if (checkInput(entry) || entry.length === 0) {
        console.log("ENTRY OK ", entry);
        setPhoneNumber(entry);
      } else {
        // 
        ref.current.value = phoneNumber;
        e.preventDefault();
      }
    }

    const checkPhoneNumberAttr = phoneNum => {
      console.log("CHECKING ", phoneNum);
      return new Promise(function (resolve, reject) {
        checkCognitoAttributeQuery("phone_number", phoneNum).then(res => {
          resolve(res.data.checkCognitoAttribute)
        }).catch((err) => {
          reject(err);
        });
      });

      /*
      return checkCognitoAttributeQuery(
        "phone_number",
        phoneNum
      );
      */
    };

    const phoneAlert = (errorMsg) => {
      //console.log("ALERTS ", errorMsg, alerts.check());
      if (errorMsg !== "" && !alerts.check().some(alert => alert.message === errorMsg)) {
        alerts.error(errorMsg, {});
      }
    };
    const updateCheckStatus = (status) => {
      if (status) {
        setInputError(true);
        setInvalidTxt(options.txt.invalidTxt);
        inputState(isPhoneNumber.current);
        ref.current.focus();
        if (options.toast) {
          phoneAlert(options.txt.invalidTxt);
        }
      } else {
        //setInputError(false);
        //inputState(isPhoneNumber.current);
      }
    }
    const checkInput = (phoneInput, checkIsValidNumber = false) => {
      let phone = typeof phoneInput === "string" ? phoneInput : ref.current.value;

      console.log("INPUT CHECK ", phone, checkIsValidNumber, selectRef.current.value);
      if (!phone.startsWith("+") && selectRef.current.value !== "") {
        if (phone.startsWith("0")) {
          phone = phone.substr(1);
        }
        phone = selectRef.current.value + phone;
      }

      //const validatePhoneNumberRegex = /^\+?[1-9][0-9]{7,14}$/;
      //if (!validatePhoneNumberRegex.test(phone)) {
      let checkNumber = phone;
      if (phone.startsWith("+")) {
        checkNumber = phone.substr(1);
      }
      // allow only digits... 
      if ((checkNumber.length > 0 && !onlyDigitChars(checkNumber))) {
        isPhoneNumber.current = {};
        setInputError(true);
        setInvalidTxt(options.txt.invalidTxt);
        return false;
      } else if ((phone.length > 0 && checkIsValidNumber) || isPhoneNumber.current?.nationalNumber == undefined) {
        const checkResult = isValidNumber(phone);
        console.log("CHECK RES ", checkResult)
        let phoneState = Object.keys(checkResult).length > 0;
        if (!phoneState || checkResult.nationalNumber.length < 6) {
          console.log("CHECK ERRORS ", phoneState, phone, checkIsValidNumber);
          isPhoneNumber.current = checkResult;
          updateCheckStatus(true);
        } else {
          if (options.checkExists) {
            // checking if phone number exists.... 
            checkPhoneNumberAttr(phone).then(res => {
              //console.log("ATTR RES ", res);
              isPhoneNumber.current = checkResult;
              //if (inputError === res) {
              // if state has not changed... this is not triggered in useEffect
              inputState(isPhoneNumber.current);
              //}
              updateCheckStatus(res);
              if (!res) {
                //setIsPhoneNumber(checkResult);

              }
            });
          } else {
            console.log("NO ERRORS ", phone, checkIsValidNumber, checkResult);
            isPhoneNumber.current = checkResult;
            //if (!inputError) {
            // if state has not changed... this is not triggered in useEffect
            inputState(isPhoneNumber.current);
            //}
            setInputError(false);
            //setIsPhoneNumber(checkResult);

            setInvalidTxt("");

          }
        }

      } else {
        console.log("GOOD NUMBER....");
        inputState(isPhoneNumber.current);
        setInputError(false);
        setInvalidTxt("");
      }

      return true;
    }
    return <>

      <StyledBox
        disabled={disabled || null}
        errorinput={inputError ? 1 : undefined}
        ref={boxRef}
      >
        <LeftIcon iconify={bxPhone} color={"componentPrimary"} size={"17"} disabled={disabled} inputError={inputError} />

        <div
          style={{
            display: "inline-block",
            paddingTop: "2px",
          }}
        >
          <SearchSelect
            defaultValue={options.defaultRegion}
            options={selectOptions}
            showList={options.showList}
            searchLength={options.searchLength}
            size={"sm"}
            width={"60px"}
            maxHeight={"200px"}
            selectOption={options.selectOption}
            containerRef={boxRef}
            containerOffset={"-38px"}
            ref={selectRef}
            onChange={selectOnChange}
            data-testid="regioncode"
            id="region-select"
            name="region-select"
            tabIndex="0"
          />
        </div>

        <Input
          ref={ref}
          isIcon={true}
          borders={0}
          disabled={disabled || null}
          defaultValue={options.value}
          data-isvalid={!inputError}
          data-testid="phonenumber"
          {...props}
          paddingLeft={theme.sizeOptions[10]}
          paddingRight={theme.sizeOptions[10]}
          onChange={handleChange}
          onBlur={(e) => {
            //console.log("BLUR", e.relatedTarget)
            //console.log("BLUR", e.relatedTarget.firstChild.id)
            if (e.relatedTarget !== null && e.relatedTarget?.firstChild && e.relatedTarget.firstChild.id === "region-select") {
              console.log("REGION SELECT CLICKED:...");
              // ignore checking phonenumber...
            } else {
              const checkListStatus = document.querySelector('[data-select="open"]');
              if (checkListStatus) {
                console.log("ONBLUR EVENT CLOSE AUTOCOMPLETE ");
                e.stopPropagation();
                // close autocomplete options list.... 
                checkListStatus.click();
              }
              console.log("ONBLUR EVENT OK");
              //check phonenumber
              checkInput(false, true);

            }
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              checkInput(false, true);
            }
          }}
        />

      </StyledBox>
      {!options.toast && !invalidTxt !== "" && inputError && (
        <Box mt={0} mb={10}>
          <Text textStyle={"caption2"} color={theme.colors.baseError}>
            {invalidTxt}
          </Text>
        </Box>
      )}
      {promptTxt !== "" && !inputError && (
        <Box mt={0} mb={10}>
          <Text textStyle={"caption2"} color={theme.colors.baseSecondary}>
            {promptTxt}
          </Text>
        </Box>
      )}
    </>
  });

PhoneNumberField.propTypes = {
  disabled: PropTypes.bool,
  options: PropTypes.object,
  selectOptions: PropTypes.array,
  inputState: PropTypes.func,
  initState: PropTypes.bool
};

export default PhoneNumberField;