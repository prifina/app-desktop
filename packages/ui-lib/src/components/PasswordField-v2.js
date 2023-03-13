import React, { useState, forwardRef, useEffect, useRef } from "react";
import { Box } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";
//import { useToast } from "@blend-ui/toast";

import { useToast } from "@prifina-apps/ui-lib";


import { default as eyeIcon } from "@iconify/icons-bx/bx-show";
import bxLockAlt from "@iconify/icons-bx/bx-lock-alt";
import bxHide from "@iconify/icons-bx/bx-hide";

import { checkPassword } from "@prifina-apps/utils";

//import { checkPassword } from "../lib/utils";

import usePasswordPopup from "./usePasswordPopup";
import config from "../config";

import PropTypes from "prop-types";


const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

const PasswordField = forwardRef(
  ({ options, inputState, initState = true, backGroundColor, ...props }, ref) => {


    //({ placeholder, addPopper = false, verifications = [], ...props }, ref) => {

    // console.log("OPTIONS ", options, inputState)

    const alerts = useToast();

    const [passwordVerification, setPasswordVerification] = useState([
      false,
      false,
      false,
      false,
    ]);

    const { reference, TooltipComponent } = usePasswordPopup({ verifications: passwordVerification, backGroundColor: backGroundColor });

    const [referenceElement, setReferenceElement] = useState(ref);
    const [hidePassword, setHidePassword] = useState(true);

    //const [isPassword, setIsPassword] = inputState;
    const [isValid, setIsValid] = useState(initState)

    // possibly dynamic change of messages
    const [promptTxt, setPromptTxt] = useState(options.txt.promptTxt);
    const [invalidTxt, setInvalidTxt] = useState(options.txt.invalidTxt);

    const [password, setPassword] = useState("")
    const [showPopup, setShowPopup] = useState(false);
    /*
    useEffect(() => {
      //inputState(isPhoneNumber.current);
      console.log("UPDATE ", isValid, ref.current);
      if (ref?.current) {
        inputState(ref.current)
      }
    }, [isValid]);
    */

    useEffect(() => {

      if (initState !== isValid) {

        setIsValid(initState);
      }

    }, [initState]);

    const onHide = e => {
      e.preventDefault();
      setShowPopup(true);
      setHidePassword(!hidePassword);
    };

    const handleChange = (e) => {
      const entry = e.target.value;
      passwordCheck(entry);
      setPassword(entry);
    }


    const passwordAlert = (errorMsg) => {
      //console.log("ALERTS ", errorMsg, alerts.check());
      if (errorMsg !== "" && !alerts.check().some(alert => alert.message === errorMsg)) {
        alerts.error(errorMsg, {});
      }
    };

    const passwordCheck = (passwordInput, showAlert = false) => {
      //console.log("REF ", reference, referenceElement.value)
      const password = typeof passwordInput === "string" ? passwordInput : referenceElement.value;
      //const password = typeof passwordInput === "string" ? passwordInput : "";
      let invalidPasswordStatus = false;
      let invalidPassword = options.txt.passwordQuality;
      console.log("OPTIONS ", options);

      if (options?.accountPassword) {
        const comparePasswd = options.accountPassword();
        if ((password !== comparePasswd && comparePasswd.length === password.length) || password.length > comparePasswd.length) {
          invalidPasswordStatus = true;
        }
        // this is Enter & Blur check.... 
        if (!invalidPasswordStatus && showAlert && password.length < comparePasswd.length) {
          invalidPasswordStatus = true;
        }
        invalidPassword = options.txt.invalidEntry;

      } else {
        const passwordCheckResult = checkPassword(password, config.passwordLength, options.checkList());
        /*
     Contains at least {config.passwordLength} characters
     Contains both lower (a-z) and upper case letters (A-Z)
     Contains at least one number (0-9) and a symbol
     Does not contain your name or email address
     Is not commonly used
  */
        if (passwordCheckResult.length === 5) {
          passwordCheckResult.pop();
        }
        invalidPasswordStatus = passwordCheckResult.some((v, i) => {
          console.log("STEP ", v, i);
          return v === false;
        });

        setPasswordVerification(passwordCheckResult);
      }

      if (invalidPasswordStatus) {
        if (!isValid) {
          inputState(ref.current)
        }
        setIsValid(false);

        //setIsPassword(false);
        setReferenceElement(password);
        if (showAlert && options.toast) {
          passwordAlert(invalidPassword);
        }
        if (showAlert && !options.toast) {
          setInvalidTxt(invalidPassword);
        }
        ref.current = referenceElement;
        //setInvalidTxt(options.txt.passwordQuality);
      } else {
        ref.current = referenceElement;
        if (isValid) {
          inputState(ref.current)
        }
        setIsValid(true)
      }

      return !invalidPasswordStatus
    };

    return <>
      <div onBlur={(e) => {
        if (e.target?.id && e.target.id === "hide-icon") {
          setShowPopup(false);
        }
      }} tabIndex="0">
        <IconField onClick={onHide}  >
          <IconField.LeftIcon
            iconify={bxLockAlt}
            color={"componentPrimary"}
            size={"17"}
          />
          <IconField.InputField
            type={hidePassword ? "password" : "text"}
            placeholder={options.txt.placeholderTxt}
            data-isvalid={isValid}
            data-testid="password"
            /*  id and name  in props... */
            {...props}
            ref={mergeRefs(setReferenceElement, reference)}
            /* ref={reference} */
            onChange={handleChange}
            onBlur={(e) => {
              //console.log("BLUR", e.relatedTarget)
              passwordCheck(false, true);
              if (e.relatedTarget === null || e.relatedTarget.id !== "hide-icon") {
                setShowPopup(false);
              }
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (passwordCheck(false, true)) {
                  setShowPopup(false);
                }
              }
            }}
            promptMsg={!options.toast ? promptTxt : ""}
            errorMsg={!options.toast ? invalidTxt : ""}
            error={!isValid && password.length > 0}
            onFocus={() => {
              setShowPopup(true);
            }}
          />
          <Box
            display={"inline-flex"}
            onClick={onHide}
            className={"PasswordRightIcon"}
            role="hide-icon"
            tabIndex="0"  // otherwise onBlur relatedTarget is null
            id="hide-icon"
          >

            <IconField.RightIcon
              iconify={hidePassword ? bxHide : eyeIcon}
              color={"componentPrimary"}
              size={"17"}
              className={hidePassword ? "EyeIcon" : "HideIcon"}
            />

          </Box>
        </IconField>
      </div>
      {options.addPopup && showPopup && TooltipComponent}
    </>
  });


PasswordField.displayName = "PasswordField";

PasswordField.propTypes = {
  options: PropTypes.object.isRequired,
  inputState: PropTypes.func,
  initState: PropTypes.bool

};

export default PasswordField;