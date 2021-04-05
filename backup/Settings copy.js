/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from "react";
import { Box, Text } from "@blend-ui/core";
import { StyledBox, StyledBackground } from "../components/DefaultBackground";
//import { PrifinaLogo } from "../components/PrifinaLogo";

import { useHistory } from "react-router-dom";

import { useAppContext } from "../lib/contextLib";
import {
  UserMenuContextProvider,
  useUserMenu,
} from "@blend-ui/floating-user-menu";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";
/*
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";

import i18n from "../lib/i18n";
i18n.init();
*/

const Content = (props) => {
  //const history = useHistory();
  //const { userAuth } = useAppContext();
  const userMenu = useUserMenu();
  useEffect(() => {
    userMenu.show({
      initials: "TA",
      effect: { hover: { width: 42 } },
      notifications: 0,
      RecentApps: [],
    });
    //console.log(RecentApps);
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };
  return (
    <React.Fragment>
      <StyledBox>
        <StyledBackground>
          <Tabs
            activeTab={activeTab}
            onClick={tabClick}
            title={"Account Settings"}
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
        </StyledBackground>
      </StyledBox>
    </React.Fragment>
  );
};

const Settings = (props) => {
  const history = useHistory();
  const { userAuth } = useAppContext();
  const [logout, setLogout] = useState(false);

  const onDialogClose = (e, action) => {
    //console.log("CLOSE ", e, action);
    setLogout(false);
    e.preventDefault();
  };
  const onDialogClick = async (e, action) => {
    //console.log("BUTTON ", e, action);
    setLogout(false);
    if (action === "logout") {
      console.log("LOGOUT...");
      try {
        //console.log("LOGOUT...");
        setLogout(true);

        await Auth.signOut();
        userAuth(false);
        history.replace("/");
      } catch (e) {
        console.log("error signing out: ", e);
      }
    }
    e.preventDefault();
  };
  const logOut = () => {
    //console.log("LOGOUT...");
    setLogout(true);
  };
  return (
    <UserMenuContextProvider
      onExit={logOut}
      onHome={() => {
        console.log("HOME CLICK...");
        history.replace("/home");
      }}
    >
      {logout && (
        <LogoutDialog onClose={onDialogClose} onButtonClick={onDialogClick} />
      )}
      <Content />
    </UserMenuContextProvider>
  );
};

Settings.displayName = "Settings";

export default Settings;
