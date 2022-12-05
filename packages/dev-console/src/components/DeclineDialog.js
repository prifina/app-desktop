import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@blend-ui/modal";
import { Box, Button, colors, Text, useTheme } from "@blend-ui/core";

import PropTypes from "prop-types";
import { i18n } from "@prifina-apps/utils";

i18n.init();

const DeclineDialog = ({ onClose, onButtonClick, ...props }) => {
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
        <ModalContent style={{ background: theme.colors.baseTertiary }}>
          <ModalHeader>
            <Text textStyle={"h5"} color={theme.colors.baseError}>
              {i18n.__("declineTitle")}
            </Text>
          </ModalHeader>
          <ModalBody ml={55} mr={55}>
            <Text textStyle={"body"} as={"p"} textAlign={"center"}>
              {i18n.__("declineText")}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Box textAlign={"center"} width={1}>
              <Button
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
                ml={20}
                onClick={e => {
                  setDialogOpen(false);
                  onButtonClick(e, "decline");
                  e.preventDefault();
                }}
              >
                {i18n.__("declineButton")}
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

DeclineDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};
export default DeclineDialog;
