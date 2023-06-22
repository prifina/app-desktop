import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Button, Text, Link } from "@blend-ui/core";

//import { ReactComponent as Phone } from "../assets/phone.svg";
import Phone from "./assets/phone";



import { useTranslate, } from "@prifina-apps/utils";

//import useTranslate from "../lib/i18n-v2";

//import { useStore } from "../stores/PrifinaStore";

import VerificationField from "./VerificationField";
import PropTypes from "prop-types";



const initTexts = (t) => {
  return { "invalidTxt": "", "codeLengthError": t("codeLengthError"), "codeDigitsError": t("codeDigitsError"), "placeholderTxt": t("codePrompt"), "promptTxt": "" };
}

const PhoneVerification = ({ invalidLink, backClick, verifyClick, resendClick, ...props }) => {
  //const { nextStepAction, currentUser } = useAccountContext();

  const { __ } = useTranslate();
  const inputRef = useRef();
  const verificationOptions = { toast: true, txt: {}, };
  verificationOptions.txt = Object.assign({}, initTexts(__));

  const [inputIsValid, setInputIsValid] = useState(false);
  //const inputState = [inputIsValid, setInputIsValid];


  const inputState = (input) => {
    console.log("VERIFICATION STATUS ", input);
    console.log(input.value);
    console.log(input.dataset);
    console.log((inputRef.current));

    let isValid = true;
    if (inputRef.current.value.length !== 6) {
      isValid = false;
    } else if (inputRef.current.value.length === 6) {
      isValid = true;
    } else {
      isValid = input.dataset['isvalid']
    }
    setInputIsValid(isValid);

  }

  return (
    <>
      <Box mt={50}>
        <Box display={"inline-flex"}>
          <Box>
            <Phone height={"135px"} width={"68px"} />
          </Box>
          <Box ml={34}>
            <Box>
              <Text textStyle={"h6"}>
                {__("phoneVerificationTitle")}
              </Text>
            </Box>
            <Box mt={5}>
              <Text textStyle={"caption2"} as={"p"} m={0}>
                {__("phoneVerificationText")}
              </Text>
            </Box>
            <Box mt={15}>
              <VerificationField ref={inputRef} options={verificationOptions} inputState={inputState} />
            </Box>
            <Box mt={inputIsValid ? 0 : 3} display={"inline-flex"}>
              <Flex alignItems={"center"}>
                <Text textStyle={"caption2"} mr={5}>
                  {__("codeMissing")}
                </Text>
                <Button
                  variation="link"
                  fontSize={"10px"}
                  role={"resend-click"}
                  onClick={resendClick}

                >
                  {" "}
                  {__("sendAgainLinkText")}
                </Button>
              </Flex>
            </Box>
            <Box>
              <Link href={invalidLink} target="_blank" fontSize={"10px"} className="link" role={"support-click"}>
                {__("verifySupportLink")}
              </Link>
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
            onClick={(e) => {
              verifyClick(inputRef.current.value);
              e.preventDefault()
            }}
            role={"verify-click"}
          >
            {__("verifyButton")}
          </Button>
        </Flex>
      </Box>
    </>
  );
};

PhoneVerification.propTypes = {

  invalidLink: PropTypes.string.isRequired,
  backClick: PropTypes.func.isRequired,
  verifyClick: PropTypes.func.isRequired,
  resendClick: PropTypes.func.isRequired,
};
export default PhoneVerification;
