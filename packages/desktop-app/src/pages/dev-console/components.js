import React from "react";
// import { List, ListItem, ListDivider } from "@blend-ui/list";
import { Box, Flex, Text, Button, Image, Divider } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import { PrifinaLogo } from "../../components/PrifinaLogo";
import bxsCheckCircle from "@iconify/icons-bx/bxs-check-circle";

import appMenu from "@iconify/icons-fe/app-menu";
import bxsWidget from "@iconify/icons-bx/bxs-widget";
import bxMinusBack from "@iconify/icons-bx/bx-minus-back";

import styled, { createGlobalStyle } from "styled-components";

export const MenuButton = styled(Button)`
  height: 57px;
  width: 100%;
  border-radius: 0;
  background: transparent;
  // border: 1px solid #61045f;
  border-color: #00847a;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  outline: 0 !important;

  &:hover {
    color: transparent;
    background-color: transparent !important;
    text-decoration: 0;
    border: 1px solid black;
  }
  &:focus {
    outline: 0 !important;
  }
  &:active {
    outline: none;
  }
  font-size: 16px;
  text-align: left;
  padding-left: 14px;
`;

export const StyledButton = styled(Button)`
  width: 361px;
  border: 0;
`;

export const Card = styled(Box)`
  width: 361px;
  height: 107px;
  border-radius: 5px;
  border-left: 4px solid #00847a;
`;

export const DevCard = styled(Flex)`
  width: 361px;
  height: 107px;
  border-radius: 5px;
  align-items: center;
  padding-left: 26px;
`;

export const DeveloperCard = ({ name, avatar }) => {
  return (
    <DevCard bg="baseMuted">
      <Image src={avatar} width="58px" height="58px" />
      <Box ml="26px">
        <Text>{name}</Text>
        <Text fontSize="xs">
          We noticed you are currently logged into Prifina as JohnS116
        </Text>
      </Box>
    </DevCard>
  );
};
