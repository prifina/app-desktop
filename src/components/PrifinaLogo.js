import React from "react";
import { Flex, Text } from "@blend-ui/core";

import { ReactComponent as PrifinaLogoImage } from "../assets/prifina.svg";

import PropTypes from "prop-types";
export const PrifinaLogo = ({ title = null, ...props }) => (
  <Flex mt={16}>
    <PrifinaLogoImage width={"69px"} height={"27px"} {...props} />
    {title && <Text textStyle={"h5"}>{title}</Text>}
  </Flex>
);

PrifinaLogo.propTypes = {
  title: PropTypes.string,
};
