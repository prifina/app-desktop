/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useRef } from "react";

import { Box, Flex, Text, Button, Image, Divider } from "@blend-ui/core";
import { BlendIcon } from "@blend-ui/icons";

import {
  getPrifinaWidgetsQuery,
  getPrifinaUserQuery,
  installWidgetMutation,
  listAppMarketQuery,
} from "@prifina-apps/utils";

import { useHistory } from "react-router-dom";

import PropTypes from "prop-types";

import styled, { createGlobalStyle } from "styled-components";

import * as C from "./app-market/components";

import config from "../config";

//assets
import { PrifinaLogo } from "../components/PrifinaLogo";
import { ReactComponent as DefaultWidget } from "../assets/third-party-app.svg";
import appMarketBanner from "../assets/app-market/app-market-banner.svg";
import apiDataImg from "../assets/app-market/api-data.svg";
import healthData from "../assets/app-market/health-data.svg";
import viewingData from "../assets/app-market/viewing-data.svg";
//icons
import bxsCheckCircle from "@iconify/icons-bx/bxs-check-circle";
import bxsXCircle from "@iconify/icons-bx/bxs-x-circle";
import lefArrow from "@iconify/icons-bx/bxs-chevron-left";
import { background, width } from "styled-system";

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
  const [isShown, setIsShown] = useState(false);

  console.log("PROPS ", id, installed, title, installedWidget, props);
  return (
    <C.WidgetBase
      onClick={onClick}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      // style={{
      //   background: `url(${bannerImage})`,
      //   opacity: 0.7,
      // }}
      backgroundImage={bannerImage}
    >
      <Flex
        flexDirection={"column"}
        justifyContent="space-between"
        padding="24px"
      >
        {/* <Image src={icon} width="42px" /> */}
        <C.MarketBadge
          style={{
            backgroundColor: "#CAEBCD",
            position: "absolute",
            right: 24,
            minWidth: 91,
          }}
        >
          <Text fontSize="xs">{category}</Text>
        </C.MarketBadge>
        <Flex
          flexDirection="row"
          width="100"
          alignItems="center"
          justifyContent="space-between"
          position="absolute"
          bottom="20px"
        >
          <Text textStyle={"h2"} fontWeight={"semiBold"}>
            {title}
          </Text>
        </Flex>
      </Flex>
      {isShown && (
        <div
          className="overContainer"
          style={{
            background: "white",
            width: 326,
            position: "absolute",
            zIndex: 10,
            bottom: "0px",
            backgroundColor: "white",
            height: 168,
            borderBottomLeftRadius: "0.625rem",
            borderBottomRightRadius: "0.625rem",
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <Flex
            flexDirection={"row"}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text textStyle={"h2"} fontWeight={"semiBold"}>
              {title}
            </Text>
            <Flex>
              {installedWidget > -1 && (
                <Button size="xs" disabled>
                  Installed
                </Button>
              )}
              {installedWidget === -1 && (
                <Button
                  onClick={e => {
                    installWidget(e, id, settings);
                  }}
                >
                  Install
                </Button>
              )}
            </Flex>
          </Flex>
          <Text fontSize="xs" mt="8px">
            {shortDescription}
          </Text>
        </div>
      )}
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

      setInstalledWidgets(...installedWidgets, id);
    });
  };
  console.log(installedWidgets, widgets.current);

  const [allValues, setAllValues] = useState({
    title: "",
    shortDescription: "",
    icon: "",
    publisher: "",
    screenshots: [],
  });

  const [step, setStep] = useState(0);

  let menuItemColor1 = "baseWhite";
  let menuItemColor2 = "baseWhite";
  let menuItemColor3 = "baseWhite";

  switch (step) {
    case 0:
      menuItemColor1 = "#d7eeff";
      break;
    case 1:
      menuItemColor2 = "#d7eeff";
      break;
    case 2:
      menuItemColor2 = "#d7eeff";
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
          <BlendIcon iconify={bxsCheckCircle} color={"#066FE1"} size="16px" />
          <Text fontSize="14px" color="#066FE1" marginLeft="8px">
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
          <Text marginLeft="8px" color="#969595" fontSize="14px">
            None needed
          </Text>
        </Flex>
      );
    }
  }

  function userGeneratedData() {
    const newData = allValues.userGenerated.map(item => {
      return (
        <Flex alignItems="center">
          <BlendIcon iconify={bxsCheckCircle} color={"#066FE1"} size="16px" />
          <Text fontSize="14px" color="#066FE1" marginLeft="8px">
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
          <Text marginLeft="8px" color="#969595" fontSize="14px">
            None needed
          </Text>
        </Flex>
      );
    }
  }
  function publicData() {
    const newData = allValues.public.map(item => {
      return (
        <Flex alignItems="center">
          <BlendIcon iconify={bxsCheckCircle} color={"#066FE1"} size="16px" />
          <Text fontSize="14px" color="#066FE1" marginLeft="8px">
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
          <Text marginLeft="8px" color="#969595" fontSize="14px">
            None needed
          </Text>
        </Flex>
      );
    }
  }

  return (
    <>
      <C.GlobalStyle />
      <C.AppMarketSidebar
        onClick1={() => {
          setStep(0);
        }}
        // onClick2={() => {
        //   setStep(1);
        // }}
        backgroundColor1={menuItemColor1}
        backgroundColor2={menuItemColor2}
        backgroundColor3={menuItemColor3}
      />
      {step === 0 && (
        <>
          <C.NavbarContainer bg="baseWhite">
            <PrifinaLogo className={"app-market"} title="App Market" />
          </C.NavbarContainer>

          <Flex
            width="100%"
            height="100%"
            paddingLeft="286px"
            bg="white"
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
                <Text fontSize="28px" color="#639AED" marginBottom="24px">
                  Data on your side
                </Text>
                <Text fontSize="16px" color="#639AED">
                  Free your data from its silos and utilize it in different apps
                  and widgets. Like a key, your data can unlock valuable
                  experiences and insights. By using your data directly, you
                  capture the value and open a new market of apps.
                </Text>
              </Flex>
              <Image src={appMarketBanner} />
            </Flex>

            <Box mt={"40px"} ml={"64px"}>
              <Text textStyle={"h3"}>Category</Text>
              <Text textStyle={"h6"}>
                This section features all the widgets which require user-held
                data
              </Text>
              <Flex mt="24px" flexDirection="row" flexWrap="wrap">
                {Object.keys(widgets.current).map(w => {
                  console.log("HEEEEE", widgets.current);
                  return (
                    <WidgetBox
                      key={w}
                      id={w}
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
            <PrifinaLogo className={"app-market"} title="App Market" />
          </C.NavbarContainer>

          <Flex
            width="100%"
            height="100%"
            paddingLeft="286px"
            bg="white"
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
                Widgets Directory
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
              bg="white"
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
                      <Text fontSize="24px" bold marginRight="24px">
                        {allValues.title}
                      </Text>
                      <C.Badge>Widget</C.Badge>
                    </Flex>
                    <Flex paddingTop="8px">
                      <Text marginRight="18px" color="#969595" fontSize="12px">
                        {allValues.publisher}
                      </Text>
                      <Text color="#969595" fontSize="12px">
                        {allValues.category}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alt="rightSide">
                  <C.OutlineButton variation="outline">
                    Report bug
                  </C.OutlineButton>
                  <C.OutlineButton variation="outline" marginLeft="16px">
                    Support
                  </C.OutlineButton>
                  <Button
                    marginLeft="16px"
                    onClick={() => history.push("/core/display-app")}
                  >
                    View
                  </Button>
                </Flex>
              </Flex>
              <Flex alt="buttons" marginBottom="40px">
                <C.UnderlineButton
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  Widget Details
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
                  Data requirements
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
                      fontSize="10px"
                      color="#00A3C4"
                    >
                      User Held
                    </Box>
                  </Flex>
                  <Text fontSize="12px" color="#969595">
                    {allValues.publisher}
                  </Text>
                  <Text fontSize="14px">{allValues.shortDescription}</Text>
                  <Flex
                    alt="requirementCards"
                    paddingTop="32px"
                    marginBottom="40px"
                    justifyContent="space-between"
                  >
                    <C.Card title="Data types" value={allValues.dataTypes} />
                    <C.Card title="Category" value={allValues.category} />
                    <C.Card
                      title="Device support"
                      value={allValues.deviceSupport}
                    />
                    <C.Card title="Languages" value={allValues.languages} />
                    <C.Card title="App Appropriate" value={allValues.age} />
                  </Flex>
                  <Text color="#969595" fontSize="14px" marginBottom="16px">
                    {allValues.longDescription}
                  </Text>
                  <Flex alt="features" flexDirection="column">
                    <Text color="#969595" fontSize="14px" marginBottom="8px">
                      Features
                    </Text>
                    <C.OrderedList>
                      {allValues.keyFeatures.map(item => {
                        return (
                          <C.ListItem fontSize="14px" color="#969595">
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
          <C.NavbarContainer bg="baseWhite">
            <PrifinaLogo className={"app-market"} title="App Market" />
          </C.NavbarContainer>
          <Flex
            width="100%"
            height="100%"
            paddingLeft="286px"
            bg="white"
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
                Widgets Directory
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
              bg="white"
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
                      <Text fontSize="24px" bold marginRight="24px">
                        {allValues.title}
                      </Text>
                      <C.Badge>Widget</C.Badge>
                    </Flex>
                    <Flex paddingTop="8px">
                      <Text marginRight="18px" color="#969595" fontSize="12px">
                        {allValues.publisher}
                      </Text>
                      <Text color="#969595" fontSize="12px">
                        {allValues.category}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alt="rightSide">
                  <C.OutlineButton variation="outline">
                    Report bug
                  </C.OutlineButton>
                  <C.OutlineButton variation="outline" marginLeft="16px">
                    Support
                  </C.OutlineButton>
                  <Button
                    marginLeft="16px"
                    onClick={() => history.push("/core/display-app")}
                  >
                    View
                  </Button>
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
                  Widget Details
                </C.UnderlineButton>
                <C.UnderlineButton
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  Data requirements
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
                      Data Requirements
                    </Text>
                    {/* temproray */}
                    <Box
                      width="117px"
                      height="30px"
                      bg="#B2F5EA"
                      textAlign="center"
                      lineHeight="30px"
                      fontSize="10px"
                      color="#00A3C4"
                    >
                      User Held
                    </Box>
                  </Flex>
                  <Text fontSize="14px" color="#969595">
                    Some products on Prifina are powered by ‘user-held’ data
                    which they pull from your data cloud, if the data is not
                    available in your cloud they can’t run. Select from sources
                    below to add the data
                  </Text>
                  <Flex
                    justifyContent="space-between"
                    paddingTop="32px"
                    paddingBottom="31px"
                  >
                    <Flex flexDirection="column">
                      <Text fontSize="14px" bold marginBottom="16px">
                        User-held
                      </Text>
                      {userHeldData()}
                    </Flex>
                    <Flex flexDirection="column">
                      <Text fontSize="14px" bold marginBottom="16px">
                        User-generated
                      </Text>
                      {userGeneratedData()}
                    </Flex>
                    <Flex flexDirection="column">
                      <Text fontSize="14px" bold marginBottom="16px">
                        Public
                      </Text>
                      {publicData()}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex alt="rightSide">
                  <Image
                    //this needs further imporvement
                    src={apiDataImg}
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
                    <Text marginLeft="8px">Add health data to your cloud</Text>
                  </Flex>
                  <Text color="#969595">
                    Select from available sources to add
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
                <Flex flexDirection="column">
                  <Flex paddingBottom="8px">
                    <Image src={viewingData} alt={"Image"} shape={"square"} />
                    <Text marginLeft="8px">Add viewing data to your cloud</Text>
                  </Flex>
                  <Text color="#969595">
                    Select from available sources to add
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
