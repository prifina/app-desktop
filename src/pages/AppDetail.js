import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";
import '../assets/scss/style.css';

import AppDetailHeaderContainer from "../components/AppDetailHeaderContainer";
import AppDetailLeftContainer from "../components/AppDetailLeftContainer";
import AppDetailRightContainer from "../components/AppDetailRightContainer";
import i18n from "../lib/i18n";
i18n.init();


const AppDetail = ({ onAction, ...props }) => {
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
      <div className="container">
          <div class="row">
            <AppDetailHeaderContainer />
          </div>

          <div class="row">
            <div class="col-xs-12
                      col-sm-12
                      col-md-3
                      col-lg-3">
              <AppDetailLeftContainer />
            </div>  
            <div class="col-xs-12
                      col-sm-12
                      col-md-9
                      col-lg-9">
              <AppDetailRightContainer />
            </div>
          </div>
      </div>
    </React.Fragment>
  );
};

export default AppDetail;
