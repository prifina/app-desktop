import React, { useState } from "react";

import { Modal, ModalContent, ModalBody, ModalFooter } from "@blend-ui/modal";
import { Box, Button, Text, Flex, useTheme, Input } from "@blend-ui/core";

import styled from "styled-components";

import { Radio } from "@blend-ui/core";
import { BlendIcon } from "@blend-ui/icons";

import cardPrifinaLogo from "../assets/cardPrifinaLogo.svg";

import bxsInfoCircle from "@iconify/icons-bx/bxs-info-circle";

import { API } from "aws-amplify";

import PropTypes from "prop-types";
import {
  i18n,
  useAppContext,
  useFormFields,
  newAppVersionMutation,
} from "@prifina-apps/utils";

//import { useHistory } from "react-router-dom";

import * as C from "./components";

const short = require("short-uuid");

i18n.init();

const StyledBox = styled(Box)`
  height: 129px;
  width: 331px;
  border-radius: 5px;
  align-items: center;
  z-index: 1;
  border: null;
  // background: linear-gradient(180deg, #aa076b 0%, #61045f 100%);
  // background-image: url(${cardPrifinaLogo});
  background: url(${cardPrifinaLogo}),
    linear-gradient(180deg, #aa076b 0%, #61045f 100%);
  background-repeat: no-repeat;
  background-position: right center;
`;

const CreateProjectModal = ({ onClose, onButtonClick, ...props }) => {
  const { currentUser } = useAppContext();
  console.log("NEW APP ", currentUser);

  const { colors } = useTheme();

  const [appFields, handleChange] = useFormFields({
    appId: short.generate(),
    name: "",
    title: "",
    version: 1,
  });

  const [appType, setAppType] = useState(1);

  const createApp = async e => {
    try {
      console.log("CLICK ", appFields);

      await newAppVersionMutation(API, appFields.appId, currentUser.prifinaID, {
        name: appFields.name,
        title: appFields.title,
        identity: currentUser.identity,
        identityPool: currentUser.identityPool,
        version: appFields.version,
        appType: appType,
      });
      // history.push("/");
      // location.reload();
    } catch (e) {
      console.log("error ", e);
    }
  };

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
                  {i18n.__("createProject")}
                </Text>
                <Text paddingTop="36px" color={colors.textMuted}>
                  {i18n.__("projectType")}
                </Text>
                <Flex width="268px">
                  <Flex flexDirection="row" alignItems="center" mr="15px">
                    <Radio
                      fontSize="8px"
                      onChange={() => { }}
                      onClick={() => {
                        setAppType(1);
                      }}
                    />
                    <Text fontSize="xs">{i18n.__("application")}</Text>
                  </Flex>
                  <Flex flexDirection="row" alignItems="center" mr="15px">
                    <Radio
                      fontSize="8px"
                      onChange={() => { }}
                      onClick={() => {
                        setAppType(2);
                      }}
                    />
                    <Text fontSize="xs">{i18n.__("widget")}</Text>
                  </Flex>
                </Flex>
                <Text paddingTop="10px" paddingBottom="16px" color="#ADADAD">
                  {i18n.__("projectName")}
                </Text>
                <Input
                  width="361px"
                  autoFocus={true}
                  placeholder={i18n.__("name")}
                  id={"name"}
                  name={"name"}
                  onChange={handleChange}
                />
                <Box mt={10}>
                  <Input
                    placeholder={i18n.__("title")}
                    id={"title"}
                    name={"title"}
                    onChange={handleChange}
                  />
                </Box>
              </Box>
              <Box paddingLeft="46px">
                <StyledBox>
                  <Box paddingLeft="16px" paddingTop="10px">
                    <Flex>
                      <BlendIcon
                        // iconify={bxsInfoCircle}
                        color={"#580F57"}
                        size={"20"}
                      />
                      <Text fontSize="md" paddingBottom="5px" paddingLeft="8px">
                        {i18n.__("prifinaAppId")}
                      </Text>
                    </Flex>
                    <Text color="#ADADAD" fontSize="xs">
                      {i18n.__("prifinaAppIdText")}
                    </Text>
                    <Text color="#ADADAD" fontSize="xs" paddingTop="7px">
                      {i18n.__("copyAndAddToYourBuild")}
                    </Text>
                  </Box>
                </StyledBox>
                <Text
                  color="#ADADAD"
                  fontSize="xs"
                  paddingTop="34px"
                  paddingBottom="4px"
                >
                  {i18n.__("appId")}
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
              <C.OutlineButton
                variation={"outline"}
                // colorStyle={"error"}
                onClick={e => {
                  setDialogOpen(false);
                  onButtonClick(e, "cancel");
                  e.preventDefault();
                }}
                marginLeft="36px"
              >
                <Text>{i18n.__("cancelButton")}</Text>
              </C.OutlineButton>
              <Button
                onClick={e => {
                  setDialogOpen(false);
                  onButtonClick(e);
                  createApp();
                  e.preventDefault();
                }}
                marginLeft="466px"
              >
                {i18n.__("newProject")}
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
