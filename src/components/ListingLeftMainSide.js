import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
// import '../assets/scss/style.css';
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";

import { ReactComponent as PrifinaVectorIcon } from '../assets/images/Icon1.svg';
import { ReactComponent as Dashboard } from '../assets/images/dashboard.svg';
import { ReactComponent as Cloud } from '../assets/images/cloud.svg';
import { ReactComponent as Search } from '../assets/images/search.svg';
import { ReactComponent as Rectangle } from '../assets/images/Rectangle.svg';

const ListingLeftMainSide = ({ user }) => {  
const MainSideBar = styled.div`    
      width: 100px;
      text-align: center;
      // margin-top: 30px;
      // border-right: 2px solid #DFEBEF;
      // height: calc(100vh - 46px);
      height: calc(100vh);
      background: #F3F6FD;
      border-top-left-radius: 20px;
      position: relative;
      padding-top: 25px;
    & ul{
      margin-top: 25px;
      padding: 0;
      list-style: none;
      border-right: 2px solid #DFEBEF;
    height: 96%;
    }
    & ul li {
      margin-bottom: 25px;
    }
    & ul li a{
      opacity: 0.4;
      transition: all 0.4s ease-in;
    }
    & ul li:hover a{
      opacity: 1;
    }
    & ul li.active a{
      opacity: 1;
    }
    .active-left-li {
      margin-right: 5px;
      position: absolute;
      left: 0;
	  }
`;
return(
    <MainSideBar>
        <ul className="vertical-main-menu">
          <li className="active"><Rectangle className="active-left-li"/> <a href="#"><PrifinaVectorIcon /> </a> </li>
          <li> <a href="#"><Dashboard /> </a> </li>
          <li> <a href="#"><Cloud /> </a> </li>
          <li> <a href="#"><Search /> </a> </li>
        </ul>
    </MainSideBar>
);
}
ListingLeftMainSide.propTypes = {
  user: PropTypes.shape({})
};

ListingLeftMainSide.defaultProps = {
  user: null,
};

export default ListingLeftMainSide;