/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Flex, Text, Button } from "@blend-ui/core";
import { ReactComponent as DefaultWidget } from "../assets/third-party-app.svg";

import { PrifinaLogo } from "../components/PrifinaLogo";
import styled, { createGlobalStyle } from "styled-components";
import {
  getPrifinaWidgetsQuery,
  getPrifinaUserQuery,
  installWidgetMutation,
} from "../graphql/api";

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
  name,
  installedWidget,
  ...props
}) => {
  console.log("PROPS ", name, installed, title, installedWidget, props);
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
                  installWidget(e, name);
                }}
              >
                Install
              </InstallButton>
            )}
          </Flex>
        </Flex>
        <StyledDescription textStyle={"caption"} mt={"16px"}>
          Description text here...
        </StyledDescription>
      </Flex>
    </WidgetBase>
  );
};

WidgetBox.propTypes = {
  title: PropTypes.string,
  installed: PropTypes.bool,
  installWidget: PropTypes.func,
  name: PropTypes.string,
  installedWidget: PropTypes.bool,
};
const AppMarket = ({ GraphQLClient, prifinaID, ...props }) => {
  console.log("APP MARKET PROPS ", props);
  //const [widgets, setWidgets] = useState({});
  const widgets = useRef({});
  const [installedWidgets, setInstalledWidgets] = useState([]);

  useEffect(() => {
    getPrifinaWidgetsQuery(GraphQLClient, "WIDGETS").then(res => {
      const widgetData = JSON.parse(res.data.getPrifinaApp.widgets);
      //console.log(widgetData);
      let availableWidgets = {};
      Object.keys(widgetData).forEach(w => {
        if (!widgetData[w].hasOwnProperty("restricted")) {
          availableWidgets[widgetData[w].name] = {
            title: widgetData[w].title,

            installed: false,
          };
        }
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
            if (availableWidgets.hasOwnProperty(w.name)) {
              availableWidgets[w.name].installed = true;
              currentInstalled.push(w.name);
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
    });
  }, []);
  /*
  const installWidget = useCallback(
    (e, name) => {
      console.log("CLICK ", name);
      //console.log("INSTALL ", widgets);

      installWidgetMutation(GraphQLClient, prifinaID, {
        name: name,
        index: -1,
      }).then(res => {
        console.log("INSTALL ", res);

        let availableWidgets = widgets;
        availableWidgets[name].installed = true;
        setWidgets(availableWidgets);
        
      });
    },
    [widgets],
  );
  */
  const installWidget = (e, name) => {
    console.log("CLICK ", name);
    //console.log("INSTALL ", widgets);

    installWidgetMutation(GraphQLClient, prifinaID, {
      name: name,
      index: -1,
    }).then(res => {
      console.log("INSTALL ", res);

      //let availableWidgets = widgets.current;
      //availableWidgets[name].installed = true;
      widgets.current[name].installed = true;

      setInstalledWidgets(...installedWidgets, name);
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
                name={w}
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
