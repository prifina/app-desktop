/* global localStorage */

import React, { useEffect, useReducer, useState, useRef } from "react";

import { CssGrid, CssCell } from "@blend-ui/css-grid";

import { Box } from "@blend-ui/core";
/*
import gql from "graphql-tag";

import {
  updateActivity,
  getPrifinaUserQuery,
  updateUserProfileMutation,
  listAppMarketQuery,
  getSystemNotificationCountQuery,

  useIsMountedRef,
  useAppContext,
  useUserMenu,
  withUsermenu,
  
  createClient,
} from "@prifina-apps/utils";

import { API as GRAPHQL, Auth } from "aws-amplify";
*/

import {
  useIsMountedRef,
  useUserMenu
} from "@prifina-apps/utils";
//import { useHistory } from "react-router-dom";

import { useNavigate } from "react-router";
//import { redirect } from "react-router-dom";


import { StyledBox, StyledBackground } from "../components/DefaultBackground";
import { PrifinaLogo } from "../components/PrifinaLogo";

import shallow from "zustand/shallow";

import { useStore } from "../utils-v2/stores/PrifinaStore";

import PropTypes from "prop-types";
import { prifinaApps } from "@prifina-apps/utils/src/lib/mocks/coreModels";

const array_chunks = (array, chunk_size) =>
  Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size));

const Content = ({ installedAppIcons, gridCols, prifinaApps }) => {
  const navigate = useNavigate();

  return (
    <StyledBox>
      <PrifinaLogo />
      <StyledBackground id="home-styledBackground">

        <Box m={8} mt={77} style={{ zIndex: 3 }}>
          <CssGrid id="home-appsGrid" columns={gridCols} flow="column">
            {installedAppIcons.length > 0 &&
              installedAppIcons.map((icons, colIndex) => {
                return icons.map((appIcon, pos) => {
                  return (
                    <CssCell
                      id="home-appCell"
                      key={"cell-" + colIndex + "-" + pos}
                      left={installedAppIcons.length - colIndex + 1}
                      top={icons.length - pos}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        console.log(
                          "APP CLICK ",
                          prifinaApps[appIcon.name].route,
                        );
                        navigate("/" + prifinaApps[appIcon.name].route, { replace: true });

                      }}
                    >
                      {appIcon.component}
                    </CssCell>
                  );
                });
              })}
          </CssGrid>
        </Box>
      </StyledBackground>
    </StyledBox>
  );
};

Content.propTypes = {
  installedAppIcons: PropTypes.array,
  gridCols: PropTypes.string,
  prifinaApps: PropTypes.object
};

const Home = props => {

  // const { userAuth, currentUser } = useAppContext();
  // console.log("HOME ", currentUser);

  const { user, getPrifinaUserQuery, updateUserProfileMutation,
    setAppsyncConfig, listAppMarketQuery, getSystemNotificationCountQuery, updateUserActivityMutation,
    setActiveUser, setPrifinaUser } = useStore(
      state => ({
        user: state.user,

        getPrifinaUserQuery: state.getPrifinaUserQuery,
        updateUserProfileMutation: state.updateUserProfileMutation,
        setAppsyncConfig: state.setAppsyncConfig,
        listAppMarketQuery: state.listAppMarketQuery,
        getSystemNotificationCountQuery: state.getSystemNotificationCountQuery,
        updateUserActivityMutation: state.updateUserActivityMutation,
        setActiveUser: state.setActiveUser,
        setPrifinaUser: state.setPrifinaUser
      }),
      shallow,
    );

  const effectCalled = useRef(false);

  //const activeUser = useRef({});
  const prifinaApps = useRef({});

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { appIcons: [], loadingStatus: true },
  );

  const [installedAppIcons, setInstalledAppIcons] = useState([]);
  const userMenu = useUserMenu();

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

  useEffect(() => {
    async function init() {
      effectCalled.current = true;
      const currentPrifinaUser = await getPrifinaUserQuery(user.prifinaID);
      console.log("USER ", currentPrifinaUser);
      const currentUser = currentPrifinaUser.data.getPrifinaUser;
      let appProfile = JSON.parse(
        currentUser.appProfile,
      );


      let clientEndpoint = "";
      let clientRegion = "";
      /*   updateUserProfileMutation has problems... 
      if (!appProfile.hasOwnProperty("endpoint")) {
        const defaultProfileUpdate = await updateUserProfileMutation(user.prifinaID);
        console.log("PROFILE UPDATE ", defaultProfileUpdate);
        appProfile = JSON.parse(
          defaultProfileUpdate.data.updateUserProfile.appProfile,
        );
      }
      */

      const activeUser = {
        name: appProfile.name,
        initials: appProfile.initials,
        uuid: currentUser.id,
        endpoint: appProfile.endpoint,
        region: appProfile.region,
        dataSources: currentUser.dataSources
          ? JSON.parse(currentUser.dataSources)
          : {},
      };
      setActiveUser(activeUser);
      setPrifinaUser(currentUser);

      setAppsyncConfig({
        aws_appsync_graphqlEndpoint: appProfile.endpoint,
        aws_appsync_region: appProfile.region
      })

      const prifinaAppsData2 = await listAppMarketQuery({
        filter: { appType: { eq: 3 } }, // system apps
      });

      //console.log("APPS 2", prifinaAppsData2);
      let prifinaAppsJSON = {};
      prifinaAppsData2.data.listAppMarket.items.forEach(item => {
        prifinaAppsJSON[item.id] = item;
        if (item.appType === 3) {
          prifinaAppsJSON[item.id].route = "system/" + item.route;
        }
      });

      const installedAppsJSON = JSON.parse(currentUser.installedApps);
      installedAppsJSON.forEach(app => {
        prifinaApps.current[app] = prifinaAppsJSON[app];
      });

      const initials = appProfile.initials;

      //console.log("APP PROFILE ", appProfile);

      //console.log(prifinaApps);

      const notificationCountResult = await getSystemNotificationCountQuery(
        {
          filter: {
            owner: { eq: currentUser.id },
            status: { eq: 0 },
          },
        },
      );

      //console.log("COUNT ", notificationCountResult);
      const userMenuInit = {
        initials: initials,
        //effect: { hover: { width: 42 } },
        notifications:
          notificationCountResult.data.getSystemNotificationCount,
        RecentApps: [],
        prifinaID: currentUser.id
      };
      console.log("User menu init ", userMenuInit);
      /*
      userMenu.show(userMenuInit);

      userMenu.setClientHandler(clientHandler);
      userMenu.setActiveUser(activeUser);
      */
      const updateRes = await updateUserActivityMutation({
        id: currentUser.id,
        activeApp: "Home",
      });
      console.log("READY ", updateRes);
      //setState({ installedApps: installedAppsJSON });

      const appImports = installedAppsJSON.map(app => {
        return import(`../components/${app}Icon`);
      });

      Promise.all(appImports).then(components => {
        //console.log("COMPONENT ", components);
        const appComponents = components.map((Component, i) => {
          //console.log("COMPONENT NAME ", Component.default.displayName);
          return {
            component: (
              <div key={"app-" + i}>
                <Component.default />
              </div>
            ),
            name: Component.default.displayName,
          };
        });

        //console.log("IMPORT APP ICONS...", appComponents);
        setState({ loadingStatus: false, appIcons: appComponents });
      });

      //setInstalledApps(installedAppsJSON);


      //setInitClient(true);
    }
    if (!effectCalled.current) {
      init();
    }

  }, [user]);

  const { loadingStatus, appIcons } = state;
  console.log("APP ICONS ", appIcons, appIcons.length * 100);

  const iconCols = Math.ceil(
    (appIcons.length * 115) / (window.innerHeight - 130),
  );

  let gridCols = "1fr";
  if (iconCols > 0) {
    gridCols += " 80px".repeat(iconCols);
  }

  // console.log(iconCols, gridCols, appIcons.length);

  let maxColHeight = Array(appIcons.length)
    .fill(0)
    .map((v, i) => {
      return i + 1;
    })
    .filter((v, i) => {
      //console.log(v, i, v * 115);
      return v * 115 > window.innerHeight - 130;
    })[0];
  //console.log("maxColHeight... ", maxColHeight - 1);
  //console.log("CHECK ", appIcons.length > 0, installedAppIcons.length === 0);
  if (isNaN(maxColHeight)) maxColHeight = appIcons.length;
  if (appIcons.length > 0 && installedAppIcons.length === 0) {
    setInstalledAppIcons(array_chunks(appIcons, maxColHeight - 1));
  }
  /*
  if (installedAppIcons.length > 0) {
    installedAppIcons.map((v, i) => {
      console.log(v, i);
    });
  }
  */
  console.log("APPS ", prifinaApps.current);
  return (
    <>
      {!loadingStatus && (
        <Content
          installedAppIcons={installedAppIcons}
          gridCols={gridCols}
          prifinaApps={prifinaApps.current}
        />
      )}
      {loadingStatus && <div />}
    </>
  );
};

Home.displayName = "Home";

//export default withUsermenu()(Home);
export default Home;