/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useCallback, useRef } from "react";

import { Box, Flex, Text, Button } from "@blend-ui/core";
import { ReactComponent as DefaultWidget } from "../assets/third-party-app.svg";

import { PrifinaLogo } from "../components/PrifinaLogo";
import styled, { createGlobalStyle } from "styled-components";

import { getPrifinaUserQuery, listDataSourcesQuery } from "@prifina-apps/utils";

import PropTypes from "prop-types";
import { listDataSources } from "@prifina-apps/utils/dist/esm/graphql/queries";

const GlobalStyle = createGlobalStyle`
.data-cloud path {
  fill: #F15F79;
}
`;

const DataConsole = props => {
  console.log("DATA CONSOLE PROPS ", props);
  const { GraphQLClient, prifinaID } = props;

  const dataSources = useRef({});
  const [installedDataSources, setInstalledDataSources] = useState([]);

  useEffect(() => {
    listDataSourcesQuery(GraphQLClient, {
      filter: { sourceType: { lt: 3 } },
    }).then(res => {
      const dataSources = res.data.listDataSources.items;
      console.log("DATA SOURCES ", dataSources);
    });
  }, []);

  return (
    <>
      <GlobalStyle />
      <PrifinaLogo className={"data-cloud"} />
      {/* 
    <Box width={"100vw"} height={"100vh"}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Text textAlign={"center"} textStyle={"h3"}>
          DataConsole
        </Text>
      </Flex>
    </Box>
    */}
    </>
  );
};

DataConsole.displayName = "DataConsole";

export default DataConsole;
