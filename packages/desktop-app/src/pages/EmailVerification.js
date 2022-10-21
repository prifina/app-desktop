import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text, Link } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";

import bxKey from "@iconify/icons-bx/bx-key";
import { ReactComponent as Email } from "../assets/email-envelope.svg";

import ProgressContainer from "../components/ProgressContainer";

import { API } from "aws-amplify";

import {
  getVerificationQuery,
  sendVerificationMutation,
  i18n,
  useFormFields,
  useFocus,
  useAccountContext,
  onlyDigitChars,
} from "@prifina-apps/utils";

import { useToast } from "@blend-ui/toast";

import config from "../config";
import PropTypes from "prop-types";

i18n.init();

const EmailVerification = ({ invalidLink, ...props }) => {
  const { nextStepAction, currentUser } = useAccountContext();
  const alerts = useToast();

  const APIConfig = {
    aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
    aws_appsync_region: config.main_region,
    aws_appsync_authenticationType:
      config.appSync.aws_appsync_authenticationType,
  };

  API.configure(APIConfig);
  //Auth.configure(AUTHConfig);
  console.log("USER ", currentUser);

  const [verificationFields, handleChange] = useFormFields({
    verificationCode: "",
  });
  const [inputCode, setInputCodeFocus] = useFocus();
  const [inputError, setInputError] = useState({ status: false, msg: "" });

  const checkInput = code => {
    const checkResult = onlyDigitChars(code);

    let validCode = true;
    if (!checkResult && code.length > 0) {
      const errorMsg = i18n.__("codeDigitsError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      setInputError({ status: true });
      validCode = false;
    }

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
                  {i18n.__("verifySupportLink")}
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
      </ProgressContainer>
    </React.Fragment>
  );
};

EmailVerification.propTypes = {
  invalidLink: PropTypes.string.isRequired,
};
export default EmailVerification;
