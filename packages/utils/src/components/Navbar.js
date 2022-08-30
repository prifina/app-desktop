import React from "react";

import { Flex } from "@blend-ui/core";

import PropTypes from "prop-types";

import styled from "styled-components";

export const NavbarContainer = styled(Flex)`
  height: 65px;
  width: 100%;
  padding-left: 64px;
  padding-top: 17px;
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
