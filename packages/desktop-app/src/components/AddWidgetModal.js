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

import { useHistory } from "react-router-dom";

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
  &:active {
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
  widgetData,
  widgetConfig,
  views,
  viewID,
  ...props
}) => {
  const history = useHistory();

  const { colors } = useTheme();
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

  let existingArray = widgetConfig;

  const [activeViewArray, setActiveViewArray] = useState(existingArray);

  const handleAddToArray = e => {
    setActiveViewArray(oldArray => [...oldArray, activeItem]);
  };

  const onOptionClicked = value => () => {
    setActiveItem(value);
  };

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

  props.propDrill(activeViewArray);

  let viewName = views.find(x => x.id === viewID).title;

  console.log("view name", viewName);

  const modalRef = useRef(null);

  // useEffect(() => {
  //   const closeOpenMenus = e => {
  //     if (
  //       modalRef.current &&
  //       dialogOpen &&
  //       !modalRef.current.contains(e.target)
  //     ) {
  //       setDialogOpen(prevalue => !prevalue);
  //     }
  //   };
  //   document.addEventListener("modal", closeOpenMenus);

  //   return () => {
  //     // Cleanup the event listener
  //     document.removeEventListener("modal", closeOpenMenus);
  //   };
  // }, [modalRef]);

  function onOutsideClose(ref, state, setState, listener) {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setState(false);
      }
    };

    useEffect(() => {
      document.addEventListener("menu", handleClickOutside, true);
      return () => {
        document.removeEventListener("menu", handleClickOutside, true);
      };
    }, [ref, state]);

    return { ref, state, setState };
  }

  // useOnClickOutside(modalRef, () => setDialogOpen(prevalue => !prevalue));
  onOutsideClose(modalRef, dialogOpen, setDialogOpen, "addWidgetModal");

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
        {...props}
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
              <Box style={{ height: "100%", width: 264 }}>
                <Text fontSize="sm" color={colors.textMuted}>
                  Available now
                </Text>
                <Box style={{ overflowY: "scroll" }}>
                  <List>
                    {widgetData.map((item, index) => (
                      <ListItem key={index} onClick={onOptionClicked(item)}>
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
              </Box>
              <Box
                width="320px"
                style={{ borderLeft: "1px solid #EAECF0", paddingLeft: 22 }}
              >
                <Flex mb={10} justifyContent="space-between">
                  <Image
                    src={activeItem.widget.icon}
                    width="64px"
                    height="64px"
                  />
                  <C.CategoryBadge style={{ background: "#D5E7FB" }}>
                    {/* Category  */}
                    {activeItem.widget.category || "Category"}
                  </C.CategoryBadge>

                  {/* <Text>{activeItem.widget.title}</Text> */}
                </Flex>
                <Text fontWeight={500}>{activeItem.widget.title}</Text>
                <Box style={{ overflowY: "scroll", maxHeight: 75 }}>
                  <Text color={colors.textMuted}>
                    {activeItem.widget.shortDescription}
                  </Text>
                </Box>
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  width="320px"
                >
                  <Button mb={12} onClick={handleAddToArray}>
                    Add to ‘{viewName}’
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
    </div>
  );
};

AddWidgetModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};
export default AddWidgetModal;
