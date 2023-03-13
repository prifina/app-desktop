import React, { useState, useRef } from "react";

import { Box, Flex, Button, Text, Link } from "@blend-ui/core";
import {
  useTranslate
} from "@prifina-apps/utils";

import Phone from "./assets/phone";

import VerificationField from "./VerificationField";

import PropTypes from "prop-types";



const initTexts = (t) => {
  return { "invalidTxt": t("invalidCode"), "codeLengthError": t("codeLengthError"), "codeDigitsError": t("codeDigitsError"), "placeholderTxt": t("codePrompt"), "promptTxt": '\u00a0' };
}
const ConfirmAuth = ({ backClick, verifyClick }) => {

  const { __ } = useTranslate();

  const inputRef = useRef();
  const verificationOptions = { toast: false, txt: {}, value: "", };

  verificationOptions.txt = Object.assign({}, initTexts(__));

  console.log("TRANSLATE ", __, verificationOptions);

  const [inputIsValid, setInputIsValid] = useState(false);
  //const inputState = [inputIsValid, setInputIsValid];

  const inputState = (input, validation = false) => {
    console.log("VERIFICATION STATUS ", input);
    console.log(input.value);
    console.log(input.dataset);
    console.log((inputRef.current));

    let isValid = true;
    if (inputRef.current.value.length !== 6) {
      isValid = false;
    } else if (inputRef.current.value.length === 6) {
      //isValid = true;
      isValid = validation ? input.dataset['isvalid'] === "true" : true;
    } else {
      isValid = input.dataset['isvalid'] === "true"
    }
    console.log("VERIFICATION STATUS ", isValid);
    setInputIsValid(isValid);

  }

  return (
    <>
      <Box mt={50}>
        <Box display={"inline-flex"}>
          <Box>
            <Phone style={{ heigh: "135px", width: "68px" }} />
          </Box>
          <Box ml={34}>
            <Box>
              <Text textStyle={"h6"}>
                {__("authConfirmTitle")}
              </Text>
            </Box>
            <Box mt={5}>
              <Text textStyle={"caption2"} as={"p"} m={0}>
                {__("authConfirmationText")}
              </Text>
            </Box>
            <Box mt={15}>
              <VerificationField ref={inputRef} initState={inputIsValid} options={verificationOptions} inputState={inputState} />
            </Box>

          </Box>
        </Box>
      </Box>

      <Box mt={80} display={"inline-flex"}>
        <Flex>
          <Button variation={"outline"} onClick={backClick} role={"back-click"}>
            {__("backButton")}
          </Button>
        </Flex>
        <Flex ml={99}>
          <Button
            disabled={!inputIsValid}
            onClick={async (e) => {
              const verified = await verifyClick(inputRef.current.value);
              console.log("VERIFYING ", verified);
              if (!verified) {
                //setInputIsValid(false);
                inputRef.current.dataset["isvalid"] = false;
                inputState(inputRef.current, true);
              }
              e.preventDefault()
            }}
            role={"verify-click"}
          >
            {__("confirmButton")}
          </Button>
        </Flex>
      </Box>
    </>
  );
}

export default ConfirmAuth;
