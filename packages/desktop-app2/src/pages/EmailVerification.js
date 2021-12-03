import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text, IconField, Link } from "@blend-ui/core";

import bxKey from "@iconify/icons-bx/bx-key";
import { ReactComponent as Email } from "../assets/email-envelope.svg";

import ProgressContainer from "../components/ProgressContainer";
import { useFormFields } from "../lib/formFields";

import { onlyDigitChars } from "../lib/utils";

import { useFocus } from "../lib/componentUtils";
import Amplify, { API } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { getVerificationQuery, sendVerificationMutation } from "../graphql/api";
//import { useHistory } from "react-router-dom";
import { useToast } from "@blend-ui/toast";
import { useAccountContext } from "../lib/contextLib";

import PropTypes from "prop-types";
import i18n from "../lib/i18n";
i18n.init();

const EmailVerification = ({ invalidLink, ...props }) => {
  //console.log("Phone ", props);
  //const history = useHistory();
  const { nextStepAction, currentUser } = useAccountContext();
  const alerts = useToast();
  const { APIConfig } = useAppContext();
  Amplify.configure(APIConfig);
  console.log("USER ", currentUser);

  const [verificationFields, handleChange] = useFormFields({
    verificationCode: "",
  });
  const [inputCode, setInputCodeFocus] = useFocus();
  const [inputError, setInputError] = useState({ status: false, msg: "" });
  // const [toastSuccess, setToastSuccess] = useState({ status: false, msg: "" });
  // const [toastError, setToastError] = useState({ status: false, msg: "" });

  const checkInput = code => {
    const checkResult = onlyDigitChars(code);
    //console.log(checkResult);
    let validCode = true;
    if (!checkResult && code.length > 0) {
      const errorMsg = i18n.__("codeDigitsError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      setInputError({ status: true });
      validCode = false;
    }
    //if (code.length > 1 && code.length !== 6) {
    if (code.length > 1 && code.length !== 6) {
      const errorMsg = i18n.__("codeLengthError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      setInputError({ status: true });
      validCode = false;
    }
    if (validCode) {
      setInputError({ status: false });
    }
  };

  useEffect(() => {
    //console.log("SEND MSG ", currentUser);

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
        /*
        setToastSuccess({
          status: true,
          msg: i18n.__("emailVerificatioSent"),
        });
        */
      })
      .catch(e => {
        console.log("ERR", e);
      });

    //{data:{},errors:[]}
    //s.errors[0].message
    //onAction("phone");
    //history.replace("/verify-phone");
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
      /*
      setToastSuccess({
        status: true,
        msg: i18n.__("emailVerificatioSent"),
      });
      */
    } catch (e) {
      console.log("ERR", e);
    }
  };
  const verifyClick = async e => {
    try {
      /*
      const result = await verifyCodeMutation(
        API,
        [
          currentUser.username,
          currentUser.client,
          "email",
          verificationFields.verificationCode,
        ].join("#")
      );
      */
      const userCode = [
        currentUser.username,
        currentUser.client,
        "email",
        verificationFields.verificationCode,
      ].join("#");

      const result = await getVerificationQuery(API, userCode);
      //console.log(result.data.getVerification);
      if (result.data.getVerification === null) {
        alerts.error(i18n.__("invalidCode"), {});
        setInputError({ status: true });
        /*
        setToastError({
          status: true,
          msg: i18n.__("invalidCode"),
        });
        */
      }
      console.log("VERIFY ", result);
      nextStepAction(3);
    } catch (e) {
      console.log("ERR", e);
      alerts.error(i18n.__("invalidCode"), {});
      setInputError({ status: true });
      nextStepAction(2);
      /*
      setToastError({
        status: true,
        msg: i18n.__("invalidCode"),
      });
      */
      /*
      data:
verifyCode: null

      errors: Array(1)
0:
data: null
errorInfo: null
errorType: null
locations: [{…}]
message: "INVALID_CODE"
path: ["verifyCode"]
*/
    }
    //e.preventDefault();
  };
  const backClickAction = e => {
    nextStepAction(0);
  };
  return (
    <React.Fragment>
      <ProgressContainer
        title={i18n.__("verificationTitle")}
        progress={100}
        pr={19}
      >
        <Box mt={50}>
          <Box display={"inline-flex"}>
            <Box>
              <Email height={"105px"} width={"95px"} />
            </Box>
            <Box ml={34}>
              <Box>
                <Text textStyle={"h6"}>
                  {i18n.__("emailVerificationTitle")}
                </Text>
              </Box>
              <Box mt={5}>
                <Text textStyle={"caption2"} as={"p"} m={0}>
                  {i18n.__("emailVerificationText")}
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
                    onChange={handleChange}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        checkInput(verificationFields.verificationCode);
                      }
                    }}
                    ref={inputCode}
                    error={inputError.status}
                  />
                </IconField>
              </Box>
              <Box mt={inputError.status ? 0 : 3} display={"inline-flex"}>
                <Flex alignItems={"center"}>
                  <Text textStyle={"caption2"} mr={5}>
                    {i18n.__("emailMissing")}
                  </Text>
                  <Button
                    variation="link"
                    fontSize={"10px"}
                    onClick={resendClick}
                  >
                    {" "}
                    {i18n.__("sendAgainLinkText")}
                  </Button>
                </Flex>
              </Box>
              <Box>
                <Link href={invalidLink} target="_blank" fontSize={"10px"}>
                  {i18n.__("verifySUpportLink")}
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box mt={80} display={"inline-flex"}>
          <Flex>
            <Button variation={"outline"} onClick={backClickAction}>
              {i18n.__("backButton")}
            </Button>
          </Flex>
          <Flex ml={99}>
            <Button
              disabled={
                inputError.status ||
                verificationFields.verificationCode.length !== 6
              }
              onClick={verifyClick}
            >
              {i18n.__("verifyButton")}
            </Button>
          </Flex>
        </Box>

        {/* 
        <Box mt={inputError.status ? 53 : 80} textAlign={"center"}>
          <Button
            disabled={
              inputError.status ||
              verificationFields.verificationCode.length !== 6
            }
            onClick={verifyClick}
          >
            {i18n.__("verifyButton")}
          </Button>
        </Box>
        */}
      </ProgressContainer>
    </React.Fragment>
  );
};

EmailVerification.propTypes = {
  invalidLink: PropTypes.string.isRequired,
};
export default EmailVerification;
