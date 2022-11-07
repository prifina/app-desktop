import React, { useState, useEffect, useRef } from "react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@blend-ui/modal";

import { Box, Button, Text, Flex, Image, useTheme } from "@blend-ui/core";

import styled from "styled-components";

import PropTypes from "prop-types";
import { i18n } from "@prifina-apps/utils";


import * as C from "../pages/display-app/components";

i18n.init();

const List = styled("ul")`
  margin: 0;
  padding: 0px 2px 5px 0px;
  font-size: 12px;
  font-weight: 500;

  // width: 280px;
`;

const ListItem = styled.li`
  // justify-content: space-between;
  align-items: center;
  list-style-type: none;
  padding: 2px 14px 2px 0px;

  &.active {
    background: #e7dbf0;
  }
  &:hover {
    background: #e7dbf0;
  }
  cursor: pointer;
  height: 40px;
  border-radius: 8px;
  display: flex;
  font-size: 14px;
`;

const AddWidgetModal = ({
  onClose,
  widgetSettings,
  widgetConfigs,
  viewName,
  addWidget,
  ...props
}) => {

  const { colors } = useTheme();
  const theme = useTheme();

  console.log("current view widgets", widgetSettings);
  console.log("widgetConfig", widgetConfigs);

  const [dialogOpen, setDialogOpen] = useState(true);

  const onCloseCheck = (e, action) => {
    console.log("MODAL CLOSE ", e, action);
    onClose(e, action);
    e.preventDefault();
  };

  const [availableWidgets, setAvailableWidgets] = useState(widgetConfigs.filter(w => {

    return (widgetSettings.find(installed => installed.appId === w.widget.appID) === undefined)

  }))

  console.log("AVAILABLE ", availableWidgets);

  const [activeItem, setActiveItem] = useState(0);

  //const [selectedWidgets, setSelectedWidgets] = useState([]);


  const handleAddToArray = e => {
    e.preventDefault();
    //setActiveViewArray(oldArray => [...oldArray, activeItem]);
    const selectedAppID = availableWidgets[activeItem].widget.appID
    //console.log(selectedAppID);
    addWidget(selectedAppID);
    setAvailableWidgets(availableWidgets.filter(w => w.widget.appID !== selectedAppID));
    // is 0 good here... 
    setActiveItem(0);

  };

  /*
    const [activeItem, setActiveItem] = useState(widgetData[0]);
  
    let existingArray = widgetConfig;
  
    const [activeViewArray, setActiveViewArray] = useState(existingArray);
  
    const handleAddToArray = e => {
      setActiveViewArray(oldArray => [...oldArray, activeItem]);
    };
  */

  const onOptionClicked = value => () => {
    //console.log("CLICKED ",value)
    setActiveItem(value);
  };

  /*
  console.log("active item", activeItem);
  console.log("active array", activeViewArray);

  useEffect(() => {
    console.log("log3");

    // storing input name
    localStorage.setItem(
      `viewsContent-${viewID}`,
      JSON.stringify(activeViewArray),
    );
  }, [activeViewArray]);
*/

  //props.propDrill(activeViewArray);

  //let viewName = views[viewID].title;

  //console.log("view name", viewName);

  const modalRef = useRef(null);

  return (
    <div ref={modalRef}>
      <Modal
        isOpen={dialogOpen}
        closeOnEsc
        closeOnOutsideClick={false}
        onClose={onCloseCheck}
        scrollBehavior={"inside"}
        theme={theme}
        size="640px"
      >
        <ModalContent
          style={{
            background: "white",
            width: 640,
            height: 402,
            borderRadius: 5,
            padding: "8px 0px 16px 16px",
          }}
        >
          <Text mb={8}>Find widgets for ‘{viewName}’</Text>
          <ModalBody style={{ overflow: "hidden" }}>
            <Flex>
              <Box style={{ height: "100%", width: 264, overflowY: "scroll" }}>
                {availableWidgets.length === 0 &&
                  <Text fontSize="sm" color={colors.textMuted}>
                    {i18n.__("widgetNotAvailable")}
                  </Text>
                }
                {availableWidgets.length > 0 && <>
                  <Text fontSize="sm" color={colors.textMuted}>
                    {i18n.__("widgetAvailable")}
                  </Text>
                  <Box>

                    <List>
                      {availableWidgets.map((item, index) => (
                        <ListItem key={index} className={`${activeItem === index ? "active" : null}`} onClick={onOptionClicked(index)}>
                          <Image
                            src={item.widget.icon}
                            width="21px"
                            height="21px"
                          />
                          <Text ml={8}>{item.widget.title}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </>
                }
              </Box>
              <Box
                width="320px"
                style={{ borderLeft: "1px solid #EAECF0", paddingLeft: 22 }}
              >
                {availableWidgets.length > 0 && <>
                  <Flex mb={10} justifyContent="space-between">
                    <Image
                      src={availableWidgets[activeItem]?.widget.icon}
                      width="64px"
                      height="64px"
                    />
                    <C.CategoryBadge style={{ background: "#D5E7FB" }}>
                      {/* Category  */}
                      {availableWidgets[activeItem]?.widget.category || "Category"}
                    </C.CategoryBadge>
                  </Flex>

                  <Text fontWeight={500}>{availableWidgets[activeItem]?.widget.title}</Text>
                  <Box style={{ overflowY: "scroll", maxHeight: 75 }}>
                    <Text color={colors.textMuted}>
                      {availableWidgets[activeItem]?.widget.shortDescription}
                    </Text>
                  </Box>
                </>
                }
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  width="320px"
                >
                  <Button
                    mb={12}
                    onClick={handleAddToArray}
                    disabled={availableWidgets.length === 0 || widgetSettings.length > 7 ? true : false}
                  >
                    Add to ‘{viewName}’
                  </Button>
                  <Button variation="outline" mb={12}>
                    {i18n.__("learnMoreButton")}
                  </Button>
                  <Button variation="outline" onClick={onClose}>
                    {i18n.__("closeButton")}
                  </Button>
                </Flex>
              </Box>

            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

AddWidgetModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  widgetSettings: PropTypes.array.isRequired,
  widgetConfigs: PropTypes.array.isRequired,
  viewName: PropTypes.string,
  addWidget: PropTypes.func.isRequired

};
export default AddWidgetModal;
