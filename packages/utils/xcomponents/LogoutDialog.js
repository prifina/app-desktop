import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@blend-ui/modal";
import { Box, Button, Text, useTheme } from "@blend-ui/core";

import PropTypes from "prop-types";

import i18n from "../lib/i18n";
i18n.init();

const LogoutDialog = ({ onClose, onButtonClick, ...props }) => {
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(true);

  const onCloseCheck = (e, action) => {
    console.log("MODAL CLOSE ", e, action);
    onClose(e, action);
    e.preventDefault();
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
        size={"566px"}
        {...props}
      >
        <ModalContent>
          <ModalHeader>
            <Text textStyle={"h5"} color={theme.colors.baseError}>
              {i18n.__("logoutTitle")}
            </Text>
          </ModalHeader>
          <ModalBody ml={55} mr={55}>
            <Text textStyle={"body"} as={"p"} textAlign={"center"}>
              {i18n.__("logoutText")}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Box textAlign={"center"} width={1}>
              <Button
                className="dialog-cancelButton"
                variation={"outline"}
                colorStyle={"error"}
                onClick={e => {
                  setDialogOpen(false);
                  onButtonClick(e, "cancel");
                  e.preventDefault();
                }}
              >
                {i18n.__("cancelButton")}
              </Button>
              <Button
                className="dialog-logoutButton"
                ml={20}
                onClick={e => {
                  setDialogOpen(false);
                  onButtonClick(e, "logout");
                  e.preventDefault();
                }}
              >
                {i18n.__("logoutButton")}
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

LogoutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};
export default LogoutDialog;
