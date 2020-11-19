import React from 'react';
import PropTypes from 'prop-types';
// import '../assets/scss/style.css';
import { Box, Flex, Text, useTheme, Input } from "@blend-ui/core";
import styled from "styled-components";

import TableListing from "./TableListing";
import { ReactComponent as Filter } from '../assets/images/Icon_filter_ho.svg';
import { ReactComponent as Search } from '../assets/images/search.svg';




const ListingRightContainer = ({ user }) => {
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
  
  return (
    <Box width={"100%"}>
      <Box m={40} >
        <Text as={"h5"} fontSize={18} >Console</Text>
        <Text as={"h2"} fontSize={37} > Connections </Text>
        <Box className="btn-group">
            <button className="btn"> Hidden Connections </button>
            <button className="btn active"> All Connections </button>
        </Box>
        <TabContent>
          <Text as={"p"} fontSize={12} color="#C4C7D8" lineHeight={"15px"}>This is an combined list of connections pulled from the third-party applications that you installed and connected to the console</Text>
          <Flex justifyContent={"space-between"}>
            <Box className="connection-filter-container">
              <Filter className="search-icon"/>
              <select className="connection-filter round">
                <option value="1"> First Name </option>
              </select>
            </Box>
            <Box className="connection-searchbox-container">
              <Search className="search-icon"/>
              <Input className="searchInput" type="text" placeholder="Search console"/>
            </Box>
          </Flex>
          <TableListing />
        </TabContent>
      </Box>
    </Box>  
  )
}

ListingRightContainer.propTypes = {
  user: PropTypes.shape({})
};

ListingRightContainer.defaultProps = {
  user: null,
};


export default ListingRightContainer;