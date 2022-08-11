import React, { useState, useEffect } from "react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@blend-ui/modal";
import { Box, Button, Text, Flex, Image, useTheme } from "@blend-ui/core";

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

const AddWidgetModal = ({
  onClose,
  widgetData,
  viewID,
  widgetConfig,
  ...props
}) => {
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
  console.log("widgetConfig", widgetConfig);

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

  let existingArray = widgetConfig;

  const [activeViewArray, setActiveViewArray] = useState(existingArray);

  let id = viewID;

  const handleAddToArray = e => {
    setActiveViewArray(oldArray => [...oldArray, activeItem]);
    // setActiveViewArray([...activeViewArray, activeItem]);
  };

  console.log("active item", activeItem);
  console.log("active array", activeViewArray);

  useEffect(() => {
    console.log("log3");

    // storing input name
    localStorage.setItem(`viewsContent-${id}`, JSON.stringify(activeViewArray));
  }, [activeViewArray]);

  props.propDrill(activeViewArray);

  const List = styled("ul")`
    margin: 0;
    padding: 8px;
    font-size: 12px;
    font-weight: 500;
    width: 280px;
    // overflow-y: scroll;
  `;

  const ListItem = styled.li`
    // justify-content: space-between;
    align-items: center;
    list-style-type: none;
    padding: 2px 14px 2px 12px;
    &:active {
      background: #e7dbf0;
    }
    &:hover {
      background: #e7dbf0;
    }
    cursor: pointer;
    height: 40px;
    font-size: 14px;
    border-radius: 8px;
    display: flex;
  `;

  const onOptionClicked = value => () => {
    setActiveItem(value);
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
        size="640px"
        {...props}
      >
        <ModalContent
          style={{
            background: "white",
            width: "806px",
            height: "412px",
            borderRadius: 5,
          }}
          marginLeft="317px"
        >
          <ModalHeader>Find Widgets</ModalHeader>
          <ModalBody paddingRight="36px">
            <Flex>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="space-between"
                style={{ overflowY: "scroll", width: 280, height: "100%" }}
              >
                {widgetData.map((item, index) => (
                  <List>
                    <ListItem
                      key={index}
                      // value={index}
                      // onClick={handleActiveItem}
                      onClick={onOptionClicked(item)}
                    >
                      <Image
                        src={item.widget.icon}
                        width="21px"
                        height="21px"
                      />
                      <Text ml={8}>{item.widget.title}</Text>
                    </ListItem>
                  </List>
                ))}
              </Flex>
              <Box>
                <Flex mb={10}>
                  <Image
                    src={activeItem.widget.icon}
                    width="64px"
                    height="64px"
                  />
                  <Text>{activeItem.widget.title}</Text>
                </Flex>
                <Text fontWeight={500}>{activeItem.widget.title}</Text>
                <Text color="#4D5150" mb={44}>
                  {activeItem.widget.shortDescription}
                </Text>
                <Flex flexDirection="column" justifyContent="center">
                  <Button mb={12} onClick={handleAddToArray}>
                    Add to
                  </Button>
                  <Button variation="outline" mb={12}>
                    Learn More
                  </Button>
                  <Button variation="outline" onClick={onClose}>
                    Close
                  </Button>
                </Flex>
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
