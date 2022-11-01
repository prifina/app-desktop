import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Button, Text, Link } from "@blend-ui/core";
import { ReactComponent as Email } from "../assets/email-envelope.svg";

import { useToast } from "@blend-ui/toast";

import { useTranslate, } from "@prifina-apps/utils";
import VerificationField from "../components/VerificationField";

import { useStore } from "../stores/PrifinaStore";
import PropTypes from "prop-types";



const initTexts = (t) => {
  return { "invalidTxt": "", "codeLengthError": t("codeLengthError"), "codeDigitsError": t("codeDigitsError"), "placeholderTxt": t("codePrompt"), "promptTxt": "" };
}

const EmailVerification = ({ invalidLink, backClick, verifyClick, resendClick, ...props }) => {
  //const { nextStepAction, currentUser } = useAccountContext();

  const setActiveIndex = useStore(state => state.setActiveIndex);
  const alerts = useToast();
  const { __ } = useTranslate();
  const inputRef = useRef();
  const verificationOptions = { toast: true, txt: {} };
  verificationOptions.txt = Object.assign({}, initTexts(__));

  const [inputIsValid, setInputIsValid] = useState(false);
  //const inputState = [inputIsValid, setInputIsValid];

  useEffect(() => {
    setActiveIndex(2);
  }, []);
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
  /*
  useEffect(() => {
    console.log("IS VALID ", inputIsValid)
 
  }, [inputIsValid])
  */

  /*
  useEffect(() => {
    sendVerificationMutation(
      API,
      "email",
      JSON.stringify({
        userId: currentUser.username,
        clientId: currentUser.client,
        email: currentUser.email,
        given_name: currentUser.given_name,
      }),
    )
      .then(result => {
        console.log("EMAIL RESULT ", result);
        alerts.info(i18n.__("emailVerificatioSent"), { duration: 10000 });
      })
      .catch(e => {
        console.log("ERR", e);
      });
  }, [currentUser]);

  const resendClick = async e => {
    try {
      await sendVerificationMutation(
        API,
        "email",
        JSON.stringify({
          userId: currentUser.username,
          clientId: currentUser.client,
          email: currentUser.email,
          given_name: currentUser.given_name,
        }),
      );
      alerts.info(i18n.__("emailVerificatioSent"), {});
    } catch (e) {
      console.log("ERR", e);
    }
  };
  const verifyClick = async e => {
    try {
      const userCode = [
        currentUser.username,
        currentUser.client,
        "email",
        verificationFields.verificationCode,
      ].join("#");

      const result = await getVerificationQuery(API, userCode);

      if (result.data.getVerification === null) {
        alerts.error(i18n.__("invalidCode"), {});
        setInputError({ status: true });
      }
      console.log("VERIFY ", result);
      nextStepAction(3);
    } catch (e) {
      console.log("ERR", e);
      alerts.error(i18n.__("invalidCode"), {});
      setInputError({ status: true });
      nextStepAction(2);
    }
  };
  const backClickAction = e => {
    nextStepAction(0);
  };
  */
  return (
    <>
      <Box mt={50}>
        <Box display={"inline-flex"}>
          <Box>
            <Email height={"105px"} width={"95px"} />
          </Box>
          <Box ml={34}>
            <Box>
              <Text textStyle={"h6"}>
                {__("emailVerificationTitle")}
              </Text>
            </Box>
            <Box mt={5}>
              <Text textStyle={"caption2"} as={"p"} m={0}>
                {__("emailVerificationText")}
              </Text>
            </Box>
            <Box mt={15}>
              <VerificationField ref={inputRef} options={verificationOptions} inputState={inputState} />
            </Box>
            <Box mt={inputIsValid ? 0 : 3} display={"inline-flex"}>
              <Flex alignItems={"center"}>
                <Text textStyle={"caption2"} mr={5}>
                  {__("emailMissing")}
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

EmailVerification.propTypes = {
  invalidLink: PropTypes.string.isRequired,
  backClick: PropTypes.func.isRequired,
  verifyClick: PropTypes.func.isRequired,
  resendClick: PropTypes.func.isRequired,
};
export default EmailVerification;
