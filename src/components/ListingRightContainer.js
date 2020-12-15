import React from 'react';
import { Box, Flex, Text, useTheme } from "@blend-ui/core";
import styled from "styled-components";
import { space, color, layout, flexbox , typography, border, position} from 'styled-system'
import TableListing from "./TableListing";
import Input from "./Input";
import Select from "./Select";
import { ReactComponent as Filter } from '../assets/images/Icon_filter_ho.svg';
import { ReactComponent as Search } from '../assets/images/search.svg';
import colors from "../lib/colors";
import i18n from "../lib/i18n";
i18n.init();




const ListingRightContainer = (props) => {
  // console.log("props",props)
  const theme = useTheme();
  const TabContent = styled.div`
    ${space}
    ${color}
    ${layout}
    ${flexbox}
    ${typography}
    ${border}
    ${position}
    clear: both;
    border-radius: 20px 0px 20px 20px;
    
    box-shadow: 12px 0 15px -4px ${colors.right_container_shadow}, -12px 0 8px -4px ${colors.right_container_shadow};
    -webkit-box-shadow : 12px 0 15px -4px ${colors.right_container_shadow}, -12px 0 8px -4px ${colors.right_container_shadow};
    -moz-box-shadow: 12px 0 15px -4px ${colors.right_container_shadow}, -12px 0 8px -4px ${colors.right_container_shadow};
    
    .searchInput{
      background: ${theme.colors.textLight};
      border: 1px solid ${colors.search_box_bd};
      box-sizing: border-box;
      border-radius: 15px;
      padding-left:35px;
      width: 266px;
      transition: all 0.5s ease;
      &:focus, 
      &:not([disabled]):hover {
        border: 0.0625rem solid ${colors.input_bg};
      }      
    } 
    .search-icon-list{
      position: absolute;
      width: 20px;
      margin-left: 10px;
      margin-top: 4px;
      margin-right: 5px;
      margin-bottom: 2px;
    }
    .round{
      width:266px;
    }
  `;

  const ConnectionFilter = styled.div`
    & .connection-filter{
      font-size: 14px;
      line-height: 1.42857143;
      color: ${colors.divider};
      background-color: ${colors.search_box_bg};
      border: 1px solid ${colors.filter_bg};
      border-radius: 15px;
      padding: 6px 35px 6px 35px;         
    }
    & .round{
      background-image:
      linear-gradient(45deg, transparent 50%, #fff 50%),
      linear-gradient(135deg, #fff 50%, transparent 50%),
      radial-gradient(${colors.li_hover} 70%, transparent 72%);
      background-position:
      calc(100% - 20px) calc(1em + 2px),
      calc(100% - 15px) calc(1em + 2px),
      calc(100% - .65em) .5em;
      background-size:
      5px 5px,
      5px 5px,
      1.5em 1.5em;
      background-repeat: no-repeat;
      &:focus{
        background-image:
        linear-gradient(45deg, white 50%, transparent 50%),
        linear-gradient(135deg, transparent 50%, white 50%),
        radial-gradient(${colors.li_hover} 70%, transparent 72%);
        background-position:
        calc(100% - 15px) 1em,
        calc(100% - 20px) 1em,
        calc(100% - .65em) .5em;
        background-size:
        5px 5px,
        5px 5px,
        1.5em 1.5em;
        background-repeat: no-repeat;
        border-color: ${colors.input_bg};
        outline: 0;
      }
      .search-icon {
        position: absolute;
        width: 20px;
        margin-left: 10px;
        margin-top: 4px;
        margin-right: 5px;
        margin-bottom: 2px;
      }
    }
  `;
  const dropdown= [{label: 'listFirstName',value: 1}]
  return (
    <Box width={"100%"}>
      <Box m={40} >
        <Text as={"h5"} fontSize={18}> {i18n.__("listConsole")}</Text>
        <Text as={"h2"} fontSize={37}> {i18n.__("listConnections")} </Text>
        <Box className="btn-group">
            <button className="btn"> {i18n.__("listHiddenConnections")} </button>
            <button className="btn active"> {i18n.__("listAllConnections")} </button>
        </Box>
        <TabContent bg="#fff" height="75%" p="40px">
          <Text as={"p"} fontSize={12} color={colors.text_p1}> {i18n.__("listDetail")}</Text>

          <Flex justifyContent={"space-between"}>
            <ConnectionFilter className="connection-filter-container">
              <Filter className="search-icon-list"/>
              <Select 
                className="connection-filter round" 
                child={dropdown}
              />
            </ConnectionFilter>
            <Box className="connection-searchbox-container">
              <Search className="search-icon-list"/>
              <Input className="searchInput" placeholder={i18n.__("listSearchconsole")}/>
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


export default ListingRightContainer;