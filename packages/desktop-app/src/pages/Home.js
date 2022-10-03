/* global localStorage */

import React, { useEffect, useReducer, useState, useRef } from "react";

import { CssGrid, CssCell } from "@blend-ui/css-grid";

import { Box } from "@blend-ui/core";

import gql from "graphql-tag";

import {
  updateActivity,
  getPrifinaUserQuery,
  updateUserProfileMutation,
  listAppMarketQuery,
  useIsMountedRef,
  useAppContext,
  useUserMenu,
  withUsermenu,
  getSystemNotificationCountQuery,
  createClient,
} from "@prifina-apps/utils";

import { API as GRAPHQL, Auth } from "aws-amplify";
//import { useHistory } from "react-router-dom";

import { useNavigate } from "react-router";
//import { redirect } from "react-router-dom";


import { StyledBox, StyledBackground } from "../components/DefaultBackground";
import { PrifinaLogo } from "../components/PrifinaLogo";

import { useSpring, animated } from "react-spring";

import PropTypes from "prop-types";

const array_chunks = (array, chunk_size) =>
  Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size));

const Content = ({ clientHandler, currentUser, activeUser }) => {
  //const history = useHistory();
  const navigate = useNavigate();
  const userMenu = useUserMenu();

  console.log("CURRENT USER ", currentUser);

  const isMountedRef = useIsMountedRef();
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { appIcons: [], loadingStatus: true },
  );

  const prifinaApps = useRef({});
  const [installedAppIcons, setInstalledAppIcons] = useState([]);
  const [installedApps, setInstalledApps] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (isMountedRef.current) {
        const prifinaAppsData2 = await listAppMarketQuery(GRAPHQL, {
          filter: { appType: { gt: 1 } }, // apps+core apps
        });

        console.log("APPS 2", prifinaAppsData2);
        let prifinaAppsJSON = {};
        prifinaAppsData2.data.listAppMarket.items.forEach(item => {
          prifinaAppsJSON[item.id] = item;
          if (item.appType === 3) {
            prifinaAppsJSON[item.id].route = "system/" + item.route;
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

        const notificationCountResult = await getSystemNotificationCountQuery(
          GRAPHQL,
          {
            filter: {
              owner: { eq: currentUser.id },
              status: { eq: 0 },
            },
          },
        );

        console.log("COUNT ", notificationCountResult);

        userMenu.show({
          initials: initials,
          //effect: { hover: { width: 42 } },
          notifications:
            notificationCountResult.data.getSystemNotificationCount,
          RecentApps: [],

          PrifinaGraphQLHandler: GRAPHQL,
          prifinaID: activeUser.uuid,
        });

        userMenu.setClientHandler(clientHandler);
        userMenu.setActiveUser(activeUser);

        console.log("USER APPSYNC ", clientHandler);
        const updateRes = await clientHandler.mutate({
          mutation: gql(updateActivity),
          variables: {
            id: currentUser.id,
            activeApp: "Home",
          },
        });

        console.log("READY ", updateRes);
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

        console.log("IMPORT APP ICONS...", appComponents);
        setState({ loadingStatus: false, appIcons: appComponents });
      });
    }
  }, [installedApps]);

  const { loadingStatus, appIcons } = state;
  console.log("APP ICONS ", appIcons, appIcons.length * 100);

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
    setInstalledAppIcons(array_chunks(appIcons, maxColHeight - 1));
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

  const copyInstance = obj => {
    let copy = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    return copy;
  };

  return (
    <React.Fragment>

      <StyledBox>
        <PrifinaLogo />
        <StyledBackground id="home-styledBackground">
          {loadingStatus && <div />}
          {!loadingStatus && (
            <animated.div
              style={{ opacity: opacity.to(o => (o > 0.6 ? 1 : o)) }}
            >
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
                                prifinaApps.current[appIcon.name].route,
                              );
                              navigate("/" + prifinaApps.current[appIcon.name].route, { replace: true });
                              //return redirect("/" + prifinaApps.current[appIcon.name].route);
                              //window.location.replace("/" + prifinaApps.current[appIcon.name].route);
                              //window.location.href = "/" + prifinaApps.current[appIcon.name].route;
                              //window.location.href = "/logout";
                              /*
                              history.push(
                                "/" + prifinaApps.current[appIcon.name].route,
                              );
                              */
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
  clientHandler: PropTypes.instanceOf(Object),
  currentUser: PropTypes.instanceOf(Object),
  activeUser: PropTypes.instanceOf(Object),
};

const Home = props => {

  const { userAuth, currentUser } = useAppContext();
  console.log("HOME ", currentUser);
  const clientHandler = useRef(null);
  const userData = useRef(null);

  const [initClient, setInitClient] = useState(false);
  const activeUser = useRef({});

  const createClientx = async (endpoint, region) => {
    console.log("CLIENT ", endpoint, region);

    const _currentSession = await Auth.currentSession();
    const token = _currentSession.getIdToken().payload;
    const userIdPool = localStorage.getItem("LastSessionIdentityPool");

    const provider = token["iss"].replace("https://", "");
    let identityParams = {
      IdentityPoolId: userIdPool,
      Logins: {},
    };
    const idToken = _currentSession.getIdToken().getJwtToken();
    identityParams.Logins[provider] = idToken;
    const cognitoClient = new CognitoIdentityClient({
      region: userIdPool.split(":")[0],
    });

    const cognitoIdentity = await cognitoClient.send(
      new GetIdCommand(identityParams),
    );

    let credentialParams = {
      IdentityId: cognitoIdentity.IdentityId,
      Logins: {},
    };

    credentialParams.Logins[provider] = idToken;

    const cognitoIdentityCredentials = await cognitoClient.send(
      new GetCredentialsForIdentityCommand(credentialParams),
    );
    console.log("COGNITO IDENTITY CREDS ", cognitoIdentityCredentials);
    const clientCredentials = {
      identityId: cognitoIdentity.IdentityId,
      accessKeyId: cognitoIdentityCredentials.Credentials.AccessKeyId,
      secretAccessKey: cognitoIdentityCredentials.Credentials.SecretKey,
      sessionToken: cognitoIdentityCredentials.Credentials.SessionToken,
      expiration: cognitoIdentityCredentials.Credentials.Expiration,
      authenticated: true,
    };

    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: clientCredentials,
      },
      disableOffline: true,
    });
    return Promise.resolve(client);
  };

  useEffect(() => {

    async function init() {
      if (Object.keys(currentUser).length > 0) {
        const currentPrifinaUser = await getPrifinaUserQuery(
          GRAPHQL,
          currentUser.prifinaID,
        );

        let appProfile = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.appProfile,
        );

        let clientEndpoint = "";
        let clientRegion = "";

        if (!appProfile.hasOwnProperty("endpoint")) {
          const defaultProfileUpdate = await updateUserProfileMutation(
            GRAPHQL,
            currentUser.prifinaID,
          );
          console.log("PROFILE UPDATE ", defaultProfileUpdate);
          appProfile = JSON.parse(
            defaultProfileUpdate.data.updateUserProfile.appProfile,
          );
        }
        clientEndpoint = appProfile.endpoint;
        clientRegion = appProfile.region;

        const _currentSession = await Auth.currentSession();

        const client = await createClient(
          clientEndpoint,
          clientRegion,
          _currentSession,
        );

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
    }
    init();

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
