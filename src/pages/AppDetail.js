import React, { useState, useEffect } from "react";
import { Box, Flex } from "@blend-ui/core";
import styled from "styled-components";
import '../assets/scss/style.css';

import AppDetailHeaderContainer from "../components/AppDetailHeaderContainer";
import AppDetailLeftContainer from "../components/AppDetailLeftContainer";
import AppDetailRightContainer from "../components/AppDetailRightContainer";
import colors from "../lib/colors";
import i18n from "../lib/i18n";
i18n.init();


const AppDetail = ({ onAction, ...props }) => {
  console.log("Terms ", props);
  // const { theme } = useTheme();
  // console.log("THEME ", colors);
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
    border: 1px solid ${colors.appdetail_box};
    background-color: ${colors.appdetail_box_bg};
  `;
  return (
    <React.Fragment>
      <StyledBox minWidth={"1440px"} >
        <Flex width={"100%"}>
          <AppDetailHeaderContainer />
        </Flex>
        <Box display={"inline-flex"} width={"100%"} >
          <Flex width={"25%"}  justifyContent={"center"} ml={10}>
              <AppDetailLeftContainer />
          </Flex>  
          <Flex width={"75%"}  justifyContent={"flex-end"} ml={10}>
              <AppDetailRightContainer />
          </Flex>
        </Box>
      </StyledBox>
    </React.Fragment>
  );
};

export default AppDetail;
