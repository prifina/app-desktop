import React, { useState } from "react";

import { Modal, ModalContent, ModalBody, ModalFooter } from "@blend-ui/modal";
import { Box, Button, Text, Flex, useTheme, Input } from "@blend-ui/core";

import styled from "styled-components";

import { Radio } from "@blend-ui/core";

//import cardPrifinaLogo from "../assets/cardPrifinaLogo.svg"; // does this work without webpack loader?

import CardPrifinaLogo from "../assets/CardPrifinaLogo";


import PropTypes from "prop-types";
import {

  useFormFields,
} from "@prifina-apps/utils";

//import { useHistory } from "react-router-dom";

//import * as C from "./components";

import { randomAppId } from "../pages/NewApp";

import { useTranslate } from "@prifina-apps/utils";

const OutlineButton = styled(Button)`
  &:not([disabled]):hover {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;

    background-color: transparent;
  }
`;
const StyledBox = styled(Box)`
  height: 129px;
  width: 331px;
  border-radius: 5px;
  align-items: center;
  z-index: 1;
  border: null;
  // background: linear-gradient(180deg, #aa076b 0%, #61045f 100%);
  background: url(${CardPrifinaLogo}),
    linear-gradient(180deg, #aa076b 0%, #61045f 100%);
  background-repeat: no-repeat;
  background-position: right center;
`;

const CreateProjectModal = ({ onClose, onButtonClick, createApp, defaultAppType, prifinaAppTypes, ...props }) => {

  const { __ } = useTranslate();
  const { colors } = useTheme();

  const [appFields, handleChange] = useFormFields({
    appId: randomAppId(),
    appName: "",  // to prevent autofill suggestions... 
    appTitle: "",
    version: "0.0.1",
  });

  const [appType, setAppType] = useState(defaultAppType);

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
          <ModalBody paddingLeft="36px" paddingRight="36px" paddingTop="37px">
            <Flex display="flex" flexDirection="row" justifyContent="center">
              <Box>
                <Text textStyle={"semiBold"} fontSize="xl">
                  {__("createProject")}
                </Text>
                <Text paddingTop="36px" color={colors.textMuted}>
                  {__("projectType")}
                </Text>
                <Flex width="268px">
                  <Flex flexDirection="row" alignItems="center" mr="15px">
                    <Radio
                      fontSize="8px"
                      onChange={() => { }}
                      onClick={() => {
                        setAppType(prifinaAppTypes.APP);
                      }}
                      checked={appType === prifinaAppTypes.APP ? "checked" : null}
                    />
                    <Text fontSize="xs">{__("application")}</Text>
                  </Flex>
                  <Flex flexDirection="row" alignItems="center" mr="15px">
                    <Radio
                      fontSize="8px"
                      onChange={() => { }}
                      onClick={() => {
                        setAppType(prifinaAppTypes.WIDGET);
                      }}
                      checked={appType === prifinaAppTypes.WIDGET ? "checked" : null}
                    />
                    <Text fontSize="xs">{__("widget")}</Text>
                  </Flex>
                </Flex>
                <Text paddingTop="10px" paddingBottom="16px" color="#ADADAD">
                  {__("projectName")}
                </Text>
                <Input
                  width="361px"
                  autoFocus={true}
                  placeholder={__("name")}
                  id={"appName"}
                  name={"appName"}
                  onChange={handleChange}
                />
                <Box mt={10}>
                  <Input
                    placeholder={__("title")}
                    id={"appTitle"}
                    name={"appTitle"}
                    onChange={handleChange}
                  />
                </Box>
              </Box>
              <Box paddingLeft="46px">
                <StyledBox>
                  <Box paddingTop="10px">
                    <Flex>
                      <Text fontSize="md" paddingBottom="5px" >
                        {__("prifinaAppId")}
                      </Text>
                    </Flex>
                    <Text color="#ADADAD" fontSize="xs">
                      {__("prifinaAppIdText")}
                    </Text>
                    <Text color="#ADADAD" fontSize="xs" paddingTop="7px">
                      {__("copyAndAddToYourBuild")}
                    </Text>
                  </Box>
                </StyledBox>
                <Text
                  color="#ADADAD"
                  fontSize="xs"
                  paddingTop="34px"
                  paddingBottom="4px"
                >
                  {__("appId")}
                </Text>
                <Input
                  width="331px"
                  id={"appId"}
                  name={"appId"}
                  defaultValue={appFields.appId}
                  disabled
                />
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex paddingTop="54px">
              <OutlineButton
                variation={"outline"}
                // colorStyle={"error"}
                onClick={e => {
                  setDialogOpen(false);
                  onButtonClick(e, "cancel");
                  e.preventDefault();
                }}
                marginLeft="36px"
              >
                <Text>{__("cancelButton")}</Text>
              </OutlineButton>
              <Button
                onClick={e => {
                  createApp(appFields).then(() => {
                    setDialogOpen(false);
                    onButtonClick(e);
                  })

                  e.preventDefault();
                }}
                marginLeft="466px"
              >
                {__("newProject")}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

CreateProjectModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};
export default CreateProjectModal;
