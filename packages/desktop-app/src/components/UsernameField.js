import React, { useState, forwardRef, useEffect } from "react";
//import { Text, Box, useTheme } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";
import { useToast } from "@blend-ui/toast";

import bxUser from "@iconify/icons-bx/bx-user";
//import { useStore } from "../stores/PrifinaStore";

import { useStore } from "../utils-v2/stores/PrifinaStore";
import { validUsername, } from "@prifina-apps/utils";

import config from "../config";

import PropTypes from "prop-types";


const UsernameField = forwardRef(
  ({ options, inputState, initState = true, ...props }, ref) => {


    console.log("OPTIONS ", options)

    const checkCognitoAttributeQuery = useStore(state => state.checkCognitoAttributeQuery);

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

    const checkUsernameAttr = username => {
      console.log("CHECKING ", username);
      //console.log("CHECK RES ", res.data.checkCognitoAttribute);
      return new Promise(function (resolve, reject) {
        checkCognitoAttributeQuery("username", username).then(res => {
          resolve(res.data.checkCognitoAttribute)
        }).catch((err) => {
          reject(err);
        });
      });

    };
    const usernameAlert = (errorMsg) => {
      if (!alerts.check().some(alert => alert.message === errorMsg)) {
        alerts.error(errorMsg, {});
      }
    };

    const updateCheckStatus = (userState, userError) => {

      console.log(userState, userError, userError === "EXISTS", options.txt);


      let userMsg = options.txt.invalidTxt;
      if (userError === "LENGTH") {
        userMsg = options.txt["usernameError"];
      }
      if (userError === "SPACES") {
        userMsg = options.txt["usernameError2"];
      }

      if (userError === "EXISTS") {
        userMsg = options.txt["usernameExists"];
      }

      if (!options.toast && !userState) {
        setInvalidTxt(userMsg);
        if (!isValid) {
          inputState(ref.current);
        }
        setIsValid(false);
        ref.current.focus();
      }
      if (options.toast && !userState) {
        setInvalidTxt(userMsg);
        usernameAlert(userMsg);
        if (!isValid) {
          inputState(ref.current);
        }
        setIsValid(false);
        ref.current.focus();
      }
    }

    const checkUsername = (e) => {
      const username = ref.current.value;

      let userError = validUsername(username, config.usernameLength);
      //console.log("CHECK ", username, userError, userError.length, isValid, options.checkExists, ref);

      let userState = userError.length === 0;
      //console.log("USER ", username, userState,);
      //console.log("USER ERROR ", typeof userError, userError, userError !== "", userError.length);

      if (userState && !isValid && !options.checkExists) {
        //console.log("SET VALID:...", isValid, ref.current);
        if (isValid) {
          inputState(ref.current);
        }
        setIsValid(true);
      } else if (username.length === 0) {
        if (isValid) {
          inputState(ref.current);
        }
        setIsValid(true);

      } else if (userState && !isValid && options.checkExists) {
        checkUsernameAttr(username).then(res => {
          updateCheckStatus(!res, "EXISTS");
        })
      } else if (userState && isValid && options.checkExists) {
        checkUsernameAttr(username).then(res => {
          // console.log("CHECK RES ", res);
          updateCheckStatus(!res, res ? "EXISTS" : userError);
        })
      } else {
        //console.log("ELSE :...", isValid, username, userState, ref.current);
        updateCheckStatus(userState, userError);
      }

      e.preventDefault();
      return false
    };


    return <>
      <IconField>
        <IconField.LeftIcon
          iconify={bxUser}
          color={"componentPrimary"}
          size={"17"}
        />
        <IconField.InputField
          {...props}
          data-isvalid={isValid}
          data-testid="username"
          placeholder={options.txt.placeholderTxt}
          promptMsg={promptTxt}
          errorMsg={!options.toast ? invalidTxt : '\u00a0'}
          error={!isValid}
          ref={ref}
          onBlur={checkUsername}
          defaultValue={options.value}
          onKeyDown={e => {
            if (e.key === "Enter") {
              checkUsername(e);
            }
          }}
        />
      </IconField>

    </>
  });


UsernameField.displayName = "UsernameField";

UsernameField.propTypes = {
  options: PropTypes.object.isRequired,

  inputState: PropTypes.func,
  initState: PropTypes.bool
};

export default UsernameField;