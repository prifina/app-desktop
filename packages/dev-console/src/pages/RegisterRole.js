import React, { useState, useReducer, useEffect } from "react";
import { Flex, Box, Text, Button, Image, useTheme } from "@blend-ui/core";

import { useNavigate } from "react-router-dom";
import { useTranslate } from "@prifina-apps/utils";
import { RegisterContainer } from "./CreateAccount-v2";

import AvatarDefault from "../assets/AvatarDefault";

import * as C from "../components/components";

import styled from "styled-components";
import PropTypes from "prop-types";

const DevCard = styled(Flex)`
  width: 361px;
  height: 107px;
  border-radius: 5px;
  align-items: center;
  padding-left: 26px;
`;

const DeveloperCard = ({ name, Avatar, text }) => {
  return (
    <DevCard bg="basePrimary">
      {Avatar}
      <Box ml="26px">
        {/* <Text>{name}</Text> */}
        <Text fontSize="xs">
          {text} {name}
        </Text>
      </Box>
    </DevCard>
  );
};

DeveloperCard.propTypes = {
  name: PropTypes.string,
  Avatar: PropTypes.node,
  text: PropTypes.string,
};

const RegisterRole = ({ activeUser, ...props }) => {

  const { __ } = useTranslate();
  const navigate = useNavigate();

  const { colors } = useTheme();
  const avatar = <AvatarDefault width="75px" />;
  //given_name
  //<Avatar width="58px" height="58px" />
  //console.log("ACTIVE USER ", activeUser);

  const user = activeUser.name || "Unknown";

  // <Image src={avatar} width="58px" height="58px" /> }

  return <RegisterContainer>

    <Box mt={40} mb={40}>
      <Text fontSize="xl">
        {__("welcomeBack")} {user}!
      </Text>
    </Box>

    <DeveloperCard
      name={user}
      Avatar={avatar}
      text={__("welcomeBackText")}
    />
    <C.Card
      mt={42}
      mb={60}
      bg={colors.basePrimary}
      leftbordercolor={colors.brandAccent}
    >
      <Box ml={23} mt={13} mr={23} mb={13}>
        <Text fontSize="md">{__("loginCardTitle")}</Text>
        <Text fontSize="xs" textStyle={"normal"}>
          {__("loginCardText")}
        </Text>
      </Box>
    </C.Card>
    <C.StyledButton
      mb={8}
      onClick={(e) => {
        navigate("/register/role/terms-of-use", { replace: true });
        e.preventDefault();
      }}
    >
      {__("continueAs")} {user}
    </C.StyledButton>

    <Box>
      <Flex alignItems="baseline">
        <Text fontSize="xs" mr="5px">
          {__("notYou")}
        </Text>
        <Button variation="link"> {__("logoutButton")}</Button>
      </Flex>
    </Box>


  </RegisterContainer>
}


export default RegisterRole;
