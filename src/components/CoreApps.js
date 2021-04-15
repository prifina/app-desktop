/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React, { useRef, useState, useEffect } from "react";
import { PrifinaProvider, PrifinaContext } from "@prifina/hooks";

import i18n from "../lib/i18n";

import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";
import { getPrifinaWidgetsQuery, getPrifinaUserQuery } from "../graphql/api";

import config from "../config";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";
import { useLocation, useHistory } from "react-router-dom";
import {
  UserMenuContextProvider,
  useUserMenu,
} from "@blend-ui/floating-user-menu";

import LogoutDialog from "./LogoutDialog";
import { useAppContext } from "../lib/contextLib";

import PropTypes from "prop-types";
//import DisplayApp from "../pages/DisplayApp";

//const DisplayApp = React.lazy(() => import("../pages/DisplayApp"));

i18n.init();

const APIConfig = {
  aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
  aws_appsync_region: config.main_region,
  aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
};

const AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.main_region,
};
/*
const S3Config = {
  AWSS3: {
    bucket: config.S3.bucket, //REQUIRED -  Amazon S3 bucket name
    region: config.S3.region, //OPTIONAL -  Amazon service region
  },
};
*/

const appPaths = { "display-app": "DisplayApp", settings: "Settings" };

const importApp = appName => {
  console.log("APP ", appName);
  return React.lazy(() =>
    import("../pages/" + appName).catch(() => import("./NotFoundPage")),
  );
};

const Content = ({ Component, initials, ...props }) => {
  const userMenu = useUserMenu();
  console.log("INITIALS ", props);
  useEffect(() => {
    userMenu.show({
      initials: initials,
      effect: { hover: { width: 42 } },
      notifications: 0,
      RecentApps: [],
    });
    //console.log(RecentApps);
  }, []);

  return <Component {...props} />;
};

Content.propTypes = {
  Component: PropTypes.elementType.isRequired,
  initials: PropTypes.string,
};
export const CoreApps = props => {
  console.log("CORE COMPONENT --->", props, props.hasOwnProperty("app"));
  const history = useHistory();
  const { userAuth } = useAppContext();
  const { app } = props;
  let coreApp = "";
  if (app) {
    coreApp = app;
  } else {
    const { pathname, search } = useLocation();
    coreApp = appPaths[pathname.split("/").pop()];
  }
  //console.log("CORE ", path.pop());
  //console.log("CORE ", pathname, search);
  //console.log("CORE ", search);
  const AppComponent = importApp(coreApp);

  const [appReady, setAppReady] = useState(false);
  const [logout, setLogout] = useState(false);

  const componentProps = useRef({});
  //const data = useRef([]);
  const activeUser = useRef({});
  const [settingsReady, setSettingsReady] = useState(false);

  Auth.configure(AUTHConfig);
  Amplify.configure(APIConfig);
  //Amplify.configure(S3Config);
  console.log("AUTH CONFIG ", AUTHConfig);

  // get user auth...
  useEffect(async () => {
    try {
      const session = await Auth.currentSession();
      /*
      const user = await Auth.currentAuthenticatedUser();
      console.log("USER ", user);
      if (!user) {
        console.log("NO CURRENT USER FOUND");
      }
      */
      console.log("SESSION ", session);
      if (!session) {
        console.log("NO CURRENT SESSION FOUND");
      }
      console.log("PRIFINA-ID", session.idToken.payload["custom:prifina"]);
      const prifinaID = session.idToken.payload["custom:prifina"];

      const client = new AWSAppSyncClient({
        url: APIConfig.aws_appsync_graphqlEndpoint,
        region: APIConfig.aws_appsync_region,
        auth: {
          type: AUTH_TYPE.AWS_IAM,
          credentials: () => Auth.currentCredentials(),
        },

        disableOffline: true,
      });

      console.log("APP NAME ", coreApp);
      // app component props
      if (coreApp === "DisplayApp") {
        const prifinaWidgets = await getPrifinaWidgetsQuery(GRAPHQL, "WIDGETS");
        console.log(
          "CURRENT CONFIG ",
          JSON.parse(prifinaWidgets.data.getPrifinaApp.widgets),
        );
        const widgetData = JSON.parse(
          prifinaWidgets.data.getPrifinaApp.widgets,
        );

        const currentPrifinaUser = await getPrifinaUserQuery(
          GRAPHQL,
          prifinaID,
        );

        console.log("CURRENT USER ", currentPrifinaUser);
        const appProfile = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.appProfile,
        );
        console.log("CURRENT USER ", appProfile, appProfile.initials);

        const initials = appProfile.inititals;
        activeUser.current = {
          name: appProfile.name,
          uuid: prifinaID,
        };

        const installedWidgets = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.installedWidgets,
        );
        /*
        const data = Object.keys(installedWidgets).map(w => {
          let defaultValues = {};
          if (widgetData[w].settings) {
            widgetData[w].settings.forEach(v => {
              // if type=text...
              defaultValues[v.value] = "";
            });

            if (installedWidgets[w].length > 0) {
              //console.log("SEETINGS FOUND ", w.widget.appID);
              installedWidgets[w].forEach(i => {
                if (defaultValues.hasOwnProperty(i.field)) {
                  defaultValues[i.field] = i.value;
                }
              });
            }
          }
          */
        let widgetCounts = {};
        const data = installedWidgets.map(w => {
          if (widgetCounts.hasOwnProperty(w.name)) {
            widgetCounts[w.name]++;
          } else {
            widgetCounts[w.name] = 0;
          }
          let defaultValues = {};
          if (widgetData[w.name].settings) {
            widgetData[w.name].settings.forEach(v => {
              // if type=text...
              defaultValues[v.value] = "";
            });

            if (w.hasOwnProperty("settings") && w.settings.length > 0) {
              console.log("SETTINGS FOUND ", w);
              w.settings.forEach(k => {
                if (defaultValues.hasOwnProperty(k.field)) {
                  defaultValues[k.field] = k.value;
                }
              });
            }
            /*
              if (installedWidgets[w].length > 0) {
                //console.log("SEETINGS FOUND ", w.widget.appID);
                installedWidgets[w].forEach(i => {
                  if (defaultValues.hasOwnProperty(i.field)) {
                    defaultValues[i.field] = i.value;
                  }
                });
              }
              */
          }

          return {
            url: widgetData[w.name].url,
            settings: widgetData[w.name].settings.length > 0,
            currentSetting: defaultValues,
            widget: {
              settings: widgetData[w.name].settings,
              installCount: widgetCounts[w.name],
              appID: w.name,
              name: widgetData[w.name].name,
              title: widgetData[w.name].title,
            },
          };
          /*
          {
            url: widgetData[w].url,
            settings: widgetData[w].settings.length > 0,
            currentSetting: defaultValues,
            widget: {
              settings: widgetData[w].settings,
              appID: w,
              name: widgetData[w].name,
              title: widgetData[w].title,
            },
          };*/
        });

        console.log("CURRENT SETTINGS 2", data, appProfile);
        componentProps.current.appSyncClient = client;
        componentProps.current.widgetConfigData = data;
        componentProps.current.prifinaID = prifinaID;
        componentProps.current.initials = appProfile.initials;
      }

      //setAppReady(false);
      setSettingsReady(true);
    } catch (e) {
      if (typeof e === "string" && e === "No current user") {
        //const user = await Auth.signIn("tahola", "xxxx");
        //console.log("AUTH ", user);
        //console.log("APP DEBUG ", appCode);
      }

      console.log("AUTH ", e);
    }
  }, []);

  useEffect(() => {
    if (settingsReady) {
      console.log("SETTINGS ", activeUser, componentProps);
      setAppReady(true);
    }
  }, [settingsReady]);
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
  const onHomeClick = () => {
    history.replace("/");
  };
  const logOut = () => {
    //console.log("LOGOUT...");
    setLogout(true);
  };
  console.log("ACTIVE USER ", activeUser.current);
  return (
    <>
      {appReady && (
        <PrifinaProvider
          stage={"alpha"}
          Context={PrifinaContext}
          activeUser={activeUser.current}
        >
          <UserMenuContextProvider onExit={logOut} onHome={onHomeClick}>
            {logout && (
              <LogoutDialog
                onClose={onDialogClose}
                onButtonClick={onDialogClick}
              />
            )}
            <React.Suspense fallback={"Loading ..."}>
              <Content Component={AppComponent} {...componentProps.current} />
            </React.Suspense>
          </UserMenuContextProvider>
        </PrifinaProvider>
      )}
      {!appReady && <div />}
    </>
  );
};

CoreApps.propTypes = {
  app: PropTypes.string,
};
