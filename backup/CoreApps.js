/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React, { useRef, useState, useEffect, useCallback } from "react";
import { PrifinaProvider, PrifinaContext } from "@prifina/hooks";

import i18n from "../lib/i18n";

import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";
import { getPrifinaWidgetsQuery, getPrifinaUserQuery } from "../graphql/api";

import {
  createNotification,
  updateActivity,
  addNotification,
} from "../graphql/mutations";

import { newNotification } from "../graphql/subscriptions";

import {
  listNotifications,
  getNotificationCount,
  getAddressBook,
} from "../graphql/queries";

import gql from "graphql-tag";

import config from "../config";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";
import { useLocation, useHistory } from "react-router-dom";
/*
import {
  UserMenuContextProvider,
  useUserMenu,
} from "@blend-ui/floating-user-menu";
*/

import UserMenuContextProvider, { useUserMenu } from "./FloatingUserMenu";

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

const Content = ({
  Component,
  initials,
  notificationCount,
  updateNotificationHandler,
  ...props
}) => {
  const userMenu = useUserMenu();
  console.log("USERMENU CORE APP INIT  ", props, initials, notificationCount);
  useEffect(() => {
    userMenu.show({
      initials: initials,
      effect: { hover: { width: 42 } },
      notifications: notificationCount,
      RecentApps: [],
    });
    //console.log(RecentApps);
  }, []);

  updateNotificationHandler(userMenu.onUpdate);
  return <Component {...props} />;
};

Content.propTypes = {
  Component: PropTypes.elementType.isRequired,
  initials: PropTypes.string,
  notificationCount: PropTypes.number,
  updateNotificationHandler: PropTypes.func,
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
  const addressBook = useRef({});
  const lastActivity = useRef(new Date().getTime());
  const notificationCount = useRef(0);
  const notificationHandler = useRef(null);
  const subscriptionHandler = useRef(null);
  const clientHandler = useRef(null);
  const [settingsReady, setSettingsReady] = useState(false);

  Auth.configure(AUTHConfig);
  Amplify.configure(APIConfig);
  //Amplify.configure(S3Config);
  console.log("AUTH CONFIG ", AUTHConfig);

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

  const subscribeNotification = (userClient, variables) => {
    return userClient
      .subscribe({ query: gql(newNotification), variables: variables })
      .subscribe({
        next: res => {
          console.log("NOTIFICATION SUBS RESULTS ", res);
          if (res.data.newNotification.owner !== "") {
            notificationHandler.current(1);
          }
          /*
        {
          "data": {
            "newNotification": {
              "notificationId": "0e136c0f-6975-4f22-a68c-d1a171d4e7ce",
              "owner": "0cc3bc47d8a60c8a0f6f35a9134c689e0a8c"
            }
          }
        }
        */
        },
        error: error => {
          console.warn(error);
        },
      });
  };

  /*
  // get user auth...
  */
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

      const currentPrifinaUser = await getPrifinaUserQuery(GRAPHQL, prifinaID);

      console.log("CURRENT USER ", currentPrifinaUser);

      // should get this from user ....
      /*
      const client = createClient(
        APIConfig.aws_appsync_graphqlEndpoint,
        APIConfig.aws_appsync_region,
      );
*/
      let clientEndpoint =
        "https://kxsr2w4zxbb5vi5p7nbeyfzuee.appsync-api.us-east-1.amazonaws.com/graphql";
      let clientRegion = "us-east-1";
      if (
        currentPrifinaUser.data.getPrifinaUser.hasOwnProperty("userAPI") &&
        currentPrifinaUser.data.getPrifinaUser.userAPI !== null
      ) {
        const userAPI = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.userAPI,
        );
        clientEndpoint = userAPI.endpoint;
        clientRegion = userAPI.region;
      }

      const client = createClient(clientEndpoint, clientRegion);
      const appProfile = JSON.parse(
        currentPrifinaUser.data.getPrifinaUser.appProfile,
      );
      console.log("CURRENT USER ", appProfile, appProfile.initials);

      const initials = appProfile.inititals;
      activeUser.current = {
        name: appProfile.name,
        uuid: prifinaID,
        endpoint: appProfile.endpoint,
        region: appProfile.region,
      };

      const addressBookResult = await client.query({
        query: gql(getAddressBook),
        variables: {
          id: prifinaID,
        },
      });
      //console.log(addressBookResult);

      if (
        addressBookResult.data.getUserAddressBook.hasOwnProperty("addressBook")
      ) {
        JSON.parse(
          addressBookResult.data.getUserAddressBook.addressBook,
        ).forEach(user => {
          addressBook.current[user.uuid] = {
            name: user.name,
            endpoint: user.endpoint,
            region: user.region,
          };
        });
      }

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

        console.log("ADDRESS BOOK ", addressBook.current);

        console.log("CURRENT SETTINGS 2", data, appProfile, client);
        componentProps.current.appSyncClient = client;
        componentProps.current.widgetConfigData = data;
        componentProps.current.prifinaID = prifinaID;
        componentProps.current.initials = appProfile.initials;
      }

      /*
query MyQuery2 {
  getNotificationCount(filter: {owner: {eq: "0cc3bc47d8a60c8a0f6f35a9134c689e0a8c"}})
}
*/

      // notificationCount...
      const notificationCountResult = await client.query({
        query: gql(getNotificationCount),
        variables: {
          filter: {
            owner: { eq: prifinaID },
            status: { eq: 0 },
          },
        },
      });
      console.log("COUNT ", notificationCountResult);
      notificationCount.current =
        notificationCountResult.data.getNotificationCount;

      componentProps.current.notificationCount = notificationCount.current;

      lastActivity.current = new Date().getTime();
      await client.mutate({
        mutation: gql(updateActivity),
        variables: {
          id: prifinaID,
          activeApp: coreApp,
        },
      });
      subscriptionHandler.current = subscribeNotification(client, {
        owner: prifinaID,
      });

      clientHandler.current = client;

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

    return () => {
      // unsubscribe...
      subscriptionHandler.unsubscribe();
    };
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

        // await Auth.signOut({ global: true });
        await Auth.signOut();
        userAuth(false);
        history.replace("/");
      } catch (e) {
        console.log("error signing out: ", e);
      }
    }
    e.preventDefault();
  };
  const remoteUser = opts => {
    console.log("REMOTE USER ", opts);
    console.log("ADDRESS BOOK ", addressBook.current);
    const msg = opts.createMessage;
    const receiver = msg.receiver;

    const { endpoint, region } = addressBook.current[receiver];
    const remoteClient = createClient(endpoint, region);
    console.log(remoteClient);
    return remoteClient.mutate({
      mutation: gql(addNotification),
      variables: {
        input: {
          body: msg.body,
          owner: receiver,
          type: "MESSAGING",
          sender: msg.sender,
          app: coreApp,
        },
      },
    });
  };
  const remoteClient = (endpoint, region) => {
    return createClient(endpoint, region);
  };

  /*

    (async () => {
      subscription = client.subscribe({ query: gql(onCreateTodo) }).subscribe({
        next: data => {
          console.log(data.data.onCreateTodo);
        },
        error: error => {
          console.warn(error);
        }
      });
    })();

  const addSubscription = (
    appID,
    fnName,
    subscription,
    onUpdateID,
    variables
  ) => {
    //setAppSubscriptions({ ...appSubscriptions, [appID]: { [fnName]: fnSub } });
    console.log("SUBS ", appID);
    console.log("SUBS ", fnName);
    console.log("SUBS ", gql(subscription));
    console.log("SUBS ", onUpdateID);
    console.log("SUBS ", variables);
    return new Promise(function (resolve, reject) {
      const subHandler = CLIENT.current.user
        .subscribe({
          query: gql(subscription),
          variables: variables,
        })
        .subscribe({
          next: (data) => {
            console.log("SUB DATA ", data);
            //callbacks.current[appID][0](data[r]);
            const appIndex = providerContext.current.init.apps[appID];
            let callBackIndex = 0;
            if (appIndex.length > 1) {
              callBackIndex = appIndex.findIndex((id) => {
                return id === onUpdateID;
              });
            }
            callbacks.current[appID][callBackIndex](data);
            //data.data.addMessage...
          },
          error: (err) => {
            console.log("SUB ERROR ", err);
            const appIndex = providerContext.current.init.apps[appID];
            let callBackIndex = 0;
            if (appIndex.length > 1) {
              callBackIndex = appIndex.findIndex((id) => {
                return id === onUpdateID;
              });
            }
            callbacks.current[appID][callBackIndex]({ error: err });
          },
        });

      if (appSubscriptions.current.hasOwnProperty(appID)) {
        appSubscriptions.current[appID].push(subHandler);
      } else {
        appSubscriptions.current[appID] = [subHandler];
      }
      resolve(true);
    });
  
  };
*/
  const onHomeClick = () => {
    history.replace("/");
  };
  const logOut = () => {
    //console.log("LOGOUT...");
    setLogout(true);
  };

  const updateNotification = useCallback(handler => {
    notificationHandler.current = handler;
  }, []);
  console.log("ACTIVE USER ", activeUser.current);
  return (
    <>
      {appReady && coreApp === "DisplayApp" && (
        <PrifinaProvider
          stage={"alpha"}
          Context={PrifinaContext}
          activeUser={activeUser.current}
          activeApp={coreApp}
          remoteUser={remoteUser}
          remoteClient={remoteClient}
        >
          <UserMenuContextProvider
            onExit={logOut}
            onHome={onHomeClick}
            clientHandler={clientHandler.current}
            activeUser={activeUser.current}
          >
            {logout && (
              <LogoutDialog
                onClose={onDialogClose}
                onButtonClick={onDialogClick}
              />
            )}
            <React.Suspense fallback={"Loading ..."}>
              <Content
                Component={AppComponent}
                {...componentProps.current}
                updateNotificationHandler={updateNotification}
              />
            </React.Suspense>
          </UserMenuContextProvider>
        </PrifinaProvider>
      )}
      {appReady && coreApp !== "DisplayApp" && (
        <UserMenuContextProvider
          onExit={logOut}
          onHome={onHomeClick}
          clientHandler={clientHandler.current}
          activeUser={activeUser.current}
        >
          {logout && (
            <LogoutDialog
              onClose={onDialogClose}
              onButtonClick={onDialogClick}
            />
          )}
          <React.Suspense fallback={"Loading ..."}>
            <Content
              Component={AppComponent}
              {...componentProps.current}
              updateNotificationHandler={updateNotification}
            />
          </React.Suspense>
        </UserMenuContextProvider>
      )}
      {!appReady && <div />}
    </>
  );
};

CoreApps.propTypes = {
  app: PropTypes.string,
};
