import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@blend-ui/modal";
import {
  Flex,
  Box,
  Button,
  Text,
  Divider,
  Image,
  useTheme,
  colors,
} from "@blend-ui/core";

import { API } from "aws-amplify";

import { IconField } from "@blend-ui/icon-field";

import PropTypes from "prop-types";

import {
  i18n,
  getVerificationQuery,
  sendVerificationMutation,
  useFormFields,
  updateCognitoUserMutation,
  useAppContext,
} from "@prifina-apps/utils";

import phoneImage from "../assets/settings-app/phone.svg";
import emailImage from "../assets/settings-app/email.svg";

import bxKey from "@iconify/icons-bx/bx-key";

i18n.init();

const VerificationModal = ({
  onClose,
  onButtonClick,
  state,
  verificationType,
  ...props
}) => {
  const { currentUser } = useAppContext();
  console.log("USER INFO", currentUser);
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(true);

  const onCloseCheck = (e, action) => {
    console.log("MODAL CLOSE ", e, action);
    onClose(e, action);
    e.preventDefault();
  };

  const [verificationFields, handleChange] = useFormFields({
    verificationCode: "",
  });

  const updateUserEmail = () => {
    updateCognitoUserMutation(API, "email", state.email.value).then(res => {
      // alerts.success(i18n.__("success"), {});
      console.log("SUCCESS", res);
    });
  };

  const phoneNumber = state.regionCode + state.phoneNumber.value;

  const updateUserPhone = () => {
    updateCognitoUserMutation(API, "phone", phoneNumber).then(res => {
      // alerts.success(i18n.__("success"), {});
      console.log("SUCCESS", res);
    });
  };

  const verifyClickEmail = async e => {
    try {
      const userCode = [
        currentUser.loginUsername,
        currentUser.client,
        "email",
        verificationFields.verificationCode,
      ].join("#");

      const result = await getVerificationQuery(API, userCode);

      if (result.data.getVerification === null) {
        // alerts.error(i18n.__("invalidCode"), {});
        console.log("VERIFICATION FAILED", result);
      } else {
        updateUserEmail();
        setDialogOpen(false);
      }
      console.log("VERIFY ", result);
    } catch (e) {
      console.log("ERR", e);
      // alerts.error(i18n.__("invalidCode"), {});
    }
  };

  const verifyClickPhone = async e => {
    try {
      const userCode = [
        currentUser.loginUsername,
        currentUser.client,
        "phone",
        verificationFields.verificationCode,
      ].join("#");

      const result = await getVerificationQuery(API, userCode);

      if (result.data.getVerification === null) {
        // alerts.error(i18n.__("invalidCode"), {});
        console.log("VERIFICATION FAILED", result);
      } else {
        updateUserPhone();
        setDialogOpen(false);
      }
      console.log("VERIFY ", result);
    } catch (e) {
      console.log("ERR", e);
      // alerts.error(i18n.__("invalidCode"), {});
    }
  };
  console.log("verification state ", state);

  console.log("ver code ", verificationFields.verificationCode);
  console.log("verification email ", state);
  console.log("verification phone ", phoneNumber);

  const resendCodeEmail = async e => {
    try {
      await sendVerificationMutation(
        API,
        "email",
        JSON.stringify({
          username: currentUser.loginUsername,
          clientId: currentUser.client,
          email: state.email.value,
          given_name: currentUser.given_name,
        }),
      );
      // alerts.info(i18n.__("phoneVerificatioSent"), {});
    } catch (e) {
      console.log("ERR", e);
    }
  };

  const getClientID = process.env.REACT_APP_APP_CLIENT_ID;

  const resendCodePhone = async e => {
    try {
      await sendVerificationMutation(
        API,
        "phone",
        JSON.stringify({
          username: currentUser.loginUsername,
          clientId: getClientID,
          phone_number: phoneNumber,
          given_name: currentUser.given_name,
        }),
      );
      // alerts.info(i18n.__("emailVerificatioSent"), {});
    } catch (e) {
      console.log("ERR", e);
    }
  };

  return (
    <React.Fragment>
      <Modal
        isOpen={dialogOpen}
        closeOnEsc={false}
        closeOnOutsideClick={false}
        onClose={onCloseCheck}
        scrollBehavior={"inside"}
        theme={theme}
        {...props}
      >
        <ModalContent
          style={{
            background: "white",
            width: 415,
            height: 335,
            borderRadius: 16,
            padding: 24,
          }}
        >
          <Box>
            <Divider>
              <Text textStyle={"h5"}>{i18n.__("verifyNumberModalHeader")}</Text>
            </Divider>
          </Box>
          <ModalBody style={{ marginTop: 35, marginBottom: 45 }}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              style={{
                padding: "0px 16.5px 0px 16.5px",
                width: "auto",
              }}
            >
              <Image src={phoneImage} />
              <Box ml={42}>
                <Text fontWeight="600">{i18n.__("authConfirmTitle")}</Text>
                <Text fontSize="xxs" mb={18}>
                  {i18n.__("authConfirmationText2")}
                </Text>
                <IconField width="224px">
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
                    // onKeyDown={e => {
                    //   if (e.key === "Enter") {
                    //     checkInput(verificationFields.verificationCode);
                    //   }
                    // }}
                    // ref={inputCode}
                    // error={inputError.status}
                  />
                </IconField>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter style={{ margin: 0 }}>
            <Box textAlign="center">
              <Flex height="34px" width="350px" justifyContent="space-between">
                <Flex alignItems="center">
                  <Text fontSize="xxs" mr={1}>
                    {i18n.__("codeMissing")}
                  </Text>
                  <Button
                    variation="link"
                    size="xs"
                    onClick={
                      verificationType === "phone"
                        ? resendCodePhone
                        : resendCodeEmail
                    }
                  >
                    <Text fontSize="xxs" ml={3} color={colors.textLink}>
                      {i18n.__("sendCodeText")}
                    </Text>
                  </Button>
                </Flex>

                <Button
                  size="xs"
                  // onClick={e => {
                  // //   setDialogOpen(false);

                  // on

                  //   e.preventDefault();
                  // }}
                  onClick={
                    verificationType === "phone"
                      ? verifyClickPhone
                      : verifyClickEmail
                  }
                >
                  {/* {i18n.__("declineButton")} */}
                  {i18n.__("verifyButton")}
                </Button>
              </Flex>
              <Button
                size="xs"
                variation={"link"}
                colorStyle={"error"}
                onClick={onClose}
              >
                {i18n.__("cancelButton")}
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

VerificationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  //   onButtonClick: PropTypes.func.isRequired,
};
export default VerificationModal;
