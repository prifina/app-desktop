/* eslint-disable react/forbid-prop-types */
import React, { useState } from "react";
import { Box, Flex, Button, Text, IconField } from "@blend-ui/core";

import bxKey from "@iconify/icons-bx/bx-key";
import { ReactComponent as Phone } from "../assets/phone.svg";

import ProgressContainer from "../components/ProgressContainer";
//import { useFormFields } from "../lib/formFields";

//import { onlyDigitChars } from "../lib/utils";

//import { useFocus } from "../lib/componentUtils";
import { useHistory } from "react-router-dom";
import { useToast } from "@blend-ui/toast";
//import i18n from "../lib/i18n";
import {
  i18n,
  useFormFields,
  useFocus,
  onlyDigitChars,
} from "@prifina-apps/utils";

import PropTypes from "prop-types";

i18n.init();

const ConfirmAuth = ({ backButton, authOptions, ...props }) => {
  const history = useHistory();
  const alerts = useToast();
  //console.log("TOAST ", alerts);
  const appDebug =
    process.env.REACT_APP_DEBUG === "true" &&
    history.location.search === "?debug=true";
  console.log("APP DEBUG ", appDebug);

  const [confirmationFields, handleChange] = useFormFields({
    confirmationCode: "",
  });
  const [inputCode, setInputCodeFocus] = useFocus();
  const [inputError, setInputError] = useState({ status: false, msg: "" });

  const checkInput = code => {
    const checkResult = onlyDigitChars(code);
    //console.log(checkResult);
    let validCode = true;
    if (!checkResult) {
      setInputError({ status: true, msg: i18n.__("codeDigitsError") });
      //alerts.error(i18n.__("codeDigitsError"), {});
      const errorMsg = i18n.__("codeDigitsError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      validCode = false;
    }
    if (code.length > 1 && code.length !== 6) {
      setInputError({ status: true, msg: i18n.__("codeLengthError") });
      //alerts.error(i18n.__("codeLengthError"), {});
      const errorMsg = i18n.__("codeLengthError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      validCode = false;
    }
    if (validCode) {
      setInputError({ status: false, msg: "" });
    }
  };
  const confirmClick = async e => {
    try {
      const loggedUser = await authOptions.Auth.confirmSignIn(
        authOptions.user,
        confirmationFields.confirmationCode,
        "SMS_MFA",
      );

      console.log("CONFIRM ", loggedUser);
      if (appDebug) {
        const mfa = await authOptions.Auth.setPreferredMFA(loggedUser, "NOMFA");
        console.log("MFA ", mfa);
      }

      history.replace("/home");
      authOptions.setAuth(true);
    } catch (e) {
      console.log("ERR", e);
      if (e.code === "CodeMismatchException") {
        setInputError({ status: true, msg: i18n.__("invalidCode") });
        //alerts.error(i18n.__("invalidCode"), {});
        const errorMsg = i18n.__("invalidCode");
        if (!alerts.check().some(alert => alert.message === errorMsg))
          alerts.error(errorMsg, {});
      }

      /*
      code: "CodeMismatchException"
message: "Invalid code or auth state for the user."
name: "CodeMismatchException"
*/
    }
  };
  // 86 ,114
  return (
    <ProgressContainer title={i18n.__("confirmTitle")} progress={100}>
      <Box mt={47}>
        <Box display={"inline-flex"}>
          <Box>
            <Phone height={"135px"} width={"68px"} />
          </Box>
          <Box ml={48}>
            <Box>
              <Text textStyle={"h6"}>{i18n.__("authConfirmTitle")}</Text>
            </Box>
            <Box mt={5}>
              <Text textStyle={"caption2"} as={"p"} m={0}>
                {i18n.__("authConfirmationText")}
              </Text>
            </Box>
            <Box mt={15}>
              <IconField width={"200px"}>
                <IconField.LeftIcon
                  iconify={bxKey}
                  color={"componentPrimary"}
                  size={"17"}
                />
                <IconField.InputField
                  placeholder={i18n.__("codePropmt")}
                  id={"confirmationCode"}
                  name={"confirmationCode"}
                  onChange={handleChange}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      checkInput(confirmationFields.confirmationCode);
                    }
                  }}
                  //errorMsg={inputError.msg}
                  //error={inputError.status}
                  ref={inputCode}
                />
              </IconField>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={inputError.status ? 83 : 84} display={"inline-flex"}>
        <Flex>
          <Button variation={"outline"} onClick={backButton}>
            {i18n.__("backButton")}
          </Button>
        </Flex>
        <Flex ml={99}>
          <Button
            disabled={
              inputError.status ||
              confirmationFields.confirmationCode.length !== 6
            }
            onClick={confirmClick}
          >
            {i18n.__("confirmButton")}
          </Button>
        </Flex>
      </Box>
    </ProgressContainer>
  );
};

ConfirmAuth.propTypes = {
  backButton: PropTypes.func.isRequired,
  authOptions: PropTypes.object.isRequired,
};
export default ConfirmAuth;
