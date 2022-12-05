import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Button, Text, Link } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";

import bxKey from "@iconify/icons-bx/bx-key";
import { ReactComponent as Phone } from "../assets/phone.svg";

import { API } from "aws-amplify";

import {
  getVerificationQuery,
  sendVerificationMutation,
  useFormFields,
  useFocus,
  useAccountContext,
  i18n,
  onlyDigitChars,
} from "@prifina-apps/utils";

import { useToast } from "@blend-ui/toast";

import config from "../config";
import PropTypes from "prop-types";
import styled from "styled-components";

const ContentContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  width: 352px;
  height: 168px;
  border: 1px solid #6b6669;
  border-radius: 10px;
`;

i18n.init();

const PhoneVerification = ({ invalidLink, ...props }) => {
  const { nextStepAction, currentUser } = useAccountContext();
  const alerts = useToast();

  const APIConfig = {
    aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
    aws_appsync_region: config.main_region,
    aws_appsync_authenticationType:
      config.appSync.aws_appsync_authenticationType,
  };

  API.configure(APIConfig);
  const [verificationFields, handleChange] = useFormFields({
    verificationCode: "",
  });
  const [inputCode, setInputCodeFocus] = useFocus();
  const [inputError, setInputError] = useState({ status: false, msg: "" });

  const verifyClickTrigger = useRef(false);

  const checkInput = code => {
    const checkResult = onlyDigitChars(code);

    let validCode = true;
    if (!checkResult) {
      const errorMsg = i18n.__("codeDigitsError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});

      setInputError({
        ...inputError,
        status: true,
        msg: errorMsg,
      });
      validCode = false;
    }

    if (code.length > 1 && code.length !== 6) {
      const errorMsg = i18n.__("codeLengthError");
      if (!alerts.check().some(alert => alert.message === errorMsg))
        alerts.error(errorMsg, {});
      setInputError({
        ...inputError,
        status: true,
        msg: errorMsg,
      });

      validCode = false;
    }
    if (validCode) {
      setInputError({ status: false, msg: "" });
    }
  };
  const verifyClick = async e => {
    try {
      const userCode = [
        currentUser.username,
        currentUser.client,
        "phone",
        verificationFields.verificationCode,
      ].join("#");

      const result = await getVerificationQuery(API, userCode);

      if (result.data.getVerification === null) {
        alerts.error(i18n.__("invalidCode"), {});
        setInputError({
          ...inputError,
          status: true,
          msg: "Invalid code",
        });
      }

      if (
        !inputError.status &&
        verificationFields.verificationCode !== "" &&
        result.data.getVerification
      ) {
        nextStepAction(4);
      }

      console.log("VERIFY ", result);
    } catch (e) {
      console.log("ERR", e);
      alerts.error(i18n.__("invalidCode"), {});
      setInputError({
        ...inputError,
        status: true,
        msg: "Invalid code",
      });
    }
  };
  const resendClick = async e => {
    try {
      await sendVerificationMutation(
        API,
        "phone",
        JSON.stringify({
          userId: currentUser.username,
          clientId: currentUser.client,
          phone_number: currentUser.phone_number,
          given_name: currentUser.given_name,
        }),
      );
      alerts.info(i18n.__("phoneVerificatioSent"), {});
    } catch (e) {
      console.log("ERR", e);
    }
  };

  useEffect(() => {
    const sendCode = () => {
      sendVerificationMutation(
        API,
        "phone",
        JSON.stringify({
          userId: currentUser.username,
          clientId: currentUser.client,
          phone_number: currentUser.phone_number,
          given_name: currentUser.given_name,
        }),
      )
        .then(result => {
          console.log("PHONE SMS RESULT ", result);
          alerts.info(i18n.__("phoneVerificatioSent"), { duration: 10000 });
        })
        .catch(e => {
          console.log("ERR", e);
        });

      verifyClickTrigger.current = true;
    };

    if (!verifyClickTrigger.current) {
      sendCode();
    }
  }, [currentUser]);

  const backClickAction = e => {
    nextStepAction(2);
  };

  console.log("currentuser", currentUser);
  console.log("verification fields", verificationFields);

  console.log("inputerror", inputError);

  const currentPhone = () => (
    <Text fontWeight="900" as="b">
      {currentUser.phone_number}
    </Text>
  );

  return (
    <Box mt={121}>
      <ContentContainer mb={145}>
        <Box mr={24}>
          <Phone height="135" width="56px" />
        </Box>
        <Box>
          <Box mb={16}>
            <Text textStyle={"caption"} as={"p"} m={0}>
              We sent a verification code to {currentPhone()}. Enter it below to
              verify your phone number
            </Text>
          </Box>
          <Box width="169px">
            <IconField>
              <IconField.LeftIcon
                iconify={bxKey}
                color={"componentPrimary"}
                size={"17"}
              />
              <IconField.InputField
                placeholder={i18n.__("codePropmt")}
                id={"verificationCode"}
                name={"verificationCode"}
                onChange={e => {
                  handleChange(e);
                  checkInput(verificationFields.verificationCode);
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    checkInput(verificationFields.verificationCode);
                  }
                }}
                ref={inputCode}
                error={inputError.status}
                errorMsg={inputError.status ? inputError.msg : ""}
              />
            </IconField>
          </Box>
        </Box>
      </ContentContainer>
      <Box>
        <Flex justifyContent="space-between" mb={16}>
          <Button width="45%" variation={"outline"} onClick={resendClick}>
            Resend Code
          </Button>
          <Button width="45%" onClick={verifyClick}>
            {i18n.__("verifyButton")}
          </Button>
        </Flex>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Flex alignItems="center">
            <Text textStyle={"caption2"} mr={5}>
              Still did not receive your code?
            </Text>
            <Link href={invalidLink} target="_blank" fontSize="10px">
              Get help
            </Link>
          </Flex>
          <Flex alignItems="center">
            <Text textStyle={"caption2"} mr={5}>
              Not your number?
            </Text>
            <Button
              variation="link"
              fontSize={"10px"}
              onClick={backClickAction}
            >
              Change phone number
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

PhoneVerification.propTypes = {
  invalidLink: PropTypes.string.isRequired,
};
export default PhoneVerification;
