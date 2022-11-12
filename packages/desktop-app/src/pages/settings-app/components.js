import React from "react";
import { Flex, Text } from "@blend-ui/core";

import { ReactComponent as PrifinaLogoImage } from "../../assets/settings-app/settings-logo.svg";

import PropTypes from "prop-types";

import styled from "styled-components";

export const UnorderedList = styled.ul`
  /* */
  list-style-type: none;
  margin: 0;
  list-style-position: outside;
  padding-inline-start: 20px;
  margin-block-start: 0px;
  padding: 0;
  padding-left: 20px;
`;

export const ListItem = styled.li`
  /* */
  ::before {
    content: "•";
    color: ${props =>
      props.verified
        ? props.theme.colors.baseSecondary
        : props.theme.colors.baseMuted}; // from theme
    display: inline-block;
    width: 0.9em;
    margin-left: -0.9em;
    font-size: 2em;
  }
  span {
    position: relative;
    top: -5px;
  }
`;
