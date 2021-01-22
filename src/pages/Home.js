/* eslint-disable react/no-multi-comp */
/* global localStorage */

import React, { useEffect, useReducer, useState } from "react";
//import { useTheme } from "@blend-ui/core";
import { CssGrid, CssCell } from "@blend-ui/css-grid";

import { Box, Flex } from "@blend-ui/core";
import { ReactComponent as PrifinaLogo } from "../assets/prifina.svg";
import {
  UserMenuContextProvider,
  useUserMenu,
} from "@blend-ui/floating-user-menu";

//import { Background } from "../assets/background-image";
import Background from "../assets/background.png";
import styled from "styled-components";
//import InstalledApps from "../components/InstalledApps";
//import { ReactComponent as SettingsIcon } from "../assets/settings.svg";
//import AppIcon from "../components/AppIcon";
//import ImportComponent from "../components/ImportComponent";
import { useIsMountedRef } from "../lib/componentUtils";
import { getInstalledAppsQuery } from "../graphql/api";
import { useAppContext } from "../lib/contextLib";
import Amplify, { API } from "aws-amplify";

const StyledBox = styled(Box)`
  /* border-radius: 20px; */
  height: 100vh;
  z-index: 1;
  border: 1px solid #f5f8f7;
  background-color: ${(props) =>
    props.colors ? props.colors.baseWhite : "#F5F8F7"};
`;
const StyledBackground = styled(Box)`
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
  /* opacity: 0.3; */
  width: 100%;
  height: 631px;
  z-index: 2;
  border: 1px solid #f5f8f7;
  background-color: ${(props) =>
    props.colors ? props.colors.baseWhite : "#F5F8F7"};
`;
/*
const importComponent = (name) => {
  console.log("IMPORT ", name);
  return React.lazy(() =>
    import(`${name}`).catch((err) => {
      console.log("ERR ", err);
    })
  );
};
*/
const array_chunks = (array, chunk_size) =>
  Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map((begin) => array.slice(begin, begin + chunk_size));

const Content = (props) => {
  const userMenu = useUserMenu();
  //const theme = useTheme();
  const { APIConfig, currentUser } = useAppContext();
  Amplify.configure(APIConfig);
  console.log("CURRENT USER ", currentUser);

  const isMountedRef = useIsMountedRef();
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { appIcons: [], loadingStatus: true }
  );

  const [installedAppIcons, setInstalledAppIcons] = useState([]);
  const [installedApps, setInstalledApps] = useState([]);
  //let installedApps = [];
  /*
  let installedApps = JSON.parse(localStorage.getItem("PrifinaInstalledApps"));
  if (installedApps === null) {
    installedApps = [
      "Settings",
      "DataConsole",
      "AppMarket",
      "SmartSearch",
      "DisplayApp",
      "ProfileCards",
      "DevConsole",
    ];
    localStorage.setItem("PrifinaInstalledApps", JSON.stringify(installedApps));
  }
*/

  useEffect(() => {
    async function fetchData() {
      const res = await getInstalledAppsQuery(API, currentUser.username);
      if (isMountedRef.current) {
        console.log("INSTALLED APPS  ", res.data.getPrifinaUser);
        setInstalledApps(JSON.parse(res.data.getPrifinaUser.installedApps));
      }
    }

    fetchData();
  }, [isMountedRef, currentUser.username]);

  useEffect(() => {
    userMenu.show({
      initials: "TA",
      effect: { hover: { width: 42 } },
      notifications: 0,
      RecentApps: [],
    });
    //console.log(RecentApps);
  }, []);
  /*
  useEffect(() => {
    if (!isClient) {
      return false;
    }

    let isMounted = true;

    function handleResize() {
      if (isMounted) {
        setWindowSize(getSize());
      }
    }

    window.addEventListener('resize', throttle(handleResize, 200));
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
*/

  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId = null;
    let isMounted = true;
    const resizeListener = () => {
      if (isMounted) {
        // prevent execution of previous setTimeout
        clearTimeout(timeoutId);
        // change width from the state object after 150 milliseconds
        timeoutId = setTimeout(() => {
          console.log("RESIZE ", window.innerHeight);
          setInstalledAppIcons([]);
        }, 150);
      }
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      isMounted = false;
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  //height={"100vh"}
  /*
  <StyledBox
  minWidth={"1440px"}
  maxHeight={"792px"}
  minHeight={"792px"}
>
*/
  //const installedApps=InstalledApps(["./SettingsIcon"])

  //const Component = ImportComponent("./SettingsIcon");
  useEffect(() => {
    const appImports = installedApps.map((app) => {
      return import(`../components/${app}Icon`);
    });

    Promise.all(appImports).then((components) => {
      console.log("COMPONENT ", components);
      const appComponents = components.map((Component, i) => {
        return (
          <div key={"app-" + i}>
            <Component.default />
          </div>
        );
      });
      //console.log(appComponents);
      console.log("IMPORT APP ICONS...", appComponents);
      setState({ loadingStatus: false, appIcons: appComponents });
    });

    // Spread operator, wrapper function (recommended)
    // setSearches(searches => [...searches, query])
    // Using .concat(), wrapper function (recommended)
    // setSearches(searches => searches.concat(query))
  }, [installedApps]);

  const { loadingStatus, appIcons } = state;
  console.log("APP ICONS ", appIcons, appIcons.length * 100);
  // window.innerHeight-130  (130 is from top)
  const iconCols = Math.ceil(
    (appIcons.length * 115) / (window.innerHeight - 130)
  );

  let gridCols = "1fr";
  if (iconCols > 0) {
    gridCols += " 80px".repeat(iconCols);
  }

  console.log(iconCols, gridCols, appIcons.length);

  let maxColHeight = Array(appIcons.length)
    .fill(0)
    .map((v, i) => {
      return i + 1;
    })
    .filter((v, i) => {
      console.log(v, i, v * 115);
      return v * 115 > window.innerHeight - 130;
    })[0];
  console.log("maxColHeight... ", maxColHeight - 1);
  if (isNaN(maxColHeight)) maxColHeight = appIcons.length;
  if (appIcons.length > 0 && installedAppIcons.length === 0) {
    console.log("UPDATE THIS ");
    setInstalledAppIcons(array_chunks(appIcons, maxColHeight - 1));
    //console.log(installedAppIcons);
  }
  if (installedAppIcons.length > 0) {
    installedAppIcons.map((v, i) => {
      console.log(v, i);
    });
  }
  return (
    <React.Fragment>
      <StyledBox>
        <Box mt={16}>
          <PrifinaLogo width={"69px"} height={"27px"} />
        </Box>

        <StyledBackground>
          {loadingStatus && <div>This may require loading indicator...</div>}
          {!loadingStatus && (
            <Box m={8} mt={77} style={{ zIndex: 3 }}>
              <CssGrid columns={gridCols} flow="column">
                {/* 
                <CssCell left={3} top={1}>
                  {appIcons}
                </CssCell>
                */}
                {installedAppIcons.length > 0 &&
                  installedAppIcons.map((icons, colIndex) => {
                    return icons.map((appIcon, pos) => {
                      return (
                        <CssCell
                          key={"cell-" + colIndex + "-" + pos}
                          left={installedAppIcons.length - colIndex + 1}
                          top={icons.length - pos}
                        >
                          {appIcon}
                        </CssCell>
                      );
                    });
                  })}
              </CssGrid>
            </Box>
          )}
        </StyledBackground>
      </StyledBox>
    </React.Fragment>
  );
};

const Home = (props) => {
  const logOut = () => {
    console.log("LOGOUT...");
  };
  return (
    <UserMenuContextProvider onExit={logOut}>
      <Content />
    </UserMenuContextProvider>
  );
};

Home.displayName = "Home";

export default Home;
