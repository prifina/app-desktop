import React, { useState, useRef } from "react";
import { Box, Flex, Button, Text, IconField } from "@blend-ui/core";

import bxKey from "@iconify/icons-bx/bx-key";
import { ReactComponent as Phone } from "../assets/phone.svg";

import ProgressContainer from "../components/ProgressContainer";
import { useFormFields } from "../lib/formFields";

import { onlyDigitChars } from "../lib/utils";
import { UseFocus } from "../lib/componentUtils";

import i18n from "../lib/i18n";
i18n.init();

const PhoneVerification = (props) => {
  const [fields, _handleChange] = useFormFields({
    verificationCode: "",
  });
  const [inputCode, setInputCodeFocus] = UseFocus();
  const [inputError, setInputError] = useState({ status: false, msg: "" });

  const checkInput = (code) => {
    const checkResult = onlyDigitChars(code);
    //console.log(checkResult);
    let validCode = true;
    if (!checkResult) {
      setInputError({ status: true, msg: i18n.__("codeDigitsError") });
      validCode = false;
    }
    if (code.length > 1 && code.length !== 6) {
      setInputError({ status: true, msg: i18n.__("codeLengthError") });
      validCode = false;
    }
    if (validCode) {
      setInputError({ status: false, msg: "" });
    }
  };
  return (
    <ProgressContainer title={i18n.__("verificationTitle")} progress={100}>
      <Box mt={47}>
        <Box display={"inline-flex"}>
          <Box>
            <Phone height={"135px"} width={"68px"} />
          </Box>
          <Box ml={48}>
            <Box>
              <Text textStyle={"h6"}>{i18n.__("phoneVerificationTitle")}</Text>
            </Box>
            <Box mt={5}>
              <Text textStyle={"caption2"} as={"p"} m={0}>
                {i18n.__("phoneVerificationText")}
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
                  id={"verificationCode"}
                  name={"verificationCode"}
                  onChange={(e) => {
                    _handleChange(e);
                    checkInput(e.target.value);
                  }}
                  errorMsg={inputError.msg}
                  error={inputError.status}
                  ref={inputCode}
                />
              </IconField>
            </Box>
            <Box mt={inputError.status ? 0 : 3} display={"inline-flex"}>
              <Flex alignItems={"center"}>
                <Text textStyle={"caption2"}>{i18n.__("codeMissing")}</Text>
                <Button variation={"link"} fontSize={"xxs"}>
                  {i18n.__("sendAgainLinkText")}
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={inputError.status ? 54 : 84} display={"inline-flex"}>
        <Flex>
          <Button variation={"outline"}>{i18n.__("backButton")}</Button>
        </Flex>
        <Flex ml={99}>
          <Button
            disabled={inputError.status || fields.verificationCode.length !== 6}
          >
            {i18n.__("verifyButton")}
          </Button>
        </Flex>
      </Box>
    </ProgressContainer>
  );
};

export default PhoneVerification;
