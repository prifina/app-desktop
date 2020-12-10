import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text, IconField, Link } from "@blend-ui/core";

import bxKey from "@iconify/icons-bx/bx-key";
import { ReactComponent as Email } from "../assets/email-envelope.svg";

import ProgressContainer from "../components/ProgressContainer";
import { useFormFields } from "../lib/formFields";

import { onlyDigitChars } from "../lib/utils";
import { UseFocus } from "../lib/componentUtils";
import Amplify, { API } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { getVerificationQuery, sendVerificationMutation } from "../graphql/api";
//import { useHistory } from "react-router-dom";
import { Toast } from "@blend-ui/toast";

import i18n from "../lib/i18n";
i18n.init();

const EmailVerification = ({
  invalidLink,
  currentUser,
  nextStep,
  ...props
}) => {
  //console.log("Phone ", props);
  //const history = useHistory();
  const { APIConfig } = useAppContext();
  Amplify.configure(APIConfig);
  console.log("USER ", currentUser);

  const [verificationFields, _handleChange] = useFormFields({
    verificationCode: "",
  });
  const [inputCode, setInputCodeFocus] = UseFocus();
  const [inputError, setInputError] = useState({ status: false, msg: "" });
  const [toastSuccess, setToastSuccess] = useState({ status: false, msg: "" });
  const [toastError, setToastError] = useState({ status: false, msg: "" });

  const checkInput = (code) => {
    const checkResult = onlyDigitChars(code);
    //console.log(checkResult);
    let validCode = true;
    if (!checkResult && code.length > 0) {
      setToastError({
        status: true,
        msg: i18n.__("codeDigitsError"),
      });

      //setInputError({ status: true, msg: i18n.__("codeDigitsError") });
      validCode = false;
    }
    //if (code.length > 1 && code.length !== 6) {
    if (code.length > 6 || code.length === 0) {
      setToastError({
        status: true,
        msg: i18n.__("codeLengthError"),
      });

      //setInputError({ status: true, msg: i18n.__("codeLengthError") });
      validCode = false;
    }
    if (validCode) {
      setToastError({
        status: false,
      });
      //setInputError({ status: false, msg: "" });
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
      })
    )
      .then((result) => {
        console.log("EMAIL RESULT ", result);
        setToastSuccess({
          status: true,
          msg: i18n.__("emailVerificatioSent"),
        });
      })
      .catch((e) => {
        console.log("ERR", e);
      });

    //{data:{},errors:[]}
    //s.errors[0].message
    //onAction("phone");
    //history.replace("/verify-phone");
  }, [currentUser]);

  const resendClick = async (e) => {
    try {
      await sendVerificationMutation(
        API,
        "email",
        JSON.stringify({
          userId: currentUser.username,
          clientId: currentUser.client,
          email: currentUser.email,
          given_name: currentUser.given_name,
        })
      );
      setToastSuccess({
        status: true,
        msg: i18n.__("emailVerificatioSent"),
      });
    } catch (e) {
      console.log("ERR", e);
    }
  };
  const verifyClick = async (e) => {
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
        //setInputError({ status: true, msg: i18n.__("invalidCode") });
        setToastError({
          status: true,
          msg: i18n.__("invalidCode"),
        });
      }
      console.log("VERIFY ", result);
      //nextStep(3);
    } catch (e) {
      console.log("ERR", e);
      //setInputError({ status: true, msg: i18n.__("invalidCode") });
      setToastError({
        status: true,
        msg: i18n.__("invalidCode"),
      });
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
  return (
    <React.Fragment>
      {toastSuccess.status && (
        <Toast.Success
          m={30}
          onClose={() => {
            setToastSuccess({
              status: false,
            });
          }}
        >
          {toastSuccess.msg}
        </Toast.Success>
      )}
      {toastError.status && (
        <Toast.Error
          m={30}
          onClose={() => {
            setToastError({
              status: false,
            });
          }}
        >
          {toastError.msg}
        </Toast.Error>
      )}
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
                    onChange={(e) => {
                      _handleChange(e);
                      checkInput(e.target.value);
                    }}
                    errorMsg={inputError.msg}
                    error={toastError.status}
                    ref={inputCode}
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
            <Button variation={"outline"}>{i18n.__("backButton")}</Button>
          </Flex>
          <Flex ml={99}>
            <Button
              disabled={
                toastError.status ||
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

export default EmailVerification;
