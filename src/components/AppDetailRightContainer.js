import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import {ScreenImages} from "./Image";
import { Box, Text, useTheme,  } from "@blend-ui/core";


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
      <Text as={"h2"} fontSize={24} lineHeight={"20.36px"}>Dashboard</Text> 

      <Box className="breadcrumbs-container">
        <span className="breadcrumbs-previous-page">Prifina</span>
        <span className="breadcrumbs-Boxider">.</span>
        <span className="breadcrumbs-active-page">Data</span>
      </Box>

      <Box>
        <ScreenImages />
        
        <Box>
          <Text as={"h3"} fontSize={18} lineHeight={"20.36px"}>Description</Text>
          <Text as={"p"} fontSize={14} lineHeight={"1.7"} mb={0}>Have you ever wondered what insights can be gathered from your everyday data? Prifina’s dashboard app is the answer. This app allows you to view your raw data through visual analytics and insights, with additional features such as a discovery feed and third party widgets.</Text> 
          <Text as={"p"} fontSize={14} lineHeight={"1.7"} >Feeling overwhelmed by your data? This dashboard makes understanding this information easier, by allowing you to participate and understand the analytics process by visualizing trends and occurrences. This is designed for quick analysis and informational awareness to reduce the complexity of understanding the information.</Text>
        </Box>

        <Box>
          <Text as={"h4"} fontSize={18} lineHeight={"15.36px"}>Key Features</Text>

          <Text as={"h5"} fontSize={14}  mb={0}>Data Visualizations</Text>
          <List>
            <ListItem> Customize your categories to view different data insights </ListItem>
            <ListItem> Learn how to understand your data in the form of tables, charts, and other visual gauges</ListItem>
          </List>          

          <Text as={"h5"} fontSize={14} mb={0}>Data Insights</Text>
          <List >
            <ListItem fontSize={14}>Discover trends and patterns in your everyday life </ListItem>
            <ListItem>Use these insights to better understand the patterns in the different areas of your life</ListItem>
          </List>    

          <Text as={"h5"} fontSize={14} mb={0}>Third Party Widgets</Text>
          <List>
            <ListItem>Access frequently used functions directly from the dashboard</ListItem>
            <ListItem>Reduce the frequency of clicking to open other apps</ListItem>
          </List> 

          <Text as={"h5"} fontSize={14} mb={0}>Discovery Feed</Text>
          <List>
            <ListItem>Get customized topics and news on items that interest you</ListItem>
            <ListItem>Find information on your interests without searching for them</ListItem>
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