/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */

import React from "react";
// import { List, ListItem, ListDivider } from "@blend-ui/list";
import { Flex } from "@blend-ui/core";

import PropTypes from "prop-types";

import styled from "styled-components";

export const NavbarContainer = styled(Flex)`
  height: 65px;
  width: 100%;
  padding-left: 64px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Navbar = ({
  //theme,
  children,
  backgroundColor,
  ...props
}) => {
  console.log("Navbar ", props);
  return <NavbarContainer bg={backgroundColor}>{children}</NavbarContainer>;
};

Navbar.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.string,
};

export default Navbar;
