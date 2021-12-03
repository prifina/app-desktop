/* eslint-disable react/no-multi-comp */
/* global localStorage */

import React, { useEffect, useReducer, useState, useRef } from "react";
//import { useTheme } from "@blend-ui/core";
import { CssGrid, CssCell } from "@blend-ui/css-grid";

import { Box, Flex } from "@blend-ui/core";
//import { ReactComponent as PrifinaLogo } from "../assets/prifina.svg";
/*
import {
  UserMenuContextProvider,
  useUserMenu,
} from "@blend-ui/floating-user-menu";
*/
import UserMenuContextProvider, {
  useUserMenu,
} from "../components/FloatingUserMenu";

//import { Background } from "../assets/background-image";
//import Background from "../assets/background.png";
//import styled from "styled-components";
//import InstalledApps from "../components/InstalledApps";
//import { ReactComponent as SettingsIcon } from "../assets/settings.svg";
//import AppIcon from "../components/AppIcon";
//import ImportComponent from "../components/ImportComponent";
import { useIsMountedRef } from "../lib/componentUtils";
import {
  getInstalledAppsQuery,
  getPrifinaAppsQuery,
  getPrifinaUserQuery,
} from "../graphql/api";
import { useAppContext } from "../lib/contextLib";
import Amplify, { API, Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";

import LogoutDialog from "../components/LogoutDialog";
import { StyledBox, StyledBackground } from "../components/DefaultBackground";
import { PrifinaLogo } from "../components/PrifinaLogo";

import { useSpring, animated } from "react-spring";
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
    .map(begin => array.slice(begin, begin + chunk_size));

const Content = props => {
  const history = useHistory();
  const userMenu = useUserMenu();
  //const theme = useTheme();
  const { APIConfig, currentUser } = useAppContext();
  //Amplify.configure(APIConfig);
  //console.log("AMPLIFY ", Amplify.configure(), API.configure());
  console.log("CURRENT USER ", currentUser);

  const isMountedRef = useIsMountedRef();
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { appIcons: [], loadingStatus: true },
  );

  const prifinaApps = useRef({});
  const [installedAppIcons, setInstalledAppIcons] = useState([]);
  const [installedApps, setInstalledApps] = useState([]);

  // const [logout, setLogout] = useState(true);
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
      if (isMountedRef.current) {
        const prifinaAppsData = await getPrifinaAppsQuery(API, "APPS");
        console.log(prifinaApps);
        const prifinaAppsJSON = JSON.parse(
          prifinaAppsData.data.getPrifinaApp.apps,
        );
        /*
        {
          "data": {
            "getPrifinaApp": {
              "apps": "{\"SmartSearch\":{\"route\":\"\"},\"DisplayApp\":{\"route\":\"core/display-app\"},\"ProfileCards\":{\"route\":\"\"},\"AppMarket\":{\"route\":\"\"},\"DataConsole\":{\"route\":\"\"},\"Settings\":{\"route\":\"core/settings\"},\"DevConsole\":{\"route\":\"\"}}"
            }
          }
        }
*/

        const res = await getPrifinaUserQuery(API, currentUser.prifinaID);
        console.log("INSTALLED APPS  ", res.data.getPrifinaUser);
        const installedAppsJSON = JSON.parse(
          res.data.getPrifinaUser.installedApps,
        );
        installedAppsJSON.forEach(app => {
          prifinaApps.current[app] = prifinaAppsJSON[app];
        });
        const appProfile = JSON.parse(res.data.getPrifinaUser.appProfile);

        userMenu.show({
          initials: appProfile.initials,
          effect: { hover: { width: 42 } },
          notifications: 0,
          RecentApps: [],
        });

        setInstalledApps(installedAppsJSON);
      }
    }

    fetchData();
  }, [isMountedRef, currentUser.prifinaID]);

  /*
  useEffect(() => {
    userMenu.show({
      initials: "TA",
      effect: { hover: { width: 42 } },
      notifications: 0,
      RecentApps: [],
    });
    //console.log(RecentApps);
  }, []);
  */
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
    if (installedApps.length > 0) {
      const appImports = installedApps.map(app => {
        return import(`../components/${app}Icon`);
      });

      Promise.all(appImports).then(components => {
        console.log("COMPONENT ", components);
        const appComponents = components.map((Component, i) => {
          console.log("COMPONENT NAME ", Component.default.displayName);
          return {
            component: (
              <div key={"app-" + i}>
                <Component.default />
              </div>
            ),
            name: Component.default.displayName,
          };
        });
        //console.log(appComponents);
        console.log("IMPORT APP ICONS...", appComponents);
        setState({ loadingStatus: false, appIcons: appComponents });
      });
    }
    // Spread operator, wrapper function (recommended)
    // setSearches(searches => [...searches, query])
    // Using .concat(), wrapper function (recommended)
    // setSearches(searches => searches.concat(query))
  }, [installedApps]);

  const { loadingStatus, appIcons } = state;
  console.log("APP ICONS ", appIcons, appIcons.length * 100);
  // window.innerHeight-130  (130 is from top)
  const iconCols = Math.ceil(
    (appIcons.length * 115) / (window.innerHeight - 130),
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
  console.log("CHECK ", appIcons.length > 0, installedAppIcons.length === 0);
  if (isNaN(maxColHeight)) maxColHeight = appIcons.length;
  if (appIcons.length > 0 && installedAppIcons.length === 0) {
    //console.log("UPDATE THIS ", appIcons);
    setInstalledAppIcons(array_chunks(appIcons, maxColHeight - 1));
    //console.log(installedAppIcons);
  }
  if (installedAppIcons.length > 0) {
    installedAppIcons.map((v, i) => {
      console.log(v, i);
    });
  }
  console.log("APPS ", prifinaApps.current);
  const { opacity } = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 3000 },
  });
  // opacity.interpolate(o => (o > 0.7 ? 1 : o)),
  //visibility: props.opacity.interpolate(o => o === 0 ? 'hidden' : 'visible')
  // <a.div class="c front" style={{ opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`) }} />
  //style={{ opacity: opacity.interpolate(o => (o > 0.5 ? 1 : o)) }}
  return (
    <React.Fragment>
      <StyledBox>
        <PrifinaLogo />
        <StyledBackground>
          {loadingStatus && <div>This may require loading indicator...</div>}
          {!loadingStatus && (
            <animated.div
              style={{ opacity: opacity.interpolate(o => (o > 0.6 ? 1 : o)) }}
            >
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
                        //console.log("RENDER ", appIcon);
                        return (
                          <CssCell
                            key={"cell-" + colIndex + "-" + pos}
                            left={installedAppIcons.length - colIndex + 1}
                            top={icons.length - pos}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              console.log(
                                "APP CLICK ",
                                prifinaApps.current[appIcon.name].route,
                              );
                              history.replace(
                                "/" + prifinaApps.current[appIcon.name].route,
                              );
                            }}
                          >
                            {appIcon.component}
                          </CssCell>
                        );
                      });
                    })}
                </CssGrid>
              </Box>
            </animated.div>
          )}
        </StyledBackground>
      </StyledBox>
    </React.Fragment>
  );
};

const Home = props => {
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

        await Auth.signOut({ global: true });
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
      }}
    >
      {logout && (
        <LogoutDialog onClose={onDialogClose} onButtonClick={onDialogClick} />
      )}
      <Content />
    </UserMenuContextProvider>
  );
};

Home.displayName = "Home";

export default Home;
