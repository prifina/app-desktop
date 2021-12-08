/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useCallback, useRef } from "react";

import { Box, Flex, Text, Button, Image, Link, useTheme } from "@blend-ui/core";
import { ReactComponent as DefaultWidget } from "../assets/third-party-app.svg";

import { PrifinaLogo } from "../components/PrifinaLogo";
import styled, { createGlobalStyle } from "styled-components";

import {
  getPrifinaUserQuery,
  listDataSourcesQuery,
  SidebarMenu,
  Navbar,
} from "@prifina-apps/utils";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import PropTypes from "prop-types";

import * as C from "./data-cloud/components";

import Table from "./data-cloud/Table";

import dataCloudBanner from "../assets/data-cloud/data-cloud-banner.svg";
import connectDataSources from "../assets/data-cloud/connect-data-sources.svg";
import folder from "../assets/folder.svg";

///data source icons

import ouraIcon from "../assets/app-market/oura-icon.svg";
import fitbitIcon from "../assets/app-market/fitbit-icon.svg";
const GlobalStyle = createGlobalStyle`
.data-cloud path {
  fill: #F15F79;
}
`;

const DataConsole = props => {
  console.log("DATA CONSOLE PROPS ", props);

  const { colors } = useTheme();

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

  const Columns = [
    {
      Header: "Name",
      accessor: "name",
      Cell: props => {
        return (
          <Text
            // fontSize="xs"
            onClick={() => {
              setStep(3);
              setAllValues({
                ...allValues,
                // title: widgets.current[w].title,
                name: props.cell.value,
                id: props.row.values.id,
              });
            }}
          >
            {props.cell.value}
          </Text>
        );
      },
    },
    {
      Header: "App ID",
      accessor: "id",
      Cell: props => {
        return <Text>{props.cell.value}</Text>;
      },
    },
    {
      Header: "Type",
      accessor: "appType",
      className: "appType",
      // Cell: cellProp => appTypes[cellProp.row.values.appType],
    },

    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Status",
      accessor: "status",
      className: "status",
      Cell: cellProp => versionStatus[cellProp.row.values.status],
    },
    {
      Header: "Version",
      accessor: "version",
      className: "version",
    },
    {
      Header: "Modified",
      accessor: "modifiedAt",
      className: "date",
      Cell: props => {
        return <Text>{props.cell.value}</Text>;
      },
    },
    {
      Header: () => null, // No header
      id: "sendApp", // It needs an ID
      Cell: cellProp => {
        //console.log("ROW ", cellProp);
        return (
          <Button
            size="xs"
            onClick={e => {
              console.log(cellProp.row.values);
              sendClick(cellProp.row.values);
            }}
          >
            {i18n.__("submit")}
          </Button>
        );
      },
    },
  ];

  const [step, setStep] = useState(1);

  switch (step) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 3:
      break;
    default:
  }

  const [activeTab, setActiveTab] = useState(0);

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };

  const items = [
    {
      label: "Home",
    },
    { label: "Data Sources" },
    {
      label: "Apps",
    },
  ];

  const sourceData = [
    {
      title: "Oura",
      image: ouraIcon,
      category: "Health * Wearables",
      description: "The most accurate data on Sleep, Readiness, and Activity.",
      buttonText: "connect",
    },
    {
      title: "Fitbit",
      image: fitbitIcon,
      category: "Health * Wearables",
      description: "The most accurate data on Sleep, Readiness, and Activity.",
      buttonText: "connect",
    },
    {
      title: "Garmin",
      image: fitbitIcon,
      category: "Health * Wearables",
      description: "The most accurate data on Sleep, Readiness, and Activity.",
      buttonText: "connect",
    },
  ];

  return (
    <>
      <GlobalStyle />

      <SidebarMenu items={items} />
      <Navbar backgroundColor="baseWhite">
        <PrifinaLogo className={"data-cloud"} />
      </Navbar>
      <Flex width="100vw" height="100vh" paddingLeft="286px">
        {step === 0 && (
          <>
            <Flex
              paddingTop="40px"
              paddingRight="65px"
              paddingLeft="65px"
              flexDirection="column"
            >
              <Flex
                className="bannerContainer"
                flexDirection="row"
                bg="backgroundPrimary"
                borderRadius="15px"
                paddingTop="10px"
                paddingBottom="10px"
                paddingLeft="32px"
                paddingRight="88px"
              >
                <Flex
                  className="textContainer"
                  flexDirection="column"
                  position="relative"
                  paddingTop="25px"
                  paddingBottom="25px"
                  maxWidth="613px"
                >
                  <Text textStyle="h3">
                    Bring all your data into Data Cloud
                  </Text>
                  <Text color={colors.textMuted}>
                    Your Data Cloud is the heart of your Personal Data Engine.
                    By bringing your data into your personal data cloud, you can
                    activate it in different apps in your Prifina account.
                  </Text>
                  <Button
                    size="md"
                    variation="outline"
                    style={{ position: "absolute", bottom: 30 }}
                  >
                    Learn More
                  </Button>
                </Flex>
                <Image src={dataCloudBanner} />
              </Flex>

              <Flex marginTop="24px">
                <Flex
                  className="connectDataContainer"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  boxShadow="0px 12px 24px rgba(182, 204, 214, 0.2)"
                  borderRadius="15px"
                  width="500px"
                  height="360px"
                  padding="25px"
                >
                  <Flex flexDirection="column" alignItems="center" mb={40}>
                    <Text textStyle="h4">Connect data sources</Text>
                    <Text fontSize="xxs">
                      Connecting your data sources to activate this data in apps
                    </Text>
                  </Flex>
                  <Image src={connectDataSources} />
                  <Button size="sm" mt="40px">
                    Connect
                  </Button>
                </Flex>
                <Flex
                  className="uploadDataContainer"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  boxShadow="0px 12px 24px rgba(182, 204, 214, 0.2)"
                  borderRadius="15px"
                  width="500px"
                  height="360px"
                  padding="25px"
                >
                  <Flex flexDirection="column" alignItems="center" mb={40}>
                    <Text textStyle="h4">Upload your data</Text>
                    <Text fontSize="xxs">
                      You can upload one file at a time
                    </Text>
                  </Flex>
                  <Flex
                    bg="baseTertiary"
                    width="468px"
                    height="200px"
                    borderRadius="20px"
                    border="1px solid #D3F2F0"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    mb={25}
                  >
                    <Image src={folder} width="73px" />
                    <Flex>
                      <Text fontSize="xxs">
                        Drag and drop your files here or
                      </Text>
                      <Link fontSize="xxs" ml={3}>
                        click to browse
                      </Link>
                    </Flex>
                  </Flex>
                  <Text fontSize="xxs" color={colors.textAccent}>
                    Not more than 500 mb
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
        {step === 1 && (
          <>
            <Flex
              paddingTop="30px"
              paddingRight="30px"
              paddingLeft="25px"
              flexDirection="column"
            >
              <div
                style={{
                  overflow: "hidden",
                  paddingTop: 16,
                  paddingBottom: 16,
                  paddingLeft: 40,
                  paddingRight: 40,
                  borderRadius: 10,
                  minWidth: 1192,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tabs
                  activeTab={activeTab}
                  onClick={tabClick}
                  style={{ height: "100%" }}
                  variant={"line"}
                >
                  <TabList>
                    <Tab>
                      <Text>Available Sources</Text>
                    </Tab>
                    <Tab>
                      <Text>Connected Sources</Text>
                    </Tab>
                  </TabList>
                  <TabPanelList style={{ backgroundColor: null }}>
                    <TabPanel
                      style={{
                        height: "100vh",
                        paddingBottom: "50px",
                        overflow: "auto",
                      }}
                    >
                      <div style={{ overflow: "auto" }}>
                        <Flex flexDirection="column">
                          <Box textAlign="center">
                            <Text textStyle="h2">Available data sources</Text>
                            <Text fontSize="lg">
                              Select from available data sources to add data to
                              your Data cloud
                            </Text>
                          </Box>
                          <Flex mt={40} mb={20} mr={5}>
                            <C.SourceCard items={sourceData} />
                          </Flex>
                        </Flex>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div style={{ overflow: "auto", marginTop: 50 }}>
                        <Flex>
                          <Flex
                            flexDirection="column"
                            mb={20}
                            justifyContent="space-between"
                          >
                            <Text>Connected data sources</Text>
                            <Button>+ Add Source</Button>
                          </Flex>
                          <div>
                            <Table columns={Columns} />
                          </div>
                        </Flex>
                      </div>
                    </TabPanel>
                  </TabPanelList>
                </Tabs>
              </div>
            </Flex>
          </>
        )}
      </Flex>
      {/* 
    <Box width={"100vw"} height={"100vh"}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Text  textStyle={"h3"}>
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
