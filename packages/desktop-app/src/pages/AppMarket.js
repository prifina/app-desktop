/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Flex, Text, Button } from "@blend-ui/core";
import { ReactComponent as DefaultWidget } from "../assets/third-party-app.svg";

import { PrifinaLogo } from "../components/PrifinaLogo";
import styled, { createGlobalStyle } from "styled-components";
/*
import {
  getPrifinaWidgetsQuery,
  getPrifinaUserQuery,
  installWidgetMutation,
  listAppMarketQuery,
} from "../graphql/api";
*/

import {
  getPrifinaWidgetsQuery,
  getPrifinaUserQuery,
  installWidgetMutation,
  listAppMarketQuery,
} from "@prifina-apps/utils";

import PropTypes from "prop-types";

//import { ReactComponent as PrifinaLogoImage } from "../assets/prifina.svg";

const propTest = props => {
  console.log("PROP TEST ", props);
  return null;
};
const WidgetBase = styled.div`
  display: flex;
  padding-top: 15px;
  padding-right: 15px;
  width: 310px;
  height: 103px;
  background: #fbfbfb; // color missing from theme
  box-shadow: 0px 4px 8px #ebf0f1; // color missing,... shadow missing from theme
  border-radius: 0.625rem; // missing from theme...
  margin-right: 24px;
  margin-bottom: 24px;
`;

const StyledText = styled(Text)`
  width: 190px;
  font-weight: ${props =>
    props.hasOwnProperty("fontWeight")
      ? Object.keys(props.theme.fontWeights).indexOf(props.fontWeight) > -1
        ? props.theme.fontWeights[props.fontWeight]
        : props.fontWeight
      : "null"};
`;

const StyledDescription = styled(Text)`
  color: #6b767e;
  word-break: break-word;
`;

const InstallButton = styled(Button)`
  width: 74px; // fixed width is not good idea... because of the translations
  min-width: 74px; //
  background: #47a7d6; // not on theme
  border-radius: 15px; // not on theme
  line-height: 23px;
`;

const InstalledText = styled(Text)`
  color: #47a7d6; // not on theme
  line-height: 23px;
`;
const TitleText = styled(Text)`
  /* */
`;

const GlobalStyle = createGlobalStyle`
.app-market path {
  fill: #47a7d6;
}
`;

const WidgetBox = ({
  title,
  installed,
  installWidget,
  id,
  shortDescription,
  installedWidget,
  settings,
  ...props
}) => {
  console.log("PROPS ", id, installed, title, installedWidget, props);
  return (
    <WidgetBase>
      <Flex width={"73px"} justifyContent={"center"}>
        <DefaultWidget width={"42px"} height={"42px"} />
      </Flex>
      <Flex width={"237px"} flexDirection={"column"}>
        <Flex flexDirection={"row"}>
          <StyledText textStyle={"body"} fontWeight={"semiBold"}>
            {title}
          </StyledText>
          <Flex width={"100%"} justifyContent={"flex-end"}>
            {installedWidget > -1 && <InstalledText>Installed</InstalledText>}
            {installedWidget === -1 && (
              <InstallButton
                onClick={e => {
                  installWidget(e, id, settings);
                }}
              >
                Install
              </InstallButton>
            )}
          </Flex>
        </Flex>
        <StyledDescription textStyle={"caption"} mt={"16px"}>
          {shortDescription}
        </StyledDescription>
      </Flex>
    </WidgetBase>
  );
};

WidgetBox.propTypes = {
  title: PropTypes.string,
  installed: PropTypes.bool,
  installWidget: PropTypes.func,
  id: PropTypes.string,
  shortDescription: PropTypes.string,
  installedWidget: PropTypes.number,
};
const AppMarket = ({ GraphQLClient, prifinaID, ...props }) => {
  console.log("APP MARKET PROPS ", props);
  //const [widgets, setWidgets] = useState({});
  const widgets = useRef({});
  const [installedWidgets, setInstalledWidgets] = useState([]);

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
            shortDescription: manifest.shortDescription,
            settings: defaultSettings,
          };
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
  return (
    <>
      <GlobalStyle />
      <PrifinaLogo className={"app-market"} />

      <Box mt={"40px"} ml={"64px"}>
        <TitleText textStyle={"h4"}>Recommended for you</TitleText>
        <Flex mt={"24px"} flexDirection={"row"} flexWrap="wrap">
          {Object.keys(widgets.current).map(w => {
            return (
              <WidgetBox
                key={w}
                id={w}
                {...widgets.current[w]}
                installWidget={installWidget}
                installedWidget={installedWidgets.indexOf(w)}
              />
            );
          })}
        </Flex>
      </Box>
      {/* 
    <Box width={"100vw"} height={"100vh"}>
      <WidgetBox />
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Text textAlign={"center"} textStyle={"h3"}>
          AppMarket
        </Text>
      </Flex>
    </Box>
    */}
    </>
  );
};

AppMarket.propTypes = {
  GraphQLClient: PropTypes.object,
  prifinaID: PropTypes.string,
};
AppMarket.displayName = "AppMarket";

export default AppMarket;
