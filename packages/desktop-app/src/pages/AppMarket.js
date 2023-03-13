import React, { useState, useEffect, useRef } from "react";

import _ from "lodash";

import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Divider,
  useTheme,
} from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import {
  SidebarMenu,
  Navbar
} from "@prifina-apps/ui-lib";


import PropTypes from "prop-types";

import shallow from "zustand/shallow";

import { useStore, useTranslate } from "@prifina-apps/utils";
//import { useStore } from "../utils-v2/stores/PrifinaStore";

import * as C from "./app-market/components";
import DataSourceModal from "./app-market/DataSourceModal";
import WidgetBox from "./app-market/WidgetBox";
import ButtonGroup from "./app-market/ButtonGroup";

import config from "../config";

//assets
import { PrifinaLogo } from "../components/PrifinaLogo";
//import appMarketBanner from "../assets/app-market/app-market-banner.svg";
//import useHeldDataImage from "../assets/app-market/user-held-data.svg";
import AppMarketBanner from "../assets/app-market/AppMarketBanner";
import UseHeldDataImage from "../assets/app-market/UserHeldData";

//dataSource icons
//import ouraIcon from "../assets/app-market/oura-icon.svg";
//import dataSourceIcon from "../assets/app-market/data-source-icon.svg";

import OuraIcon from "../assets/app-market/OuraIcon";
import DataSourceIcon from "../assets/app-market/DataSourceIcon";
//icons
import bxsCheckCircle from "@iconify/icons-bx/bxs-check-circle";
import bxsXCircle from "@iconify/icons-bx/bxs-x-circle";
import lefArrow from "@iconify/icons-bx/bxs-chevron-left";
//menuIcons
import AppMenu from "@iconify/icons-fe/app-menu";
import bxsWidget from "@iconify/icons-bx/bxs-widget";
import bxMinusBack from "@iconify/icons-bx/bx-minus-back";

import bxsGrid from "@iconify/icons-bx/bxs-grid";
import mdiShopping from "@iconify/icons-mdi/shopping";
import mdiSort from "@iconify/icons-mdi/sort";

import { PrifinaIcon } from "./app-market/icons";

//import { ReactComponent as AppMarketLogo } from "../assets/app-market/app-market-logo.svg";
import AppMarketLogo from "../assets/app-market/AppMarketLogo";

const propTest = props => {
  console.log("PROP TEST ", props);
  return null;
};

const AppMarket = ({ prifinaID, ...props }) => {
  console.log("APP MARKET PROPS ", props);


  const { __ } = useTranslate();

  const { user, listDataSourcesQuery, getPrifinaUser,
    installWidgetMutation,
    listAppMarketQuery, getRequestTokenQuery } = useStore(
      state => ({
        user: state.user,
        listDataSourcesQuery: state.listDataSourcesQuery,
        getPrifinaUser: state.getPrifinaUser,
        installWidgetMutation: state.installWidgetMutation,
        listAppMarketQuery: state.listAppMarketQuery,
        getRequestTokenQuery: state.getRequestTokenQuery
      }),
      shallow,
    );

  const widgets = useRef({});
  const [installedWidgets, setInstalledWidgets] = useState([]);

  const [count, setCount] = useState({
    all: 0,
    widgets: 0,
    apps: 0,
    systemApps: 0,
  });

  const { colors } = useTheme();

  const s3path = `https://prifina-apps-${config.prifinaAccountId}-${config.main_region}.s3.amazonaws.com`;

  const availableDataSources = useRef([]);
  const userDataSources = useRef({});

  const dataSourceIcons = {
    oura: OuraIcon,
    API: DataSourceIcon,
    fitbit: DataSourceIcon,
    garmin: DataSourceIcon,
    "google-timeline": DataSourceIcon,
  };

  const [isLoading, setIsLoading] = useState(true);

  const [showAppType, setShowAppType] = useState(4);

  const [filteredWidgets, setFilteredWidgets] = useState({});

  const effectCalled = useRef(false);
  useEffect(() => {
    async function init() {

      effectCalled.current = true;

      const apps = await listAppMarketQuery({
        filter: { appType: { lt: 4 } },
      });

      console.log("APPLICATIONS", apps);

      const prifinaUser = getPrifinaUser();
      if (
        prifinaUser.hasOwnProperty("dataSources") &&
        prifinaUser.dataSources !== null
      ) {
        //
        //console.log(typeof prifinaUser.data.getPrifinaUser.dataSources);
        //console.log("INIT USER DATASOURCES...", prifinaUser.data.getPrifinaUser);
        userDataSources.current = JSON.parse(
          prifinaUser.dataSources,
        );
      } else {
        userDataSources.current = {};
      }
      // filter sourceType===1 only oauth based datasources...
      const dataSources = await listDataSourcesQuery({
        filter: { sourceType: { gt: 0 } },
      });
      //console.log("AVAILABLE DATASOURCES ", dataSources);
      availableDataSources.current = dataSources.data.listDataSources.items;
      console.log("AVAILABLE DATASOURCES ", availableDataSources.current);

      let dataSourceModules = {};
      Object.keys(availableDataSources.current).forEach(s => {
        if (availableDataSources.current[s].modules !== null && availableDataSources.current[s]?.modules) {
          for (
            let m = 0;
            m < availableDataSources.current[s].modules.length;
            m++
          ) {
            const moduleName = availableDataSources.current[s].modules[m];
            dataSourceModules[moduleName] = {
              ...availableDataSources.current[s],
            };
          }
        }
      });
      console.log("AVAILABLE DATASOURCES MODULES ", dataSourceModules);
      let widgetData = apps.data.listAppMarket.items;
      console.log("WIDGET DATA", widgetData);

      let availableWidgets = {};
      widgetData.forEach(item => {
        const manifest = JSON.parse(item.manifest);
        let theme = "dark";
        let size = "300x300";
        let defaultSettings = [
          { field: "size", size },
          { field: "theme", theme },
        ];

        if (item.settings && item.settings.length > 0) {
          item.settings.forEach(s => {
            if (s.field === "sizes") {
              defaultSettings[0] = {
                field: "size",
                value: JSON.parse(s.value)[0].value,
              };
              //"[{\"option\":\"300x300\",\"value\":\"300x300\"}]"
            } else if (s.field === "theme") {
              defaultSettings[1] = {
                field: "theme",
                value: JSON.parse(s.value)[0].value,
              };
            } else {
              defaultSettings.push({ field: s.field, value: s.value });
            }
          });
        }
        console.log("WidgetData ITEM ", item);
        let dataSources = [];

        if (
          item.hasOwnProperty("dataSources") &&
          item.dataSources !== null &&
          item.dataSources.length > 0
        ) {
          dataSources = item.dataSources.map(ds => {
            const dataSource = dataSourceModules[ds];

            return {
              id: dataSource.source,
              title: dataSource ? dataSource.name : dataSource.source,
              description: dataSource ? dataSource.description : "",
              icon: dataSourceIcons[dataSource.source],
              connected: false,
              sourceType: dataSource ? dataSource.sourceType : 0,
            };
          });
        }

        availableWidgets[item.id] = {
          appType: item.appType,
          title: item.title,
          installed: false,
          settings: defaultSettings,
          publisher: manifest?.publisher,
          icon: `${s3path}/${manifest?.id}/${manifest?.icon}`,
          bannerImage: `${s3path}/${manifest?.id}/${manifest?.bannerImage}`,
          description: manifest?.description,
          shortDescription: manifest?.shortDescription,
          longDescription: manifest?.longDescription,
          dataTypes: manifest?.dataTypes,
          category: manifest?.category,
          deviceSupport: manifest?.deviceSupport,
          languages: manifest?.languages,
          age: manifest?.age,
          screenshots: manifest?.screenshots,
          keyFeatures: manifest?.keyFeatures,
          userHeld: manifest?.userHeld,
          userGenerated: manifest?.userGenerated,
          public: manifest?.public,
          id: manifest?.id,
          dataSources: dataSources,
          //dataConnectors: manifest.dataConnectors || [],
        };

        console.log("MANIFEST", manifest);
        const screenshots = [
          `${s3path}/${manifest?.id}/${manifest?.screenshots}`,
        ];
        console.log("sreenshots", screenshots);
      });

      console.log("AVAILABLE WIDGETS ", availableWidgets);
      let currentInstalled = [];
      if (
        prifinaUser.hasOwnProperty("installedWidgets") &&
        prifinaUser.installedWidgets !== null
      ) {
        const installedWidgets = JSON.parse(
          prifinaUser.installedWidgets,
        );
        installedWidgets.forEach(w => {
          if (availableWidgets.hasOwnProperty(w.id)) {
            availableWidgets[w.id].installed = true;
            currentInstalled.push(w.id);
          }
        });
        console.log(availableWidgets);
        widgets.current = availableWidgets;
        setInstalledWidgets(currentInstalled);
      } else {
        // no widgets installed....
        widgets.current = availableWidgets;
        setInstalledWidgets(currentInstalled);
      }

      let widgetsCount = _.pickBy(widgets.current, { appType: 2 });
      let appCount = _.pickBy(widgets.current, { appType: 1 });
      let systemAppsCount = _.pickBy(widgets.current, { appType: 3 });

      let all = { ...widgetsCount, ...appCount };

      setFilteredWidgets(all);

      setCount({
        ...count,
        all: _.size(all),
        widgets: _.size(widgetsCount),
        apps: _.size(appCount),
        systemApps: _.size(systemAppsCount),
      });

      setIsLoading(false);
    }
    if (!effectCalled.current) {
      init();
    }

    return () => {
      widgets.current = {};
    };
  }, []);

  console.log("WIDGETS ", widgets);

  console.log("FILTERED WIDGETS", filteredWidgets);

  const installWidget = (e, id, settings) => {
    console.log("CLICK ", id);

    installWidgetMutation(prifinaID, {
      id: id,
      settings: settings,
      index: -1,
    }).then(res => {
      console.log("INSTALL ", res);

      widgets.current[id].installed = true;

      setInstalledWidgets(...installedWidgets, id);
    });
  };

  const [selectedWidgetIndex, setSelectedWidgetIndex] = useState(-1);

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

  function userHeldData() {
    const newData = widgets.current[selectedWidgetIndex].userHeld?.map(
      (item, index) => {
        return (
          <Flex alignItems="center" key={index}>
            <BlendIcon
              iconify={bxsCheckCircle}
              color={colors.textLink}
              size="16px"
            />
            <Text fontSize="sm" color={colors.textLink} marginLeft="8px">
              {item}
            </Text>
          </Flex>
        );
      },
    );
    if (newData?.length > 0) {
      return <Flex flexDirection="column">{newData}</Flex>;
    } else {
      return (
        <Flex alignItems="center">
          <BlendIcon iconify={bxsXCircle} color={"#ADADAD"} size="16px" />
          <Text marginLeft="8px" color={colors.textMuted} fontSize="sm">
            {__("noneNeeded")}
          </Text>
        </Flex>
      );
    }
  }

  function userGeneratedData() {
    const newData = widgets.current[selectedWidgetIndex].userGenerated?.map(
      (item, index) => {
        return (
          <Flex alignItems="center" key={index}>
            <BlendIcon
              iconify={bxsCheckCircle}
              color={colors.textLink}
              size="16px"
            />
            <Text fontSize="sm" color={colors.textLink} marginLeft="8px">
              {item}
            </Text>
          </Flex>
        );
      },
    );
    if (newData?.length > 0) {
      return <Flex flexDirection="column"> {newData}</Flex>;
    } else {
      return (
        <Flex alignItems="center">
          <BlendIcon iconify={bxsXCircle} color={"#ADADAD"} size="16px" />
          <Text marginLeft="8px" color={colors.textMuted} fontSize="sm">
            {__("noneNeeded")}
          </Text>
        </Flex>
      );
    }
  }
  function publicData() {
    const newData = widgets.current[selectedWidgetIndex].public?.map(
      (item, index) => {
        return (
          <Flex alignItems="center" key={index}>
            <BlendIcon
              iconify={bxsCheckCircle}
              color={colors.textLink}
              size="16px"
            />
            <Text fontSize="sm" color={colors.textLink} marginLeft="8px">
              {item}
            </Text>
          </Flex>
        );
      },
    );
    if (newData?.length > 0) {
      return <Flex flexDirection="column">{newData}</Flex>;
    } else {
      return (
        <Flex alignItems="center">
          <BlendIcon iconify={bxsXCircle} color={"#ADADAD"} size="16px" />
          <Text marginLeft="8px" color={colors.textMuted} fontSize="sm">
            {__("noneNeeded")}
          </Text>
        </Flex>
      );
    }
  }

  const items = [
    {
      label: "Marketplace",
      IconImage: AppMenu,
      onClick: () => {
        setStep(0);
      },
    },
    // {
    //   label: "Widgets",
    //   icon: bxsWidget,
    //   onClick: () => {
    //     setStep(0);
    //   },
    // },
    // {
    //   label: "Apps",
    //   icon: bxMinusBack,
    //   badgeText: "Soon",
    //   disabled: true,
    // },
  ];

  const [activeTab, setActiveTab] = useState(0);

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };

  const [addingDataSource, setAddingDataSource] = useState(-1);

  const onDialogClose = e => {
    console.log("DIALOG CLOSE...", e);
    setAddingDataSource(-1);
    e.preventDefault();
  };
  const onDialogClick = async e => {
    ///...further logic on adding data source data
    console.log("DIALOG CLICK...", e);
    setAddingDataSource(-1);

    e.preventDefault();
  };

  console.log(
    "install",
    //widgets.current,
    selectedWidgetIndex > -1
      ? widgets.current[selectedWidgetIndex].installed
      : null,
  );
  console.log("LEFT MENU ", items);

  const printButtonLabel = event => {
    console.log(event.target.name);
    //do some stuff here
  };

  const filterButtons = [
    {
      name: "View all",
      icon: <BlendIcon iconify={mdiShopping} width="14px" />,
      onClick: () => setShowAppType(2),
      count: count.all,
    },

    {
      name: "Widgets",
      icon: <BlendIcon iconify={bxsWidget} width="14px" />,
      onClick: () => setShowAppType(2),
      count: count.widgets,
    },
    {
      name: "Apps",
      icon: <BlendIcon iconify={bxsGrid} width="14px" />,
      onClick: () => setShowAppType(1),
      count: count.apps,
    },
    {
      name: "System Apps",
      icon: <PrifinaIcon style={{ fill: "blue" }} />,
      onClick: () => setShowAppType(3),
      count: count.systemApps,
    },
  ];

  console.log("show apps ", showAppType);

  const handleFilter = type => {
    if (type <= 3) {
      setFilteredWidgets(_.pickBy(widgets.current, { appType: type }));
    } else {
      setFilteredWidgets(widgets.current);
    }
  };

  // const handleSort = order => {
  //   let arr = Object.values(filteredWidgets);

  //   setFilteredWidgets(
  //     _.orderBy(arr, [item => item.title.toLowerCase()], ["asc"]),
  //   );
  // };

  useEffect(() => {
    handleFilter(showAppType);
  }, [showAppType]);

  // useEffect(() => {
  //   setFilteredWidgets(widgets.current);
  // }, [filteredWidgets]);

  // const sorted = Object.keys(filteredWidgets)
  //   .sort()
  //   .reduce((accumulator, key) => {
  //     accumulator[key] = filteredWidgets[key];

  //     return accumulator;
  //   }, {});

  // const sorted = Object.keys(filteredWidgets).sort();

  const result = _.pickBy(filteredWidgets, (value, key) => {
    return _.startsWith(key, "c");
  });
  console.log("result", result);

  // let sortable = filteredWidgets.sort((a, b) =>
  //   a.firstname.localeCompare(b.firstname),
  // );

  // let sortable = [];

  // for (var prop in filteredWidgets) {
  //   if (filteredWidgets.hasOwnProperty(prop)) {
  //     var innerObj = {};
  //     innerObj[prop] = filteredWidgets[prop];
  //     sortable.push(innerObj);
  //   }
  // }

  // console.log(arr);

  // console.log("sorted", sortable);

  const [sort, setSort] = useState({
    subject: "",
    order: "",
  });

  console.log("sort", sort);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggling = () => setMenuOpen(!menuOpen);

  const SortingToggle = ({ onClick }) => {
    return (
      <C.SortingContainer onClick={onClick}>
        Name A-Z
        <BlendIcon iconify={mdiSort} width="14px" />
      </C.SortingContainer>
    );
  };

  // const handleSort = ({ data, subject, order }) => {
  //   return _.orderBy(data, [item => item.subject?.toLowerCase()], [{ order }]);
  // };

  useEffect(() => {
    // handleSort();
  }, []);

  return (
    <>
      <C.GlobalStyle />
      <SidebarMenu items={items} />
      <Navbar backgroundColor="baseWhite">
        <AppMarketLogo />
      </Navbar>
      {step === 0 && (
        <>
          <Flex
            width="100%"
            height="100%"
            paddingLeft="286px"
            bg={colors.backgroundLight}
            flexDirection="column"
          >
            <Flex
              minHeight="316px"
              bg="#EBF3FF"
              justifyContent="space-between"
              padding="32px 40px 32px 40px"
            >
              <Flex
                display="flex"
                flexDirection="column"
                justifyContent="center"
                marginRight="143px"
                width="480px"
              >
                <Text textStyle="h3" mb="24px">
                  {__("dataOnYourSide")}
                </Text>
                <Text fontSize="md" color="#4D5150">
                  {__("appMarketText")}
                </Text>
              </Flex>
              <AppMarketBanner id="appMarket-banner" />
            </Flex>
            <Box mt={"50px"} ml={"64px"} mr={"34px"}>
              {!isLoading ? (
                <>
                  <Flex justifyContent="space-between">
                    <div>
                      <ButtonGroup
                        buttons={filterButtons}
                        handleClickAction={printButtonLabel}
                      />
                    </div>
                    {/* <Box mr={64}>
                      <SortingToggle onClick={toggling} />
                      {menuOpen && (
                        <C.DropDownListContainer>
                          <C.DropDownList>
                            <C.InteractiveMenuItem
                              title="Name A-Z"
                              onClick={e => {
                                e.preventDefault();
                                // setSort({
                                //   ...sort,
                                //   suvject:
                                // })
                                // setFilteredWidgets(
                                //   _.orderBy(
                                //     filteredWidgets,
                                //     ["title"],
                                //     ["asc"],
                                //   ),
                                // );
                                handleSort();
                              }}
                            />
                            <C.InteractiveMenuItem
                              title="Name Z-A"
                              onClick={e => {
                                e.preventDefault();
                              }}
                            />
                            <C.InteractiveMenuItem
                              title="Type A-Z"
                              onClick={e => {
                                e.preventDefault();
                              }}
                            />
                            <C.InteractiveMenuItem
                              title="Type Z-A"
                              onClick={e => {
                                e.preventDefault();
                              }}
                            /> 
                          </C.DropDownList>
                        </C.DropDownListContainer>
                      )}
                    </Box> 
                    */}
                  </Flex>
                  <Flex mt="24px" flexDirection="row" flexWrap="wrap">
                    {/* {Object.keys(widgets.current).map(w => { */}
                    {Object.keys(filteredWidgets).map(w => {
                      // console.log("WIDGETS CURRENT", widgets.current);
                      return (
                        <WidgetBox
                          key={w}
                          id={w}
                          {...widgets.current[w]}
                          keyName={w}
                          installWidget={installWidget}
                          installedWidget={installedWidgets.indexOf(w)}
                          onClick={() => {
                            setStep(1);
                            setSelectedWidgetIndex(w);
                          }}
                        />
                      );
                    })}
                  </Flex>
                  {/* {!filteredWidgets === {} null : (
                    <Flex mt="24px" flexDirection="row" flexWrap="wrap">
                      <Text>Coming soon...</Text>
                    </Flex>
                  )} */}
                </>
              ) : (
                <Text>Loading...</Text>
              )}
            </Box>
          </Flex>
        </>
      )}
      {step === 1 && (
        <>
          {addingDataSource > -1 && (
            <DataSourceModal
              onClose={setAddingDataSource}
              dataSourceItems={widgets.current[selectedWidgetIndex].dataSources}
              selectedDataSourceIndex={addingDataSource}
              getRequestTokenQuery={getRequestTokenQuery}
              prifinaID={prifinaID}
            />
          )}
          <Flex
            width="100%"
            height="100%"
            paddingLeft="286px"
            bg={colors.backgroundLight}
            flexDirection="column"
            alignItems="center"
          >
            <Flex
              width="100%"
              height="71px"
              alignItems="center"
              paddingLeft="64px"
            >
              <C.TextButton
                id="widgetsDirectoryButton"
                onClick={() => {
                  setStep(0);
                }}
              >
                <BlendIcon iconify={lefArrow} size="12px" />
                {__("widgetsDirectory")}
              </C.TextButton>
            </Flex>
            {widgets.current[selectedWidgetIndex].appType !== 3 ? (
              <>
                <Image
                  src={widgets.current[selectedWidgetIndex].bannerImage}
                  alt={"Image"}
                  shape={"square"}
                  style={{ filter: "blur(1.5px)" }}
                />
                <Flex
                  alt="innerContainer"
                  marginTop={-120}
                  borderRadius="8px"
                  width="1026px"
                  height="auto"
                  bg={colors.backgroundLight}
                  boxShadow="0px 0px 16px rgba(74, 77, 79, 0.25)"
                  flexDirection="column"
                  marginBottom="82px"
                  paddingLeft="40px"
                  paddingRight="40px"
                  paddingBottom="30px"
                  zIndex={0}
                >
                  <Flex
                    alt="topContainer"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    paddingTop="32px"
                    paddingBottom="24px"
                  >
                    <Flex alt="leftSide" alignItems="center">
                      <Image
                        src={widgets.current[selectedWidgetIndex].icon}
                        alt={"Image"}
                        shape={"square"}
                        width={57}
                      />
                      <Flex flexDirection="column" marginLeft="16px">
                        <Flex alignItems="center">
                          <Text fontSize="xl" bold marginRight="24px">
                            {widgets.current[selectedWidgetIndex].title}
                          </Text>
                          <C.Badge>{__("widget")}</C.Badge>
                        </Flex>
                        <Flex paddingTop="8px">
                          <Text
                            marginRight="18px"
                            color={colors.textMuted}
                            fontSize="xs"
                          >
                            {widgets.current[selectedWidgetIndex].publisher}
                          </Text>
                          <Text color={colors.textMuted} fontSize="xs">
                            {widgets.current[selectedWidgetIndex].category}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Flex alt="rightSide">
                      <Button variation="outline" id="reportBugButton">
                        {__("reportBug")}
                      </Button>
                      <Button
                        variation="outline"
                        id="supportButton"
                        marginLeft="16px"
                      >
                        {__("support")}
                      </Button>
                      {widgets.current[selectedWidgetIndex].installed ===
                        false ? (
                        <Button
                          id="installButton"
                          marginLeft="16px"
                          onClick={e => {
                            installWidget(
                              e,
                              widgets.current[selectedWidgetIndex].id,
                              widgets.current[selectedWidgetIndex].settings,
                            );
                          }}
                        >
                          {__("install")}
                        </Button>
                      ) : (
                        <Button
                          id="viewButton"
                          marginLeft="16px"
                          onClick={() => {
                            window.location.replace(
                              config.APP_URL + "/system/display-app",
                            );
                          }}
                        >
                          {__("view")}
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                  <div
                    style={{
                      overflow: "hidden",
                    }}
                  >
                    <Tabs
                      activeTab={activeTab}
                      onClick={tabClick}
                      style={{ height: "100%" }}
                      variant={"line"}
                    >
                      <TabList>
                        <Tab style={{ paddingLeft: 30, paddingRight: 30 }}>
                          <Text>{__("widgetDetails")}</Text>
                        </Tab>
                        <Tab style={{ paddingLeft: 30, paddingRight: 30 }}>
                          <Text>{__("dataRequirements")}</Text>
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
                            <Flex
                              alt="bottomContainer"
                              justifyContent="space-between"
                            >
                              <Flex
                                alt="leftSide"
                                flexDirection="column"
                                width="549px"
                              >
                                <Flex alt="widgetInfo" alignItems="center">
                                  <Text marginRight="24px" fontSize="18px">
                                    {widgets.current[selectedWidgetIndex].title}
                                  </Text>
                                  {/* temproray */}
                                  <Box
                                    width="117px"
                                    height="30px"
                                    bg="#B2F5EA"
                                    textAlign="center"
                                    lineHeight="30px"
                                    fontSize="xxs"
                                    color="#00A3C4"
                                  >
                                    {__("userHeld")}
                                  </Box>
                                </Flex>
                                <Text fontSize="xs" color={colors.textMuted}>
                                  {
                                    widgets.current[selectedWidgetIndex]
                                      .publisher
                                  }
                                </Text>
                                <Text fontSize="sm">
                                  {
                                    widgets.current[selectedWidgetIndex]
                                      .shortDescription
                                  }
                                </Text>
                                <Flex
                                  alt="requirementCards"
                                  paddingTop="32px"
                                  marginBottom="40px"
                                  justifyContent="space-between"
                                >
                                  <C.Card
                                    title={__("dataTypes")}
                                    value={
                                      widgets.current[selectedWidgetIndex]
                                        ?.dataTypes
                                    }
                                  />
                                  <C.Card
                                    title={__("category")}
                                    value={
                                      widgets.current[selectedWidgetIndex]
                                        .category
                                    }
                                  />
                                  <C.Card
                                    title={__("deviceSupport")}
                                    value={
                                      widgets.current[selectedWidgetIndex]
                                        .deviceSupport
                                    }
                                  />
                                  <C.Card
                                    title={__("languages")}
                                    value={
                                      widgets.current[selectedWidgetIndex]
                                        .languages
                                    }
                                  />
                                  <C.Card
                                    title={__("ageAppropriate")}
                                    value={
                                      widgets.current[selectedWidgetIndex].age
                                    }
                                  />
                                </Flex>
                                <Text
                                  color={colors.textMuted}
                                  fontSize="sm"
                                  marginBottom="16px"
                                >
                                  {
                                    widgets.current[selectedWidgetIndex]
                                      .longDescription
                                  }
                                </Text>
                                <Flex alt="features" flexDirection="column">
                                  <Text
                                    color={colors.textMuted}
                                    fontSize="sm"
                                    marginBottom="8px"
                                  >
                                    {__("features")}
                                  </Text>
                                  <C.OrderedList>
                                    {widgets.current[
                                      selectedWidgetIndex
                                    ].keyFeatures?.map((item, index) => {
                                      return (
                                        <C.ListItem
                                          key={index}
                                          fontSize="sm"
                                          color={colors.textMuted}
                                        >
                                          {item}
                                        </C.ListItem>
                                      );
                                    })}
                                  </C.OrderedList>
                                </Flex>
                              </Flex>
                              <Flex alt="rightSide" flexDirection="column">
                                {widgets.current[
                                  selectedWidgetIndex
                                ].screenshots?.map((item, i) => {
                                  return (
                                    <Box
                                      key={i}
                                      width="284px"
                                      height="213px"
                                      marginBottom="16px"
                                    >
                                      <Image
                                        src={`${s3path}/${widgets.current[selectedWidgetIndex].id}/${item}`}
                                      />
                                    </Box>
                                  );
                                })}
                              </Flex>
                            </Flex>
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <div
                            style={{
                              overflow: "auto",
                            }}
                          >
                            <Flex
                              alt="dataRequirements"
                              paddingLeft="7px"
                              paddingRight="20px"
                              marginBottom="25px"
                              justifyContent="space-between"
                            >
                              <Flex
                                alt="leftSide"
                                flexDirection="column"
                                width="480px"
                              >
                                <Flex alignItems="center" marginBottom="13px">
                                  <Text marginRight="24px" fontSize="18px">
                                    {__("dataRequirements")}
                                  </Text>
                                  {/* temproray */}
                                  <Box
                                    width="117px"
                                    height="30px"
                                    bg="#B2F5EA"
                                    textAlign="center"
                                    lineHeight="30px"
                                    fontSize="xxs"
                                    color="#00A3C4"
                                  >
                                    {__("userHeld")}
                                  </Box>
                                </Flex>
                                <Text fontSize="sm" color={colors.textMuted}>
                                  {__("userHeldText")}
                                </Text>
                                <Flex
                                  justifyContent="space-between"
                                  paddingTop="32px"
                                  paddingBottom="31px"
                                >
                                  <Flex flexDirection="column">
                                    <Text
                                      fontSize="sm"
                                      bold
                                      marginBottom="16px"
                                    >
                                      {__("userDashHeld")}
                                    </Text>
                                    {userHeldData()}
                                  </Flex>
                                  <Flex flexDirection="column">
                                    <Text
                                      fontSize="sm"
                                      bold
                                      marginBottom="16px"
                                    >
                                      {__("userDashGenerated")}
                                    </Text>
                                    {userGeneratedData()}
                                  </Flex>
                                  <Flex flexDirection="column">
                                    <Text
                                      fontSize="sm"
                                      bold
                                      marginBottom="16px"
                                    >
                                      {__("public")}
                                    </Text>
                                    {publicData()}
                                  </Flex>
                                </Flex>
                              </Flex>
                              <Flex alt="rightSide">
                                <UseHeldDataImage
                                  style={{
                                    width: "284px",
                                    height: "213px",
                                  }}
                                />
                              </Flex>
                            </Flex>
                            <Divider
                              as={"div"}
                              color="#F2F4F5"
                              height={"1px"}
                            />
                            <Flex
                              alt="addData"
                              paddingTop="32px"
                              paddingBottom="40px"
                            >
                              <Flex flexDirection="column" marginRight="190px">
                                {widgets.current[selectedWidgetIndex]
                                  .dataSources.length > 0 && (
                                    <Text color={colors.textMuted}>
                                      {__("selectAvailableData")}
                                    </Text>
                                  )}
                                <Flex paddingTop="31px">
                                  {widgets.current[
                                    selectedWidgetIndex
                                  ].dataSources?.map((item, index) => {

                                    const IconImage = item.icon;
                                    //console.log("ITEM ICON ", item);

                                    return (
                                      <C.DataSourceButton
                                        key={"ds-" + index}

                                        title={item.title}
                                        installed={
                                          Object.keys(
                                            userDataSources.current,
                                          ).indexOf(item.id) > -1
                                        }
                                        onClick={() => {
                                          const dataSourceExists =
                                            Object.keys(
                                              userDataSources.current,
                                            ).indexOf(item.id) > -1;

                                          if (
                                            item.sourceType == 1 &&
                                            !dataSourceExists
                                          ) {
                                            setAddingDataSource(index);
                                          }
                                        }}
                                      >
                                        <IconImage style={{ width: "44px", height: "44px" }} />
                                      </C.DataSourceButton>
                                    );
                                  })}
                                </Flex>
                              </Flex>
                            </Flex>
                          </div>
                        </TabPanel>
                      </TabPanelList>
                    </Tabs>
                  </div>
                </Flex>
              </>
            ) : null}
          </Flex>
        </>
      )}
    </>
  );
};

AppMarket.propTypes = {
  prifinaID: PropTypes.string,
};
AppMarket.displayName = "AppMarket";

export default AppMarket;
