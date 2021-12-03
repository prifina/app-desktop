import React from "react";
import { Flex } from "@blend-ui/core";

import { ReactComponent as PrifinaLogoImage } from "../assets/app-studio.svg";
export const DevConsoleLogo = props => (
  <Flex alignItems="center">
    <PrifinaLogoImage {...props} />
  </Flex>
);
