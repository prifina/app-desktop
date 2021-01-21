import React from "react";

//import Layout from "../components/Layout";
import { CssGrid, CssCell } from "@blend-ui/css-grid";

import { ReactComponent as AppMarket } from "../assets/app-market.svg";
import AppIcon from "../components/AppIcon";

import { Box, Flex } from "@blend-ui/core";

import Home from "../pages/Home";

export default { title: "Home" };

export const home = () => (
  <CssGrid columns={"1fr 80px"} flow="column">
    <CssCell left={2}>
      {" "}
      <AppIcon title={"App Market1"} icon={AppMarket} />
    </CssCell>
    <CssCell left={2} top={2}>
      <AppIcon title={"App Market2"} icon={AppMarket} />
    </CssCell>
    <CssCell left={2} top={3}>
      <AppIcon title={"App Market3"} icon={AppMarket} />
    </CssCell>
  </CssGrid>
);
home.story = {
  name: "Home",
};

export const home2 = () => (
  <CssGrid flow="row dense" columns={1}>
    <CssCell>
      <AppIcon title={"App Market1"} icon={AppMarket} />
    </CssCell>
    <CssCell>
      <AppIcon title={"App Market2"} icon={AppMarket} />
    </CssCell>
    <CssCell>
      <AppIcon title={"App Market3"} icon={AppMarket} />
    </CssCell>
  </CssGrid>
);
home2.story = {
  name: "Home CSS",
};

export const home3 = () => (
  <Box>
    <CssGrid columns={"1fr 80px 80px"} flow="column">
      <CssCell left={2} top={1}>
        <div>
          <AppIcon title={"App Market4"} icon={AppMarket} />
        </div>
        <div>
          <AppIcon title={"App Market5"} icon={AppMarket} />
        </div>
      </CssCell>
      <CssCell left={3} top={1}>
        <Flex justifyContent={"flex-end"}>
          <AppIcon title={"App Market1"} icon={AppMarket} />
        </Flex>
        <Flex justifyContent={"flex-end"}>
          <AppIcon title={"App Market2"} icon={AppMarket} />
        </Flex>
        <Flex justifyContent={"flex-end"}>
          <AppIcon title={"App Market3"} icon={AppMarket} />
        </Flex>
      </CssCell>
    </CssGrid>
  </Box>
);
home3.story = {
  name: "Home FLEX",
};

export const home4 = () => <Home />;
home4.story = {
  name: "Home Component",
};
