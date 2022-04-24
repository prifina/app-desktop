/* global localStorage */

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  version,
} from "react";

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

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

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
import BlendIcon from "@blend-ui/icons/dist/esm/BlendIcon";

import mdiPowerPlug from "@iconify/icons-mdi/power-plug";
import mdiZipBoxOutline from "@iconify/icons-mdi/zip-box-outline";
import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";
import bxsInfoCircle from "@iconify/icons-bx/bxs-info-circle";
import baselineWeb from "@iconify/icons-mdi/table";

//sidebar icons
import viewDashboard from "@iconify/icons-mdi/view-dashboard";
import mdiWidget from "@iconify/icons-mdi/widgets";
import mdiBookOpenVariant from "@iconify/icons-mdi/book-open-variant";
import mdiSitemap from "@iconify/icons-mdi/sitemap";

import bxsEdit from "@iconify/icons-bx/bx-edit-alt";

import hazardSymbol from "@iconify/icons-mdi/warning";
import successTick from "@iconify/icons-mdi/tick-circle";

import {
  AddRemoveDataSources,
  ControlAddedDataSources,
  DataSourceForm,
  ApiForm,
} from "../components/helper";

import UploadAsset from "../components/UploadAsset";
import UploadFile from "../components/UploadFile";

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
    keyFeatures: "",
    newKeyFeatures: "",
    shortDescription: "",
    newShortDescription: "",
    longDescription: "",
    newLongDescription: "",
    userHeld: "",
    newUserHeld: "",
    userGenerated: "",
    newUserGenerated: "",
    public: "",
    newPublic: "",
    icon: "",
    newIcon: "",
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
                newKeyFeatures: props.row.original.newKeyFeatures,
                shortDescription: props.row.original.shortDescription,
                newShortDescription: props.row.original.newShortDescription,
                longDescription: props.row.original.longDescription,
                newLongDescription: props.row.original.newLongDescription,
                userHeld: props.row.original.userHeld,
                newUserHeld: props.row.original.newUserHeld,
                userGenerated: props.row.original.userGenerated,
                newUserGenerated: props.row.original.newUserGenerated,
                public: props.row.original.public,
                newPublic: props.row.original.newPublic,
                icon: props.row.original.icon,
                newIcon: props.row.original.newIcon,
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

  const saveChanges = (
    id,
    newAppType,
    newName,
    newVersion,
    newPublisher,
    newCategory,
    newDeviceSupport,
    newLanguages,
    newAge,
    newKeyFeatures,
    newShortDescription,
    newLongDescription,
    newUserHeld,
    newUserGenerated,
    newPublic,
    newIcon,
  ) => {
    updateAppVersionMutation(GRAPHQL, {
      id: id,
      appType: newAppType,
      name: newName,
      nextVersion: newVersion,
      publisher: newPublisher,
      category: newCategory,
      deviceSupport: newDeviceSupport,
      languages: newLanguages,
      age: newAge,
      keyFeatures: newKeyFeatures,
      shortDescription: newShortDescription,
      longDescription: newLongDescription,
      userHeld: newUserHeld,
      userGenerated: newUserGenerated,
      public: newPublic,
      icon: newIcon,
    }).then(res => {
      console.log("SUCCESS", res);
      toast.success("Project name updated successfully", {});
      // location.reload();
      setStep(2);
    });
  };

  const testing = (id, dataSources) => {
    console.log("CLICK ", id);

    updateAppVersionMutation(GRAPHQL, {
      id: id,
      // category: newCategory,
      dataSources: dataSources,
    }).then(res => {
      console.log("SUCCESS", res);
      toast.success("Project name updated successfully", {});
      // location.reload();
      // setStep(2);
    });
  };

  const deleteApp = () => {
    deleteAppVersionMutation(GRAPHQL, {
      id: allValues.id,
    }).then(res => {
      console.log("SUCCESS", res);
      // location.reload();
      toast.success("Deleted project successfully", {});
    });
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

  const radioButtons = () => {
    if (allValues.appType === 1) {
      return (
        <Flex flexDirection="row" alignItems="center" mr="20px">
          <Flex flexDirection="row" alignItems="center" mr="15px">
            <Radio
              fontSize="8px"
              onChange={() => {}}
              onClick={() => {
                setAllValues({ ...allValues, newType: 2 });
              }}
            />
            <Text fontSize="xs">{i18n.__("widget")}</Text>
          </Flex>
          <Flex flexDirection="row" alignItems="center">
            <Radio
              fontSize="10px"
              onChange={() => {}}
              checked
              onClick={() => {
                setAllValues({ ...allValues, newType: 1 });
              }}
            />
            <Text fontSize="xs">Application</Text>
          </Flex>
        </Flex>
      );
    } else if (allValues.appType === 2) {
      return (
        <Flex flexDirection="row" alignItems="center" mr="20px">
          <Flex flexDirection="row" alignItems="center" mr="15px">
            <Radio
              checked
              fontSize="10px"
              onChange={() => {}}
              value="1"
              onClick={() => {
                setAllValues({ ...allValues, newType: 2 });
              }}
            />
            <Text fontSize="xs">{i18n.__("widget")}</Text>
          </Flex>
          <Flex flexDirection="row" alignItems="center">
            <Radio
              fontSize="10px"
              onChange={() => {}}
              value="2"
              onClick={() => {
                setAllValues({ ...allValues, newType: 1 });
              }}
            />
            <Text fontSize="xs">Application</Text>
          </Flex>
        </Flex>
      );
    }
  };

  const detailsSaveStatus = () => {
    if (
      allValues.name !== allValues.newName ||
      allValues.appType !== allValues.newType
    ) {
      return (
        <Flex alignItems="center">
          <BlendIcon
            size="18px"
            iconify={hazardSymbol}
            className="icon"
            color="orange"
          />
          <Text fontSize="xs" ml={5} color="#EDA436">
            Unsaved Changes
          </Text>
          <Button
            ml="15px"
            onClick={() => {
              saveChanges(
                allValues.id,
                allValues.newType,
                allValues.newName,
                allValues.newVersion,
              );
            }}
          >
            Save Changes
          </Button>
        </Flex>
      );
    } else {
      return (
        <Flex alignItems="center">
          <Text fontSize="xs">No Unsaved Changes</Text>
          <Button disabled colorStyle="red" ml="15px">
            Save Changes
          </Button>
        </Flex>
      );
    }
  };

  console.log("all", allValues);

  const resourcesSaveStatus = () => {
    if (
      allValues.version !== allValues.newVersion ||
      allValues.publisher !== allValues.newPublisher ||
      allValues.category !== allValues.newCategory ||
      allValues.deviceSupport !== allValues.newDeviceSupport ||
      allValues.languages !== allValues.newLanguages ||
      allValues.age !== allValues.newAge ||
      allValues.keyFeatures !== allValues.newKeyFeatures ||
      allValues.shortDescription !== allValues.newShortDescription ||
      allValues.longDescription !== allValues.newLongDescription ||
      allValues.userHeld !== allValues.newUserHeld ||
      allValues.userGenerated !== allValues.newUserGenerated ||
      allValues.public !== allValues.newPublic
    ) {
      return (
        <Flex alignItems="center">
          <BlendIcon
            size="18px"
            iconify={hazardSymbol}
            className="icon"
            color="orange"
          />
          <Text fontSize="xs" ml={5} color="#EDA436">
            Unsaved Changes
          </Text>
          <Button
            ml="15px"
            onClick={() => {
              saveChanges(
                allValues.id,
                allValues.appType,
                allValues.newName,
                allValues.newVersion,
                allValues.newPublisher,
                allValues.newCategory,
                allValues.newDeviceSupport,
                allValues.newLanguages,
                allValues.newAge,
                allValues.newKeyFeatures,
                allValues.newShortDescription,
                allValues.newLongDescription,
                allValues.newUserHeld,
                allValues.newUserGenerated,
                allValues.newPublic,
                allValues.newIcon,
              );
            }}
          >
            Save Changes
          </Button>
        </Flex>
      );
    } else {
      return (
        <Flex alignItems="center">
          <Text fontSize="xs">No Unsaved Changes</Text>
          <Button disabled colorStyle="red" ml="15px">
            Save Changes
          </Button>
        </Flex>
      );
    }
  };

  useEffect(() => {
    if (allValues.version !== allValues.newVersion) {
      return console.log("true");
    } else {
      return console.log("false");
    }
  }, [allValues.newVersion]);

  useEffect(() => {
    if (
      allValues.name !== allValues.newName ||
      allValues.type !== allValues.newType
    ) {
      return console.log("true");
    } else {
      return console.log("false");
    }
  }, [allValues.newName, allValues.newType]);

  const handleNameChange = event =>
    setAllValues({
      ...allValues,
      newName: event.target.value,
    });

  const handleValueChange = event => {
    let value = event.target.value;
    let name = event.target.name;

    setAllValues(prevalue => {
      return {
        ...prevalue, // Spread Operator
        [name]: value,
      };
    });
  };

  var pullParams = {
    type: "slotPull",
    message: "RequestResponse",
    LogType: "None",
  };

  let jsonWord = JSON.stringify(pullParams);

  console.log("json word", jsonWord);

  const InputSection = ({ title, valueName, defaultValue, onChange, text }) => {
    return (
      <Flex alignItems="flex-end" mb={16}>
        <Box>
          <Text fontSize="sm" mb={5}>
            {title}
          </Text>
          <Input
            width="451px"
            label="text"
            name={valueName}
            defaultValue={defaultValue}
            onChange={onChange}
            color={colors.textPrimary}
            style={{
              background: "transparent",
              border: "1px solid #ADADAD",
            }}
          />
        </Box>
        <Text fontSize="xs" ml={25}>
          {text}
        </Text>
      </Flex>
    );
  };

  const passAssetInfo = title => {
    console.log("pass", title); // LOGS DATA FROM CHILD (My name is Dean Winchester... &)

    setAllValues({
      ...allValues,
      newIcon: allValues.id + "-" + "icon" + "-" + title,
    });
  };

  return (
    <React.Fragment>
      <DevConsoleSidebar items={menuItems} />
      <C.NavbarContainer bg="basePrimary">
        <DevConsoleLogo className="appStudio" />
      </C.NavbarContainer>

      {/* <StyledBox> */}
      <Flex
        width="100vw"
        minHeight="100vh"
        paddingLeft="286px"
        paddingBottom="100px"
        bg="baseTertiary"
        flexDirection="column"
        alignItems="center"
      >
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
                      {data.length === 0 && (
                        <div
                          style={{
                            //same as table
                            width: 1000,
                          }}
                        >
                          <Text m={2}>{i18n.__("noApps")}</Text>
                        </div>
                      )}
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
              <C.ActionContainer
                mt={10}
                mb={32}
                style={{ top: 65, position: "sticky" }}
              >
                <C.CustomShape bg="brandAccent" />
                <BlendIcon
                  style={{ cursor: "pointer" }}
                  color={colors.textPrimary}
                  iconify={mdiArrowLeft}
                  width="24px"
                  onClick={() => {
                    setStep(2);
                  }}
                />
                <Input
                  width="200px"
                  name="newName"
                  defaultValue={allValues.name}
                  onChange={handleValueChange}
                />
                <Flex>
                  {radioButtons()}
                  {detailsSaveStatus()}
                </Flex>
                <Button disabled>Launch Sandbox</Button>
              </C.ActionContainer>
              <C.ProjectContainer mb={24}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text style={{ textTransform: "uppercase" }}>
                    Project resources
                  </Text>
                  {resourcesSaveStatus()}
                </Flex>
                <Box width="584px">
                  <Text fontSize="xs">
                    Add your .Zip build deployment package and information
                    regarding your apps data useage here to prepare for handoff
                    to a nominated publisher account.
                  </Text>
                </Box>
                <Divider mb={24} mt={24} color={colors.textMuted} />
                <Text mb={24}>Build deployment</Text>

                <Flex mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      App ID
                    </Text>
                    <Input
                      disabled
                      width="451px"
                      label="text"
                      value={allValues.id}
                      color={colors.textPrimary}
                      style={{ background: "transparent" }}
                    />
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Version number
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="newVersion"
                      defaultValue={allValues.version || "undefined"}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        border: "1px solid #ADADAD",
                      }}
                    />
                  </Box>
                  <Text fontSize="xs" ml={25}>
                    This version number is for your internal use so can follow
                    whatever logic you choose.
                  </Text>
                </Flex>
                <Flex alignItems="center" justifyContent="center" mb={16}>
                  <Box ml="5px">
                    <Text fontSize="sm" mb={5}>
                      Build deployment package
                    </Text>
                    {/* <div
                      style={{
                        border: "1px dashed lightgray",
                        width: 451,
                        height: 132,
                        borderRadius: 4,
                        background: "transparent",
                      }}
                    /> */}
                    <UploadFile />
                  </Box>
                  <Box ml={25}>
                    <Text fontSize="xs">
                      The build deployment package is a package version of your
                      local build. It must include:
                    </Text>
                    <Text fontSize="xs">1. Your Prifina App ID</Text>
                    <Text fontSize="xs">
                      2. Come in a .zip with a maximum file size of 5MB
                    </Text>
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Publisher
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="newPublisher"
                      defaultValue={allValues.publisher}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        border: "1px solid #ADADAD",
                      }}
                    />
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Category
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="newCategory"
                      defaultValue={allValues.category}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        border: "1px solid #ADADAD",
                      }}
                    />
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Device support
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="newDeviceSupport"
                      defaultValue={allValues.deviceSupport}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        border: "1px solid #ADADAD",
                      }}
                    />
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Languages
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="newLanguages"
                      defaultValue={allValues.languages}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        border: "1px solid #ADADAD",
                      }}
                    />
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Age
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="newAge"
                      defaultValue={allValues.age}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        border: "1px solid #ADADAD",
                      }}
                    />
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Key Features
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="newKeyFeatures"
                      defaultValue={allValues.keyFeatures}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        border: "1px solid #ADADAD",
                      }}
                    />
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Short Description
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="newShortDescription"
                      defaultValue={allValues.shortDescription}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        border: "1px solid #ADADAD",
                      }}
                    />
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Long Description
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="newLongDescription"
                      defaultValue={allValues.longDescription}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        border: "1px solid #ADADAD",
                      }}
                    />
                  </Box>
                </Flex>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5}>
                      Icon
                    </Text>
                  </Box>
                  <UploadAsset
                    id={allValues.id}
                    type="icon"
                    numId="1"
                    passAssetInfo={passAssetInfo}
                  />
                </Flex>
              </C.ProjectContainer>
              <C.ProjectContainer alt="dataSources">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text style={{ textTransform: "uppercase" }}>
                    Data sources
                  </Text>
                  {/* {resourcesSaveStatus()} */}
                </Flex>
              </C.ProjectContainer>

              {/* <C.DataContainer /> */}
              <C.ActionContainer mt={10} mb={32} justifyContent="space-between">
                <C.CustomShape bg="baseError" />
                <Box width="530px">
                  <Text>DELETE PROJECT</Text>
                  <Text mt={5} fontSize="xs">
                    Choose this to delete your project and all data associated
                    with your account. This operation is final and all data will
                    be permanently lost.
                  </Text>
                </Box>
                <Button colorStyle="error" onClick={deleteApp} disabled>
                  Delete
                </Button>
              </C.ActionContainer>
            </Flex>
          </>
        )}
      </Flex>
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
        {initClient && (
          <Content Component={AppComponent} {...componentProps.current} />
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
