//global localStorage

import React, { useState, useEffect, useRef } from "react";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@blend-ui/modal";
import { Flex, Button, Text, useTheme } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import PropTypes from "prop-types";
import { useTranslate } from "@prifina-apps/utils";

//import dataCloud from "../../assets/data-console.svg";
import DataCloud from "../../assets/data-console";

import mdiArrowRight from "@iconify/icons-mdi/arrow-right";

/*
export const getRequestTokenQuery = (API, id, source) => {
  return API.graphql({
    query: getRequestToken,
    variables: { id: id, source: source },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};
*/
const DataSourceModal = ({
  onClose,

  dataSourceItems,
  selectedDataSourceIndex,
  getRequestTokenQuery,
  prifinaID,
  ...props
}) => {

  const { __ } = useTranslate();

  const theme = useTheme();

  const { colors } = useTheme();

  const [dialogOpen, setDialogOpen] = useState(true);

  const [requestUrl, setRequestUrl] = useState("#");

  const effectCalled = useRef(false);

  const dataSourceItem = dataSourceItems[selectedDataSourceIndex];
  const IconImage = dataSourceItem.icon;

  console.log("DS MODAL ", dataSourceItems);
  console.log("DS MODAL ", selectedDataSourceIndex);
  useEffect(() => {
    async function init() {
      effectCalled.current = true;
      const result = await getRequestTokenQuery(
        prifinaID,
        dataSourceItem.id,
        2,
      );

      setRequestUrl(result.data.getRequestToken.requestURL);
    }
    if (!effectCalled.current) {
      init();
    }

  }, []);
  const onCloseCheck = (e, action) => {
    console.log("MODAL CLOSE ", e, action);
    onClose(-1);
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text textStyle={"h5"} >
                {__("connect")} {dataSourceItem.title}
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
                    <IconImage style={{ width: "72px" }} />
                    <Flex flexDirection="column">
                      <BlendIcon iconify={mdiArrowRight} color="gray" />
                      <BlendIcon iconify={mdiArrowRight} color="gray" />
                    </Flex>
                    <DataCloud style={{ width: "72px" }} />
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
                    {__("dataSourceModalAlertText")}
                  </Text>
                </Flex>
              </Flex>
              <Flex flex={2} flexDirection="column" justifyContent="center">
                <Text mb={8}>Prifina + {dataSourceItem.title}</Text>
                <Text mb={12} fontSize="sm" color={colors.textMuted}>
                  {__("dataSourceModalText1")}
                </Text>
                <Text fontSize="sm" color={colors.textMuted}>
                  {__("dataSourceModalText2")}
                </Text>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter m={0}>
            <Flex
              style={{
                height: 73,
                width: "100%",
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
                  e.preventDefault();
                  setDialogOpen(false);
                  setTimeout(function () {
                    onClose(-1);
                  }, 500);

                }}
              >
                {__("cancelButton")}
              </Button>

              <Button
                as={"a"}
                /* variation={"link"} */
                target={"_blank"}
                href={requestUrl}
                ml={20}
                onClick={e => {
                  setDialogOpen(false);
                  setTimeout(function () {
                    onClose(-1);
                  }, 500);
                }}
              >
                {__("connect")}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

DataSourceModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  //onButtonClick: PropTypes.func.isRequired,
  dataSourceItems: PropTypes.instanceOf(Array),
  selectedDataSourceIndex: PropTypes.number.isRequired,
  prifinaID: PropTypes.string,
  getRequestTokenQuery: PropTypes.func
};
export default DataSourceModal;
