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
  useTheme,
  colors,
} from "@blend-ui/core";

import { IconField } from "@blend-ui/icon-field";

import PropTypes from "prop-types";

import { useFormFields, useToast } from "@prifina-apps/ui-lib";

//import phoneImage from "../assets/settings-app/phone.svg";
//import emailImage from "../assets/settings-app/email.svg";
import PhoneImage from "../assets/settings-app/Phone";
//import EmailImage from "../assets/settings-app/Email";


import bxKey from "@iconify/icons-bx/bx-key";

import { useTranslate } from "@prifina-apps/utils";

//init();

const VerificationModal = ({
  onClose,
  options,
  verificationType,
  getVerificationQuery,
  sendVerificationMutation,
  updateCognitoUserMutation,
  currentUser,
  ...props
}) => {

  const { __ } = useTranslate();
  //const { currentUser } = useAppContext();
  console.log("USER INFO", currentUser);
  const theme = useTheme();

  const alerts = useToast();

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
    updateCognitoUserMutation("email", options.email).then(res => {
      alerts.success("Email changed", {});
      console.log("SUCCESS", res);
    });
  };

  const phoneNumber = options.regionCode + options.phoneNumber;

  const updateUserPhone = () => {
    updateCognitoUserMutation("phone_number", phoneNumber).then(res => {
      alerts.success("Phone number changed", {});
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

      const result = await getVerificationQuery(userCode);

      if (result.data.getVerification === null) {
        alerts.error(__("invalidCode"), {});
        console.log("VERIFICATION FAILED", result);
      } else {
        updateUserEmail();
        setDialogOpen(false);
      }
      console.log("VERIFY ", result);
    } catch (e) {
      console.log("ERR", e);
      alerts.error(__("invalidCode"), {});
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

      const result = await getVerificationQuery(userCode);

      if (result.data.getVerification === null) {
        alerts.error(__("invalidCode"), {});
        console.log("VERIFICATION FAILED", result);
      } else {
        updateUserPhone();
        setDialogOpen(false);
      }
      console.log("VERIFY ", result);
    } catch (e) {
      console.log("ERR", e);
      alerts.error(__("invalidCode"), {});
    }
  };
  console.log("verification options ", options);

  console.log("ver code ", verificationFields.verificationCode);
  console.log("verification email ", options);
  console.log("verification phone ", phoneNumber);

  const resendCodeEmail = async e => {
    try {
      await sendVerificationMutation(

        "email",
        JSON.stringify({
          username: currentUser.loginUsername,
          clientId: currentUser.client,
          email: options.email,
          given_name: currentUser.given_name,
        }),
      );
      alerts.info(__("emailVerificatioSent"), {});
    } catch (e) {
      console.log("ERR", e);
    }
  };

  const getClientID = process.env.REACT_APP_APP_CLIENT_ID;

  const resendCodePhone = async e => {
    try {
      await sendVerificationMutation(

        "phone",
        JSON.stringify({
          username: currentUser.loginUsername,
          clientId: getClientID,
          phone_number: phoneNumber,
          given_name: currentUser.given_name,
        }),
      );
      alerts.info(__("emailVerificatioSent"), {});
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
              <Text textStyle={"h5"}>Verify your new phone number</Text>
            </Divider>
          </Box>
          <ModalBody style={{ marginTop: 35, marginBottom: 45 }}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              style={{
                padding: "0px",
                width: "auto",
              }}
            >
              <PhoneImage style={{ width: "99px" }} />
              <Box ml={42}>
                <Text fontWeight="600">Enter authentication code</Text>
                <Text fontSize="xxs" mb={18}>
                  We've sent you the authentication code. Please enter it below
                  to verify this number.
                </Text>
                <IconField width="224px">
                  <IconField.LeftIcon
                    iconify={bxKey}
                    color={"componentPrimary"}
                    size={"17"}
                  />
                  <IconField.InputField
                    placeholder={__("codePropmt")}
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
                    Didn’t receive the code?
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
                      Send another code
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
                  {/* {__("declineButton")} */}
                  Verify
                </Button>
              </Flex>
              <Button
                size="xs"
                variation={"link"}
                colorStyle={"error"}
                onClick={onClose}
              >
                {__("cancelButton")}
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
  options: PropTypes.object,
  verificationType: PropTypes.string,
  getVerificationQuery: PropTypes.func,
  sendVerificationMutation: PropTypes.func,
  updateCognitoUserMutation: PropTypes.func,
  currentUser: PropTypes.object
};
export default VerificationModal;
