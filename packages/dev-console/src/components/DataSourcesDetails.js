import React from "react";

import {
  Box,
  Flex,
  Text,
  useTheme,
} from "@blend-ui/core";

import PlaceholderImage from "../assets/PlaceholderImage";

import { BlendIcon } from "@blend-ui/icons";

import trashCan from "@iconify/icons-mdi/trash-can";

import mdiPowerPlug from "@iconify/icons-mdi/power-plug";

import PropTypes from "prop-types";

export function ControlAddedDataSources({
  dataSource,
  keyIndex,
  deleteDataSource,
}) {

  const { colors } = useTheme();

  return (
    <Box>
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
          />

          {dataSource !== undefined && dataSource !== null ? (
            <Flex>
              <Text mr="5px">{dataSource?.url !== undefined ? "" : "USER HELD "}{dataSource.name}</Text>
            </Flex>
          ) : null}
        </Flex>

        <Flex>
          <Flex alignItems="center" justifySelf="flex-end">
            <BlendIcon
              iconify={trashCan}
              color={colors.baseBright}
              onClick={() => deleteDataSource(keyIndex)}
              style={{ cursor: "pointer" }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

ControlAddedDataSources.propTypes = {
  dataSource: PropTypes.object,
  keyIndex: PropTypes.number,
  deleteDataSource: PropTypes.func,
};


const DataSourcesDetails = ({ deleteDataSource, allDataSources, selectedDataSources }) => {

  console.log("DETAILS ", allDataSources, selectedDataSources)
  const { colors } = useTheme();

  return <>
    <Box>
      <Text mt="20px" mb="20px">
        Data sources used in your project
      </Text>
      {selectedDataSources.length > 0 &&
        selectedDataSources.map((item, index) => {
          const dataSource = allDataSources[item];
          return <ControlAddedDataSources
            key={index}
            keyIndex={index}
            dataSource={dataSource}
            deleteDataSource={deleteDataSource}
          />
        })
      }
      {selectedDataSources.length === 0 &&

        <Flex alignItems="center" height={"272px"} bg={"#6B6669"} style={{
          border: "1px dashed #373436",
          width: 438,
          borderRadius: 4,
        }}>
          <Box textAlign="center" width="100%">
            <PlaceholderImage />

            <Text fontSize="lg" mt={16}>
              Search and select data sources
            </Text>
            <Text mt="10px" color={colors.textSecondary}>
              Data sources you add will show up here
            </Text>
          </Box>
        </Flex>
      }
    </Box>
  </>



}

export default DataSourcesDetails;    