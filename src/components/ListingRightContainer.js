import React from 'react';
import PropTypes from 'prop-types';
// import '../assets/scss/style.css';
import { Box, Flex, Text, useTheme, Input } from "@blend-ui/core";
import styled from "styled-components";
import TableListing from "./TableListing";
import { ReactComponent as Filter } from '../assets/images/Icon_filter_ho.svg';
import { ReactComponent as Search } from '../assets/images/search.svg';

import i18n from "../lib/i18n";
i18n.init();




const ListingRightContainer = (props) => {
  // console.log("props",props)
  const TabContent = styled.div`
    clear: both;
    border-radius: 20px 0px 20px 20px;
    background: #fff;
    box-shadow: 12px 0 15px -4px rgba(0, 0, 0, 0.05), -12px 0 8px -4px rgba(0, 0, 0, 0.05);
    -webkit-box-shadow : 12px 0 15px -4px rgba(0, 0, 0, 0.05), -12px 0 8px -4px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: 12px 0 15px -4px rgba(0, 0, 0, 0.05), -12px 0 8px -4px rgba(0, 0, 0, 0.05);
    height: 75%;
    padding: 40px;
    .searchInput{
      background: #FFFFFF;
      border: 1px solid #D1D5DE;
      box-sizing: border-box;
      border-radius: 15px;
      padding-left:35px;
      width: 266px;
      transition: all 0.5s ease;
      &:focus, 
      &:not([disabled]):hover {
        border: 0.0625rem solid #6967ff;
      }      
    } 
    .round{
      width:266px;
    }
  `;
  const Subtitle5 = styled.h5`
    font-size: 18px;
  `;
  const Subtitle2 = styled.h2`
    font-size: 37px;
  `;
  const BodyText1 = styled.p`
    font-size:12px;
    color:#C4C7D8;
  `;
  return (
    <Box width={"100%"}>
      <Box m={40} >
        <Subtitle5> {i18n.__("listConsole")}</Subtitle5>
        <Subtitle2> {i18n.__("listConnections")} </Subtitle2>
        <Box className="btn-group">
            <button className="btn"> {i18n.__("listHiddenConnections")} </button>
            <button className="btn active"> {i18n.__("listAllConnections")} </button>
        </Box>
        <TabContent>
          <BodyText1>{i18n.__("listDetail")}</BodyText1>
          <Flex justifyContent={"space-between"}>
            <Box className="connection-filter-container">
              <Filter className="search-icon"/>
              <select className="connection-filter round">
                <option value="1"> {i18n.__("listFirstName")}  </option>
              </select>
            </Box>
            <Box className="connection-searchbox-container">
              <Search className="search-icon"/>
              <Input className="searchInput" type="text" placeholder={i18n.__("listSearchconsole")}/>
            </Box>
          </Flex>
          <TableListing 
            dataTable = {props.dataTable}
            headTable = {props.headTable}
          />
        </TabContent>
      </Box>
    </Box>  
  )
}

// ListingRightContainer.propTypes = {
//   user: PropTypes.shape({})
// };

// ListingRightContainer.defaultProps = {
//   // user: null,
// };


export default ListingRightContainer;