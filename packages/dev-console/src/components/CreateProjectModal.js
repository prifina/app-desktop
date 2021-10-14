import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@blend-ui/modal";
import {
  Box,
  Button,
  Text,
  Flex,
  useTheme,
  Input,
  Image,
} from "@blend-ui/core";

import styled from "styled-components";

import { Radio, checkAction } from "@blend-ui/core";
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

//import { newAppVersionMutation } from "../graphql/api";
import { useHistory } from "react-router-dom";

const short = require("short-uuid");
//const appId = short.generate();

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

// width = "331px";
// height = "129px";
// bg = "#61045F";
// borderRadius = "5px";
// alignItems = "center";

const CreateProjectModal = ({ onClose, onButtonClick, setStep, ...props }) => {
  const { currentUser } = useAppContext();
  const history = useHistory();
  console.log("NEW APP ", currentUser);

  const [appFields, handleChange] = useFormFields({
    appId: short.generate(),
    name: "",
    title: "",
    //version: "",
  });

  const createApp = async e => {
    try {
      console.log("CLICK ", appFields);

      await newAppVersionMutation(API, appFields.appId, currentUser.prifinaID, {
        name: appFields.name,
        title: appFields.title,
        identity: currentUser.identity,
        identityPool: currentUser.identityPool,
        //version: appFields.version,
      });
      history.push("/");
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
            background: "white",
            width: "806px",
            height: "412px",
            borderRadius: 5,
          }}
          marginLeft="317px"
        >
          {/* <ModalHeader>
            <Text textStyle={"h5"} color={theme.colors.baseError}>
              Title
            </Text>
          </ModalHeader> */}
          <ModalBody paddingLeft="36px" paddingRight="36px" paddingTop="37px">
            <Flex display="flex" flexDirection="row" justifyContent="center">
              <Box>
                <Text textStyle={"semiBold"} fontSize="xl" color="textPrimary">
                  Create Project
                </Text>
                <Text paddingTop="36px" color="#ADADAD">
                  Project Type
                </Text>
                <Flex width="268px">
                  <Radio
                    // checked
                    value="TABLE"
                    fontSize="14px"
                    onClick={checkAction}
                    color="#AA1370"
                    styl
                    textStyle={{ color: "white" }}
                  >
                    Widget
                  </Radio>
                  <Radio
                    // checked
                    value="TABLE"
                    fontSize="14px"
                    onClick={checkAction}
                  >
                    App
                  </Radio>
                </Flex>
                <Text paddingTop="10px" paddingBottom="16px" color="#ADADAD">
                  Project Name
                </Text>
                <Input
                  width="361px"
                  autoFocus={true}
                  placeholder="Name"
                  id={"name"}
                  name={"name"}
                  onChange={handleChange}
                />
                <Box mt={10}>
                  <Input
                    placeholder={"Title"}
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
                        iconify={bxsInfoCircle}
                        color={"#580F57"}
                        size={"20"}
                      />
                      <Text
                        color="white"
                        fontSize={16}
                        paddingBottom="5px"
                        paddingLeft="8px"
                      >
                        Prifina app ID
                      </Text>
                    </Flex>
                    <Text color="#ADADAD" fontSize={12}>
                      This unique identifer is needed to connect your
                      application to prifina.
                    </Text>
                    <Text color="#ADADAD" fontSize={12} paddingTop="7px">
                      Copy it and add it to your build.
                    </Text>
                  </Box>
                </StyledBox>
                <Text
                  color="#ADADAD"
                  fontSize={12}
                  paddingTop="34px"
                  paddingBottom="4px"
                >
                  App ID
                </Text>
                <Input
                  width="331px"
                  placeholder="App ID"
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
              <Button
                variation={"outline"}
                colorStyle={"error"}
                onClick={e => {
                  setDialogOpen(false);
                  {
                    setStep;
                  }
                  e.preventDefault();
                }}
                marginLeft="36px"
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                // onClick={e => {
                //   setDialogOpen(false);

                //   e.preventDefault();
                // }}
                onClick={createApp}
                marginLeft="466px"
              >
                New Project
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
