import React from "react";
import { Flex, Text } from "@blend-ui/core";

//import { ReactComponent as PrifinaLogoImage } from "../assets/prifina.svg";
import PrifinaLogoImage from "../assets/prifina";

import PropTypes from "prop-types";
export const PrifinaLogo = ({ title = null, ...props }) => (
  <Flex height={"43px"} alignItems={"center"} {...props} >
    <PrifinaLogoImage width={"69px"} height={"27px"} />
    {title && <Text textStyle={"h5"}>{title}</Text>}
  </Flex>
);

PrifinaLogo.propTypes = {
  title: PropTypes.string,
};
