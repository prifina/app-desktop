import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Link,
  Radio,
  useTheme,
} from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import { PrifinaLogo } from "../components/PrifinaLogo";
import { createGlobalStyle } from "styled-components";

/*
import {
  listDataSourcesQuery,
  listNotificationsByDate,
  SidebarMenu,
  Navbar,
  i18n,
} from "@prifina-apps/utils";

init();
*/
import {
  SidebarMenu,
  Navbar,
} from "@prifina-apps/utils";

import { useTranslate } from "@prifina-apps/utils";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import PropTypes from "prop-types";

import * as C from "./data-cloud/components";

import Table from "./data-cloud/Table";

//import dataCloudBanner from "../assets/data-cloud/data-cloud-banner.svg";
//import connectDataSources from "../assets/data-cloud/connect-data-sources.svg";

import DataCloudBanner from "../assets/data-cloud/DataCloudBanner";
import ConnectDataSources from "../assets/data-cloud/ConnectDataSources";
//import folder from "../assets/folder.svg";
import Folder from "../assets/folder";

///data source icons
//import ouraIcon from "../assets/app-market/oura-icon.svg";
//import fitbitIcon from "../assets/app-market/fitbit-icon.svg";
//import garminIcon from "../assets/app-market/garmin-icon.svg";

import ouraIcon from "../assets/app-market/OuraIcon";
import fitbitIcon from "../assets/app-market/FitbitIcon";
import garminIcon from "../assets/app-market/GarminIcon";

import lefArrow from "@iconify/icons-bx/bxs-chevron-left";
import mdiFlash from "@iconify/icons-mdi/flash";
import mdiFlashOutline from "@iconify/icons-mdi/flash-outline";
import mdiHomeOutline from "@iconify/icons-mdi/home-outline";
import mdiFileDocumentOutline from "@iconify/icons-mdi/file-document-outline";

import mdiCached from "@iconify/icons-mdi/cached";
import mdiFileEditOutline from "@iconify/icons-mdi/file-edit-outline";
import mdiTrashCanOutline from "@iconify/icons-mdi/trashcan-outline";


import shallow from "zustand/shallow";

import { useStore } from "../utils-v2/stores/PrifinaStore";

const GlobalStyle = createGlobalStyle`
.data-cloud path {
  fill: #F15F79;
}
`;

const DataConsole = props => {
  console.log("DATA CONSOLE PROPS ", props);

  const { colors } = useTheme();

  const { __ } = useTranslate();

  const { user, listDataSourcesQuery, listNotificationsByDateQuery } = useStore(
    state => ({
      user: state.user,
      listDataSourcesQuery: state.listDataSourcesQuery,
      listNotificationsByDateQuery: state.listNotificationsByDateQuery

    }),
    shallow,
  );
  // const { GraphQLClient, appSyncClient, prifinaID } = props;

  const dataSources = useRef({});
  const userNotifications = useRef({});

  const effectCalled = useRef(false);
  //const [installedDataSources, setInstalledDataSources] = useState([]);

  useEffect(() => {
    async function fetchData() {
      effectCalled.current = true;
      try {
        const prifinaDataSources = await listDataSourcesQuery({
          filter: { sourceType: { lt: 3 } },
        });

        dataSources.current = prifinaDataSources.data.listDataSources.items;
        console.log("DATA SOURCES ", dataSources);

        const notifications = await listNotificationsByDateQuery({
          owner: user.prifinaID,
          sortDirection: "DESC",
          limit: 200,
        });
        //console.log("NOTIFICATIONS ", notifications);
        if (
          notifications.data.listNotificationsByDate.items !== null &&
          notifications.data.listNotificationsByDate.items.length > 0
        ) {
          notifications.data.listNotificationsByDate.items.forEach(n => {
            if (userNotifications.current.hasOwnProperty(n.type)) {
              const d = n.createdAt.split("T")[0];
              if (!userNotifications.current[n.type].hasOwnProperty(d)) {
                userNotifications.current[n.type][d] = [];
              }
              userNotifications.current[n.type][d].push({
                createdAt: n.createdAt,
                body: JSON.parse(n.body),
              });
            } else {
              userNotifications.current[n.type] = {};
            }
          });
        }
        // console.log("NOTIFICATIONS ", userNotifications.current);

      } catch (err) {
        console.log("ERR ", err);
      }
    }
    if (!effectCalled.current) {
      fetchData();
    }
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
      badgeText: "Soon",
      disabled: true,
    },
  ];

  const sourceData = [
    {
      title: "Oura",
      IconImage: ouraIcon,
      category: "Health * Wearables",
      description: "Sleep, Activity, Readiness data from your Oura ring.",
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
          {__("connect")}
        </Button>
      ),
    },
    {
      title: "Fitbit",
      IconImage: fitbitIcon,
      category: "Health * Wearables",
      description: "Sleep, Activity, Heartrate data from your Fitbit device.",
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
          {__("connect")}
        </Button>
      ),
    },
    {
      title: "Garmin",
      IconImage: garminIcon,
      category: "Health * Wearables",
      description: "Sleep, Activity, Heartrate data from your Garmin device.",
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
          {__("connect")}
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
                  <Text textStyle="h3">{__("dataCloudHomeHeading")}</Text>
                  <Text color={colors.textMuted}>
                    {__("dataCloudHomeText")}
                  </Text>
                  <Button
                    size="md"
                    variation="outline"
                    style={{ position: "absolute", bottom: 30 }}
                  >
                    {__("learnMore")}
                  </Button>
                </Flex>
                <DataCloudBanner />
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
                    <Text textStyle="h4">{__("connectDataSources")}</Text>
                    <Text fontSize="xxs">
                      {__("connectingDataSources")}
                    </Text>
                  </Flex>
                  <ConnectDataSources />
                  <Button
                    size="sm"
                    mt="40px"
                    onClick={() => {
                      setStep(1);
                    }}
                  >
                    {__("connect")}
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
                    <Text textStyle="h4">{__("uploadData")}</Text>
                    <Text fontSize="xxs">{__("uploadFileText")}</Text>
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
                    <Folder style={{ width: "73px" }} />
                    <Flex>
                      <Text fontSize="xxs">{__("dragAndDropText")}</Text>
                      <Link fontSize="xxs" ml={3}>
                        {__("clickToBrowse")}
                      </Link>
                    </Flex>
                  </Flex>
                  <Text fontSize="xxs" color={colors.textAccent}>
                    {__("notMoreThan500")}
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
                      <Text>{__("availableSources")}</Text>
                    </Tab>
                    <Tab>
                      <Text>{__("connectedSources")}</Text>
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
                              {__("availableDataSources")}
                            </Text>
                            <Text fontSize="lg">
                              {__("selectAvailableDataSourcesText")}
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
                            <Text>{__("connectedSources")}</Text>
                            <Button
                              onClick={() => {
                                setActiveTab(0);
                              }}
                            >
                              {__("addSource")}
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
                {__("connectedSources")}
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
                  <Text textStyle="h4">{__("connectionPreferences")}</Text>
                  <Text fontSize="sm" color={colors.textMuted}>
                    Make your choices and sign in to get data from{" "}
                    {allValues.title}.
                  </Text>
                  <Flex mt={10}>
                    <Text>{__("syncWithCloud")}</Text>
                  </Flex>
                  <Flex>
                    <Radio
                      checked
                      onChange={() => { }}
                      value="TABLE"
                      fontSize="md"
                      textStyle={{ color: "white" }}
                    >
                      {__("dailyRecommended")}
                    </Radio>
                  </Flex>
                </Flex>

                <Flex
                  justifyContent="space-between"
                  paddingRight="40px"
                  paddingLeft="40px"
                  mt={20}
                >
                  <Button>{__("disconnect")}</Button>
                  <Button>{__("connect")}</Button>
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
};

DataConsole.propTypes = {
  GraphQLClient: PropTypes.string,
  prifinaID: PropTypes.string,
  cell: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DataConsole.displayName = "DataConsole";

export default DataConsole;
