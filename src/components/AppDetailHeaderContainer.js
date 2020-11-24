import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { ReactComponent as PrifinaLogo } from "../assets/prifina.svg";
import { ReactComponent as PrifinaText } from "../assets/prifina-text.svg";
import Line from "../assets/Line.png";
import { ReactComponent as Search } from '../assets/images/search.svg';
import { Box, Text, useTheme } from "@blend-ui/core";
import i18n from "../lib/i18n";
i18n.init();

const AppDetailHeaderContainer = ({ user }) => {
  const Header = styled.div`     
    display: flex;
    width: 100%;
    align-items: center;
  `;    
  const HeaderIteam = styled.div`     
    display: flex;
    width: 100%;
    align-items: center;
    padding: 20px 35px;
    .site-logo-icon{
      margin-right:15px;
    }
    .sit-tagline-divider{
      font-size: 23px;
      margin-top: -3px;
      padding: 0 10px;
      color: #B8C1C6;
    }
    .site-tagline{
      font-size: 18px;
      color: #B8C1C6;
    }
  `;  
  const HeaderSearchBox = styled.div`    
    margin: 0 auto;
    .header-searchbox{
      font-size: 14px;
      line-height: 1.42857143;
      color:#B8C1C6;
      background-color:#FBFBFB;
      border: 1px solid #D1D5DE;
      border-radius: 15px;
      padding: 6px 6px 6px 40px;
      width: 256px;
      .search-icon{
        color: #EEEEEE;
      }
    }
  `;
  return (  
    <Header>
        <HeaderIteam mt="4" className="Header">
          <PrifinaLogo className="site-logo-icon"/> 
          <PrifinaText className="site-logo-text"/> 
          <span className="sit-tagline-divider"> | </span> 
          <span className="site-tagline">{i18n.__("appDirectory")}</span>
          <HeaderSearchBox>
            <Box>
              <Search className="search-icon"/>
              <input className="header-searchbox" placeholder={i18n.__("appheaderSearch")}></input>
            </Box>
          </HeaderSearchBox> 
        </HeaderIteam>
    </Header>

  );
}

AppDetailHeaderContainer.propTypes = {
  user: PropTypes.shape({})
};

AppDetailHeaderContainer.defaultProps = {
  user: null,
};


export default AppDetailHeaderContainer;