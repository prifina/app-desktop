import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { space, layout, flexbox , typography } from 'styled-system'
import { ReactComponent as PrifinaLogo } from "../assets/prifina.svg";
import { ReactComponent as PrifinaText } from "../assets/prifina-text.svg";
import Input from "./Input";
import { ReactComponent as Search } from '../assets/images/search.svg';
import { Box } from "@blend-ui/core";
import colors from "../lib/colors";
import i18n from "../lib/i18n";
i18n.init();

const AppDetailHeaderContainer = ({ user }) => {
  // console.log('colors',colors)
  // const theme = useTheme();

  const Header = styled.div`    
    ${typography}    
    ${flexbox}    
    ${layout}       
  `;    
  const HeaderIteam = styled.div`    
    ${typography}    
    ${flexbox}    
    ${layout}      
    ${space}      
    display:flex;
    .site-logo-icon{
      margin-right:15px;
    }
    .sit-tagline-divider{
      font-size: 23px;
      margin-top: -3px;
      padding: 0 10px;
      color: ${colors.divider};
    }
    .site-tagline{
      font-size: 18px;
      color: ${colors.divider};
    }
  `;  
  const HeaderSearchBox = styled.div`    
    margin: 0 auto;
    .header-searchbox{
      font-size: 14px;
      line-height: 1.42857143;
      color: ${colors.divider};
      background-color: ${colors.search_box_bg};
      border: 1px solid ${colors.search_box_bd};
      border-radius: 15px;
      padding: 6px 6px 6px 40px;
      width: 256px;
      .search-icon{
        color: ${colors.search_box_cl};
      }
    }
  `;
  return (  
    <Header  width="100%" alignItems='center' flex='1' >
        <HeaderIteam mt="4" className="Header" flex='1' width="100%" textAlign='center' pt="20px" pb="35px">
          <PrifinaLogo className="site-logo-icon"/> 
          <PrifinaText className="site-logo-text"/> 
          <span className="sit-tagline-divider"> | </span> 
          <span className="site-tagline">{i18n.__("appDirectory")}</span>
          <HeaderSearchBox>
            <Box>
              <Search className="search-icon"/>
              <Input className="header-searchbox" placeholder={i18n.__("appheaderSearch")}/>
              {/*<input className="header-searchbox" placeholder={i18n.__("appheaderSearch")}></input>*/}
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