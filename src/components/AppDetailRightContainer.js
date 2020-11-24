import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import {ScreenImages} from "./Image";
import { Box, Text, useTheme,  } from "@blend-ui/core";
import i18n from "../lib/i18n";
i18n.init();


const AppDetailRightContainer = ({ user }) => {
  const DetailRightContainerBox = styled.div`     
    height: 100%;
    padding-right: 15px;
    h2{        
      color: #383838;
      font-size: 24px;
      padding-top: 40px;
      margin-bottom: 5px;
    }
    .breadcrumbs-container {
      display: flex;
      align-self: center;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .breadcrumbs-previous-page{
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;
        align-items: center;
        color: #B8C1C6;
        padding: 5px;
    }
    .breadcrumbs-divider{
        width: 2px;
        height: 2px;
        background: #B8C1C6;
    }
    .breadcrumbs-active-page{
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;
        align-items: center;
        color: #B8C1C6;
        padding: 5px;
    }
    .breadcrumbs-Boxider{
      align-self: baseline;
      color: #B8C1C6;
      font-size: 14px;
    }
    h4{
      margin-top:40px;
      margin-bottom:25px
    }
    h5{
      margin-top:15px;      
    }
  `; 
  const List = styled.ul`
    /* */
    list-style-type: none;
    margin: 0;
    list-style-position: outside;
    padding-inline-start: 20px;
    margin-block-start: 0px;
    padding: 0;
    padding-left: 20px;
  `;

  const ListItem = styled.li`
    /* */
    font-size: 14px;
    color: ${(props) => props.theme.colors.basePrimary };
    ::before {
      content: "-";
      color: ${(props) =>
        props.verified
          ? props.theme.colors.basePrimary
          : props.theme.colors.basePrimary}; // from theme
      display: inline-block;
      width: 10px;
      vertical-align: text-bottom;
      margin-left: -0.9em;
      font-size: 2em;
      margin-right: 2px;
      font-weight: normal;
    }
    span {
      position: relative;
      top: -5px;
    }
  `;   
  return (
    <DetailRightContainerBox>
      <Text as={"h2"} fontSize={24} lineHeight={"20.36px"}>{i18n.__("appDashboard")}</Text> 

      <Box className="breadcrumbs-container">
        <span className="breadcrumbs-previous-page">{i18n.__("prifina")}</span>
        <span className="breadcrumbs-Boxider">.</span>
        <span className="breadcrumbs-active-page">{i18n.__("appData")}</span>
      </Box>

      <Box>
        <ScreenImages />
        
        <Box>
          <Text as={"h3"} fontSize={18} lineHeight={"20.36px"}>{i18n.__("appDescription")}</Text>
          <Text as={"p"} fontSize={14} lineHeight={"1.7"} mb={0}>{i18n.__("appDescriptionData1")}</Text> 
          <Text as={"p"} fontSize={14} lineHeight={"1.7"} >{i18n.__("appDescriptionData2")}</Text>
        </Box>

        <Box>
          <Text as={"h4"} fontSize={18} lineHeight={"15.36px"}>{i18n.__("appKeyFeatures")}</Text>

          <Text as={"h5"} fontSize={14}  mb={0}>{i18n.__("appDataVisualizations")}</Text>
          <List>
            <ListItem>{i18n.__("appDataVisualizationsData1")}</ListItem>
            <ListItem>{i18n.__("appDataVisualizationsData2")}</ListItem>
          </List>          

          <Text as={"h5"} fontSize={14} mb={0}>{i18n.__("appDataInsights")}</Text>
          <List >
            <ListItem fontSize={14}>{i18n.__("appDataInsightsData1")}</ListItem>
            <ListItem>{i18n.__("appDataInsightsData2")}</ListItem>
          </List>    

          <Text as={"h5"} fontSize={14} mb={0}>{i18n.__("appThirdPartyWidgets")}</Text>
          <List>
            <ListItem>{i18n.__("appThirdPartyWidgetsData1")}</ListItem>
            <ListItem>{i18n.__("appThirdPartyWidgetsData2")}</ListItem>
          </List> 

          <Text as={"h5"} fontSize={14} mb={0}>{i18n.__("appDiscoveryFeed")}</Text>
          <List>
            <ListItem>{i18n.__("appDiscoveryFeedData1")}</ListItem>
            <ListItem>{i18n.__("appDiscoveryFeedData2")}</ListItem>
          </List> 
        </Box>
      </Box>
      
    </DetailRightContainerBox>
  );
}
AppDetailRightContainer.propTypes = {
  user: PropTypes.shape({})
};

AppDetailRightContainer.defaultProps = {
  user: null,
};

export default AppDetailRightContainer;