import React from "react";
import Background from "../assets/background.png";
import styled from "styled-components";
import { Box } from "@blend-ui/core";

export const StyledBox = styled(Box)`
  /* border-radius: 20px; */
  height: 100vh;
  z-index: 1;
  border: 1px solid #f5f8f7;
  background-color: ${(props) =>
    props.colors ? props.colors.baseWhite : "#F5F8F7"};
`;
export const StyledBackground = styled(Box)`
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
  /* opacity: 0.3; */
  width: 100%;
  height: 631px;
  z-index: 2;
  border: 1px solid #f5f8f7;
  background-color: ${(props) =>
    props.colors ? props.colors.baseWhite : "#F5F8F7"};
`;
