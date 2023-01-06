import React, { useState, forwardRef, useEffect, useCallback } from "react";
//import { Text, Box, useTheme } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";
import { useToast } from "@blend-ui/toast";


import bxKey from "@iconify/icons-bx/bx-key";
//import { useStore } from "../stores/PrifinaStore";

import { onlyDigitChars, } from "@prifina-apps/utils";

//import config from "../config";

import PropTypes from "prop-types";


const VerificationField = forwardRef(
  ({ options, inputState, initState = true, ...props }, ref) => {


    // console.log("OPTIONS ", options, inputState, ref.current?.dataset, initState)

    //const checkCognitoAttributeQuery = useStore(state => state.checkCognitoAttributeQuery);
    const alerts = useToast();
    //const [isValid, setIsValid] = useState(true);

    // const [isCode, setIsCode] = inputState;
    const [isValid, setIsValid] = useState(initState)

    // possibly dynamic change of messages
    const [promptTxt, setPromptTxt] = useState(options.txt.promptTxt);
    const [invalidTxt, setInvalidTxt] = useState(options.txt.invalidTxt);

    const [verificationCode, setVerificationCode] = useState("")

    /*
    useEffect(() => {
      //inputState(isPhoneNumber.current);
      console.log("UPDATE ", isValid, ref.current);
      if (ref?.current) {
        inputState(ref.current)
      }
    }, [isValid]);
    */


    // weird,... initState update didn't trigger component render... 
    useEffect(() => {

      if (initState !== isValid) {
        //   console.log("SET IS VALID ", initState);
        setIsValid(initState);
      }

    }, [initState]);

    const handleChange = (e) => {
      const entry = e.target.value;
      if (checkInput(entry) || entry.length === 0) {
        setVerificationCode(entry);
      } else {
        // 
        ref.current.value = verificationCode;
        e.preventDefault();
      }

      /*
      if (checkInput(entry, false) && entry.length < 6) {
        setVerificationCode(entry);
      } else if (checkInput(entry, false) && entry.length === 6) {
        updateCheckStatus(true, entry.length, true);
      } else if (entry.length > 6) {
        updateCheckStatus(false, entry.length, true);
      }
*/

    }

    const codeAlert = (errorMsg) => {
      //console.log("ALERTS ", errorMsg, alerts.check());
      if (errorMsg !== "" && !alerts.check().some(alert => alert.message === errorMsg)) {
        alerts.error(errorMsg, {});
      }
    };

    const updateCheckStatus = (codeState, codeLength, checkLength) => {

      //console.log(codeState, codeLength, checkLength);

      let userMsg = "";

      if ((codeLength === 6 && !codeState) || (codeLength > 0 && checkLength && !codeState)) {
        userMsg = options.txt["codeDigitsError"];
      }
      if (codeLength > 1 && !checkLength) {
        userMsg = options.txt["codeLengthError"];
      }

      if (!options.toast && userMsg !== "") {
        setInvalidTxt(userMsg);
        if (!isValid) {
          inputState(ref.current);
        }
        setIsValid(false);
        ref.current.focus();
      }
      if (options.toast && userMsg !== "") {
        setInvalidTxt(userMsg);
        codeAlert(userMsg);
        if (!isValid) {
          inputState(ref.current);
        }
        setIsValid(false);
        ref.current.focus();
      }
      if (codeLength === 0) {
        setInvalidTxt("");
        if (isValid) {
          inputState(ref.current);
        }
        setIsValid(true);
        ref.current.focus();
      }
      if (codeState) {
        setIsValid(true);
        //if (codeLength === 6) {
        if ((verificationCode.length === 6 && codeLength >= 6) || (verificationCode.length < codeLength && codeLength === 6)) {
          //console.log("IS CODE ", verificationCode.length, codeLength);
          //setIsCode(true);
          //if (isValid) {
          inputState(ref.current);
          //}
          setIsValid(true);
        } else {
          //setIsCode(false);
          if (!isValid) {
            inputState(ref.current);
          }
          setIsValid(false);
        }
      }
    }

    const checkInput = (codeInput) => {
      const code = typeof codeInput === "string" ? codeInput : ref.current.value;

      const checkResult = onlyDigitChars(code);

      const checkLength = (code.length <= 6)

      //console.log("CHECK ", codeInput, code, checkResult);

      /*
      if (checkResult && !isValid) {
        setIsValid(true);
      } 
      */
      updateCheckStatus(checkResult, code.length, checkLength);

      return checkResult && checkLength;
    };


    return <>
      <IconField width={"200px"}>
        <IconField.LeftIcon
          iconify={bxKey}
          color={"componentPrimary"}
          size={"17"}
        />
        <IconField.InputField
          placeholder={promptTxt}
          data-isvalid={isValid}
          data-testid="verificationCode"
          id={"verificationCode"}
          name={"verificationCode"}
          onChange={handleChange}
          onBlur={checkInput}
          onKeyDown={e => {
            if (e.key === "Enter") {
              checkInput();
            }
          }}
          ref={ref}

          errorMsg={!options.toast ? invalidTxt : '\u00a0'}
          error={!isValid && verificationCode.length > 0}
          promptMsg={promptTxt}

          defaultValue={options.value}
          {...props}
        />
      </IconField>
    </>
  });


VerificationField.displayName = "VerificationField";

VerificationField.propTypes = {
  options: PropTypes.object.isRequired,
  inputState: PropTypes.func,
  initState: PropTypes.bool

};

export default VerificationField;