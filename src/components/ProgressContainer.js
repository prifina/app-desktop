import React from "react";
//import { withTheme } from "styled-components";
import { Box, Divider, Text, useTheme } from "@blend-ui/core";
import { CircularProgress, CircularProgressLabel } from "@blend-ui/progress";
import { ReactComponent as PrifinaLogo } from "../assets/prifina.svg";

const ProgressContainer = ({ title, progress, children, ...props }) => {
  //console.log("CONTAINER ", props, title, progress);
  const { colors } = useTheme();
  //console.log("THEME ", colors);
  return (
    <React.Fragment>
      <Box
        borderRadius={"20px"}
        width={"421px"}
        minHeight={"437px"}
        backgroundColor={colors.baseWhite}
        pl={29}
        pr={28}
        pb={29}
        mt={20}
        {...props}
      >
        <Box textAlign={"center"} position="relative" top={-37}>
          <CircularProgress value={progress}>
            <CircularProgressLabel>
              <PrifinaLogo height={"23px"} width={"28px"} />
            </CircularProgressLabel>
          </CircularProgress>
        </Box>

        <Divider mt={-4}>
          <Text textStyle={"h6"}>{title}</Text>
        </Divider>
        {children}
      </Box>
    </React.Fragment>
  );
};

export default ProgressContainer;
