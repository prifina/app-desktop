/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
/* global localStorage */

import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
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
//import { useUserMenu } from "../components/FloatingUserMenu";

//import { Background } from "../assets/background-image";
//import Background from "../assets/background.png";
//import styled from "styled-components";
//import InstalledApps from "../components/InstalledApps";
//import { ReactComponent as SettingsIcon } from "../assets/settings.svg";
//import AppIcon from "../components/AppIcon";
//import ImportComponent from "../components/ImportComponent";
//import { useIsMountedRef } from "../lib/componentUtils";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

//import AWSAppSyncClient, { createAppSyncLink } from "aws-appsync";
//import { setContext } from "apollo-link-context";
//import { ApolloLink } from "apollo-link";
//import { createHttpLink } from "apollo-link-http";

import gql from "graphql-tag";
/*
import { getNotificationCount } from "../graphql/queries";

import { updateActivity } from "../graphql/mutations";

import { newNotification } from "../graphql/subscriptions";

import {
  getInstalledAppsQuery,
  getPrifinaUserQuery,
  updateUserProfileMutation,
  listAppMarketQuery,
} from "../graphql/api";
*/
import {
  getNotificationCount,
  updateActivity,
  newNotification,
  getInstalledAppsQuery,
  getPrifinaUserQuery,
  updateUserProfileMutation,
  listAppMarketQuery,
  useIsMountedRef,
  useAppContext,
  useUserMenu,
  withUsermenu,
} from "@prifina-apps/utils";

//import { useAppContext } from "../lib/contextLib";
import Amplify, { API, Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";

import { StyledBox, StyledBackground } from "../components/DefaultBackground";
import { PrifinaLogo } from "../components/PrifinaLogo";

import { useSpring, animated } from "react-spring";

//import withUsermenu from "../components/UserMenu";

import PropTypes from "prop-types";

const newWaiting = `subscription addWaiting($key:String!) {
  Waiting(key: $key) {
    createdAt
    endpoint
    name
    senderKey
  }
}`;

/*
// HACK since this PR {@link https://github.com/awslabs/aws-mobile-appsync-sdk-js/pull/633/files} has not been accepted
// after several months, we go ahead and modify the method to drop the graphql_headers that are causing subscription problems.
const {
  AppSyncRealTimeSubscriptionHandshakeLink,
} = require("aws-appsync/node_modules/aws-appsync-subscription-link/lib/realtime-subscription-handshake-link");
const oldStartSubscription =
  AppSyncRealTimeSubscriptionHandshakeLink.prototype
    ._startSubscriptionWithAWSAppSyncRealTime;
AppSyncRealTimeSubscriptionHandshakeLink.prototype._startSubscriptionWithAWSAppSyncRealTime = function (
  a,
) {
  if (a.options) {
    delete a.options.graphql_headers;
  }
  return oldStartSubscription.call(this, a);
};
*/
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
    console.log("SUBS NOTIFICATIONS:..", variables);
    /*
    return userClient.hydrated().then(function (client) {
      //Now subscribe to results
      const observable = client.subscribe({
        query: gql(newNotification),
        variables: variables,
      });
      console.log("OBS ", observable);

      const realtimeResults = function realtimeResults(data) {
        console.log("realtime data: ", data);
      };

      observable.subscribe({
        next: realtimeResults,
        complete: console.log,
        error: console.log,
      });
    });
    */

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
  /*
  useLayoutEffect(async () => {
    console.log("SUBS NOTIFICATIONS:..", currentUser);

    subscriptionHandler.current = await subscribeNotification(clientHandler, {
      owner: currentUser.id,
    });
  }, [currentUser.id]);
*/
  useEffect(() => {
    async function fetchData() {
      if (isMountedRef.current) {
        //const prifinaAppsData = await getPrifinaAppsQuery(API, "APPS");
        //console.log("APPS 1", prifinaAppsData);
        /*
        const prifinaAppsJSON = JSON.parse(
          prifinaAppsData.data.getPrifinaApp.apps,
        );
        */
        const prifinaAppsData2 = await listAppMarketQuery(API, {
          filter: { appType: { gt: 1 } }, // apps+core apps
        });

        console.log("APPS 2", prifinaAppsData2);
        let prifinaAppsJSON = {};
        prifinaAppsData2.data.listAppMarket.items.forEach(item => {
          prifinaAppsJSON[item.id] = item;
          if (item.appType === 3) {
            prifinaAppsJSON[item.id].route = "core/" + item.route;
          }
        });

        console.log(prifinaApps);

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
        /*
        subscriptionHandler.current = subscribeNotification(clientHandler, {
          owner: currentUser.id,
        });
        */

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

    return () => {
      // unsubscribe...
      /*
      if (subscriptionHandler.current) {
        subscriptionHandler.unsubscribe();
      }
      */
    };
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
      {/* 
      <button
        onClick={() => {
          subscriptionHandler.current = subscribeNotification(clientHandler, {
            owner: currentUser.id,
          });
        }}
      >
        SUBS...
      </button>
*/}
      <button
        onClick={() => {
          /*
          export const installWidgetMutation = (API, id, widget) => {
            return API.graphql({
              query: installWidget,
              variables: { id: id, widget: widget },
              authMode: "AMAZON_COGNITO_USER_POOLS",
            });
          };
          {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
          */

          const testClient = new AWSAppSyncClient({
            url:
              "https://reub4v4cszb53criwlma7wm7we.appsync-api.us-east-1.amazonaws.com/graphql",
            region: "us-east-1",
            auth: {
              /*
              type: AUTH_TYPE.AWS_IAM,
              credentials: () => Auth.currentCredentials(),
              */
              type: AUTH_TYPE.API_KEY,
              apiKey: "da2-i7iu4pka5zbbjk4jgmgbagetr4",
            },

            disableOffline: true,
          });

          const subscriptionTest = testClient
            .subscribe({ query: gql(newWaiting), variables: { key: "TEST" } })
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
          console.log("SUBS2....", subscriptionTest);

          /*
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
    */
          /*
          const subscriptionTest = API.graphql({
            authMode: "AWS_IAM",
            query: gql(newWaiting),
            variables: { key: "TEST" },
          }).subscribe({
            next: ({ provider, value }) => console.log({ provider, value }),
            error: error => console.warn(error),
          });
          console.log("SUBS....", subscriptionTest);
          */
          /*
          // Subscribe to creation of Todo
          const subscriptionTest = API.graphql(
            graphqlOperation(newWaiting, { variables: { key: "TEST" } }),
          ).subscribe({
            next: ({ provider, value }) => console.log({ provider, value }),
            error: error => console.warn(error),
          });
*/
          //console.log("CLIENT ", client);
          /*
          //realtime-subscription-handshake-link.js:326 Uncaught (in promise) 
          TypeError: Cannot read properties of undefined (reading 'subscriptionFailedCallback')

          _f = this.subscriptionObserverMap.get(subscriptionId), subscriptionFailedCallback = _f.subscriptionFailedCallback,
           subscriptionReadyCallback = _f.subscriptionReadyCallback;
          // This must be done before sending the message in order to be listening immediately
          this.subscriptionObserverMap.set(subscriptionId, {
              observer: observer,
              subscriptionState: subscriptionState,
              variables: variables,
              query: query,
              subscriptionReadyCallback: subscriptionReadyCallback,
              subscriptionFailedCallback: subscriptionFailedCallback,
              startAckTimeoutId: setTimeout(function () {
                  _this._timeoutStartSubscriptionAck.call(_this, subscriptionId);
              }, START_ACK_TIMEOUT)
          });
*/
        }}
      >
        SUBS...
      </button>

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
  const { APIConfig, userAuth, currentUser } = useAppContext();
  console.log("HOME ", currentUser);
  const clientHandler = useRef(null);
  const userData = useRef(null);

  const [initClient, setInitClient] = useState(false);
  const activeUser = useRef({});
  /*
  const appSyncClient = new AWSAppSyncClient({
    url: config.amplify_config.aws_appsync_graphqlEndpoint,
    request: async (operation) => {
      const user = await Auth.currentUserInfo();
      logger.debug("AWSAppSyncClient request:", user);
      operation.setContext({
        headers: {
          'amt-custom-username': user.username
        }
      });
    },
    region: config.amplify_config.aws_appsync_region,
    auth: {
      type: AUTH_TYPE.AWS_IAM,
      credentials: () => Auth.currentCredentials(),
    },
  });
*/
  const createClient = (endpoint, region) => {
    Auth.currentCredentials().then(c => {
      console.log("HOME USER CLIENT ", c);
    });

    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },

      disableOffline: true,
    });
    /*
    const AppSyncConfig = {
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },

      disableOffline: true,
    };
    const client = new AWSAppSyncClient(AppSyncConfig, {
      link: new createAppSyncLink({
        ...AppSyncConfig,
        resultsFetcherLink: ApolloLink.from([
          setContext((request, previousContext) => {
            console.log("APOLLO ", previousContext, request);
            return {
              headers: {
                ...previousContext.headers,
                "x-tro-organization": "TESTING-HEADER",
              },
            };
          }),
          createHttpLink({
            uri: AppSyncConfig.url,
          }),
        ]),
      }),
    });

    console.log("USER CLIENT ", client);
    */
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
      //const dataConnectors = [];

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
