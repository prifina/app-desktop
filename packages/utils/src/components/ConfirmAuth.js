import React, { useState } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";

import bxKey from "@iconify/icons-bx/bx-key";
import { PhoneIcon } from "./assets/phone";

//import { useHistory } from "react-router-dom";

import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useToast } from "@blend-ui/toast";

import { i18n, useFormFields, useFocus, onlyDigitChars } from "../";

import PropTypes from "prop-types";

i18n.init();

const ConfirmAuth = ({ backButton, authOptions, ...props }) => {
  //const history = useHistory();

  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const alerts = useToast();

  const { colors } = useTheme();


  const searchKeys = new URLSearchParams(search);

  const appDebug =
    process.env.REACT_APP_DEBUG === "true" && searchKeys.get("debug") === "true"
  //history.location.search === "?debug=true";
  console.log("APP DEBUG ", appDebug);
  /*
  const appDebug =
    process.env.REACT_APP_DEBUG === "true" &&
    history.location.search === "?debug=true";
  console.log("APP DEBUG ", appDebug);
*/
  const [confirmationFields, handleChange] = useFormFields({
    confirmationCode: "",
  });
  const [inputCode, setInputCodeFocus] = useFocus();
  const [inputError, setInputError] = useState({ status: false, msg: "" });

  const checkInput = code => {
    const checkResult = onlyDigitChars(code);

    let validCode = true;
    if (!checkResult) {
      setInputError({ status: true, msg: i18n.__("codeDigitsError") });

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
      navigate("/home", { replace: true })
      //history.replace("/home");
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
    }
  };
  return (
    <>
      <Box width="100%">
        <Text mb={55} textStyle="h3">
          Secure login
        </Text>
        <Box display={"inline-flex"}>
          <Box>
            <PhoneIcon height={"135px"} width={"68px"} />
          </Box>
          <Box ml={24}>
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
        <Flex
          mt={inputError.status ? 83 : 84}
          flexDirection="column"
          alignItems="center"
        >
          <Flex width="100%" justifyContent="space-between">
            <Button variation={"outline"} onClick={backButton}>
              Cancel
            </Button>

            <Button
              disabled={
                inputError.status ||
                confirmationFields.confirmationCode.length !== 6
              }
              onClick={confirmClick}
            >
              Verify
            </Button>
          </Flex>
          <Flex alignItems="baseline" mt={10}>
            <Text mr={3} fontSize="xs" textAlign="center">
              Didn’t receive the code?
            </Text>
            <Button
              className="createAccountButton"
              id="createAccountButton"
              color={colors.textLink}
              variation="link"
            // onClick={createAccountClick}
            >
              Send another code
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

ConfirmAuth.propTypes = {
  backButton: PropTypes.func.isRequired,
  authOptions: PropTypes.instanceOf(Object).isRequired,
};
export default ConfirmAuth;
