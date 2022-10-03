import React, { useRef, useState, useEffect } from "react";
import { PrifinaProvider, PrifinaContext } from "@prifina/hooks-v2";

import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";

import {
  getPrifinaUserQuery,
  updateUserProfileMutation,
  listAppMarketQuery,
  listDataSourcesQuery,
  updateActivity,
  addNotification,
  getAddressBook,
  i18n,
  useAppContext,
  useUserMenu,
  withUsermenu,
  getSystemNotificationCountQuery,
  createClient,
} from "@prifina-apps/utils";

import gql from "graphql-tag";

import config from "../config";

import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";

i18n.init();

const appPaths = {
  "display-app": "DisplayApp",
  settings: "Settings",
  "app-market": "AppMarket",
  "app-studio": "DevConsole",
  "data-console": "DataConsole",
  "profile-cards": "ProfileCards",
  "smart-search": "SmartSearch",
};

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
  appSyncClient,
  activeUser,
  ...props
}) => {
  const userMenu = useUserMenu();
  console.log(
    "USERMENU CORE APP INIT  ",
    { ...props },
    initials,
    notificationCount,
  );
  userMenu.setClientHandler(appSyncClient);
  userMenu.setActiveUser(activeUser);
  useEffect(() => {
    userMenu.show({
      initials: initials,
      //effect: { hover: { width: 42 } },
      notifications: notificationCount,
      RecentApps: [],
      PrifinaGraphQLHandler: GRAPHQL,
      prifinaID: activeUser.uuid,
    });
  }, []);

  return <Component appSyncClient={appSyncClient} {...props} />;
};

Content.propTypes = {
  Component: PropTypes.elementType.isRequired,
  initials: PropTypes.string,
  notificationCount: PropTypes.number,
  appSyncClient: PropTypes.instanceOf(Object),
  activeUser: PropTypes.instanceOf(Object),
};
const CoreApps = props => {
  console.log("CORE COMPONENT --->", props, props.hasOwnProperty("app"));

  const { AUTHConfig, APIConfig, userAuth } = useAppContext();
  const { app } = props;
  let coreApp = "";
  if (app) {
    console.log("CORE APP ", app);
    coreApp = app;
  } else {
    const { pathname, search } = useLocation();
    coreApp = appPaths[pathname.split("/").pop()];
    console.log("NO PROPS CORE ", pathname, coreApp);
  }

  const AppComponent = importApp(coreApp);
  const componentProps = useRef({});

  const activeUser = useRef({});
  const addressBook = useRef({});
  const lastActivity = useRef(new Date().getTime());
  const notificationCount = useRef(0);

  const [appReady, setAppReady] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);

  Auth.configure(AUTHConfig);

  console.log("AUTH CONFIG ", AUTHConfig);

  const createClientx = (endpoint, region) => {
    Auth.currentCredentials().then(c => {
      console.log("CORE USER CLIENT ", c);
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
    return client;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const session = await Auth.currentSession();

        console.log("SESSION ", session);
        if (!session) {
          console.log("NO CURRENT SESSION FOUND");
        }
        console.log("PRIFINA-ID", session.idToken.payload["custom:prifina"]);
        const prifinaID = session.idToken.payload["custom:prifina"];

        const currentPrifinaUser = await getPrifinaUserQuery(
          GRAPHQL,
          prifinaID,
        );

        console.log("CURRENT USER ", currentPrifinaUser);
        let appProfile = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.appProfile,
        );
        console.log("CURRENT USER ", appProfile, appProfile.initials);

        // should get this from user ....

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

        activeUser.current = {
          name: appProfile.name,
          uuid: prifinaID,
          endpoint: clientEndpoint,
          region: clientRegion,
          dataSources: currentPrifinaUser.data.getPrifinaUser.dataSources
            ? JSON.parse(currentPrifinaUser.data.getPrifinaUser.dataSources)
            : {},
        };

        console.log("APP NAME ", coreApp);
        console.log("ACTIVE USER ", activeUser.current);
        // app component props
        if (coreApp === "DisplayApp") {
          const addressBookResult = await client.query({
            query: gql(getAddressBook),
            variables: {
              id: prifinaID,
            },
          });

          if (
            addressBookResult.data.getUserAddressBook.hasOwnProperty(
              "addressBook",
            ) &&
            addressBookResult.data.getUserAddressBook.addressBook !== null
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

          const prifinaWidgets = await listAppMarketQuery(GRAPHQL, {
            filter: { appType: { eq: 1 } },
          });

          const prifinaDataSources = await listDataSourcesQuery(GRAPHQL, {});
          console.log("DATA SOURCES ", prifinaDataSources);
          let dataSources = {};
          prifinaDataSources.data.listDataSources.items.forEach(item => {
            dataSources[item.source] = {
              modules: item.modules,
              sourceType: item.sourceType,
            };
          });

          let widgetData = {};
          prifinaWidgets.data.listAppMarket.items.forEach(item => {
            console.log("APPMARKET ITEM ", item);
            const manifest = JSON.parse(item.manifest);
            console.log("APPMARKET MANIFEST ", manifest);
            widgetData[item.id] = {
              settings: item.settings,
              name: item.name,
              title: item.title,
              shortDescription: manifest.shortDescription,
              version: item.version,
              image: manifest.screenshots[0],
              dataSources: item.dataSources || [],
              publisher: manifest.publisher,
              userGenerated: manifest.userGenerated,
              userHeld: manifest.userHeld,
              public: manifest.public,
              category: manifest.category,
              icon: manifest.icon,
            };
          });
          let data = [];
          let viewSettings = [];
          if (currentPrifinaUser.data.getPrifinaUser?.viewSettings) {
            viewSettings = JSON.parse(currentPrifinaUser.data.getPrifinaUser.viewSettings);
          }

          if (viewSettings.length === 0) {
            viewSettings.push({ "widgets": {}, "view": { "title": `${appProfile.name}'s home` } });
          }

          if (
            currentPrifinaUser.data.getPrifinaUser.hasOwnProperty(
              "installedWidgets",
            ) &&
            currentPrifinaUser.data.getPrifinaUser.installedWidgets !== null
          ) {
            const installedWidgets = JSON.parse(
              currentPrifinaUser.data.getPrifinaUser.installedWidgets,
            );

            let widgetCounts = {};


            console.info("INSTALLED WIDGETS ", installedWidgets, widgetData);

            data = installedWidgets.map((w, wi) => {
              if (widgetCounts?.[w.id]) {
                widgetCounts[w.id]++;
              } else {
                widgetCounts[w.id] = 0;
              }
              let defaultValues = {};
              if (widgetData[w.id].settings) {
                widgetData[w.id].settings.forEach(v => {
                  // if type=text...
                  if (v.field === "sizes") {
                    defaultValues["size"] = JSON.parse(v.value)[0].value;
                  } else {
                    defaultValues[v.field] = v.value;
                  }
                });

                if (w.hasOwnProperty("settings") && w.settings.length > 0) {
                  console.log("SETTINGS FOUND ", w);
                  w.settings.forEach(k => {
                    if (defaultValues.hasOwnProperty(k.field)) {
                      defaultValues[k.field] = k.value;
                    }
                  });
                }
              }
              /*
              const remoteUrl = [
                "https:/",
                process.env.REACT_APP_PRIFINA_APPS_BUCKET + ".s3.amazonaws.com",
                w.id,
                widgetData[w.id].version,
                "main.bundle.js",
              ].join("/");
              */
              const remoteUrl = [
                "https:/",
                process.env.REACT_APP_PRIFINA_APPS_BUCKET + ".s3.amazonaws.com",
                w.id,
                widgetData[w.id].version,
                "remoteEntry.js",
              ].join("/");
              //https://prifina-apps-352681697435-eu-west-1.s3.eu-west-1.amazonaws.com/xkn9NGTH6eNyWUbaLxtMe1/0.0.1/remoteEntry.js


              // default view includes all installed widgets, if view is still not created... 
              if (currentPrifinaUser.data.getPrifinaUser.viewSettings === null || currentPrifinaUser.data.getPrifinaUser.viewSettings.length === 0) {
                viewSettings[0].widgets[w.id] = {
                  order: wi,
                  currentSettings: defaultValues,
                  settingsExists: widgetData[w.id].settings.length > 0,
                };
              }


              return {
                url: remoteUrl,
                settings: widgetData[w.id].settings.length > 0,
                currentSettings: defaultValues,
                dataSources: widgetData[w.id].dataSources,
                widget: {
                  settings: widgetData[w.id].settings,
                  installCount: widgetCounts[w.id],
                  appID: w.id,
                  name: widgetData[w.id].name,
                  title: widgetData[w.id].title,
                  shortDescription: widgetData[w.id].shortDescription,
                  version: widgetData[w.id].version,
                  image: [
                    "https:/",
                    process.env.REACT_APP_PRIFINA_APPS_BUCKET +
                    ".s3.amazonaws.com",
                    w.id,
                    widgetData[w.id].image,
                  ].join("/"),
                  publisher: widgetData[w.id].publisher,
                  userGenerated: widgetData[w.id].userGenerated,
                  userHeld: widgetData[w.id].userHeld,
                  public: widgetData[w.id].public,
                  category: widgetData[w.id].category,
                  icon: [
                    "https:/",
                    process.env.REACT_APP_PRIFINA_APPS_BUCKET +
                    ".s3.amazonaws.com",
                    w.id,
                    widgetData[w.id].icon,
                  ].join("/"),
                },
              };
            });
          }
          console.log("ADDRESS BOOK ", addressBook.current);

          console.log("CURRENT SETTINGS 2", data, appProfile, client);
          componentProps.current.appSyncClient = client;
          componentProps.current.widgetConfigData = data;
          componentProps.current.widgetViewSettings = viewSettings;
          componentProps.current.prifinaID = prifinaID;
          componentProps.current.initials = appProfile.initials;
          componentProps.current.dataSources = dataSources;
        } else {
          // default componentProps...
          console.log("CURRENT SETTINGS 2", client);
          componentProps.current.GraphQLClient = GRAPHQL;
          componentProps.current.appSyncClient = client;
          componentProps.current.prifinaID = prifinaID;
          componentProps.current.initials = appProfile.initials;
        }

        // notificationCount...
        const notificationCountResult = await getSystemNotificationCountQuery(
          GRAPHQL,
          {
            filter: {
              owner: { eq: prifinaID },
              status: { eq: 0 },
            },
          },
        );

        console.log("COUNT ", notificationCountResult);
        notificationCount.current =
          notificationCountResult.data.getSystemNotificationCount;

        componentProps.current.notificationCount = notificationCount.current;

        lastActivity.current = new Date().getTime();
        await client.mutate({
          mutation: gql(updateActivity),
          variables: {
            id: prifinaID,
            activeApp: coreApp,
          },
        });

        setSettingsReady(true);
      } catch (e) {
        if (typeof e === "string" && e === "No current user") {
        }

        console.log("INIT ", e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (settingsReady) {
      console.log("SETTINGS ", activeUser, componentProps);
      setAppReady(true);
    }
  }, [settingsReady]);

  // possibly obsolete code...messaging demo may have used this
  const remoteUser = opts => {
    console.log("REMOTE USER ", opts);
    console.log("ADDRESS BOOK ", addressBook.current);
    const msg = opts.createMessage;
    const receiver = msg.receiver;

    const { endpoint, region } = addressBook.current[receiver];
    const _remoteClient = createClient(endpoint, region);
    console.log(_remoteClient);
    return _remoteClient.mutate({
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
  // possibly obsolete code...messaging demo may have used this
  const remoteClient = async (endpoint, region) => {
    const _currentSession = await Auth.currentSession();
    return createClient(endpoint, region, _currentSession);
  };

  console.log("ACTIVE USER ", activeUser.current, settingsReady);

  return (
    <>
      {appReady && coreApp === "DisplayApp" && (
        <PrifinaProvider
          stage={config.STAGE}
          Context={PrifinaContext}
          activeUser={activeUser.current}
          activeApp={coreApp}
          remoteUser={remoteUser}
          remoteClient={remoteClient}
        >
          <React.Suspense fallback={"Loading ..."}>
            <Content
              Component={AppComponent}
              {...componentProps.current}
              activeUser={activeUser.current}
            />
          </React.Suspense>
        </PrifinaProvider>
      )}

      {appReady && coreApp !== "DisplayApp" && (
        <React.Suspense fallback={"Loading ..."}>
          <Content
            Component={AppComponent}
            {...componentProps.current}
            activeUser={activeUser.current}
          />
        </React.Suspense>
      )}
      {!appReady && <div />}
    </>
  );
};

CoreApps.propTypes = {
  app: PropTypes.string,
};

export default withUsermenu()(CoreApps);
