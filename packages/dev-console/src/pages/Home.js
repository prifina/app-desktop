/* global localStorage */

import React, { useEffect, useState, useRef, useCallback } from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Link,
  Divider,
  Input,
  Radio,
  useTheme,
} from "@blend-ui/core";

import { useToast, ToastContextProvider } from "@blend-ui/toast";

import {
  useAppContext,
  useIsMountedRef,
  listAppsQuery,
  updateAppVersionMutation,
  deleteAppVersionMutation,
  getPrifinaUserQuery,
  updateUserProfileMutation,
  useUserMenu,
  withUsermenu,
  i18n,
  createClient,
  SidebarMenu,
} from "@prifina-apps/utils";

i18n.init();

//import { useAppContext } from "../lib/contextLib";
import { API as GRAPHQL, Auth } from "aws-amplify";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

//import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";

import { useHistory } from "react-router-dom";

import { StyledBox } from "../components/DefaultBackground";

//import { listAppsQuery, addAppVersionMutation } from "../graphql/api";

//import withUsermenu from "../components/UserMenu";

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

/*
import mdiPowerPlug from "@iconify/icons-mdi/power-plug";
import mdiZipBoxOutline from "@iconify/icons-mdi/zip-box-outline";
import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";
import bxsInfoCircle from "@iconify/icons-bx/bxs-info-circle";
import baselineWeb from "@iconify/icons-mdi/table";
*/
//sidebar icons
import viewDashboard from "@iconify/icons-mdi/view-dashboard";
import mdiWidget from "@iconify/icons-mdi/widgets";
import mdiBookOpenVariant from "@iconify/icons-mdi/book-open-variant";
import mdiSitemap from "@iconify/icons-mdi/sitemap";

import ProjectDetails from "../components/ProjectDetails";

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
  }, []);

  updateNotificationHandler(userMenu.onUpdate);

  return <Component data={props.data} currentUser={props.currentUser} />;
};

Content.propTypes = {
  Component: PropTypes.elementType.isRequired,
  initials: PropTypes.string,
  notificationCount: PropTypes.number,
  updateNotificationHandler: PropTypes.func,
  appSyncClient: PropTypes.instanceOf(Object),
  activeUser: PropTypes.instanceOf(Object),
  currentUser: PropTypes.instanceOf(Object),
  data: PropTypes.instanceOf(Array),
};

const Main = ({ data, currentUser }) => {
  const history = useHistory();

  const { colors } = useTheme();

  const toast = useToast();

  const versionStatus = [
    "init",
    "received",
    "review",
    "review",
    "review",
    "published",
  ];

  // const appTypes = ["Widget", "App"];

  console.log("is it saved", data);
  const [allValues, setAllValues] = useState({
    name: "",
    id: "",
    appType: "",
    newType: "",
    newName: "",
    version: "",
    newVersion: "",
    publisher: "",
    newPublisher: "",
    category: "",
    newCategory: "",
    deviceSupport: "",
    newDeviceSupport: "",
    languages: "",
    newLanguages: "",
    age: "",
    newAge: "",
    keyFeatures: [],
    shortDescription: "",
    newShortDescription: "",
    longDescription: "",
    newLongDescription: "",
    userHeld: [],
    userGenerated: [],
    public: [],
    icon: "",
    newIcon: "",
    dataSources: [],
    newDataSources: [],
    remoteUrl: "",
    newRemoteUrl: "",
  });

  const Columns = [
    {
      Header: "Name",
      accessor: "name",
      Cell: props => {
        console.log("props", props);

        return (
          <Text
            onClick={() => {
              setStep(3);
              setAllValues({
                ...allValues,
                name: props.cell.value,
                id: props.row.values.id,
                newName: props.cell.value,
                appType: props.row.values.appType,
                newType: props.row.values.appType,
                version: props.row.values.version,
                newVersion: props.row.values.version,
                publisher: props.row.original.publisher,
                newPublisher: props.row.original.publisher,
                category: props.row.original.category,
                newCategory: props.row.original.category,
                deviceSupport: props.row.original.deviceSupport,
                newDeviceSupport: props.row.original.newDeviceSupport,
                languages: props.row.original.languages,
                newLanguages: props.row.original.newLanguages,
                age: props.row.original.age,
                newAge: props.row.original.newAge,
                keyFeatures: props.row.original.keyFeatures,
                shortDescription: props.row.original.shortDescription,
                newShortDescription: props.row.original.newShortDescription,
                longDescription: props.row.original.longDescription,
                newLongDescription: props.row.original.newLongDescription,
                userHeld: props.row.original.userHeld,
                userGenerated: props.row.original.userGenerated,
                public: props.row.original.public,
                icon: props.row.original.icon,
                newIcon: props.row.original.newIcon,
                dataSources: props.row.original.dataSources,
                newDataSources: props.row.original.dataSources,
                remoteUrl: props.row.original.remoteUrl,
                newRemoteUrl: props.row.original.newRemoteUrl,
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
      Cell: props => {
        return props.cell.value === 1 ? "App" : "Widget";
      },
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
      Header: "Next Version",
      accessor: "nextVersion",
      className: "nextVersion",
    },
    {
      Header: "Modified",
      accessor: "modifiedAt",
      className: "date",
      Cell: props => {
        return <Text>{props.cell.value}</Text>;
      },
    },
    // {
    //   Header: () => null, // No header
    //   id: "sendApp", // It needs an ID
    //   Cell: cellProp => {
    //     return (
    //       <Button
    //         size="xs"
    //         onClick={e => {
    //           console.log(cellProp.row.values);
    //           sendClick(cellProp.row.values);
    //         }}
    //       >
    //         {i18n.__("submit")}
    //       </Button>
    //     );
    //   },
    // },
    {
      Header: () => null, // No header
      id: "edit",
      Cell: props => {
        return (
          <Button
            size="xs"
            onClick={() => {
              setStep(3);
              setAllValues({
                ...allValues,
                name: props.row.values.name,
                id: props.row.values.id,
                newName: props.row.values.name,
                appType: props.row.values.appType,
                newType: props.row.values.appType,
                version: props.row.values.version,
                newVersion: props.row.values.version,
                publisher: props.row.original.publisher,
                newPublisher: props.row.original.publisher,
                category: props.row.original.category,
                newCategory: props.row.original.category,
                deviceSupport: props.row.original.deviceSupport,
                newDeviceSupport: props.row.original.newDeviceSupport,
                languages: props.row.original.languages,
                newLanguages: props.row.original.newLanguages,
                age: props.row.original.age,
                newAge: props.row.original.newAge,
                keyFeatures: props.row.original.keyFeatures,
                shortDescription: props.row.original.shortDescription,
                newShortDescription: props.row.original.newShortDescription,
                longDescription: props.row.original.longDescription,
                newLongDescription: props.row.original.newLongDescription,
                userHeld: props.row.original.userHeld,
                userGenerated: props.row.original.userGenerated,
                public: props.row.original.public,
                icon: props.row.original.icon,
                newIcon: props.row.original.newIcon,
                dataSources: props.row.original.dataSources,
                newDataSources: props.row.original.dataSources,
                remoteUrl: props.row.original.remoteUrl,
                newRemoteUrl: props.row.original.newRemoteUrl,
              });
            }}
          >
            Edit
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
      updateAppVersionMutation(GRAPHQL, {
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
    case 4:
      break;
    case 5:
      break;
    default:
  }

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const onDialogClose = e => {
    setProjectDialogOpen(false);
    e.preventDefault();
  };

  const onDialogClick = async e => {
    setProjectDialogOpen(false);
    e.preventDefault();
  };

  const menuItems = [
    {
      label: i18n.__("dashboard"),
      icon: viewDashboard,
      onClick: () => {
        setStep(0);
      },
    },
    {
      label: i18n.__("projects"),
      icon: mdiWidget,
      onClick: () => {
        setStep(2);
      },
    },
    {
      label: i18n.__("resources"),
      icon: mdiBookOpenVariant,
      disabled: true,
    },
    {
      label: "Data Model",
      icon: mdiSitemap,
      badgeText: "Soon",
      disabled: true,
    },
  ];

  const resourceCardItems = [
    {
      src: docs,
      title: i18n.__("prifinaDocsResourcesCardHeading"),
      description: i18n.__("docsResourcesCardPara"),
    },
    {
      src: starterResources,
      title: i18n.__("gitResourcesResourcesCardHeading"),
      description: i18n.__("gitResourcesCardPara"),
    },
    {
      src: zendeskResources,
      title: i18n.__("zenDeskResourcesCardHeading"),
      description: i18n.__("zenResourcesCardPara"),
    },
    {
      src: slackResources,
      title: i18n.__("slackResourcesCardHeading"),
      description: i18n.__("slackResourcesCardPara"),
    },
  ];

  const [updatedData, setUpdatedData] = useState(data);

  const fetchDataManually = useCallback(async () => {
    const prifinaApps = await listAppsQuery(GRAPHQL, {
      filter: { prifinaId: { eq: currentUser.prifinaID } },
    });
    let updatedApps = prifinaApps.data.listApps.items;

    setUpdatedData(updatedApps);
    console.log("updated apps", updatedApps);
  }, []);

  useEffect(() => {
    console.log("updated apps triggered");

    fetchDataManually().catch("COULD NOT FETCH DATA", console.error);
  }, [step]);

  return (
    <React.Fragment>
      <DevConsoleSidebar items={menuItems} />
      <C.NavbarContainer bg="basePrimary">
        <DevConsoleLogo className="appStudio" />
      </C.NavbarContainer>

      {/* <StyledBox> */}
      <C.ContentContainer>
        {step === 0 && (
          <>
            {projectDialogOpen && (
              <CreateProjectModal
                onClose={onDialogClose}
                onButtonClick={onDialogClick}
                // isOpen={projectDialogOpen}
              />
            )}
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
                <Text fontSize="xl">{i18n.__("createYourFirstProject")}</Text>
                <Text color={colors.textMuted} fontSize={20}>
                  {i18n.__("dashboardText")}
                </Text>
                <Button
                  size="sm"
                  bg={colors.baseAccent}
                  onClick={() => {
                    setProjectDialogOpen(true);
                  }}
                >
                  {i18n.__("newProject")}
                </Button>
              </Flex>
            </Flex>
            <Box paddingLeft="62px" paddingTop="100px">
              <Text fontSize="xl">{i18n.__("keyResourcesHeading")}</Text>
              <Text fontSize="md" mt="12px">
                {i18n.__("keyResourcesPara")}
              </Text>
              <Flex
                paddingTop="35px"
                width="1027px"
                justifyContent="space-between"
              >
                {resourceCardItems.map(item => (
                  <C.ResourceCard
                    marginRight="42px"
                    src={item.src}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </Flex>
            </Box>
          </>
        )}
        {/* PROJECTS */}
        {step === 2 && (
          <>
            {projectDialogOpen && (
              <CreateProjectModal
                onClose={onDialogClose}
                onButtonClick={onDialogClick}
                // isOpen={projectDialogOpen}
              />
            )}
            <Flex paddingTop="48px">
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
                      <Text textStyle="h3">{i18n.__("projects")}</Text>
                      <Button
                        onClick={() => {
                          setProjectDialogOpen(true);
                        }}
                      >
                        {i18n.__("newProject")}
                      </Button>
                    </Flex>
                    <div className="tableWrap">
                      {updatedData.length === 0 && (
                        <div
                          style={{
                            //same as table
                            width: 1000,
                          }}
                        >
                          <Text m={2}>{i18n.__("noApps")}</Text>
                        </div>
                      )}
                      {updatedData.length > 0 && (
                        <Table columns={Columns} data={updatedData} />
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
            <ProjectDetails
              allValues={allValues}
              setAllValues={setAllValues}
              setStep={setStep}
            />
          </>
        )}
      </C.ContentContainer>
      {/* </StyledBox> */}
    </React.Fragment>
  );
};

Main.propTypes = {
  data: PropTypes.instanceOf(Array),
  currentUser: PropTypes.instanceOf(Object),
  cell: PropTypes.instanceOf(Array),
  row: PropTypes.instanceOf(Array),
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

  const xcreateClient = (endpoint, region) => {
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

        //const client = createClient(clientEndpoint, clientRegion);
        const _currentSession = await Auth.currentSession();
        const client = await createClient(
          clientEndpoint,
          clientRegion,
          _currentSession,
        );

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

        console.log("COMPONENT ", componentProps);
        setInitClient(true);
      }
      return null;
    }

    fetchData();
  }, [isMountedRef.current]);

  return (
    <>
      <ToastContextProvider>
        {initClient && (<>
          
          <Content Component={AppComponent} {...componentProps.current} />
          </>
        )}
        {!initClient && (
          <div>
            Home {isAuthenticated ? "Authenticated" : "Unauthenticated"}{" "}
          </div>
        )}
      </ToastContextProvider>
    </>
  );
};

Home.displayName = "Home";

export default withUsermenu()(Home);
