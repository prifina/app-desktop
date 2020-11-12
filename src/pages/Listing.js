import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";
import '../assets/scss/style.css';

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

  return (
    <React.Fragment>
      <div className="">
          <div className="row row-container">
            
              <ListingLeftContainer />
           
              <ListingRightContainer />  
            
          </div>
      </div>
    </React.Fragment>
  );
};

export default Listing;
