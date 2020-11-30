import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";
// import '../assets/scss/style.css';

import Ellipse61 from '../assets/Ellipse61.png';
import Ellipse62 from '../assets/Ellipse62.png';
import Ellipse63 from '../assets/Ellipse63.png';
import Ellipse64 from '../assets/Ellipse64.png';
import Ellipse65 from '../assets/Ellipse65.png';
import Ellipse66 from '../assets/Ellipse66.png';
import Ellipse67 from '../assets/Ellipse67.png';
import Ellipse68 from '../assets/Ellipse68.png';

import ListingLeftContainer from "../components/ListingLeftContainer";
import ListingRightContainer from "../components/ListingRightContainer";

import styled from "styled-components";
import colors from "../lib/colors";
import i18n from "../lib/i18n";
i18n.init();



const Listing = ({ onAction, ...props }) => {
  console.log("Terms ", props);
  const theme = useTheme();
  //console.log("THEME ", theme);
  const [isActive, setActive] = useState(false);

  const [headTable, setHeadTable] = useState(
    {
      image: '',
      full_name: 'Full Name',
      alias: 'Alias',
      app: 'App',
      relationship: 'Relationship',
      source: 'Source',
      data_connect: 'Data Connect',
      latest_interaction: 'Latest Interaction',
      action: ''
    });
  const [dataTable, setDataTable] = useState([
    {
      image: Ellipse61,
      full_name: 'Eric Chaney',
      alias: 'erch',
      app: 'Facebook',
      relationship: 'Friend',
      source: 'EricChaney@gmail.com',
      data_connect: 'March 19,2020',
      latest_interaction: 'April 19,2020',
      action: 'Facebook'
    },
    {
      image: Ellipse62,
      full_name: 'Janer Doe',
      alias: 'N/A',
      app: 'Youtube',
      relationship: 'Follower',
      source: 'N/A',
      data_connect: 'March 14,2020',
      latest_interaction: 'April 14,2020',
      action: 'Youtube'
    },
    {
      image: Ellipse63,
      full_name: 'Diana Redding',
      alias: 'd.red',
      app: 'LinkedIn',
      relationship: 'Connection',
      source: 'N/A',
      data_connect: 'March 12,2020',
      latest_interaction: 'April 19,2020',
      action: 'LinkedIn'
    },
    {
      image: Ellipse64,
      full_name: 'Eric Chaney',
      alias: 'erch',
      app: 'Twitter',
      relationship: 'Follower',
      source: 'EricChaney@gmail.com',
      data_connect: 'March 09,2020',
      latest_interaction: 'April 14,2020',
      action: 'Twitter'
    },
    {
      image: Ellipse65,
      full_name: 'James Rob',
      alias: 'erch',
      app: 'Facebook',
      relationship: 'Friend',
      source: 'EricChaney@gmail.com',
      data_connect: 'March 19,2020',
      latest_interaction: 'April 19,2020',
      action: 'Facebook'
    },
    {
      image: Ellipse66,
      full_name: 'Derek Coule',
      alias: 'erch',
      app: 'Facebook',
      relationship: 'Friend',
      source: 'EricChaney@gmail.com',
      data_connect: 'March 19,2020',
      latest_interaction: 'April 19,2020',
      action: 'Facebook'
    },
    {
      image: Ellipse67,
      full_name: 'Emily Johnson',
      alias: 'erCh',
      app: 'Instagram',
      relationship: 'Connection',
      source: 'N/A',
      data_connect: 'March 19,2020',
      latest_interaction: 'April 19,2020',
      action: 'Instagram'
    },
    {
      image: Ellipse68,
      full_name: 'Greg Rust ',
      alias: 'gRust',
      app: 'Twitter',
      relationship: 'Follower',
      source: 'N/A',
      data_connect: 'March 19,2020',
      latest_interaction: 'April 19,2020',
      action: 'Twitter'
    }
  ]);
  
  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setTimeout(() => {
        console.log("This will run after 5 second!");
        onAction("email");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isActive]);

  const StyledBox = styled(Box)`
    border-radius: 20px;
    border: 1px solid ${colors.appdetail_box};
    background-color: ${theme.colors.textLight};
    .bodyRightContainer{
      border-radius: 20px;
      border: 1px solid ${colors.appdetail_box};
      background-color: ${theme.colors.textLight};
      margin: 0;
      width: 100%;
      box-shadow: -4px 0px 8px ${colors.right_container_shadow};
      height: 100vh;
      & button,
      & optgroup,
      & textarea {
        font-family: inherit;
        font-size: 100%;
        line-height: 1.15;
        margin: 0;
      }    
      & .btn-group {
        position: relative;
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        vertical-align: middle;
        float: right;
      }
      
      & .btn {
        display: inline-block;
        font-weight: 400;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: 1px solid transparent;
        padding: 20px 40px 15px;
        font-size: 14px;
        line-height: 1.5;
        border-radius: .25rem;
        -webkit-transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
        color: ${colors.text_h4};
        background: transparent;
      }
      
      & .btn-group > .btn.active,
      & .btn-group > .btn:active,
      & .btn-group > .btn:focus {
        outline: none;
      }
      
      & .btn-group > .btn.active {
        background: ${theme.colors.textLight};
        border-radius: 20px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        font-weight: 700;
      }
      
      & .btn-group > .btn:active,
      & .btn-group > .btn:focus {
        background: ${theme.colors.textLight};
        border-radius: 20px;
        -webkit-box-shadow: 0px -3px 8px ${colors.right_container_shadow};
                box-shadow: 0px -3px 8px ${colors.right_container_shadow};
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        font-weight: 700;
      }
      & h5{
        font-weight: 500;
        color: ${colors.text_h5};
        margin: 0;
      }
      & h2{
        font-weight: 500;
        // font-size: 37px;
        color: ${colors.text_h4};
        margin: 10px 0 0;
      }
      & button.active{
        color: ${colors.li_hover};
        box-shadow: 0px -5px 8px ${colors.right_container_shadow};  
        position:relative;
      }
      & button.active:before {
        content: "";
        position: absolute;
        bottom: -2px;
        left: -15px;
        height: 18px;
        border-right: ${"30px solid " +theme.colors.textLight};
        background: ${theme.colors.textLight};
        -webkit-border-bottom-right-radius: 80px 50px;
        -moz-border-radius-bottomright: 80px 50px;
        border-bottom-right-radius: 80px 50px;
        -webkit-transform: translate(0,-2px);
        -moz-transform: translate(0,-2px);
        -ms-transform: translate(0,-2px);
        -o-transform: translate(0,-2px);
        -webkit-transform: translate(0,-2px);
        -ms-transform: translate(0,-2px);
        transform: translate(0,-2px);
      }
      
      /* creates part of the curved pointy bit */
      & button.active:after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: -21px;
        width: 30px;
        height: 18px;
        background: ${theme.colors.textLight};
        -webkit-border-bottom-right-radius: 40px 50px;
        -moz-border-radius-bottomright: 40px 50px;
        border-bottom-right-radius: 40px 50px;
        -webkit-transform: translate(-10px,-2px);
        -moz-transform: translate(-10px,-2px);
        -ms-transform: translate(-10px,-2px);
        -o-transform: translate(-10px,-2px);
        -webkit-transform: translate(-10px,-2px);
        -ms-transform: translate(-10px,-2px);
        -webkit-transform: translate(-10px,-2px);
        -ms-transform: translate(-10px,-2px);
        transform: translate(-10px,-2px);
      }
    }
   
  `;  
  return (
    <React.Fragment>
      <StyledBox minWidth={"1440px"} maxHeight={"792px"} minHeight={"792px"} >
        <Box display={"inline-flex"} width={"100%"} >
          <Flex className="bodyLeftContainer" height={"792px"} justifyContent={"flex-start"}>
              <ListingLeftContainer />
          </Flex>  
          <Flex className="bodyRightContainer" height={"100%"} justifyContent={"flex-end"} >
              <ListingRightContainer 
                headTable = {headTable}
                dataTable = {dataTable}
              />
          </Flex>
        </Box>
      </StyledBox>
    </React.Fragment>
  );

};

export default Listing;
