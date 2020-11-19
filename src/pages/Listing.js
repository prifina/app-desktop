import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";
// import '../assets/scss/style.css';

import ListingLeftContainer from "../components/ListingLeftContainer";
import ListingRightContainer from "../components/ListingRightContainer";

import styled from "styled-components";
import i18n from "../lib/i18n";
i18n.init();


const Listing = ({ onAction, ...props }) => {
  console.log("Terms ", props);
  const { colors } = useTheme();
  //console.log("THEME ", colors);
  const [isActive, setActive] = useState(false);
  
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
    border: 1px solid #f5f8f7;
    background-color: ${(props) => props.colors ? props.colors.baseWhite : "#fff"};
    .bodyRightContainer{
      border-radius: 20px;
      border: 1px solid #f5f8f7;
      background-color: #fff;
      margin: 0;
      width: 100%;
      box-shadow: -4px 0px 8px rgba(0, 0, 0, 0.05);
      height: 100vh;
      & h5{
        font-weight: 500;
        color: #99A0B0;
        margin: 0;
      }
      & h2{
        font-weight: 500;
        // font-size: 37px;
        color: #383838;
        margin: 10px 0 0;
      }
      & button.active{
        color: #6967FF;
        box-shadow: 0px -5px 8px rgba(0,0,0,0.05);  
        position:relative;
      }
      & button.active:before {
        content: "";
        position: absolute;
        bottom: -2px;
        left: -15px;
        height: 18px;
        border-right: 30px solid #fff;
        background: #fff;
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
        background: #fff;
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
              <ListingRightContainer />
          </Flex>
        </Box>
      </StyledBox>
    </React.Fragment>
  );

};

export default Listing;
