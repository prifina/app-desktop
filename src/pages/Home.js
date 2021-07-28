/* eslint-disable react/forbid-prop-types */
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
import { useUserMenu } from "../components/FloatingUserMenu";

//import { Background } from "../assets/background-image";
//import Background from "../assets/background.png";
//import styled from "styled-components";
//import InstalledApps from "../components/InstalledApps";
//import { ReactComponent as SettingsIcon } from "../assets/settings.svg";
//import AppIcon from "../components/AppIcon";
//import ImportComponent from "../components/ImportComponent";
import { useIsMountedRef } from "../lib/componentUtils";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

import gql from "graphql-tag";

import { getNotificationCount } from "../graphql/queries";

import { updateActivity } from "../graphql/mutations";

import { newNotification } from "../graphql/subscriptions";
import {
  getInstalledAppsQuery,
  getPrifinaAppsQuery,
  getPrifinaUserQuery,
  updateUserProfileMutation,
} from "../graphql/api";
import { useAppContext } from "../lib/contextLib";
import Amplify, { API, Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";

import { StyledBox, StyledBackground } from "../components/DefaultBackground";
import { PrifinaLogo } from "../components/PrifinaLogo";

import { useSpring, animated } from "react-spring";

import withUsermenu from "../components/UserMenu";

import PropTypes from "prop-types";

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

const Content = ({ clientHandler, currentUser, activeUser }) => {
  const history = useHistory();
  const userMenu = useUserMenu();
  //const theme = useTheme();

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
  const notificationHandler = useRef(null);
  const subscriptionHandler = useRef(null);
  //const activeUser = useRef({});

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

  const subscribeNotification = (userClient, variables) => {
    return userClient
      .subscribe({ query: gql(newNotification), variables: variables })
      .subscribe({
        next: res => {
          console.log("NOTIFICATION SUBS RESULTS ", res);
          if (res.data.newNotification.owner !== "") {
            notificationHandler.current(1);
          }
        },
        error: error => {
          console.warn(error);
        },
      });
  };
  /*
  const updateNotification = useCallback(handler => {
    notificationHandler.current = handler;
  }, []);
*/
  useEffect(() => {
    async function fetchData() {
      if (isMountedRef.current) {
        const prifinaAppsData = await getPrifinaAppsQuery(API, "APPS");
        console.log(prifinaApps);
        const prifinaAppsJSON = JSON.parse(
          prifinaAppsData.data.getPrifinaApp.apps,
        );

        const installedAppsJSON = JSON.parse(currentUser.installedApps);
        installedAppsJSON.forEach(app => {
          prifinaApps.current[app] = prifinaAppsJSON[app];
        });

        const appProfile = JSON.parse(currentUser.appProfile);
        const initials = appProfile.initials;

        console.log("APP PROFILE ", appProfile);
        /*
        activeUser.current = {
          name: appProfile.name,
          uuid: currentUser.id
        };
*/

        const notificationCountResult = await clientHandler.query({
          query: gql(getNotificationCount),
          variables: {
            filter: {
              owner: { eq: currentUser.id },
              status: { eq: 0 },
            },
          },
        });
        console.log("COUNT ", notificationCountResult);

        userMenu.show({
          initials: initials,
          effect: { hover: { width: 42 } },
          notifications: notificationCountResult.data.getNotificationCount,
          RecentApps: [],
        });

        userMenu.setClientHandler(clientHandler);
        userMenu.setActiveUser(activeUser);

        notificationHandler.current = userMenu.onUpdate;

        subscriptionHandler.current = subscribeNotification(clientHandler, {
          owner: currentUser.id,
        });

        await clientHandler.mutate({
          mutation: gql(updateActivity),
          variables: {
            id: currentUser.id,
            activeApp: "Home",
          },
        });
        setInstalledApps(installedAppsJSON);
      }
    }

    fetchData();
  }, [isMountedRef, currentUser.id]);

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
          {loadingStatus && <div />}
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
                              history.push(
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

Content.propTypes = {
  clientHandler: PropTypes.object,
  currentUser: PropTypes.object,
  activeUser: PropTypes.object,
};

const Home = props => {
  const history = useHistory();
  const { userAuth, currentUser } = useAppContext();
  console.log("HOME ", currentUser);
  const clientHandler = useRef(null);
  const userData = useRef(null);

  const [initClient, setInitClient] = useState(false);
  const activeUser = useRef({});
  const createClient = (endpoint, region) => {
    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },

      disableOffline: true,
    });
    return client;
  };

  useEffect(async () => {
    if (Object.keys(currentUser).length > 0) {
      const currentPrifinaUser = await getPrifinaUserQuery(
        API,
        currentUser.prifinaID,
      );

      let appProfile = JSON.parse(
        currentPrifinaUser.data.getPrifinaUser.appProfile,
      );

      let clientEndpoint = "";
      let clientRegion = "";

      /*
      let clientEndpoint =
        "https://kxsr2w4zxbb5vi5p7nbeyfzuee.appsync-api.us-east-1.amazonaws.com/graphql";
      let clientRegion = "us-east-1";
*/
      //updateUserProfile(id: String!, profile: AWSJSON)

      if (!appProfile.hasOwnProperty("endpoint")) {
        const defaultProfileUpdate = await updateUserProfileMutation(
          API,
          currentUser.prifinaID,
        );
        console.log("PROFILE UPDATE ", defaultProfileUpdate);
        appProfile = JSON.parse(
          defaultProfileUpdate.data.updateUserProfile.appProfile,
        );
      }
      clientEndpoint = appProfile.endpoint;
      clientRegion = appProfile.region;

      const client = createClient(clientEndpoint, clientRegion);

      userData.current = currentPrifinaUser.data.getPrifinaUser;

      activeUser.current = {
        name: appProfile.name,
        uuid: currentUser.prifinaID,
        endpoint: clientEndpoint,
        region: clientRegion,
      };

      clientHandler.current = client;
      setInitClient(true);
    }
  }, [currentUser]);

  return (
    <>
      {initClient && (
        <Content
          clientHandler={clientHandler.current}
          currentUser={userData.current}
          activeUser={activeUser.current}
        />
      )}
      {!initClient && <div />}
    </>
  );
};

Home.displayName = "Home";

export default withUsermenu()(Home);
