import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@blend-ui/modal";
import { Box, Button, Text, Flex, useTheme } from "@blend-ui/core";

import styled from "styled-components";

import { API } from "aws-amplify";

import PropTypes from "prop-types";
import {
  i18n,
  useAppContext,
  useFormFields,
  newAppVersionMutation,
} from "@prifina-apps/utils";

import { useHistory } from "react-router-dom";

const short = require("short-uuid");

i18n.init();

const AddWidgetModal = ({ onClose, onButtonClick, widgetData, ...props }) => {
  const { currentUser } = useAppContext();
  const history = useHistory();
  console.log("NEW APP ", currentUser);

  const { colors } = useTheme();

  const [appFields, handleChange] = useFormFields({
    appId: short.generate(),
    name: "",
    title: "",
    version: 1,
  });

  const [appType, setAppType] = useState(1);

  const theme = useTheme();

  console.log("widgetData", widgetData);

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
        closeOnEsc={true}
        closeOnOutsideClick={false}
        onClose={onCloseCheck}
        scrollBehavior={"inside"}
        theme={theme}
        size={"806px"}
        {...props}
      >
        <ModalContent
          style={{
            background: colors.baseTertiary,
            width: "806px",
            height: "412px",
            borderRadius: 5,
          }}
          marginLeft="317px"
        >
          <ModalHeader>Find Widgets</ModalHeader>
          <ModalBody paddingLeft="36px" paddingRight="36px" paddingTop="37px">
            <Flex display="flex" flexDirection="row" justifyContent="center">
              {/* {widgetData.map((w, i) => {
                <div>{w.widget.title}</div>;
              })} */}
              {widgetData.map(function (e) {
                return <ul>{e.widget.title}</ul>;
              })}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex paddingTop="54px">Footer</Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

AddWidgetModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};
export default AddWidgetModal;
