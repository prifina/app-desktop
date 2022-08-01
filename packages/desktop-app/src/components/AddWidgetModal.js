import React, { useState, useEffect } from "react";

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

i18n.init();

const AddWidgetModal = ({ onClose, widgetData, viewID, ...props }) => {
  const { currentUser } = useAppContext();
  const history = useHistory();
  console.log("NEW APP ", currentUser);

  const { colors } = useTheme();

  const [appFields, handleChange] = useFormFields({
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

  const [activeItem, setActiveItem] = useState(widgetData[0]);

  const handleActiveItem = e => {
    setActiveItem(widgetData[+e.target.value]);
  };

  const [activeViewArray, setActiveViewArray] = useState([]);

  let id = viewID;

  const handleAddToArray = e => {
    setActiveViewArray(oldArray => [...oldArray, activeItem]);
  };

  console.log("active item", activeItem);
  console.log("active array", activeViewArray);

  useEffect(() => {
    // storing input name
    localStorage.setItem(`viewsContent-${id}`, JSON.stringify(activeViewArray));
  }, [activeViewArray]);

  return (
    <React.Fragment>
      <Modal
        isOpen={dialogOpen}
        closeOnEsc={true}
        closeOnOutsideClick={false}
        onClose={onCloseCheck}
        scrollBehavior={"inside"}
        theme={theme}
        size="640px"
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
            <Flex>
              <Flex
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="space-between"
              >
                <select onChange={handleActiveItem}>
                  {widgetData.map((item, index) => (
                    <option key={index} value={index}>
                      {item.widget.title}
                    </option>
                  ))}
                </select>
              </Flex>
              <Box>
                {}
                <Text>{activeItem.widget.title}</Text>
                <Text>{activeItem.widget.shortDescription}</Text>
                <Button onClick={handleAddToArray}>Add to</Button>
                <Button>Learn More</Button>
                <Button onClick={onClose}>Close</Button>
              </Box>
            </Flex>
          </ModalBody>
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
