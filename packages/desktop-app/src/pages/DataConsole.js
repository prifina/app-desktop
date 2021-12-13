/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useCallback, useRef } from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Link,
  Radio,
  useTheme,
} from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import { PrifinaLogo } from "../components/PrifinaLogo";
import styled, { createGlobalStyle } from "styled-components";

import {
  getPrifinaUserQuery,
  listDataSourcesQuery,
  SidebarMenu,
  Navbar,
  i18n,
} from "@prifina-apps/utils";

i18n.init();

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
import garminIcon from "../assets/app-market/garmin-icon.svg";

import lefArrow from "@iconify/icons-bx/bxs-chevron-left";
import mdiFlash from "@iconify/icons-mdi/flash";
import mdiFlashOutline from "@iconify/icons-mdi/flash-outline";
import mdiHomeOutline from "@iconify/icons-mdi/home-outline";
import mdiFileDocumentOutline from "@iconify/icons-mdi/file-document-outline";

import mdiCached from "@iconify/icons-mdi/cached";
import mdiFileEditOutline from "@iconify/icons-mdi/file-edit-outline";
import mdiTrashCanOutline from "@iconify/icons-mdi/trashcan-outline";

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

  const data = [
    {
      name: "Oura",
      frequency: "Daily",
      method: "API Connection",
      last: "4/4/21",
      batches: "4",
      actions: "",
    },
    {
      name: "Fitbit",
      frequency: "Daily",
      method: "API Connection",
      last: "4/4/21",
      batches: "4",
      actions: "",
    },
  ];

  const Columns = [
    {
      Header: "Data Source",
      accessor: "name",
      Cell: props => {
        return <Text>{props.cell.value}</Text>;
      },
    },
    {
      Header: "Frequency",
      accessor: "frequency",
      Cell: props => {
        return <Text>{props.cell.value}</Text>;
      },
    },
    {
      Header: "Method",
      accessor: "method",
      Cell: props => {
        return <Text>{props.cell.value}</Text>;
      },
    },
    {
      Header: "Last",
      accessor: "last",
      Cell: props => {
        return <Text>{props.cell.value}</Text>;
      },
    },
    {
      Header: "Batches",
      accessor: "batches",
      Cell: props => {
        return <Text>{props.cell.value}</Text>;
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: props => {
        return (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <BlendIcon iconify={mdiCached} />
            <BlendIcon iconify={mdiFileEditOutline} />
            <BlendIcon iconify={mdiTrashCanOutline} />
          </div>
        );
      },
    },
  ];

  const [step, setStep] = useState(0);

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

  const [allValues, setAllValues] = useState({
    title: "",
  });

  const items = [
    {
      label: "Home",
      icon: mdiHomeOutline,
      onClick: () => {
        setStep(0);
      },
    },
    {
      label: "Data Sources",
      icon: mdiFlashOutline,
      onClick: () => {
        setStep(1);
      },
    },
    {
      label: "All Files",
      icon: mdiFileDocumentOutline,
      disabled: true,
    },
  ];

  const sourceData = [
    {
      title: "Oura",
      image: ouraIcon,
      category: "Health * Wearables",
      description: "The most accurate data on Sleep, Readiness, and Activity.",
      children: (
        <Button
          size="xs"
          onClick={() => {
            setStep(2);
            setAllValues({
              ...allValues,
              title: "Oura",
            });
          }}
        >
          {i18n.__("connect")}
        </Button>
      ),
    },
    {
      title: "Fitbit",
      image: fitbitIcon,
      category: "Health * Wearables",
      description: "The most accurate data on Sleep, Readiness, and Activity.",
      children: (
        <Button
          size="xs"
          onClick={() => {
            setStep(2);
            setAllValues({
              ...allValues,
              title: "Fitbit",
            });
          }}
        >
          {i18n.__("connect")}
        </Button>
      ),
    },
    {
      title: "Garmin",
      image: garminIcon,
      category: "Health * Wearables",
      description: "The most accurate data on Sleep, Readiness, and Activity.",
      children: (
        <Button
          size="xs"
          onClick={() => {
            setStep(2);
            setAllValues({
              ...allValues,
              title: "Garmin",
            });
          }}
        >
          {i18n.__("connect")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <GlobalStyle />
      <SidebarMenu items={items} />
      <Navbar backgroundColor="baseWhite">
        <PrifinaLogo className={"data-cloud"} />
      </Navbar>
      <Flex paddingLeft="286px">
        {step === 0 && (
          <>
            <Flex
              paddingTop="40px"
              paddingRight="65px"
              paddingLeft="65px"
              flexDirection="column"
              width="100vw"
              alignItems="center"
            >
              <Flex
                className="bannerContainer"
                width="1024px"
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
                  <Text textStyle="h3">{i18n.__("dataCloudHomeHeading")}</Text>
                  <Text color={colors.textMuted}>
                    {i18n.__("dataCloudHomeText")}
                  </Text>
                  <Button
                    size="md"
                    variation="outline"
                    style={{ position: "absolute", bottom: 30 }}
                  >
                    {i18n.__("learnMore")}
                  </Button>
                </Flex>
                <Image src={dataCloudBanner} />
              </Flex>

              <Flex
                marginTop="24px"
                width="1024px"
                justifyContent="space-between"
              >
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
                    <Text textStyle="h4">{i18n.__("connectDataSources")}</Text>
                    <Text fontSize="xxs">
                      {i18n.__("connectingDataSources")}
                    </Text>
                  </Flex>
                  <Image src={connectDataSources} />
                  <Button
                    size="sm"
                    mt="40px"
                    onClick={() => {
                      setStep(1);
                    }}
                  >
                    {i18n.__("connect")}
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
                    <Text textStyle="h4">{i18n.__("uploadData")}</Text>
                    <Text fontSize="xxs">{i18n.__("uploadFileText")}</Text>
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
                      <Text fontSize="xxs">{i18n.__("dragAndDropText")}</Text>
                      <Link fontSize="xxs" ml={3}>
                        {i18n.__("clickToBrowse")}
                      </Link>
                    </Flex>
                  </Flex>
                  <Text fontSize="xxs" color={colors.textAccent}>
                    {i18n.__("notMoreThan500")}
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
              // paddingRight="30px"
              // paddingLeft="25px"
              flexDirection="column"
              width="100%"
            >
              <div
                style={{
                  overflow: "hidden",
                  paddingTop: 16,
                  paddingBottom: 16,
                  paddingLeft: 15,
                  display: "flex",
                  flexDirection: "column",
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
                      <Text>{i18n.__("availableSources")}</Text>
                    </Tab>
                    <Tab>
                      <Text>{i18n.__("connectedSources")}</Text>
                    </Tab>
                  </TabList>
                  <TabPanelList style={{ backgroundColor: null }}>
                    <TabPanel>
                      <div
                        style={{
                          overflow: "auto",
                          marginTop: 40,
                          paddingBottom: "50px",
                        }}
                      >
                        <Flex flexDirection="column">
                          <Box textAlign="center">
                            <Text textStyle="h2">
                              {i18n.__("availableDataSources")}
                            </Text>
                            <Text fontSize="lg">
                              {i18n.__("selectAvailableDataSourcesText")}
                            </Text>
                          </Box>
                          <Flex
                            mt={40}
                            mb={20}
                            paddingRight="10px"
                            paddingLeft="10px"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <C.SourceCard items={sourceData} />
                          </Flex>
                        </Flex>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div
                        style={{
                          overflow: "auto",
                          marginTop: 50,
                          paddingBottom: "50px",
                        }}
                      >
                        <Flex flexDirection="column">
                          <Flex
                            mb={20}
                            paddingLeft="45px"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Text>{i18n.__("connectedSources")}</Text>
                            <Button
                              onClick={() => {
                                setActiveTab(0);
                              }}
                            >
                              {i18n.__("addSource")}
                            </Button>
                          </Flex>
                          <div>
                            <Table columns={Columns} data={data} />
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
        {step === 2 && (
          <>
            <Flex width="100%" justifyContent="center" position="relative">
              <C.TextButton
                onClick={() => {
                  setStep(1);
                }}
                style={{ position: "absolute", top: 40, left: 30 }}
              >
                <BlendIcon iconify={lefArrow} size="14px" />
                {i18n.__("connectedSources")}
              </C.TextButton>

              <Flex
                mt={140}
                width="587px"
                height="390px"
                flexDirection="column"
                justifyContent="space-between"
                paddingTop="35px"
                paddingBottom="35px"
                boxShadow="0px 3.29175px 6.5835px rgba(91, 92, 91, 0.35)"
                borderRadius="10px"
              >
                <Flex paddingRight="40px" paddingLeft="40px" mb={20}>
                  <Text textStyle="h2">{allValues.title} data connector</Text>
                </Flex>
                <Flex
                  height="65px"
                  bg="#E0EAFF"
                  alignItems="center"
                  padding={14}
                  style={{ margin: 0 }}
                >
                  <BlendIcon iconify={mdiFlash} color={colors.baseLink} />
                  <Text color={colors.baseLink} fontSize="xxs" ml={8}>
                    Connect your {allValues.title} account and Prifina will
                    automatically retrieve your data and add it to your Data
                    Cloud.
                  </Text>
                </Flex>
                <Flex
                  paddingRight="40px"
                  paddingLeft="40px"
                  flexDirection="column"
                  mt={12}
                >
                  <Text textStyle="h4">{i18n.__("connectionPreferences")}</Text>
                  <Text fontSize="sm" color={colors.textMuted}>
                    Make your choices and sign in to get data from{" "}
                    {allValues.title}.
                  </Text>
                  <Flex mt={10}>
                    <Text>{i18n.__("syncWithCloud")}</Text>
                  </Flex>
                  <Flex>
                    <Radio
                      checked
                      onChange={() => {}}
                      value="TABLE"
                      fontSize="md"
                      textStyle={{ color: "white" }}
                    >
                      {i18n.__("dailyRecommended")}
                    </Radio>
                  </Flex>
                </Flex>

                <Flex
                  justifyContent="space-between"
                  paddingRight="40px"
                  paddingLeft="40px"
                  mt={20}
                >
                  <Button>{i18n.__("disconnect")}</Button>
                  <Button>{i18n.__("connect")}</Button>
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
};

DataConsole.displayName = "DataConsole";

export default DataConsole;
