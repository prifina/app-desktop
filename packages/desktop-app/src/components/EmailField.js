import React, { useState, forwardRef, useEffect } from "react";
//import { Text, Box, useTheme } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";
import { useToast } from "@blend-ui/toast";

import bxEnvelope from "@iconify/icons-bx/bx-envelope";

//import styled from "styled-components";
//import shallow from 'zustand/shallow'
import { useStore } from "../stores/PrifinaStore";
import { validEmail, } from "@prifina-apps/utils";
import PropTypes from "prop-types";



const EmailField = forwardRef(
  ({ options, inputState, ...props }, ref) => {


    console.log("OPTIONS ", options)

    /*
    const { checkCognitoAttributeQuery } = useStore(
      (state) => ({ checkCognitoAttributeQuery: state.checkCognitoAttributeQuery, }),
      shallow
    );
    */
    const checkCognitoAttributeQuery = useStore(state => state.checkCognitoAttributeQuery);


    //console.log("STORE ", checkCognitoAttributeQuery);
    const alerts = useToast();
    const [isValid, setIsValid] = useState(true);
    // possibly dynamic change of messages
    const [promptTxt, setPromptTxt] = useState(options.promptTxt);
    const [invalidTxt, setInvalidTxt] = useState(options.invalidTxt);


    useEffect(() => {
      //inputState(isPhoneNumber.current);
      console.log("UPDATE ", isValid, ref.current);
      if (ref?.current) {
        inputState(ref.current)
      }
    }, [isValid]);


    const checkEmailAttr = email => {
      //console.log("CHECKING EMAIL ", email);
      return checkCognitoAttributeQuery(
        "email",
        email
      );
    };
    const emailAlert = (errorMsg) => {
      if (!alerts.check().some(alert => alert.message === errorMsg)) {
        alerts.error(errorMsg, {});
      }
    };

    const updateCheckStatus = (emailState) => {
      if (!options.toast && !emailState) {
        if (!isValid) {
          inputState(ref.current);
        }
        setIsValid(false);
        ref.current.focus();
      }
      if (options.toast && !emailState) {
        emailAlert(options.invalidTxt);
        if (!isValid) {
          inputState(ref.current);
        }
        setIsValid(false);
        ref.current.focus();
      }
    }
    const checkEmail = (e) => {
      const email = ref.current.value;
      let emailState = validEmail(email);
      console.log("EMAIL ", email, emailState);

      if (emailState && !isValid && !options.checkExists) {
        if (isValid) {
          inputState(ref.current);
        }
        setIsValid(true);
      } else if (email.length === 0) {
        if (isValid) {
          inputState(ref.current);
        }
        setIsValid(true);
      } else if (emailState && !isValid && options.checkExists) {
        checkEmailAttr(email).then(res => {
          updateCheckStatus(!res);
        })
      } else if (emailState && isValid && options.checkExists) {
        checkEmailAttr(email).then(res => {
          updateCheckStatus(!res);
        })
      } else {
        updateCheckStatus(emailState);
      }

      e.preventDefault();
      return false
    };


    return <>
      <IconField>
        <IconField.LeftIcon
          iconify={bxEnvelope}
          color={"componentPrimary"}
          size={"17"}
        />
        <IconField.InputField
          {...props}
          data-isvalid={isValid}
          data-testid="email"
          placeholder={options.placeholderTxt}
          id={"email"}
          name={"email"}
          promptMsg={promptTxt}
          errorMsg={!options.toast ? invalidTxt : ""}
          error={!isValid}
          ref={ref}
          onBlur={checkEmail}
          defaultValue={options.value}
          onKeyDown={e => {
            if (e.key === "Enter") {
              checkEmail(e);
            }
          }}
        />
      </IconField>
    </>
  });


EmailField.displayName = "EmailField";

EmailField.propTypes = {
  options: PropTypes.object.isRequired,
  inputState: PropTypes.func

};

export default EmailField;