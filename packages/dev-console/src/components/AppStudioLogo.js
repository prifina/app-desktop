import React from "react";
import { Flex } from "@blend-ui/core";

import HeaderLogo from "../assets/AppStudio";
const AppStudioLogo = props => (
  <Flex alignItems="center">
    <HeaderLogo {...props} />
  </Flex>
);

export default AppStudioLogo;