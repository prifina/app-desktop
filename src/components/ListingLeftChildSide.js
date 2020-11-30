import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { space, color, layout, flexbox } from 'styled-system'
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";
import { ReactComponent as Back } from '../assets/images/arrow.svg';
import colors from "../lib/colors";
import i18n from "../lib/i18n";
i18n.init();


const ListingLeftChildSide = ({ user }) => {
  const SubMenuSideBar = styled.div`
    ${space}
    ${color}
    ${layout}
    ${flexbox}
    h5 img{
      vertical-align: text-top;
    }
    ul{
      padding-left: 20px;
      list-style: none;
    }
    ul li{
      font-size: 16px;
      padding-bottom: 20px;
      color: ${colors.text_h4};
      letter-spacing: 0.5px;
    }
    ul li a{
      color: ${colors.text_h4};
      text-decoration: none;
    }
    ul li.active{			
      position: relative;
    }
    ul li.active a{
      color: ${colors.li_hover};
      font-weight: 700;
    }
    ul li:hover a {
      color: ${colors.li_hover};
    }
    ul li.active::after{
      content: '';
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-right: 15px solid white;
      border-bottom: 10px solid transparent;
      display: block;
      position: absolute;
      right: 20px;
      top: 0;
    }    
  `;
  return(
       <SubMenuSideBar bg={colors.ul_div} pt="25px" mr="-20px" width="220px"  height="100vh" pl="40px">
        <Text as={"h5"} fontSize={14} lineHeight={"20.36px"}><a ><Back mr="0.25em"/> {i18n.__("listBacktoHome")}</a></Text>
        <ul>
          <li className="active"> <a href="#"> {i18n.__("listConnections")} </a></li>
          <li> <a href="#"> {i18n.__("listEvents")}  </a> </li>
          <li> <a href="#"> {i18n.__("listFiles")}  </a> </li>
          <li> <a href="#"> {i18n.__("listGroups")}  </a> </li>
          <li> <a href="#"> {i18n.__("listJourneys")}  </a> </li>
          <li> <a href="#"> {i18n.__("listPhotos")}  </a> </li>
          <li> <a href="#"> {i18n.__("listPlaces")}  </a> </li>
          <li> <a href="#"> {i18n.__("listPosts")}  </a> </li>
        </ul>
    </SubMenuSideBar>
  );
}

ListingLeftChildSide.propTypes = {
  user: PropTypes.shape({})
};

ListingLeftChildSide.defaultProps = {
  user: null,
};

export default ListingLeftChildSide;