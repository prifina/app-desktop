import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { space, color, layout, flexbox , typography, border, position} from 'styled-system'
import colors from "../lib/colors";

import { ReactComponent as PrifinaVectorIcon } from '../assets/images/Icon1.svg';
import { ReactComponent as Dashboard } from '../assets/images/dashboard.svg';
import { ReactComponent as Cloud } from '../assets/images/cloud.svg';
import { ReactComponent as Search } from '../assets/images/search.svg';
import { ReactComponent as Rectangle } from '../assets/images/Rectangle.svg';

const ListingLeftMainSide = ({ user }) => {  
const MainSideBar = styled.div`    
    ${space}
    ${color}
    ${layout}
    ${flexbox}
    ${typography}
    ${border}
    ${position}
    & ul{
      margin-top: 25px;
      padding: 0;
      list-style: none;
      border-right: 2px solid ${colors.ul_bd};
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
    <MainSideBar width="100px" height="calc(100vh)" bg={colors.ul_div} textAlign='center' borderTopLeftRadius="20px" pt="25px" position="relative">
        <ul >
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