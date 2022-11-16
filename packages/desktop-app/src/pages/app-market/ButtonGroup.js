import React, { useState } from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Divider,
  useTheme,
} from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import PropTypes from "prop-types";

import styled from "styled-components";

const CustomButton = styled.button`
  min-width: 150px;
  max-height: 34px;

  background-color: #ffffff;

  font-size: 12px;
  border: 1.5px solid #bec1c0;
  border-radius: 0px;
  cursor: pointer;
  padding: 6px 16px 6px 16px;
  color: #4d5150;

  &:hover {
    background-color: #f5faff;
    color: #4d5150;
  }

  &:active {
    background-color: #f5faff;
  }
  &:focus {
    background-color: #f5faff;
  }
`;

const Count = styled(Flex)`
  background: #eff8ff;
  color: #175cd3;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  padding: 2px 8px 2px 8px;
`;

const ButtonGroup = ({ buttons, handleClickAction }) => {
  const [clickedId, setClickedId] = useState(-1);

  const handleClick = (event, id) => {
    setClickedId(id);

    handleClickAction(event);
  };

  return (
    <Flex alignItems="center">
      {buttons.map((item, i) => (
        <CustomButton
          variation="outline"
          size="xs"
          key={i}
          name={item.name}
          //   onClick={event => handleClick(event, i)}
          onClick={item.onClick}
          className={i === clickedId ? "customButton active" : "customButton"}
        >
          <Flex alignItems="center" justifyContent="space-between">
            {item.icon}
            <Text>{item.name}</Text>

            <Count>{item.count}</Count>
          </Flex>
        </CustomButton>
      ))}
    </Flex>
  );
};

export default ButtonGroup;
