/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from "react";
import { Box, Text } from "@blend-ui/core";
//import { StyledBox, StyledBackground } from "../components/DefaultBackground";
import withUsermenu from "../components/UserMenu";
//import { PrifinaLogo } from "../components/PrifinaLogo";

import { useUserMenu } from "@blend-ui/floating-user-menu";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";
import { useIsMountedRef } from "../lib/componentUtils";

//import { getInstalledAppsQuery } from "../graphql/api";
//import Amplify, { API, Auth } from "aws-amplify";
//import { useAppContext } from "../lib/contextLib";
/*
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";

import i18n from "../lib/i18n";
i18n.init();
*/

//const compose = (...rest) => (x) => rest.reduceRight((y, f) => f(y), x);
/*
export function compose(...hofs) {
  return (wrapped) => hofs.reduceRight((p, c) => c(p), wrapped);
}
*/
/*
const compose = (...funcs) =>
  funcs.reduce(
    (a, b) => (...args) => a(b(...args)),
    (arg) => arg
  );
*/
/*
function withBackground(WrappedComponent) {
  const WithBackground = (props) => {
    return (
      <StyledBox>
        <StyledBackground>
          <WrappedComponent {...props} />
        </StyledBackground>
      </StyledBox>
    );
  };
  
  WithBackground.displayName = `WithBackground(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;
  

  return WithBackground;
}
*/
/*
function withDiv(Wrapped) {
  // eslint-disable-next-line react/display-name
  return function (props) {
    return (
      <div>
        <Wrapped {...props} />
      </div>
    );
  };
}
*/
const usePrifina = (props) => {
  const appID = props.appID;
  const getAPP = () => {
    return new Promise(function (resolve, reject) {
      try {
        let timeoutId = null;
        timeoutId = xsetTimeout(() => {
          clearTimeout(timeoutId);
          resolve("OK");
        }, 5000);
      } catch (e) {
        reject({ PRIFINA: e });
      }
    });
  };

  return { getAPP };
};
const Settings = (props) => {
  //const history = useHistory();
  //const { userAuth } = useAppContext();
  console.log("SETTINGS PROPS ", props);
  const isMountedRef = useIsMountedRef();
  const userMenu = useUserMenu();
  //const { APIConfig, currentUser } = useAppContext();
  const { getAPP } = usePrifina({ appID: "123" });
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAPP();
        if (isMountedRef.current) {
          console.log("INSTALLED APPS  ", res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, [isMountedRef]);

  /*
  useEffect(() => {
    getInstalledAppsQuery(API, currentUser.username)
      .then((res) => {
        console.log("RESULT ", res);
        console.log(
          "TEST ",
          getAPP().then((res) => {
            console.log("APP TEST ", res);
          })
        );
      })
      .catch((e) => {
        console.log("ERR", e);
      });
  }, []);
*/

  /*

function goodbye(e) {
  if (!validNavigation) {
  if (dont_confirm_leave !== 1) {
  if (!e) e = window.event;
  e.cancelBubble = true;
  e.returnValue = leave_message;
  //e.stopPropagation works in Firefox.
  if (e.stopPropagation) {
  e.stopPropagation();
  e.preventDefault();
  }
  //return works for Chrome and Safari
  return leave_message;
  }
  }
  }
*/

  useEffect(() => {
    window.onbeforeunload = confirmExit;
    function confirmExit(e) {
      console.log("UNLOAD ", e);
      e.returnValue = "Leave site 1";
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
      return "Leave site 2";
      //return "";
    }
  }, []);

  /*
  useEffect(() => {
    let isMounted = true;
    const onTrigger = (e) => {
      if (isMounted) {
        console.log("UNLOAD ", e);
        e.returnValue = "Leave site 1";
        if (e.stopPropagation) {
          e.stopPropagation();
          e.preventDefault();
        }
        return "Leave site 2";
      }
    };
    // set resize listener
    window.addEventListener("beforeunload", onTrigger);

    // clean up function
    return () => {
      isMounted = false;
      window.removeEventListener("beforeunload", onTrigger);
    };
  }, []);
*/
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
    <Tabs activeTab={activeTab} onClick={tabClick} title={"Account Settings"}>
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

//export default compose(withUsermenu(), withDiv)(Settings);
export default withUsermenu()(Settings);
