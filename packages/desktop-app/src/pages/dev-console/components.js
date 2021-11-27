import React from "react";

import { Box, Flex, Text, Button, Image } from "@blend-ui/core";

import styled from "styled-components";

export const MenuButton = styled(Button)`
  height: 57px;
  width: 100%;
  border-radius: 0;
  background: transparent;
  border: 0 !important;
  color: ${props => props.color};

  &:hover {
    color: transparent;
    background-color: transparent !important;
    text-decoration: 0;
    border-bottom: 2px solid ${props => props.borderColor} !important;
  }
  &:focus {
    border-bottom: 2px solid ${props => props.borderColor} !important;
  }
  &:active {
    border-bottom: 2px solid ${props => props.borderColor} !important;
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
  border-left: 4px solid ${props => props.leftBorderColor};
`;

export const DevCard = styled(Flex)`
  width: 361px;
  height: 107px;
  border-radius: 5px;
  align-items: center;
  padding-left: 26px;
`;

export const DeveloperCard = ({ currentUser, avatar, text }) => {
  return (
    <DevCard bg="baseMuted">
      <Image src={avatar} width="58px" height="58px" />
      <Box ml="26px">
        <Text>{currentUser}</Text>
        <Text fontSize="xs">
          {text} {currentUser}
        </Text>
      </Box>
    </DevCard>
  );
};
