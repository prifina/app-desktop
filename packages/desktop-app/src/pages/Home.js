/* global localStorage */

import React, { useEffect, useReducer, useState, useRef, createContext, } from "react";

import { CssGrid, CssCell } from "@blend-ui/css-grid";

import { Box, Flex } from "@blend-ui/core";
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
/*
import {
  useIsMountedRef,
  useUserMenu
} from "@prifina-apps/utils";
*/
//import { useHistory } from "react-router-dom";

import { useNavigate } from "react-router-dom";
//import { redirect } from "react-router-dom";


import { StyledBox, StyledBackground } from "../components/DefaultBackground";
import { PrifinaLogo } from "../components/PrifinaLogo";

import shallow from "zustand/shallow";


import { useStore, useGraphQLContext } from "@prifina-apps/utils";


//import { useStore } from "../utils-v2/stores/PrifinaStore";
//import { useGraphQLContext } from "../utils-v2/graphql/GraphQLContext";

//import { useUserMenu } from "../utils-v2/components/FloatingUserMenu-v2";
//import withUsermenu from "../utils-v2/components/UserMenu-v2";
import { useUserMenu, withUsermenu } from "@prifina-apps/ui-lib";

import UserAppIcon from "../components/UserAppIcon";

export const SmartContext = createContext(null);

import SmartBar from "../components/SmartBar";
import PropTypes from "prop-types";

const array_chunks = (array, chunk_size) =>
  Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size));

const Content = ({ installedAppIcons, gridCols, prifinaApps, dataProps, AIQuery, AIDataQuery, googleSearch, UserApiClient }) => {
  const navigate = useNavigate();
  console.log("HOME APPS ", prifinaApps);
  const [containerOpen, setContainerOpen] = useState(0);
  return (
    <StyledBox onClick={(e) => {
      //console.log("HOME CLICK ", e.target)
      const searchBox = document.getElementById('smart-input');

      if (!searchBox.contains(e.target) && e.target !== searchBox) {
        console.log('You clicked outside the box! ', searchBox.scrollHeight);
        if (searchBox.scrollHeight > 33) {
          setContainerOpen(prev => prev + 1);
        } else {
          setContainerOpen(0);
        }

      } else {
        console.log('You clicked inside the box! ', searchBox.scrollHeight);
        /* 
        if (searchBox.scrollHeight > 33) {
          setContainerOpen(true);
        } else {
          setContainerOpen(false);
        }
 */
      }
    }} >
      <Flex>
        <PrifinaLogo pl={10} />
        <SmartContext.Provider
          value={{
            dataProps,
            AIDataQuery,
            AIQuery,
            googleSearch,
            UserApiClient
          }}
        >
          <SmartBar containerStatus={containerOpen} />
        </SmartContext.Provider>
      </Flex>
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
                        //navigate("/" + prifinaApps[appIcon.name].route, { replace: true });
                        navigate("/" + prifinaApps[appIcon.name].route);

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
  prifinaApps: PropTypes.object,
  dataProps: PropTypes.object,
  AIDataQuery: PropTypes.func,
  AIQuery: PropTypes.func,
  googleSearch: PropTypes.func,
  UserApiClient: PropTypes.object

};


const Home = props => {

  // const { userAuth, currentUser } = useAppContext();
  // console.log("HOME ", currentUser);

  const { user, getPrifinaUserQuery, updateUserProfileMutation,
    setAppsyncConfig, listAppMarketQuery, getSystemNotificationCountQuery, updateUserActivityMutation,
    setActiveUser, setPrifinaUser, listSystemNotificationsByDateQuery,
    listDataconnectorsQuery, listDatasourceQuestionsQuery, getAIDataQuery, getAIQuery, googleSearch } = useStore(
      state => ({
        user: state.user,

        getPrifinaUserQuery: state.getPrifinaUserQuery,
        updateUserProfileMutation: state.updateUserProfileMutation,
        setAppsyncConfig: state.setAppsyncConfig,
        listAppMarketQuery: state.listAppMarketQuery,
        getSystemNotificationCountQuery: state.getSystemNotificationCountQuery,
        updateUserActivityMutation: state.updateUserActivityMutation,
        setActiveUser: state.setActiveUser,
        setPrifinaUser: state.setPrifinaUser,
        listSystemNotificationsByDateQuery: state.listSystemNotificationsByDateQuery,
        listDatasourceQuestionsQuery: state.listDatasourceQuestionsQuery,
        listDataconnectorsQuery: state.listDataconnectorsQuery,
        getAIDataQuery: state.getAIDataQuery,
        getAIQuery: state.getAIQuery,
        googleSearch: state.googleSearch,

      }),
      shallow,
    );

  const { CoreApiClient, UserApiClient } = useGraphQLContext();

  const effectCalled = useRef(false);

  //const activeUser = useRef({});
  const prifinaApps = useRef({});
  const dataProps = useRef({});

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
      let userInstalledApps = [];
      if (currentUser?.userInstalledApps !== undefined) {
        userInstalledApps = JSON.parse(currentUser.userInstalledApps);
      }

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

      // Create appsync client 
      setAppsyncConfig({
        aws_appsync_graphqlEndpoint: appProfile.endpoint,
        aws_appsync_region: appProfile.region,
        graphql_endpoint_iam_region: appProfile.region
      })

      const prifinaAppsData2 = await listAppMarketQuery({
        filter: { appType: { eq: 3 } }, // system apps
        limit: 1000  // possibly too big....
      });

      console.log("APPS 2", prifinaAppsData2);
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

      console.log("APP PROFILE ", appProfile);

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
        //effect: { hover: { width: 42 } },
        notifications:
          notificationCountResult.data.getSystemNotificationCount,
        RecentApps: [],
        prifinaID: currentUser.id,
        activeUser: activeUser,
        listSystemNotificationsByDateQuery: listSystemNotificationsByDateQuery,
        coreApiClient: CoreApiClient
      };
      console.log("User menu init ", userMenuInit);
      console.log("User menu init2 ", userMenu);

      userMenu.show(userMenuInit);
      /*
      userMenu.setClientHandler(clientHandler);
      userMenu.setActiveUser(activeUser);
      */

      //const dataConnectors = await listDataconnectorsQuery({ limit: 100 });
      //const dataSourceQuestions = await listDatasourceQuestionsQuery({ owner: currentUser.id, limit: 100 });


      dataProps.current = {
        //dataConnectors: dataConnectors.data.listDataconnectors.items,
        //dataSourceQuestions: dataSourceQuestions.data.listDatasourceQuestions.items,
        prifinaID: currentUser.id

      };

      const updateRes = await updateUserActivityMutation({
        id: currentUser.id,
        activeApp: "Home",
      });
      console.log("READY ", updateRes);
      //setState({ installedApps: installedAppsJSON });

      const appImports = installedAppsJSON.map(app => {
        return import(`../components/${app}Icon`);
      });
      //const AppIcon = ({ title, icon, ...props }) => {
      //const userApps = [{ id: "cw9aphqcofZkv8pCE9nE181", name: "CapyChat" }].map(m => {
      const userApps = userInstalledApps.map(m => {
        return new Promise(function (resolve, reject) {
          // app name should be unique, but use app id instead...
          prifinaApps.current[m.id] = { route: "app/" + m.name }
          resolve(<UserAppIcon title={m.name} app-id={m.id} name={m.name} />)
        });
      })

      Promise.all([appImports, userApps].flat(1)).then(components => {
        //console.log("COMPONENTS ", components);
        const appComponents = components.map((Component, i) => {
          //console.log("COMPONENT ", Component, typeof Component);
          //console.log("COMPONENT ", Component.default);
          // console.log("COMPONENT ", Component);
          if (typeof Component.default !== "undefined") {
            return {
              component: (
                <div key={"app-" + i}>
                  <Component.default />
                </div>
              ),
              name: Component.default.displayName,
            };
          } else {
            //console.log("PROPS ", Component.props)
            return {
              component: Component,
              name: Component.props['app-id']
            }
          }

          //console.log("COMPONENT NAME ", Component.default.displayName);
          /*
          return {
            component: (
              <div key={"app-" + i}>
                <Component.default />
              </div>
            ),
            name: Component.default.displayName,
          };
          */
        });

        console.log("IMPORT APP ICONS...", appComponents);
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
  // console.log("APPS ", prifinaApps.current);

  //console.log("HOME USER CLIENT", UserApiClient);
  return (
    <>
      {!loadingStatus && (
        <Content
          installedAppIcons={installedAppIcons}
          gridCols={gridCols}
          prifinaApps={prifinaApps.current}
          dataProps={dataProps.current}
          AIDataQuery={getAIDataQuery}
          AIQuery={getAIQuery}
          googleSearch={googleSearch}
          UserApiClient={UserApiClient}

        />
      )}
      {loadingStatus && <div />}
    </>
  );
};

Home.displayName = "Home";

export default withUsermenu()(Home);
//export default Home;