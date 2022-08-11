import React, { useState } from "react";
import { Box, Text } from "@blend-ui/core";
import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

const Settings = props => {
  console.log("SETTINGS PROPS ", props);

  const [activeTab, setActiveTab] = useState(0);
  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };
  return (
    <Tabs
      activeTab={activeTab}
      onClick={tabClick}
      title={"Account Settings"}
      variant="rounded"
    >
      <TabList>
        <Tab>User Details</Tab>
        <Tab>Cloud Subscription</Tab>
        <Tab>Usage</Tab>
        <Tab>{"Security & Privacy"}</Tab>
        <Tab>Settings</Tab>
      </TabList>
      <TabPanelList>
        <TabPanel>
          <Box>
            <Text colorStyle={"error"}>Testing1</Text>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box>
            <Text colorStyle={"error"}>Testing2</Text>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box>
            <Text colorStyle={"error"}>Testing3</Text>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box>
            <Text colorStyle={"error"}>Testing4</Text>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box>
            <Text colorStyle={"error"}>Testing5</Text>
          </Box>
        </TabPanel>
      </TabPanelList>
    </Tabs>
  );
};

Settings.displayName = "Settings";

export default Settings;
