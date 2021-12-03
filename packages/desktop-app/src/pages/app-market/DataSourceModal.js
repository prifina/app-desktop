/* eslint-disable react/display-name */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
/* global localStorage */

import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@blend-ui/modal";
import { Box, Flex, Button, Text, Image, useTheme } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import PropTypes from "prop-types";
import { i18n } from "@prifina-apps/utils";

import dataCloud from "../../assets/data-console.svg";

import mdiArrowRight from "@iconify/icons-mdi/arrow-right";

i18n.init();

const DataSourceModal = ({
  onClose,
  onButtonClick,
  dataSourceItems,
  ...props
}) => {
  const theme = useTheme();

  const { colors } = useTheme();

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
        {...props}
      >
        {dataSourceItems.map(({ id, title, icon, ...rest }) => (
          <ModalContent
            style={{
              maxWidth: 866,
              height: 499,
            }}
          >
            <ModalHeader
              style={{
                height: 73,
                background: "#EBF3FF",
              }}
            >
              <Flex
                style={{
                  height: 73,
                  //   background: "#EBF3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text textStyle={"h5"} textStyle="h3">
                  {i18n.__("connect")} {title}
                </Text>
              </Flex>
            </ModalHeader>
            <ModalBody>
              <Flex flex={1} mt={40} mb={40} mr={32} ml={32}>
                <Flex flexDirection="column" flex={2}>
                  <Flex
                    style={{
                      width: 389,
                      height: 193,

                      marginBottom: 16,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Flex alignItems="center">
                      <Image src={icon} />
                      <Flex flexDirection="column">
                        <BlendIcon iconify={mdiArrowRight} color="gray" />
                        <BlendIcon iconify={mdiArrowRight} color="gray" />
                      </Flex>
                      <Image src={dataCloud} size={72} />
                    </Flex>
                  </Flex>
                  <Flex
                    style={{
                      width: 389,
                      height: 64,
                      background: "#D1EAF9",
                      padding: 16,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text fontSize="sm" color={colors.textLink}>
                      {i18n.__("dataSourceModalAlertText")}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  flex={2}
                  flexDirection="column"
                  justifyContent="center"
                  // alignItems="center"
                >
                  <Text mb={8}>Prifina + {title}</Text>
                  <Text mb={12} fontSize="sm" color={colors.textMuted}>
                    {i18n.__("dataSourceModalText1")}
                  </Text>
                  <Text fontSize="sm" color={colors.textMuted}>
                    {i18n.__("dataSourceModalText2")}
                  </Text>
                </Flex>
              </Flex>
            </ModalBody>
            <ModalFooter m={0}>
              <Flex
                style={{
                  height: 73,
                  width: "100%",
                  //   background: "#EBF3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingRight: 32,
                  paddingLeft: 32,
                }}
              >
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
                    onButtonClick(e, "logout");
                    e.preventDefault();
                  }}
                >
                  {i18n.__("connect")}
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        ))}
      </Modal>
    </React.Fragment>
  );
};

DataSourceModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  dataSourceItems: PropTypes.array,
};
export default DataSourceModal;
