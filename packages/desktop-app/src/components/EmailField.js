import React, { useState, forwardRef, useEffect } from "react";
//import { Text, Box, useTheme } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";
import { useToast } from "@blend-ui/toast";

import bxEnvelope from "@iconify/icons-bx/bx-envelope";

//import styled from "styled-components";
//import shallow from 'zustand/shallow'
//import { useStore } from "../stores/PrifinaStore";

import shallow from 'zustand/shallow';
import { useStore } from "../stores/PrifinaStore";
import { validEmail, } from "../lib//utils";
import PropTypes from "prop-types";



const EmailField = forwardRef(
  ({ options, inputState, initState = true, ...props }, ref) => {


    console.log("OPTIONS ", options)

    /*
    const { checkCognitoAttributeQuery } = useStore(
      (state) => ({ checkCognitoAttributeQuery: state.checkCognitoAttributeQuery, }),
      shallow
    );
    */

    const { checkCognitoAttributeQuery } = useStore((state) => ({ checkCognitoAttributeQuery: state.checkCognitoAttributeQuery }),
      shallow
    );

    //  const checkCognitoAttributeQuery = useStore(state => state.checkCognitoAttributeQuery);


    //console.log("STORE ", checkCognitoAttributeQuery);
    const alerts = useToast();
    const [isValid, setIsValid] = useState(initState);
    // possibly dynamic change of messages
    const [promptTxt, setPromptTxt] = useState(options.txt.promptTxt);
    const [invalidTxt, setInvalidTxt] = useState(options.txt.invalidTxt);


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
        //   console.log("SET IS VALID ", initState);
        setIsValid(initState);
      }

    }, [initState]);


    const checkEmailAttr = email => {
      //console.log("CHECKING EMAIL ", email);
      return new Promise(function (resolve, reject) {
        checkCognitoAttributeQuery("email", email).then(res => {
          resolve(res.data.checkCognitoAttribute)
        }).catch((err) => {
          reject(err);
        });
      });
      /*
      return checkCognitoAttributeQuery(
        "email",
        email
      );
      */
    };
    const emailAlert = (errorMsg) => {
      if (!alerts.check().some(alert => alert.message === errorMsg)) {
        alerts.error(errorMsg, {});
      }
    };

    const updateCheckStatus = (emailState) => {
      console.log(emailState, options);

      if (!options.toast && !emailState) {
        if (!isValid) {
          inputState(ref.current);
        }
        setIsValid(false);
        ref.current.focus();
      }
      if (options.toast && !emailState) {
        emailAlert(invalidTxt);
        if (!isValid) {
          inputState(ref.current);
        }
        setIsValid(false);
        ref.current.focus();
      }
      if (options.toast && emailState) {

        emailAlert(invalidTxt);
        //if (!isValid) {
        inputState(ref.current);
        //}
        setIsValid(true);
      }
      if (!options.toast && emailState) {
        //console.log("REF ", ref);
        //if (!isValid) {
        inputState(ref.current);
        //}
        setIsValid(true);
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
        console.log("CHECK 1")
        checkEmailAttr(email).then(res => {
          updateCheckStatus(!res);
        })
      } else if (emailState && isValid && options.checkExists) {
        console.log("CHECK 2")
        checkEmailAttr(email).then(res => {
          updateCheckStatus(!res);
        })
      } else {
        console.log("CHECK 3")
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
          placeholder={options.txt.placeholderTxt}
          promptMsg={promptTxt}
          errorMsg={!options.toast ? invalidTxt : '\u00a0'}
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
  inputState: PropTypes.func,
  initState: PropTypes.bool

};

export default EmailField;