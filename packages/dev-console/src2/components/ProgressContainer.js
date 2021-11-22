/* eslint-disable react/forbid-prop-types */
import React from "react";
//import { withTheme } from "styled-components";
import { Box, Divider, Text, useTheme } from "@blend-ui/core";
import { CircularProgress, CircularProgressLabel } from "@blend-ui/progress";
import { ReactComponent as PrifinaLogo } from "../assets/prifina.svg";
import PropTypes from "prop-types";

const ProgressContainer = ({
  title,
  progress,
  children,
  mobileApp = false,
  ...props
}) => {
  //console.log("CONTAINER ", props, title, progress);
  const { colors } = useTheme();
  //console.log("THEME ", colors);
  return (
    <React.Fragment>
      {mobileApp && (
        <Box
          borderTopLeftRadius={"8px"}
          borderTopRightRadius={"8px"}
          width={"100%"}
          height={"100%"}
          backgroundColor={colors.baseWhite}
          boxShadow={"0px -4px 8px rgba(91, 92, 91, 0.15)"}
          mt={37}
          {...props}
        >
          <Box textAlign={"center"} position="relative" top={-37}>
            <CircularProgress value={progress}>
              <CircularProgressLabel>
                <PrifinaLogo height={"23px"} width={"28px"} />
              </CircularProgressLabel>
            </CircularProgress>
            <Text mt={15} textStyle={"h3"}>
              {title}
            </Text>
          </Box>
          {children}
        </Box>
      )}
      {!mobileApp && (
        <Box
          borderRadius={"20px"}
          width={"421px"}
          minHeight={"437px"}
          backgroundColor={colors.baseWhite}
          pl={29}
          pr={28}
          pb={15}
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
      )}
    </React.Fragment>
  );
};

ProgressContainer.propTypes = {
  title: PropTypes.string.isRequired,
  mobileApp: PropTypes.bool,
  progress: PropTypes.number.isRequired,

  children: PropTypes.array.isRequired,
};
export default ProgressContainer;
