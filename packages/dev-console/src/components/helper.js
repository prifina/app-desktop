import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  SearchSelect,
  useTheme,
  Link,
  AutoComplete,
} from "@blend-ui/core";
import { BlendIcon } from "@blend-ui/icons";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@blend-ui/modal";

import PropTypes from "prop-types";

import { i18n } from "@prifina-apps/utils";

import bxsEdit from "@iconify/icons-bx/bx-edit-alt";
import bxsXCircle from "@iconify/icons-bx/bx-x-circle";

import * as C from "./components";

i18n.init();

const selectOptions = [
  {
    key: "0",
    value: "Prifina/Oura",
    functions: ["Activity", "Sleep", "Readiness"],
    url: "www.oura.com",
  },
  {
    key: "1",
    value: "Prifina/Fitbit",
    functions: ["Function1", "Function2"],
    url: "www.fitbit.com",
  },
  {
    key: "2",
    value: "Prifina/Netflix",
    functions: [
      "Function1",
      "Function2",
      "Function3",
      "Function4",
      "Function5",
      "Function6",
    ],
    url: "www.netflix.com",
  },
];

export function AddRemoveDataSources({
  dataSource,
  index,
  completeDataSource,
  removeDataSource,
}) {
  console.log("data source", dataSource);

  const { colors } = useTheme();

  return (
    <Flex
      justifyContent="space-between"
      height="72px"
      border="1px solid gray"
      borderRadius="10px"
      width="438px"
      paddingLeft="15px"
      paddingRight="15px"
      marginTop="5px"
    >
      {dataSource.url !== undefined ? (
        <Flex paddingTop="5px">
          <Text mr="5px">{dataSource.text}</Text>

          <Link href={dataSource.url} target="_blank">
            {i18n.__("fullSpecHere")}
          </Link>
        </Flex>
      ) : (
        <Flex paddingTop="5px" flexDirection="column">
          <Text mr="5px">{dataSource.text}</Text>
          {/* temoporary */}
          <Link href="" target="_blank">
            URL of this API
          </Link>
        </Flex>
      )}
      {dataSource.func !== undefined ? (
        <Flex
          style={{
            flexDirection: "column",
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <Flex
            style={{
              border: `1px solid ${colors.baseErrorHover}`,
              borderRadius: 5.5,
              height: 22,
              width: 100,
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text fontSize="xs" color={colors.baseErrorHover}>
              {i18n.__("dataConnector")}
            </Text>
          </Flex>
          <Text>
            {i18n.__("dataConnectorContains")} {dataSource.func.length}{" "}
            {i18n.__("functions")}
          </Text>
        </Flex>
      ) : (
        <Flex
          style={{
            marginTop: 5,
            padding: 5,
            border: `1px solid ${colors.textLink}`,
            borderRadius: 5.5,
            height: 22,
            alignItems: "center",
          }}
        >
          <Text fontSize="xs" color={colors.textLink}>
            {i18n.__("publicApi")}
          </Text>
        </Flex>
      )}
      <Flex>
        <Flex alignItems="center" justifySelf="flex-end">
          <button
            onClick={() => completeDataSource(index)}
            style={{ width: 50, height: 50, marginRight: 5 }}
          >
            <Text textStyle="h3" color="blue">
              +
            </Text>
          </button>
          <button
            onClick={() => removeDataSource(index)}
            style={{ width: 50, height: 50 }}
          >
            <Text textStyle="h3" colorStyle="error">
              x
            </Text>
          </button>
        </Flex>
      </Flex>
    </Flex>
  );
}

AddRemoveDataSources.propTypes = {
  dataSource: PropTypes.instanceOf(Array),
  index: PropTypes.number,
  completeDataSource: PropTypes.func,
  removeDataSource: PropTypes.func,
};

export function ControlAddedDataSources({
  dataSource,
  index,
  uncompleteDataSource,
  editControled,
}) {
  const theme = useTheme();

  const { colors } = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);

  const onCloseCheck = (e, action) => {
    console.log("MODAL CLOSE ", e, action);
    onClose(e, action);
    e.preventDefault();
  };
  return (
    <Flex
      justifyContent="space-between"
      height="72px"
      border="1px solid gray"
      borderRadius="10px"
      width="438px"
      paddingLeft="15px"
      paddingRight="15px"
      marginTop="5px"
    >
      {dataSource.url !== undefined ? (
        <Flex paddingTop="5px">
          <Text mr="5px">{dataSource.name}</Text>

          <Link href={dataSource.url} target="_blank">
            {i18n.__("fullSpecHere")}
          </Link>
        </Flex>
      ) : (
        <Flex paddingTop="5px" flexDirection="column">
          <Text mr="5px">{dataSource.name}</Text>

          <Link href="" target="_blank">
            URL of this API
          </Link>
        </Flex>
      )}
      {dataSource.func !== undefined ? (
        <Flex
          style={{
            flexDirection: "column",

            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <Flex
            style={{
              border: `1px solid ${colors.baseErrorHover}`,
              borderRadius: 5.5,
              height: 22,
              width: 100,
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text fontSize="xs" color={colors.baseErrorHover}>
              {i18n.__("dataConnector")}
            </Text>
          </Flex>
          <Text>
            {i18n.__("dataConnectorContains")} {dataSource.func.length}{" "}
            {i18n.__("functions")}
          </Text>
        </Flex>
      ) : (
        <Flex
          style={{
            marginTop: 5,
            padding: 5,
            border: `1px solid ${colors.textLink}`,
            borderRadius: 5.5,
            height: 22,
            alignItems: "center",
          }}
        >
          <Text fontSize="xs" color={colors.textLink}>
            {i18n.__("publicApi")}
          </Text>
        </Flex>
      )}

      <Flex alignItems="center">
        <>
          <Modal
            isOpen={dialogOpen}
            closeOnEsc={true}
            closeOnOutsideClick={false}
            onClose={onCloseCheck}
            scrollBehavior={"inside"}
            theme={theme}
          >
            <ModalContent
              style={{
                background: "white",
                height: "412px",
                width: 350,
              }}
            >
              <ModalHeader>
                <Flex
                  justifyContent="space-between"
                  paddingLeft="20px"
                  paddingRight="20px"
                >
                  <Text textStyle={"h5"}>{i18n.__("prfinaDataConnector")}</Text>
                  <BlendIcon
                    iconify={bxsXCircle}
                    onClick={e => {
                      setDialogOpen(false);

                      e.preventDefault();
                    }}
                  />
                </Flex>
              </ModalHeader>
              <ModalBody paddingLeft="20px" paddingRight="20px">
                <Flex display="flex" flexDirection="column">
                  <Text>{i18n.__("tellUsWhatDataYourAppUses")}</Text>
                  <Text mt="20px">{i18n.__("publicApiAdress")}</Text>
                  <Input value={dataSource.text} disabled />
                  <Text mt="20px">{i18n.__("listDataAttributesUsed")}</Text>
                  <textarea style={{ height: 100 }} />
                </Flex>
              </ModalBody>
              <ModalFooter
                padding="20px"
                justifyContent="space-between"
                flexDirection="row"
              >
                <Button
                  variation={"outline"}
                  colorStyle={"error"}
                  onClick={e => {
                    setDialogOpen(false);

                    e.preventDefault();
                  }}
                >
                  {i18n.__("cancelButton")}
                </Button>
                <Button
                  onClick={e => {
                    setDialogOpen(false);
                    ///further implementation
                    e.preventDefault();
                  }}
                >
                  {i18n.__("submit")}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
        {/* {editControled ? ( */}
        <>
          {/* <button
            onClick={() => setDialogOpen(true)}
            style={{ width: 50, height: 50, marginRight: 5 }}
          >
            <BlendIcon iconify={bxsEdit} />
          </button> */}
          <button
            onClick={() => uncompleteDataSource(index)}
            style={{ width: 50, height: 50 }}
          >
            <Text textStyle="h3" colorStyle="error">
              x
            </Text>
          </button>
        </>
        {/* ) : null} */}
      </Flex>
    </Flex>
  );
}

ControlAddedDataSources.propTypes = {
  dataSource: PropTypes.instanceOf(Array),
  index: PropTypes.number,
  uncompleteDataSource: PropTypes.func,
  editControled: PropTypes.bool,
};

export function DataSourceForm({ addDataSource, selectOptions }) {
  const [value, setValue] = useState("");
  const [sourceType, setSourceType] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addDataSource(value, sourceType);
    setValue("");
    setFunctions("");
  };

  const handleChange = event => {
    const bySourceType = selectOptions.reduce(
      (result, currentSelectOption) => ({
        ...result,
        [currentSelectOption.value]: currentSelectOption.sourceType,
      }),
      {},
    );
    console.log("SELECT", event.target.value);
    setValue(event.target.value);
    setSourceType(bySourceType[event.target.value]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex>
        <SearchSelect
          variation="outline"
          options={selectOptions}
          defaultValue
          searchLength={1}
          showList={true}
          selectOption="value"
          size="sm"
          width="438px"
          onChange={handleChange}
        />
        <button
          style={{ width: 48, height: 48, marginLeft: 4 }}
          onChange={e => {
            console.log("CLICK ", e.target.value);

            setValue(e.target.value);
          }}
        >
          +
        </button>
      </Flex>
    </form>
  );
}

DataSourceForm.propTypes = {
  addDataSource: PropTypes.instanceOf(Array),
};

export function ApiForm({ addApi, selectOptions }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addApi(value);
    setValue("");
  };

  const handleChange = event => {
    const functionsByDataType = selectOptions.reduce(
      (result, currentSelectOption) => ({
        ...result,
        [currentSelectOption.value]: currentSelectOption.functions,
      }),
      {},
    );
    const urlByDataType = selectOptions.reduce(
      (result, currentSelectOption) => ({
        ...result,
        [currentSelectOption.value]: currentSelectOption.url,
      }),
      {},
    );
    console.log("SELECT", functionsByDataType[event.target.value]);
    setValue(event.target.value);
    setFunctions(functionsByDataType[event.target.value]);
    setUrl(urlByDataType[event.target.value]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box alignItems="center" width="438px">
        {/* <C.StyledInput
          width="438px"
          type="text"
          className="input"
          value={value}
          onChange={e => setValue(e.target.value)}
        /> */}

        <AutoComplete
          suggestions={selectOptions}
          // showList={true}
          // activeItem={2}
          // onChange={e => setValue(e.target.value)}
          onChange={handleChange}
        />

        <button
          style={{ width: 48, height: 48, marginLeft: 4 }}
          onChange={e => setValue(e.currentTarget.value)}
        >
          +
        </button>
      </Box>
    </form>
  );
}

ApiForm.propTypes = {
  addApi: PropTypes.string,
};
