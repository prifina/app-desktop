import React from "react";
import { Box } from "@blend-ui/core";

import { ReactComponent as PrifinaLogoImage } from "../assets/prifina.svg";
export const PrifinaLogo = props => (
  <Box mt={16}>
    <PrifinaLogoImage width={"69px"} height={"27px"} {...props} />
  </Box>
);
