import React, { useState } from "react";

import { Flex, Box, Button, Text, TextArea, useTheme } from "@blend-ui/core";
import { BlendIcon } from "@blend-ui/icons";
import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";
import { i18n } from "@prifina-apps/utils";

i18n.init();

import styled from "styled-components";

import mdiArrowTopRight from "@iconify/icons-mdi/arrow-top-right";

const GreetContainer = styled(Box)`
  padding: 24px;
  width: 1005px;
  height: 111px;
  background: linear-gradient(
    90deg,
    #860463 4.93%,
    #45213b 62.24%,
    #201e1f 106.82%
  );
  border-radius: 16px;
  cursor: pointer;
`;

const ItemContainer = styled(Box)`
  width: 490.5px;
  height: 226px;

  background: #373436;
  border-radius: 8px;
  cursor: pointer;
`;

const Resources = ({ ...props }) => {
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState(0);

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };

  return (
    <div>
      <GreetContainer
        mb={40}
        onClick={() => {
          window.open("https://docs.prifina.com");
        }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text textStyle="h3">Getting started</Text>
          <BlendIcon iconify={mdiArrowTopRight} size="20px" color="white" />
        </Flex>
        <Text>
          Read our quick start guide to familiarize yourself with Prifina’s
          tools and workflows!
        </Text>
      </GreetContainer>

      <div
        style={{
          overflow: "hidden",
          width: 600,
        }}
      >
        <Tabs
          activeTab={activeTab}
          onClick={tabClick}
          style={{
            height: "100%",
            background: "transparent",
            padding: 0,
          }}
          variant="rectangle"
        >
          <TabList>
            <Tab>
              <Text>Key resources</Text>
            </Tab>
            <Tab>
              <Text>Build resources</Text>
            </Tab>
            <Tab>
              <Text>Test resources</Text>
            </Tab>
          </TabList>
          <TabPanelList style={{ backgroundColor: null }}>
            <TabPanel
              style={{
                height: "100vh",
                paddingBottom: "50px",
                overflow: "auto",
              }}
            >
              <div style={{ flexWrap: "wrap" }}>
                <ItemContainer />
              </div>
            </TabPanel>
            <TabPanel
              style={{
                height: "100vh",
                paddingBottom: "50px",
                overflow: "auto",
              }}
            >
              Build
            </TabPanel>
            <TabPanel
              style={{
                height: "100vh",
                paddingBottom: "50px",
                overflow: "auto",
              }}
            >
              Test
            </TabPanel>
          </TabPanelList>
        </Tabs>
      </div>
    </div>
  );
};

export default Resources;
