import React, { useState } from "react";
import { Box, Flex, Text, Button, Input, useTheme, Link } from "@blend-ui/core";
import { BlendIcon } from "@blend-ui/icons";

import PropTypes from "prop-types";

import { i18n } from "@prifina-apps/utils";

import bxsEdit from "@iconify/icons-bx/bx-edit-alt";
import bxsXCircle from "@iconify/icons-bx/bx-x-circle";
import addCircle from "@iconify/icons-mdi/add-circle";
import trashCan from "@iconify/icons-mdi/trash-can";
import mdiPowerPlug from "@iconify/icons-mdi/power-plug";

import styled from "styled-components";

import * as C from "./components";

i18n.init();

export const CustomSelect = styled.select`
  border-radius: 8px;
  border: none;
  color: white;
  padding: 8px;
  font-size: 12px;
  background: #aa076b;
  height: 30px;
  width: 300px;
  &:focus {
    border: none;
  }
`;

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
      alignItems="center"
      height="36px"
      border="1px solid gray"
      bg={colors.subtleHiover}
      borderRadius="10px"
      width="438px"
      paddingLeft="15px"
      paddingRight="15px"
      marginTop="5px"
    >
      <Flex alignItems="center">
        <BlendIcon
          iconify={mdiPowerPlug}
          color={colors.baseBright}
          onClick={() => completeDataSource(index)}
        />
        <Flex
          ml={8}
          mr={16}
          style={{
            padding: 5,
            border: "1px solid #28C3E8",
            borderRadius: 20,
            height: 22,
            alignItems: "center",
          }}
        >
          <Text fontSize="xs" color="#28C3E8">
            USER HELD
          </Text>
        </Flex>
        {dataSource.url !== undefined ? (
          <Flex>
            <Text mr="5px">{dataSource.source}</Text>
          </Flex>
        ) : (
          <Flex flexDirection="column">
            <Text mr="5px">{dataSource.source}</Text>
          </Flex>
        )}
      </Flex>

      <Flex>
        <Flex alignItems="center" justifySelf="flex-end">
          <BlendIcon
            iconify={addCircle}
            color={colors.baseBright}
            onClick={() => completeDataSource(index)}
          />
          <BlendIcon
            iconify={trashCan}
            color={colors.baseBright}
            onClick={() => removeDataSource(index)}
          />
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
      alignItems="center"
      height="36px"
      border="1px solid gray"
      bg={colors.subtleHiover}
      borderRadius="10px"
      width="438px"
      paddingLeft="15px"
      paddingRight="15px"
      marginTop="5px"
    >
      <Flex alignItems="center">
        <BlendIcon
          iconify={mdiPowerPlug}
          color={colors.baseBright}
          onClick={() => completeDataSource(index)}
        />
        <Flex
          ml={8}
          mr={16}
          style={{
            padding: 5,
            border: "1px solid #28C3E8",
            borderRadius: 20,
            height: 22,
            alignItems: "center",
          }}
        >
          <Text fontSize="xs" color="#28C3E8">
            {/* {i18n.__("publicApi")} */}
            USER HELD
          </Text>
        </Flex>
        {dataSource.url !== undefined ? (
          <Flex>
            <Text mr="5px">{dataSource.source}</Text>
          </Flex>
        ) : (
          <Flex flexDirection="column">
            <Text mr="5px">{dataSource.source}</Text>
          </Flex>
        )}
      </Flex>

      <Flex>
        <Flex alignItems="center" justifySelf="flex-end">
          <BlendIcon
            iconify={trashCan}
            color={colors.baseBright}
            onClick={() => uncompleteDataSource(index)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

ControlAddedDataSources.propTypes = {
  // dataSource: PropTypes.instanceOf(Array),
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
  };

  const handleChange = event => {
    const bySourceType = selectOptions.reduce(
      (result, currentSelectOption) => ({
        ...result,
        [currentSelectOption.source]: currentSelectOption.sourceType,
      }),
      {},
    );
    console.log("SELECT", event.target);
    setValue(event.target.value);
    setSourceType(bySourceType[event.target.value]);
  };
  console.log("SELECT OPTIONS", selectOptions);

  console.log("SELECT OPTIONS value", value);

  return (
    <form onSubmit={handleSubmit}>
      <Flex alignItems="center">
        <CustomSelect onChange={handleChange}>
          {selectOptions.map((item, index) => (
            <option key={index}>{item.source}</option>
          ))}
        </CustomSelect>
        <Button
          size="xs"
          ml={4}
          onChange={e => {
            console.log("CLICK ", e.target.value);

            setValue(e.target.value);
          }}
        >
          Add
        </Button>
      </Flex>
    </form>
  );
}

DataSourceForm.propTypes = {
  // addDataSource: PropTypes.instanceOf(Array),
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
      <Flex>
        <CustomSelect onChange={handleChange}>
          {selectOptions.map((item, index) => (
            <option key={index}>{item.name}</option>
          ))}
        </CustomSelect>
        <Button
          disabled
          size="xs"
          ml={4}
          onChange={e => {
            console.log("CLICK ", e.target.value);

            setValue(e.target.value);
          }}
        >
          Add
        </Button>
      </Flex>
    </form>
  );
}

ApiForm.propTypes = {
  // addApi: PropTypes.string,
};
