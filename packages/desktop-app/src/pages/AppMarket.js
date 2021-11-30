/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useRef } from "react";

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

import {
  getPrifinaWidgetsQuery,
  getPrifinaUserQuery,
  installWidgetMutation,
  listAppMarketQuery,
  i18n,
} from "@prifina-apps/utils";

import { useHistory } from "react-router-dom";

import PropTypes from "prop-types";

i18n.init();

import * as C from "./app-market/components";
import DataSourceModal from "./app-market/DataSourceModal";

import config from "../config";

//assets
import { PrifinaLogo } from "../components/PrifinaLogo";
import appMarketBanner from "../assets/app-market/app-market-banner.svg";
import apiDataImg from "../assets/app-market/api-data.svg";
import healthData from "../assets/app-market/health-data.svg";
import viewingData from "../assets/app-market/viewing-data.svg";
import useHeldDataImage from "../assets/app-market/user-held-data.svg";
//dataSource icons
import ouraIcon from "../assets/app-market/oura-icon.svg";
import dataSourceIcon from "../assets/app-market/data-source-icon.svg";
//icons
import bxsCheckCircle from "@iconify/icons-bx/bxs-check-circle";
import bxsXCircle from "@iconify/icons-bx/bxs-x-circle";
import lefArrow from "@iconify/icons-bx/bxs-chevron-left";
//menuIcons
import appMenu from "@iconify/icons-fe/app-menu";
import bxsWidget from "@iconify/icons-bx/bxs-widget";
import bxMinusBack from "@iconify/icons-bx/bx-minus-back";

const propTest = props => {
  console.log("PROP TEST ", props);
  return null;
};

const WidgetBox = ({
  title,
  installed,
  installWidget,
  id,
  shortDescription,
  installedWidget,
  onClick,
  settings,
  icon,
  category,
  bannerImage,
  ...props
}) => {
  console.log("PROPS ", id, installed, title, installedWidget, props);
  return (
    <C.WidgetBase onClick={onClick} backgroundImage={bannerImage}>
      <Flex flexDirection={"column"} justifyContent="space-between">
        <C.MarketBadge
          style={{
            backgroundColor: "#CAEBCD",
            position: "absolute",
            right: 24,
            minWidth: 91,
            marginTop: 24,
          }}
        >
          <Text fontSize="xs">{category}</Text>
        </C.MarketBadge>
        <Flex className="overContainer">
          <Flex
            className="overContainer"
            flexDirection="column"
            width="100%"
            height="75px"
            position="absolute"
            bottom="0px"
            bg="red"
            paddingLeft="24px"
            paddingTop="10px"
            style={{
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, #FFFFFF 100%)",
            }}
          >
            <Text className="title" textStyle={"h2"} fontWeight={"semiBold"}>
              {title}
            </Text>
            <Text fontSize="xs" mt="8px" mt="15px">
              {shortDescription}
            </Text>
            {/*
            -- further data connector information
            <Text fontSize="xs" mt="8px" mb="8px">
              213123
            </Text>
             */}
          </Flex>
        </Flex>
      </Flex>
    </C.WidgetBase>
  );
};

WidgetBox.propTypes = {
  title: PropTypes.string,
  installed: PropTypes.bool,
  installWidget: PropTypes.func,
  id: PropTypes.string,
  shortDescription: PropTypes.string,
  installedWidget: PropTypes.number,
  onClick: PropTypes.func,
};

const AppMarket = ({ GraphQLClient, prifinaID, ...props }) => {
  console.log("APP MARKET PROPS ", props);
  //const [widgets, setWidgets] = useState({});
  const widgets = useRef({});
  const [installedWidgets, setInstalledWidgets] = useState([]);

  const { colors } = useTheme();

  const history = useHistory();

  const s3path = `https://prifina-apps-${config.prifinaAccountId}.s3.amazonaws.com`;

  useEffect(() => {
    listAppMarketQuery(GraphQLClient, { filter: { appType: { lt: 3 } } }).then(
      res => {
        //getPrifinaWidgetsQuery(GraphQLClient, "WIDGETS").then(res => {
        //const widgetData = JSON.parse(res.data.getPrifinaApp.widgets);
        const widgetData = res.data.listAppMarket.items;

        //console.log(widgetData);
        let availableWidgets = {};
        /*
      Object.keys(widgetData).forEach(w => {
        if (!widgetData[w].hasOwnProperty("restricted")) {
          availableWidgets[widgetData[w].name] = {
            title: widgetData[w].title,

            installed: false,
          };
        }
      });
      */
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

          availableWidgets[item.id] = {
            title: item.title,
            installed: false,
            settings: defaultSettings,
            publisher: manifest.publisher,
            icon: `${s3path}/${manifest.id}/${manifest.icon}`,
            bannerImage: `${s3path}/${manifest.id}/${manifest.bannerImage}`,
            description: manifest.description,
            shortDescription: manifest.shortDescription,
            longDescription: manifest.longDescription,
            dataTypes: manifest.dataTypes,
            category: manifest.category,
            deviceSupport: manifest.deviceSupport,
            languages: manifest.languages,
            age: manifest.age,
            screenshots: manifest.screenshots,
            keyFeatures: manifest.keyFeatures,
            userHeld: manifest.userHeld,
            userGenerated: manifest.userGenerated,
            public: manifest.public,
            id: manifest.id,
          };

          console.log("MANIFEST HEHE", manifest);
          const screenshots = [
            `${s3path}/${manifest.id}/${manifest.screenshots}`,
          ];
          console.log("sreenshots", screenshots);
        });

        console.log("AVAILABLE WIDGETS ", availableWidgets);
        let currentInstalled = [];
        getPrifinaUserQuery(GraphQLClient, prifinaID).then(res => {
          if (
            res.data.getPrifinaUser.hasOwnProperty("installedWidgets") &&
            res.data.getPrifinaUser.installedWidgets !== null
          ) {
            const installedWidgets = JSON.parse(
              res.data.getPrifinaUser.installedWidgets,
            );
            installedWidgets.forEach(w => {
              //console.log(w, typeof availableWidgets[w.name]);
              //console.log(availableWidgets[w.name]);
              //availableWidgets[w].installed = true;
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
        });
      },
    );
  }, []);

  const installWidget = (e, id, settings) => {
    console.log("CLICK ", id);
    //console.log("INSTALL ", widgets);

    installWidgetMutation(GraphQLClient, prifinaID, {
      id: id,
      settings: settings,
      index: -1,
    }).then(res => {
      console.log("INSTALL ", res);

      //let availableWidgets = widgets.current;
      //availableWidgets[name].installed = true;
      widgets.current[id].installed = true;
      // widgets.current[id].installed = true;

      setInstalledWidgets(...installedWidgets, id);
      setAllValues({
        ...allValues,
        installed: true,
      });
    });
  };

  const uninstallWidget = (e, id, settings) => {
    console.log("CLICK ", id);
    //console.log("INSTALL ", widgets);

    installWidgetMutation(GraphQLClient, prifinaID, {
      id: id,
      settings: settings,
      index: -1,
    }).then(res => {
      console.log("INSTALL ", res);

      //let availableWidgets = widgets.current;
      //availableWidgets[name].installed = true;
      widgets.current[id].installed = false;
      // widgets.current[id].installed = true;

      setInstalledWidgets(...installedWidgets, id);
      setAllValues({
        ...allValues,
        installed: false,
      });
    });
  };

  const [allValues, setAllValues] = useState({});

  const [step, setStep] = useState(0);

  let menuItemColor = "baseWhite";

  switch (step) {
    case 0:
      menuItemColor = "#d7eeff";
      break;
    case 1:
      menuItemColor = "#d7eeff";
      break;
    case 2:
      menuItemColor = "#d7eeff";
      break;
    case 3:
      break;
    case 3:
      break;
    default:
  }

  function userHeldData() {
    const newData = allValues.userHeld.map(item => {
      return (
        <Flex alignItems="center">
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
    });
    if (newData.length > 0) {
      return <Flex flexDirection="column">{newData}</Flex>;
    } else {
      return (
        <Flex alignItems="center">
          <BlendIcon iconify={bxsXCircle} color={"#ADADAD"} size="16px" />
          <Text marginLeft="8px" color={colors.textMuted} fontSize="sm">
            {i18n.__("noneNeeded")}
          </Text>
        </Flex>
      );
    }
  }

  function userGeneratedData() {
    const newData = allValues.userGenerated.map(item => {
      return (
        <Flex alignItems="center">
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
    });
    if (newData.length > 0) {
      return <Flex flexDirection="column"> {newData}</Flex>;
    } else {
      return (
        <Flex alignItems="center">
          <BlendIcon iconify={bxsXCircle} color={"#ADADAD"} size="16px" />
          <Text marginLeft="8px" color={colors.textMuted} fontSize="sm">
            {i18n.__("noneNeeded")}
          </Text>
        </Flex>
      );
    }
  }
  function publicData() {
    const newData = allValues.public.map(item => {
      return (
        <Flex alignItems="center">
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
    });
    if (newData.length > 0) {
      return <Flex flexDirection="column">{newData}</Flex>;
    } else {
      return (
        <Flex alignItems="center">
          <BlendIcon iconify={bxsXCircle} color={"#ADADAD"} size="16px" />
          <Text marginLeft="8px" color={colors.textMuted} fontSize="sm">
            {i18n.__("noneNeeded")}
          </Text>
        </Flex>
      );
    }
  }

  const items = [
    {
      label: "Market",
      icon: appMenu,
      onClick: () => {
        setStep(0);
      },
    },
    { label: "Widgets", icon: bxsWidget },
    {
      label: "Apps",
      icon: bxMinusBack,
      badge: "ComingSoon",
      badgeColor: "yellow",
      disabled: true,
    },
  ];

  const dataSourceItems = [
    {
      id: 1,
      title: "Oura",
      icon: ouraIcon,
    },
  ];

  const [addingDataSource, setAddingDataSource] = useState(false);

  const onDialogClose = e => {
    setAddingDataSource(false);
    e.preventDefault();
  };
  const onDialogClick = async (e, action) => {
    ///...further logic on adding data source data
    setAddingDataSource(false);

    e.preventDefault();
  };

  console.log("install", allValues.installed);

  return (
    <>
      <C.GlobalStyle />
      <C.AppMarketSidebar items={items} />
      {step === 0 && (
        <>
          <C.NavbarContainer bg="baseWhite">
            <PrifinaLogo className={"app-market"} title="App Market" />
          </C.NavbarContainer>

          <Flex
            width="100%"
            height="100%"
            paddingLeft="286px"
            bg={colors.backgroundLight}
            flexDirection="column"
          >
            <Flex
              height="316px"
              bg="#EBF3FF"
              width="100%"
              justifyContent="space-between"
              paddingLeft="40px"
              paddingRight="40px"
              paddingTop="32px"
              paddingBottom="32px"
            >
              <Flex
                flexDirection="column"
                marginRight="143px"
                paddingTop="62px"
              >
                <Text textStyle="h3" color="#639AED" marginBottom="24px">
                  {i18n.__("dataOnYourSide")}
                </Text>
                <Text fontSize="md" color="#639AED">
                  {i18n.__("appMarketText")}
                </Text>
              </Flex>
              <Image src={appMarketBanner} />
            </Flex>

            <Box mt={"40px"} ml={"64px"}>
              <Text textStyle={"h3"}> {i18n.__("category")}</Text>
              <Text textStyle={"h6"}>{i18n.__("categorySubText")}</Text>
              <Flex mt="24px" flexDirection="row" flexWrap="wrap">
                {Object.keys(widgets.current).map(w => {
                  console.log("WIDGETS CURRENT", widgets.current);
                  return (
                    <WidgetBox
                      key={allValues.id}
                      id={[w]}
                      {...widgets.current[w]}
                      installWidget={installWidget}
                      installedWidget={installedWidgets.indexOf(w)}
                      onClick={() => {
                        setStep(1);
                        setAllValues({
                          ...allValues,
                          title: widgets.current[w].title,
                          publisher: widgets.current[w].publisher,
                          icon: widgets.current[w].icon,
                          bannerImage: widgets.current[w].bannerImage,
                          description: widgets.current[w].description,
                          shortDescription: widgets.current[w].shortDescription,
                          longDescription: widgets.current[w].longDescription,
                          dataTypes: widgets.current[w].dataTypes,
                          category: widgets.current[w].category,
                          deviceSupport: widgets.current[w].deviceSupport,
                          languages: widgets.current[w].languages,
                          age: widgets.current[w].age,
                          screenshots: widgets.current[w].screenshots,
                          keyFeatures: widgets.current[w].keyFeatures,
                          userHeld: widgets.current[w].userHeld,
                          userGenerated: widgets.current[w].userGenerated,
                          public: widgets.current[w].public,
                          id: widgets.current[w].id,
                          installed: widgets.current[w].installed,
                          settings: widgets.current[w].settings,
                        });
                      }}
                    />
                  );
                })}
              </Flex>
            </Box>
          </Flex>
        </>
      )}
      {step === 1 && (
        <>
          <C.NavbarContainer bg="baseWhite">
            <PrifinaLogo className="app-market" title="App Market" />
          </C.NavbarContainer>

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
                onClick={() => {
                  setStep(0);
                }}
              >
                <BlendIcon iconify={lefArrow} size="12px" />
                {i18n.__("widgetsDirectory")}
              </C.TextButton>
            </Flex>
            <Image
              src={allValues.bannerImage}
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
                    src={allValues.icon}
                    alt={"Image"}
                    shape={"square"}
                    width={57}
                  />
                  <Flex flexDirection="column" marginLeft="16px">
                    <Flex alignItems="center">
                      <Text fontSize="xl" bold marginRight="24px">
                        {allValues.title}
                      </Text>
                      <C.Badge>{i18n.__("widget")}</C.Badge>
                    </Flex>
                    <Flex paddingTop="8px">
                      <Text
                        marginRight="18px"
                        color={colors.textMuted}
                        fontSize="xs"
                      >
                        {allValues.publisher}
                      </Text>
                      <Text color={colors.textMuted} fontSize="xs">
                        {allValues.category}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alt="rightSide">
                  <C.OutlineButton variation="outline">
                    {i18n.__("reportBug")}
                  </C.OutlineButton>
                  <C.OutlineButton variation="outline" marginLeft="16px">
                    {i18n.__("support")}
                  </C.OutlineButton>
                  {allValues.installed === false ? (
                    <Button
                      marginLeft="16px"
                      onClick={e => {
                        installWidget(e, allValues.id, allValues.settings);
                      }}
                    >
                      {i18n.__("install")}
                    </Button>
                  ) : (
                    <Button
                      marginLeft="16px"
                      // onClick={() => history.push("/core/display-app")}
                    >
                      {i18n.__("view")}
                    </Button>
                  )}
                </Flex>
              </Flex>
              <Flex alt="buttons" marginBottom="40px">
                <C.UnderlineButton
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  {i18n.__("widgetDetails")}
                </C.UnderlineButton>
                <C.UnderlineButton
                  style={{
                    color: "#ADADAD",
                    borderBottom: "2px solid #ADADAD",
                  }}
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  {i18n.__("dataRequirements")}
                </C.UnderlineButton>
              </Flex>
              <Flex alt="bottomContainer" justifyContent="space-between">
                <Flex
                  alt="leftSide"
                  flexDirection="column"
                  // paddingRight="113px"
                  width="549px"
                >
                  <Flex alt="widgetInfo" alignItems="center">
                    <Text marginRight="24px" fontSize="18px">
                      {allValues.title}
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
                      {i18n.__("userHeld")}
                    </Box>
                  </Flex>
                  <Text fontSize="xs" color={colors.textMuted}>
                    {allValues.publisher}
                  </Text>
                  <Text fontSize="sm">{allValues.shortDescription}</Text>
                  <Flex
                    alt="requirementCards"
                    paddingTop="32px"
                    marginBottom="40px"
                    justifyContent="space-between"
                  >
                    <C.Card
                      title={i18n.__("dataTypes")}
                      value={allValues.dataTypes}
                    />
                    <C.Card
                      title={i18n.__("category")}
                      value={allValues.category}
                    />
                    <C.Card
                      title={i18n.__("deviceSupport")}
                      value={allValues.deviceSupport}
                    />
                    <C.Card
                      title={i18n.__("languages")}
                      value={allValues.languages}
                    />
                    <C.Card
                      title={i18n.__("ageAppropriate")}
                      value={allValues.age}
                    />
                  </Flex>
                  <Text
                    color={colors.textMuted}
                    fontSize="sm"
                    marginBottom="16px"
                  >
                    {allValues.longDescription}
                  </Text>
                  <Flex alt="features" flexDirection="column">
                    <Text
                      color={colors.textMuted}
                      fontSize="sm"
                      marginBottom="8px"
                    >
                      {i18n.__("features")}
                    </Text>
                    <C.OrderedList>
                      {allValues.keyFeatures.map(item => {
                        return (
                          <C.ListItem fontSize="sm" color={colors.textMuted}>
                            {item}
                          </C.ListItem>
                        );
                      })}
                    </C.OrderedList>
                  </Flex>
                </Flex>
                <Flex alt="rightSide" flexDirection="column">
                  {allValues.screenshots.map((item, index) => {
                    return (
                      <Box width="284px" height="213px" marginBottom="16px">
                        <Image
                          key={index}
                          src={`${s3path}/${allValues.id}/${item}`}
                        />
                      </Box>
                    );
                  })}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
      {step === 2 && (
        <>
          {addingDataSource && (
            <DataSourceModal
              onClose={onDialogClose}
              onButtonClick={onDialogClick}
              dataSourceItems={dataSourceItems}
            />
          )}
          <C.NavbarContainer bg="baseWhite">
            <PrifinaLogo className={"app-market"} title="App Market" />
          </C.NavbarContainer>
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
                onClick={() => {
                  setStep(0);
                }}
              >
                <BlendIcon iconify={lefArrow} size="12px" />
                {i18n.__("widgetsDirectory")}
              </C.TextButton>
            </Flex>
            <Image
              src={allValues.bannerImage}
              alt={"Image"}
              shape={"square"}
              style={{ filter: "blur(1.5px)" }}
            />
            <Flex
              alt="innerContainer"
              marginTop={-120}
              borderRadius="8px"
              minWidth="1026px"
              bg={colors.backgroundLight}
              boxShadow="0px 0px 16px rgba(74, 77, 79, 0.25)"
              flexDirection="column"
              marginBottom="82px"
              marginLeft="64px"
              marginRight="64px"
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
                // minHeight="88px"
                paddingTop="32px"
                paddingBottom="24px"
                // marginBottom="20px"
              >
                <Flex alt="leftSide" alignItems="center">
                  <Image
                    src={allValues.icon}
                    alt={"Image"}
                    shape={"square"}
                    width={57}
                  />
                  <Flex flexDirection="column" marginLeft="16px">
                    <Flex alignItems="center">
                      <Text fontSize="xl" bold marginRight="24px">
                        {allValues.title}
                      </Text>
                      <C.Badge> {i18n.__("widget")}</C.Badge>
                    </Flex>
                    <Flex paddingTop="8px">
                      <Text
                        marginRight="18px"
                        color={colors.textMuted}
                        fontSize="xs"
                      >
                        {allValues.publisher}
                      </Text>
                      <Text color={colors.textMuted} fontSize="xs">
                        {allValues.category}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alt="rightSide">
                  <C.OutlineButton variation="outline">
                    {i18n.__("reportBug")}
                  </C.OutlineButton>
                  <C.OutlineButton variation="outline" marginLeft="16px">
                    {i18n.__("support")}
                  </C.OutlineButton>
                  {allValues.installed === false ? (
                    <Button
                      marginLeft="16px"
                      onClick={e => {
                        installWidget(e, allValues.id, allValues.settings);
                      }}
                    >
                      {i18n.__("install")}
                    </Button>
                  ) : (
                    <Button
                      marginLeft="16px"
                      // onClick={() => history.push("/core/display-app")}
                    >
                      {i18n.__("view")}
                    </Button>
                  )}
                </Flex>
              </Flex>
              <Flex alt="buttons" marginBottom="38px">
                <C.UnderlineButton
                  style={{
                    color: "#ADADAD",
                    borderBottom: "2px solid #ADADAD",
                  }}
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  {i18n.__("widgetDetails")}
                </C.UnderlineButton>
                <C.UnderlineButton
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  {i18n.__("dataRequirements")}
                </C.UnderlineButton>
              </Flex>
              <Flex
                alt="dataRequirements"
                paddingLeft="7px"
                paddingRight="20px"
                marginBottom="25px"
                justifyContent="space-between"
              >
                <Flex alt="leftSide" flexDirection="column" width="480px">
                  <Flex alignItems="center" marginBottom="13px">
                    <Text marginRight="24px" fontSize="18px">
                      {i18n.__("dataRequirements")}
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
                      {i18n.__("userHeld")}
                    </Box>
                  </Flex>
                  <Text fontSize="sm" color={colors.textMuted}>
                    {i18n.__("userHeldText")}
                  </Text>
                  <Flex
                    justifyContent="space-between"
                    paddingTop="32px"
                    paddingBottom="31px"
                  >
                    <Flex flexDirection="column">
                      <Text fontSize="sm" bold marginBottom="16px">
                        {i18n.__("userDashHeld")}
                      </Text>
                      {userHeldData()}
                    </Flex>
                    <Flex flexDirection="column">
                      <Text fontSize="sm" bold marginBottom="16px">
                        {i18n.__("userDashGenerated")}
                      </Text>
                      {userGeneratedData()}
                    </Flex>
                    <Flex flexDirection="column">
                      <Text fontSize="sm" bold marginBottom="16px">
                        {i18n.__("public")}
                      </Text>
                      {publicData()}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alt="rightSide">
                  <Image
                    //this needs further imporvement
                    src={useHeldDataImage}
                    style={{
                      width: "284px",
                      height: "213px",
                    }}
                  />
                </Flex>
              </Flex>

              <Divider as={"div"} color="#F2F4F5" height={"1px"} />
              <Flex alt="addData" paddingTop="32px" paddingBottom="40px">
                <Flex flexDirection="column" marginRight="190px">
                  <Flex paddingBottom="8px">
                    <Image src={healthData} alt={"Image"} shape={"square"} />
                    <Text marginLeft="8px">{i18n.__("addHealthData")}</Text>
                  </Flex>
                  <Text color={colors.textMuted}>
                    {i18n.__("selectAvailableData")}
                  </Text>
                  <Flex paddingTop="31px">
                    {/* <Box
                      height="44px"
                      width="44px"
                      borderRadius="8.8px"
                      bg="grey"
                    /> */}
                    {dataSourceItems.map((item, index) => {
                      return (
                        <C.DataSourceButton
                          key={index}
                          backgroundImage={item.icon}
                          onClick={() => {
                            setAddingDataSource(true);
                          }}
                        />
                      );
                    })}
                  </Flex>
                </Flex>
                <Flex flexDirection="column">
                  <Flex paddingBottom="8px">
                    <Image src={viewingData} alt={"Image"} shape={"square"} />
                    <Text marginLeft="8px">{i18n.__("addViewingData")}</Text>
                  </Flex>
                  <Text color={colors.textMuted}>
                    {i18n.__("selectAvailableData")}
                  </Text>
                  <Flex paddingTop="31px">
                    <Box
                      height="44px"
                      width="44px"
                      borderRadius="8.8px"
                      bg="grey"
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
};

AppMarket.propTypes = {
  GraphQLClient: PropTypes.object,
  prifinaID: PropTypes.string,
};
AppMarket.displayName = "AppMarket";

export default AppMarket;
