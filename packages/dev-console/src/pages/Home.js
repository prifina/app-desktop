/* eslint-disable react/display-name */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
/* global localStorage */

import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Input,
  SearchSelect,
  Select,
  Link,
  Divider,
} from "@blend-ui/core";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import {
  useAppContext,
  useIsMountedRef,
  listAppsQuery,
  addAppVersionMutation,
  getPrifinaUserQuery,
  updateUserProfileMutation,
  getNotificationCount,
  useUserMenu,
  withUsermenu,
} from "@prifina-apps/utils";

//import { useAppContext } from "../lib/contextLib";
import { API as GRAPHQL, Auth } from "aws-amplify";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

//import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";

import { useHistory } from "react-router-dom";

import { StyledBox } from "../components/DefaultBackground";
import { PrifinaLogo } from "../components/PrifinaLogo";

//import { listAppsQuery, addAppVersionMutation } from "../graphql/api";

//import withUsermenu from "../components/UserMenu";

import styled from "styled-components";
import { useTable } from "react-table";

import gql from "graphql-tag";

import UploadApp from "../components/UploadApp";

import PropTypes from "prop-types";
import { DevConsoleSidebar } from "../components/components";

import dashboardBanner from "../assets/dashboard-banner.png";

import docs from "../assets/docs.png";
import starterResources from "../assets/starterResources.png";
import slackResources from "../assets/slackResources.png";
import zendeskResources from "../assets/zendeskResources.png";

import * as C from "../components/components";
import { DevConsoleLogo } from "../components/DevConsoleLogo";

import CreateProjectModal from "../components/CreateProjectModal";

import Table from "../components/Table";
import { all } from "micromatch";
import BlendIcon from "@blend-ui/icons/dist/esm/BlendIcon";

import mdiPowerPlug from "@iconify/icons-mdi/power-plug";
import mdiZipBoxOutline from "@iconify/icons-mdi/zip-box-outline";
import copy from "@iconify/icons-mdi/content-copy";
import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";
import bxsInfoCircle from "@iconify/icons-bx/bxs-info-circle";
import arrowTopRightBottomLeft from "@iconify/icons-mdi/arrow-top-right-bottom-left";
import baselineWeb from "@iconify/icons-mdi/table";

import { mdiConnection } from "@iconify/icons-mdi/connection";

/*
const importApp = appName => {
  console.log("APP ", appName);
  return React.lazy(() =>
    import("../pages/" + appName).catch(() => import("./NotFoundPage")),
  );
};
*/

// Create a default prop getter
const defaultPropGetter = () => ({});

const Content = ({
  Component,

  initials,
  notificationCount,
  updateNotificationHandler,
  appSyncClient,
  activeUser,

  ...props
}) => {
  const userMenu = useUserMenu();
  console.log(
    "USERMENU DEV APP INIT  ",
    { ...props },

    initials,
    notificationCount,
    typeof updateNotificationHandler,
    appSyncClient,
    activeUser,
  );

  userMenu.setClientHandler(appSyncClient);
  userMenu.setActiveUser(activeUser);
  useEffect(() => {
    userMenu.show({
      initials: initials,
      effect: { hover: { width: 42 } },
      notifications: notificationCount,
      RecentApps: [],
      PrifinaGraphQLHandler: GRAPHQL,
      prifinaID: activeUser.uuid,
    });
    //console.log(RecentApps);
  }, []);

  updateNotificationHandler(userMenu.onUpdate);

  //return <Component appSyncClient={appSyncClient} {...props} />;
  return <Component data={props.data} currentUser={props.currentUser} />;
};

Content.propTypes = {
  Component: PropTypes.elementType.isRequired,
  initials: PropTypes.string,
  notificationCount: PropTypes.number,
  updateNotificationHandler: PropTypes.func,
  appSyncClient: PropTypes.object,
  activeUser: PropTypes.object,
};

const Main = ({ data, currentUser }) => {
  const history = useHistory();

  const versionStatus = [
    "init",
    "received",
    "review",
    "review",
    "review",
    "published",
  ];

  const appTypes = ["Widget", "App"];

  const [allValues, setAllValues] = useState({
    name: "",
    id: "",
  });

  const onRowClick = (state, rowInfo, column, instance) => {
    return {
      onClick: e => {},
    };
  };

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
            variation={"link"}
            onClick={e => {
              console.log(cellProp.row.values);
              sendClick(cellProp.row.values);
            }}
          >
            Send
          </Button>
        );
      },
    },
  ];

  const [upload, setUpload] = useState(false);
  const selectedRow = useRef({});

  const sendClick = row => {
    selectedRow.current = row;
    setUpload(true);
  };

  const closeClick = (fileUploaded = false, version) => {
    if (fileUploaded) {
      addAppVersionMutation(GRAPHQL, {
        id: selectedRow.current.id,
        nextVersion: version,
        status: 1, //received
      }).then(res => {
        setUpload(false);
      });
    } else {
      setUpload(false);
    }
  };

  const [activeTab, setActiveTab] = useState();

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };

  const [activeTab2, setActiveTab2] = useState();

  const tabClick2 = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab2(tab);
  };

  const [activeTab3, setActiveTab3] = useState();

  const tabClick3 = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab3(tab);
  };

  const [dataSource, setDataSource] = useState([]);
  const [apiData, setApiData] = useState([]);

  console.log("CLOUD DATA", dataSource);
  console.log("API DATA", apiData);

  let addedDataSources = dataSource
    .concat(apiData)
    .filter(key => key.isAdded == true);
  console.log("ADDED DATA", addedDataSources);

  const [addedDataSources2, setAddedDataSources2] = useState([]);

  ///Prifina user cloud

  const addDataSource = (text, func, url) => {
    const newSourceData = [...dataSource, { text, func, url }];
    setDataSource(newSourceData);
  };

  const removeDataSource = index => {
    const newSourceData = [...dataSource];
    newSourceData.splice(index, 1);
    setDataSource(newSourceData);
  };

  const completeDataSource = index => {
    const newSourceData = [...dataSource];
    newSourceData[index].isAdded = true;
    setDataSource(newSourceData);
  };

  //////API

  const addApiSource = text => {
    const newSourceData = [...apiData, { text }];
    setApiData(newSourceData);
  };

  const removeApiSource = index => {
    const newSourceData = [...apiData];
    newSourceData.splice(index, 1);
    setApiData(newSourceData);
  };

  const completeApiSource = index => {
    const newSourceData = [...apiData];
    newSourceData[index].isAdded = true;
    setApiData(newSourceData);
  };

  ////common data sources

  const uncompleteDataSource = index => {
    const newSourceData = [...addedDataSources];
    newSourceData[index].isAdded = false;
    setAddedDataSources2(newSourceData);
  };

  function AddRemoveDataSources({
    dataSource,
    index,
    completeDataSource,
    removeDataSource,
  }) {
    console.log("data source", dataSource);
    return (
      <Flex
        justifyContent="space-between"
        height="72px"
        border="1px solid black"
        borderRadius="10px"
        width="834px"
        paddingLeft="15px"
        paddingRight="15px"
        marginTop="5px"
      >
        <Flex paddingTop="5px">
          <Text mr="5px">{dataSource.text}</Text>
          <Link href={dataSource.url} target="_blank">
            Full spec here
          </Link>
        </Flex>
        <Flex
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            width: "33%",
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          {dataSource.func.map(e => {
            return (
              <button
                style={{
                  height: 22,
                  margin: 2,
                }}
              >
                {e}
              </button>
            );
          })}
        </Flex>
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

  function ControlAddedDataSources({
    dataSource,
    index,
    uncompleteDataSource,
  }) {
    const [edit, setEdit] = useState(false);
    return (
      
      <Flex
        justifyContent="space-between"
        height="72px"
        border="1px solid black"
        borderRadius="10px"
        width="834px"
        paddingLeft="15px"
        paddingRight="15px"
        marginTop="5px"
      >
        <Flex paddingTop="5px">
          <Text mr="5px">{dataSource.text}</Text>
          <Link fontSize="md" href={dataSource.url} target="_blank">
            Full Specs Here
          </Link>
        </Flex>
        <Flex
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            width: "33%",
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          {dataSource.func.map(e => {
            return (
              <button
                style={{
                  height: 22,
                  margin: 2,
                }}
              >
                {e}
              </button>
            );
          })}
        </Flex>
        {edit ? (
          <Flex alignItems="center">
            <button
              onClick={() => uncompleteDataSource(index)}
              style={{ width: 50, height: 50 }}
            >
              <Text textStyle="h3" colorStyle="error">
                x
              </Text>
            </button>
          </Flex>
        ) : (
          <Flex alignItems="center">
            <button
              onClick={() => setEdit(true)}
              style={{ width: 50, height: 50 }}
            >
              <Text textStyle="h3">E</Text>
            </button>
          </Flex>
        )}
      </Flex>
    );
  }

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

  function DataSourceForm({ addDataSource }) {
    const [value, setValue] = useState("");
    const [functions, setFunctions] = useState("");
    const [url, setUrl] = useState("");

    const handleSubmit = e => {
      e.preventDefault();
      if (!value) return;
      addDataSource(value, functions, url);
      setValue("");
      setFunctions("");
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
          <SearchSelect
            // id={selectId}
            // name={selectId}
            // key="value"
            variation="outline"
            // defaultValue="000"
            options={selectOptions}
            defaultValue
            searchLength={1}
            showList={true}
            selectOption="value"
            size="sm"
            width="834px"
            // containerRef={boxRef}
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

  function ApiForm({ addApi }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
      e.preventDefault();
      if (!value) return;
      addApi(value);
      setValue("");
    };

    return (
      <form onSubmit={handleSubmit}>
        <Flex>
          <C.StyledInput
            width="834px"
            type="text"
            className="input"
            value={value}
            onChange={e => setValue(e.target.value)}
          />

          <Button onChange={e => setValue(e.currentTarget.value)}>+</Button>
        </Flex>
      </form>
    );
  }

  const [step, setStep] = useState(3);

  switch (step) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    case 5:
      break;
    default:
  }

  return (
    <React.Fragment>
      <DevConsoleSidebar />
      <C.NavbarContainer bg="baseWhite">
        <DevConsoleLogo className={"app-market"} title="App Market" />
      </C.NavbarContainer>
      <StyledBox>
        <Flex
          width="100vw"
          height="100vh"
          paddingLeft="286px"
          bg="white"
          flexDirection="column"
        >
          {step === 0 && (
            <>
              <Flex flexDirection="column" alignItems="center" mt="42px">
                <Image src={dashboardBanner} style={{ position: "relative" }} />
                <Flex
                  textAlign="center"
                  width="506px"
                  height="196px"
                  flexDirection="column"
                  justifyContent="space-between"
                  alignItems="center"
                  position="absolute"
                  top="243px"
                >
                  <Text color="white" fontSize={24}>
                    Create your first project
                  </Text>
                  <Text color="#969595" fontSize={20}>
                    Done with your local build and ready to plug into the power
                    of Prifina? Create a project to get started
                  </Text>
                  <Button
                    size="sm"
                    onClick={() => {
                      setStep(2);
                      // openModal();
                    }}
                  >
                    New Project
                    {/* <BlendIcon iconify={bxsPlusCircle} size="12px" paddingLeft="10px" /> */}
                  </Button>
                </Flex>
              </Flex>
              <Box paddingLeft="62px" paddingTop="100px">
                <Text color="textPrimary" fontSize={24}>
                  {/* {i18n.__("keyResources")} */}
                  Key Resources
                </Text>
                <Text color="baseMuted" fontSize={16} paddingTop="8px">
                  {/* {i18n.__("resourcesSubtitle")} */}
                  Resources and utilities to help you build for Prifina
                </Text>
                <Flex paddingTop="35px">
                  <Box paddingRight="42px">
                    <C.ResourceCard
                      src={docs}
                      // title={i18n.__("prifinaDocs")}
                      title="Prifina Docs"
                      description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                    />
                  </Box>
                  <Box paddingRight="42px">
                    <C.ResourceCard
                      src={starterResources}
                      // title={i18n.__("appStarter")}
                      title="App Starter"
                      description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                    />
                  </Box>
                  <Box paddingRight="42px">
                    <C.ResourceCard
                      src={zendeskResources}
                      // title={i18n.__("zendesk")}
                      title="Zendesk"
                      description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                    />
                  </Box>
                  <Box>
                    <C.ResourceCard
                      src={slackResources}
                      // title={i18n.__("ledSlack")}
                      title="LED Slack"
                      description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                    />
                  </Box>
                </Flex>
              </Box>
            </>
          )}
          {step === 1 && (
            <>
              <Flex flexDirection="column" alignItems="center" mt="42px">
                <CreateProjectModal setStep={() => setStep(2)} />

                <Image src={dashboardBanner} style={{ position: "relative" }} />
                <Flex
                  textAlign="center"
                  width="506px"
                  height="196px"
                  flexDirection="column"
                  justifyContent="space-between"
                  alignItems="center"
                  position="absolute"
                  top="243px"
                >
                  <Text color="white" fontSize={24}>
                    Create your first project
                  </Text>
                  <Text color="#969595" fontSize={20}>
                    Done with your local build and ready to plug into the power
                    of Prifina? Create a project to get started
                  </Text>
                  <Button
                    size="sm"
                    onClick={() => {
                      setStep(2);
                      // openModal();
                    }}
                  >
                    New Project
                    {/* <BlendIcon iconify={bxsPlusCircle} size="12px" paddingLeft="10px" /> */}
                  </Button>
                </Flex>
              </Flex>
              <Box paddingLeft="62px" paddingTop="100px">
                <Text color="textPrimary" fontSize={24}>
                  {/* {i18n.__("keyResources")} */}
                  Key Resources
                </Text>
                <Text color="baseMuted" fontSize={16} paddingTop="8px">
                  {/* {i18n.__("resourcesSubtitle")} */}
                  Resources and utilities to help you build for Prifina
                </Text>
                <Flex paddingTop="35px">
                  <Box paddingRight="42px">
                    <C.ResourceCard
                      src={docs}
                      // title={i18n.__("prifinaDocs")}
                      title="Prifina Docs"
                      description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                    />
                  </Box>
                  <Box paddingRight="42px">
                    <C.ResourceCard
                      src={starterResources}
                      // title={i18n.__("appStarter")}
                      title="App Starter"
                      description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                    />
                  </Box>
                  <Box paddingRight="42px">
                    <C.ResourceCard
                      src={zendeskResources}
                      // title={i18n.__("zendesk")}
                      title="Zendesk"
                      description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                    />
                  </Box>
                  <Box>
                    <C.ResourceCard
                      src={slackResources}
                      // title={i18n.__("ledSlack")}
                      title="LED Slack"
                      description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                    />
                  </Box>
                </Flex>
              </Box>
            </>
          )}
          {/* PROJECTS */}
          {step === 2 && (
            <>
              <Flex paddingTop="48px" paddingLeft="65px">
                <Flex
                  bg="baseMuted"
                  flexDirection="column"
                  borderRadius="10px"
                  padding="16px"
                >
                  {upload && (
                    <UploadApp row={selectedRow.current} close={closeClick} />
                  )}
                  {!upload && (
                    <>
                      <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        marginBottom="40px"
                      >
                        <Text textStyle="h3">Projects</Text>
                        <Button
                          onClick={() => {
                            history.push("/new-app");
                          }}
                        >
                          New App
                        </Button>
                      </Flex>
                      <div className="tableWrap">
                        {data.length === 0 && <Text m={2}>"No apps..."</Text>}
                        {data.length > 0 && (
                          <Table columns={Columns} data={data} />
                        )}
                      </div>
                    </>
                  )}
                </Flex>
              </Flex>
            </>
          )}
          {step === 3 && (
            <>
              <Flex flexDirection="column">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  paddingLeft="22px"
                  paddingRight="24px"
                  height="64px"
                  bg="baseMuted"
                >
                  <Flex alignItems="center">
                    <BlendIcon
                      iconify={mdiArrowLeft}
                      width="24px"
                      onClick={() => {
                        setStep(2);
                      }}
                    />
                    <Text ml="16px">{allValues.name}</Text>
                  </Flex>
                  <Flex alignItems="center">
                    <Button mr="17px">Launch Sandbox</Button>
                    <BlendIcon
                      iconify={bxsInfoCircle}
                      width="13px"
                      color="#969595"
                    />
                  </Flex>
                </Flex>
                <Flex bg="brandAccent" height="95px" />
                <div
                  style={{
                    overflow: "hidden",
                    paddingTop: 38,
                    paddingLeft: 65,
                    paddingRight: 30,
                  }}
                >
                  <Tabs
                    activeTab={activeTab}
                    onClick={tabClick}
                    variant={"rounded"}
                    style={{
                      background: "transparent",
                    }}
                  >
                    <TabList>
                      <Tab
                        style={{
                          height: 37,
                          justifyContent: "center",
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          margin: 8,
                        }}
                      >
                        <Flex alignItems="center">
                          <BlendIcon iconify={mdiPowerPlug} />
                          <Text ml="8px" color="white">
                            Sanbox Testing
                          </Text>
                        </Flex>
                      </Tab>
                      <Tab
                        style={{
                          height: 37,
                          justifyContent: "center",
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          margin: 8,
                        }}
                      >
                        <Flex alignItems="center">
                          <BlendIcon iconify={baselineWeb} />
                          <Text ml="8px" color="white">
                            Build Assets
                          </Text>
                        </Flex>
                      </Tab>
                      <Tab
                        style={{
                          height: 37,
                          justifyContent: "center",
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          margin: 8,
                        }}
                      >
                        <Flex alignItems="center">
                          <BlendIcon iconify={mdiZipBoxOutline} />
                          <Text ml="8px" color="white">
                            Uploads
                          </Text>
                        </Flex>
                      </Tab>
                    </TabList>
                    <TabPanelList>
                      <TabPanel>
                        <div
                          style={{
                            overflow: "auto",
                            background: "gray",
                            borderRadius: 10,
                          }}
                        >
                          <Flex
                            ml="41px"
                            flexDirection="column"
                            paddingTop="30px"
                          >
                            <Text color="textPrimary" fontSize="24px">
                              Sandbox testing
                            </Text>
                            <Box mt="21px" width="493px" mb="49px">
                              <Text color="textPrimary">
                                Finished your local build? See how your
                                application will behave on our platform using
                                our Sandbox enviroment.
                              </Text>
                            </Box>
                          </Flex>

                          <Flex
                            style={{
                              border: "1px solid #3F3A4F",
                              width: 999,
                              borderTopRightRadius: 10,
                              borderTopLeftRadius: 10,
                              borderBottom: 0,
                              marginRight: 16,
                              marginLeft: 16,
                              paddingLeft: 32,
                              paddingRight: 34,
                              position: "relative",
                            }}
                            flexDirection="column"
                          >
                            <Text color="textPrimary" mt="35px">
                              Launch Sandbox session
                            </Text>
                            <Flex
                              alt="cards"
                              flexDirection="column"
                              style={{
                                position: "absolute",
                                right: 84,
                                top: -28,
                              }}
                            >
                              <Flex
                                width="403px"
                                height="35px"
                                bg="brandAccent"
                                borderRadius="5px"
                                alignItems="center"
                                mb="4px"
                              >
                                <Text
                                  color="white"
                                  ml="16px"
                                  mr="18px"
                                  fontSize="12px"
                                >
                                  1
                                </Text>
                                <Text color="white" fontSize="12px">
                                  Copy your app ID
                                </Text>
                              </Flex>
                              <Flex
                                width="403px"
                                height="35px"
                                bg="brandAccent"
                                borderRadius="5px"
                                alignItems="center"
                                mb="4px"
                              >
                                <Text
                                  color="white"
                                  ml="16px"
                                  mr="18px"
                                  fontSize="12px"
                                >
                                  2
                                </Text>
                                <Text color="white" fontSize="12px">
                                  Add it to your local build
                                </Text>
                              </Flex>
                              <Flex
                                width="403px"
                                height="35px"
                                bg="brandAccent"
                                borderRadius="5px"
                                alignItems="center"
                                mb="4px"
                              >
                                <Text
                                  color="white"
                                  ml="16px"
                                  mr="18px"
                                  fontSize="12px"
                                >
                                  3
                                </Text>
                                <Text color="white" fontSize="12px">
                                  Get a remote link for your repo
                                </Text>
                              </Flex>
                              <Flex
                                width="403px"
                                height="35px"
                                bg="brandAccent"
                                borderRadius="5px"
                                alignItems="center"
                              >
                                <Text
                                  color="white"
                                  ml="16px"
                                  mr="18px"
                                  fontSize="12px"
                                >
                                  4
                                </Text>
                                <Text color="white" fontSize="12px">
                                  Fill out the form and launch the Sandbox
                                </Text>
                              </Flex>
                              <Flex alignItems="baseline">
                                <Text
                                  mt="11px"
                                  color="textPrimary"
                                  fontSize="12px"
                                  mr="2px"
                                >
                                  Read a more detailed guide in the
                                </Text>
                                <Button variation="link">Prifina docs</Button>
                              </Flex>
                            </Flex>
                            <Flex mt="42px" alignItems="center" mb="19px">
                              <Text
                                color="textPrimary"
                                fontSize="12px"
                                mr="8px"
                              >
                                App ID
                              </Text>
                              <BlendIcon
                                iconify={bxsInfoCircle}
                                width="13px"
                                color="#969595"
                              />
                            </Flex>
                            <C.StyledInput value={allValues.id} disabled />
                            <Flex
                              justifyContent="space-between"
                              mt="43px"
                              width="748px"
                            >
                              <Flex flexDirection="column">
                                <Text mb="16px" color="white" fontSize="12px">
                                  Project Name
                                </Text>
                                <C.StyledInput placeholder={allValues.name} />
                              </Flex>
                              <Flex flexDirection="column">
                                <Text mb="16px" color="white" fontSize="12px">
                                  Remote Link
                                </Text>
                                <C.StyledInput placeholder="Remote Link" />
                              </Flex>
                            </Flex>
                            <Flex position="absolute" right="32px" bottom="0px">
                              <Button size="sm">Launch Sanbox</Button>
                            </Flex>
                          </Flex>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        {/* SECOND TABS */}
                        <div style={{ overflow: "hidden" }}>
                          <Tabs
                            activeTab={activeTab2}
                            onClick={tabClick2}
                            style={{ height: "100%" }}
                            variant={"line"}
                          >
                            <TabList>
                              <Tab>
                                <Text>Data Usage</Text>
                              </Tab>
                              <Tab>
                                <Text>Build Files</Text>
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
                                  <Text textStyle="h3" mb="15px">
                                    Data Usage
                                  </Text>
                                  <Box width="470px">
                                    <Text textStyle="h6" mb="15px">
                                      Sed ut perspiciatis unde omnis iste natus
                                      error sit voluptatem accusantium
                                      doloremque laudantium, totam rem aperiam,
                                      eaque ipsa quae ab illo inventore
                                      veritatis et quasi architecto beatae vitae
                                      dicta sunt
                                    </Text>
                                  </Box>
                                  {/* THIRD TABS */}
                                  <div
                                    style={{
                                      overflow: "hidden",
                                      background: "lightGray",
                                      paddingTop: 16,
                                      paddingBottom: 16,
                                      paddingLeft: 40,
                                      paddingRight: 40,
                                      borderRadius: 10,
                                    }}
                                  >
                                    <Tabs
                                      activeTab={activeTab3}
                                      onClick={tabClick3}
                                      style={{ height: "100%" }}
                                      variant={"line"}
                                    >
                                      <TabList>
                                        <Tab>
                                          <Text>Public API</Text>
                                        </Tab>
                                        <Tab>
                                          <Text>Prifina User Cloud</Text>
                                        </Tab>
                                        <Tab>
                                          <Text>No Data</Text>
                                        </Tab>
                                      </TabList>
                                      <TabPanelList
                                        style={{ backgroundColor: null }}
                                      >
                                        <TabPanel
                                          style={{
                                            height: "100vh",
                                            paddingBottom: "50px",
                                            overflow: "auto",
                                          }}
                                        >
                                          <div style={{ overflow: "auto" }}>
                                            <Flex>
                                              <ApiForm addApi={addApiSource} />
                                            </Flex>

                                            {/* Box with state change */}
                                            <Flex>
                                              {apiData.length > 0 && (
                                                <Flex
                                                  width="100%"
                                                  flexDirection="column"
                                                  padding="10px"
                                                  style={{
                                                    marginTop: 15,
                                                    borderRadius: 10,
                                                  }}
                                                >
                                                  <Text
                                                    textStyle="h6"
                                                    mb="10px"
                                                  >
                                                    Click to add you your data
                                                    sources
                                                  </Text>
                                                  <Flex>
                                                    <Flex flexDirection="column">
                                                      {apiData.map(
                                                        (event, index) => (
                                                          <AddRemoveDataSources
                                                            key={index}
                                                            index={index}
                                                            dataSource={event}
                                                            removeDataSource={
                                                              removeApiSource
                                                            }
                                                            completeDataSource={
                                                              completeApiSource
                                                            }
                                                          />
                                                        ),
                                                      )}
                                                    </Flex>
                                                  </Flex>
                                                </Flex>
                                              )}
                                            </Flex>
                                          </div>
                                        </TabPanel>
                                        <TabPanel>
                                          <div style={{ overflow: "auto" }}>
                                            <Flex>
                                              <DataSourceForm
                                                addDataSource={addDataSource}
                                                // addFunctions={addFunction}
                                              />
                                            </Flex>
                                            {/* Box with state change */}
                                            <Flex>
                                              {dataSource.length > 0 && (
                                                <Flex
                                                  width="100%"
                                                  flexDirection="column"
                                                  padding="10px"
                                                  style={{
                                                    backgroundColor:
                                                      "lightGray",
                                                    marginTop: 15,
                                                    borderRadius: 10,
                                                  }}
                                                >
                                                  <Text
                                                    textStyle="h6"
                                                    mt="10px"
                                                    mb="10px"
                                                  >
                                                    Prifina data connectors results...
                                                  </Text>

                                                  <Flex>
                                                    <Flex flexDirection="column">
                                                      {dataSource.map(
                                                        (event, index) => (
                                                          <>
                                                            <AddRemoveDataSources
                                                              key={index}
                                                              index={index}
                                                              dataSource={event}
                                                              removeDataSource={
                                                                removeDataSource
                                                              }
                                                              completeDataSource={
                                                                completeDataSource
                                                              }
                                                            />
                                                            <div>
                                                              {event.functions}
                                                            </div>
                                                          </>
                                                        ),
                                                      )}
                                                    </Flex>
                                                  </Flex>
                                                </Flex>
                                              )}
                                            </Flex>
                                          </div>
                                        </TabPanel>
                                      </TabPanelList>
                                    </Tabs>
                                  </div>
                                  <Flex
                                    flexDirection="column"
                                    width="100%"
                                    justifyContent="center"
                                    padding="15px"
                                    paddingLeft="40px"
                                    paddingRight="40px"
                                    style={{
                                      backgroundColor: "lightGray",
                                      marginTop: 15,
                                      borderRadius: 10,
                                    }}
                                  >
                                    <Text textStyle="h6" mb="10px">
                                      Data sources used in your project
                                    </Text>
                                    <Flex>
                                      {addedDataSources.length > 0 ? (
                                        <Flex
                                          width="100%"
                                          flexDirection="column"
                                          style={{
                                            backgroundColor: "lightGray",
                                            marginTop: 15,
                                            borderRadius: 10,
                                          }}
                                        >
                                          <Flex>
                                            <Flex
                                              flexDirection="column"
                                              justifyContent="center"
                                            >
                                              {addedDataSources.map(
                                                (event, index) => (
                                                  <ControlAddedDataSources
                                                    key={index}
                                                    index={index}
                                                    dataSource={event}
                                                    uncompleteDataSource={
                                                      uncompleteDataSource
                                                    }
                                                  />
                                                ),
                                              )}
                                            </Flex>
                                          </Flex>
                                        </Flex>
                                      ) : (
                                        <Flex
                                          width="100%"
                                          flexDirection="column"
                                          alignItems="center"
                                          justifyContent="center"
                                          style={{
                                            border: "1px dashed black",
                                            marginTop: 15,
                                            borderRadius: 10,
                                          }}
                                        >
                                          <Text textStyle="h6" mt="10px">
                                            Search and select data sources
                                          </Text>
                                          <Text textStyle="h6" mt="10px">
                                            Data sources you add will show up
                                            here
                                          </Text>
                                        </Flex>
                                      )}
                                    </Flex>
                                  </Flex>
                                </div>
                              </TabPanel>
                              <TabPanel>
                                <div style={{ overflow: "auto" }}>
                                  <Text textStyle="h3" mb="15px">
                                    Build Files
                                  </Text>
                                  <Box width="470px">
                                    <Text textStyle="h6" mb="15px">
                                      Sed ut perspiciatis unde omnis iste natus
                                      error sit voluptatem accusantium
                                      doloremque laudantium, totam rem aperiam,
                                      eaque ipsa quae ab illo inventore
                                      veritatis et quasi architecto beatae vitae
                                      dicta sunt
                                    </Text>
                                  </Box>
                                </div>
                              </TabPanel>
                              <TabPanel>Work panel 3</TabPanel>
                            </TabPanelList>
                          </Tabs>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <Text mb="16px" color="textPriamry" fontSize="12px">
                          In progress...
                        </Text>
                      </TabPanel>
                    </TabPanelList>
                  </Tabs>
                </div>
              </Flex>
            </>
          )}
        </Flex>
      </StyledBox>
    </React.Fragment>
  );
};

const Home = props => {
  const history = useHistory();
  const {
    userAuth,
    currentUser,
    isAuthenticated,
    mobileApp,
    APIConfig,
    AUTHConfig,
  } = useAppContext();

  console.log("HOME ", currentUser);

  const [initClient, setInitClient] = useState(false);

  const isMountedRef = useIsMountedRef();
  const apps = useRef([]);
  const componentProps = useRef({});
  const activeUser = useRef({});
  const notificationCount = useRef(0);
  let AppComponent = Main;

  const createClient = (endpoint, region) => {
    Auth.currentCredentials().then(c => {
      console.log("DEV USER CLIENT ", c);
    });
    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },

      disableOffline: true,
    });
    return client;
  };

  const updateNotification = useCallback(handler => {
    //notificationHandler.current = handler;
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (isMountedRef.current) {
        const currentPrifinaUser = await getPrifinaUserQuery(
          GRAPHQL,
          currentUser.prifinaID,
        );
        console.log("CURRENT USER ", currentPrifinaUser);
        let appProfile = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.appProfile,
        );
        console.log("CURRENT USER ", appProfile, appProfile.initials);

        let clientEndpoint = "";
        let clientRegion = "";

        if (!appProfile.hasOwnProperty("endpoint")) {
          const defaultProfileUpdate = await updateUserProfileMutation(
            GRAPHQL,
            currentUser.prifinaID,
          );
          console.log("PROFILE UPDATE ", defaultProfileUpdate);
          appProfile = JSON.parse(
            defaultProfileUpdate.data.updateUserProfile.appProfile,
          );
        }
        clientEndpoint = appProfile.endpoint;
        clientRegion = appProfile.region;

        const client = createClient(clientEndpoint, clientRegion);

        activeUser.current = {
          name: appProfile.name,
          uuid: currentUser.prifinaID,
          endpoint: clientEndpoint,
          region: clientRegion,
          dataConnectors: currentPrifinaUser.data.getPrifinaUser.dataSources
            ? JSON.parse(currentPrifinaUser.data.getPrifinaUser.dataSources)
            : {},
        };

        const prifinaApps = await listAppsQuery(GRAPHQL, {
          filter: { prifinaId: { eq: currentUser.prifinaID } },
        });
        console.log("APPS ", prifinaApps.data);
        apps.current = prifinaApps.data.listApps.items;

        console.log("APPS ", prifinaApps.data);
        componentProps.current = {
          data: apps.current,
          currentUser: currentUser,
        };

        //console.log("CURRENT SETTINGS 2", client);
        componentProps.current.GraphQLClient = GRAPHQL;
        componentProps.current.appSyncClient = client;
        componentProps.current.prifinaID = currentUser.prifinaID;
        componentProps.current.initials = appProfile.initials;
        componentProps.current.updateNotificationHandler = updateNotification;
        componentProps.current.activeUser = activeUser.current;

        // notificationCount...

        // const notificationCountResult = await client.query({
        //   query: gql(getNotificationCount),
        //   variables: {
        //     filter: {
        //       owner: { eq: currentUser.prifinaID },
        //       status: { eq: 0 },
        //     },
        //   },
        // });
        // console.log("COUNT ", notificationCountResult);
        // notificationCount.current =
        //   notificationCountResult.data.getNotificationCount;

        // componentProps.current.notificationCount = notificationCount.current;

        console.log("COMPONENT ", componentProps);
        setInitClient(true);
      }
      return null;
    }

    fetchData();
  }, [isMountedRef.current]);

  return (
    <>
      {initClient && (
        <Content Component={AppComponent} {...componentProps.current} />
      )}
      {!initClient && (
        <div>Home {isAuthenticated ? "Authenticated" : "Unauthenticated"} </div>
      )}
    </>
  );
};

Home.displayName = "Home";

export default withUsermenu()(Home);
