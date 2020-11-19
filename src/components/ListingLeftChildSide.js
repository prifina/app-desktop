import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";
import { ReactComponent as Back } from '../assets/images/arrow.svg';

const ListingLeftChildSide = ({ user }) => {
  const SubMenuSideBar = styled.div`        
    padding: 0 0 0 40px;
    width: 220px;
    background: #F3F6FD;
    height: 100vh;
    padding-top: 25px;
    margin-right: -20px;
    h5{
      font-size: 14px;
    }
    h5 img{
      margin-right: 5px;			
      vertical-align: text-top;
    }
    ul{
      padding-left: 20px;
      list-style: none;
    }
    ul li{
      font-size: 16px;
      padding-bottom: 20px;
      color: #383838;
      letter-spacing: 0.5px;
    }
    ul li a{
      color: #383838;
      text-decoration: none;
    }
    ul li.active{			
      position: relative;
    }
    ul li.active a{
      color: #6967FF;
      font-weight: 700;
    }
    ul li:hover a{
      color: #6967FF;
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
      <SubMenuSideBar>
        <Text as={"h5"} fontSize={14} lineHeight={"20.36px"}><a className="back-to-home-navigation"><Back className="mr-1"/> Back to Home</a></Text>
        <ul>
          <li className="active" > <a href="#">Connections </a></li>
          <li> <a href="#"> Events </a> </li>
          <li> <a href="#"> Files </a> </li>
          <li> <a href="#"> Groups </a> </li>
          <li> <a href="#"> Journeys </a> </li>
          <li> <a href="#"> Photos </a> </li>
          <li> <a href="#"> Places </a> </li>
          <li> <a href="#"> Posts </a> </li>
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