// /* global localStorage */

import React, { useEffect, useRef, useState, forwardRef } from "react";


import { useLocation } from "react-router-dom";
import { PrifinaProvider, PrifinaContext, usePrifina } from "@prifina/hooks-v2";

import shallow from "zustand/shallow";

import { useStore, useGraphQLContext } from "@prifina-apps/utils";

import { useUserMenu, withUsermenu, ToastContextProvider } from "@prifina-apps/ui-lib";

import { Remote } from "@prifina-apps/remote";

import styled from "styled-components";
import config from "../config";
import { useDocumentTitle } from 'usehooks-ts'

import PropTypes from "prop-types";

const s3path = `https://prifina-apps-${config.prifinaAccountId}-${config.auth_region}.s3.amazonaws.com`;

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;

  // border: 2px outset;
  //border-radius: 8px;
`;


const RemoteContent = forwardRef(({ settingsInit, system, ...props }, ref) => {
  return <AppWrapper>
    <Remote
      ref={ref}
      componentProps={{ ...settingsInit }}
      system={{ ...system }}
    />
  </AppWrapper>
});


const MemoizedRemoteContent = React.memo(RemoteContent);

const Content = forwardRef(({ activeUser, notificationCount, listSystemNotificationsByDateQuery, appID, remoteUrl, ...props }, ref) => {
  const {
    stage,
    check,
    currentUser,
    getLocalization,
    getSettings,
    setSettings,
    getCallbacks,
    registerClient,
    onUpdate,
    API,
    Prifina,
    activeRole,
  } = usePrifina();


  const userMenu = useUserMenu();
  const { CoreApiClient, UserApiClient, S3Storage } = useGraphQLContext();

  const athenaSubscription = useRef(null);
  const effectCalled = useRef(false);

  let settingsInit = {};

  useEffect(() => {
    function init() {

      effectCalled.current = true;

      const userMenuInit = {
        //effect: { hover: { width: 42 } },
        notifications: notificationCount,
        RecentApps: [],
        prifinaID: activeUser.uuid,
        activeUser: activeUser,
        listSystemNotificationsByDateQuery: listSystemNotificationsByDateQuery,
        coreApiClient: CoreApiClient
      };
      //console.log("User menu init ", userMenuInit);
      userMenu.show(userMenuInit);

      //onUpdate("sandbox", updateTest);
      registerClient([UserApiClient, CoreApiClient, S3Storage]);

      UserApiClient.setCallback((res) => {
        console.log("ATHENA SUBS RESULTS ", res);

        const currentAppId = res.data.athenaResults.appId;
        //console.log("SUBS CHECK ", currentAppId, state,widgetSettings.current);

        const c = getCallbacks();
        console.log("CALLBACKS ", c);

        if (
          c.hasOwnProperty(currentAppId) &&
          typeof c[currentAppId][0] === "function"
        ) {
          console.log("FOUND CALLBACK ");
          c[currentAppId][0]({
            data: JSON.parse(res.data.athenaResults.data),
          });
        }
      }
      )
      //const subsID = UserApiClient.subscribe(getAthenaResults, { id: prifinaID });
      //athenaSubscription.current = subsID;

    }
    if (!effectCalled.current) {
      init();
    }
    // unsubscribe...
    if (athenaSubscription.current) {
      console.log("UNSUBS ATHENA ");
      //athenaSubscription.current.unsubscribe();
    }
  }, [])
  console.log("REMOTE ", remoteUrl);
  return <>
    <MemoizedRemoteContent ref={ref} componentProps={{ ...settingsInit }}

      system={{
        remote: appID,
        url: remoteUrl,
        module: "./App",
      }} />
  </>
});

const UserApps = () => {

  const { pathname, search } = useLocation();

  const appName = useRef(pathname.split("/").pop());
  const appID = useRef("");


  useDocumentTitle(appName.current);

  const { activeUser, getSystemNotificationCountQuery, updateUserActivityMutation,
    getAddressBookQuery, listAppMarketQuery, listDataSourcesQuery, listSystemNotificationsByDateQuery,
    getPrifinaUser, setAppsyncConfig } = useStore(
      state => ({
        activeUser: state.activeUser,
        getSystemNotificationCountQuery: state.getSystemNotificationCountQuery,
        updateUserActivityMutation: state.updateUserActivityMutation,
        getAddressBookQuery: state.getAddressBookQuery,
        getPrifinaUser: state.getPrifinaUser,
        listSystemNotificationsByDateQuery: state.listSystemNotificationsByDateQuery,
        setAppsyncConfig: state.setAppsyncConfig

      }),
      shallow,
    );

  /* 
  const {
    stage,
    check,
    getCallbacks,
    registerClient,
    currentUser,
    onUpdate,
  } = usePrifina(); */

  const prifinaID = activeUser.uuid;

  const effectCalled = useRef(false);

  const componentProps = useRef({});
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {

      effectCalled.current = true;

      try {

        const prifinaID = activeUser.uuid;

        setAppsyncConfig({
          aws_appsync_graphqlEndpoint: activeUser.endpoint,
          aws_appsync_region: activeUser.region,
          graphql_endpoint_iam_region: activeUser.region
        })

        const prifinaUser = getPrifinaUser();

        console.log("PRIFINA USER ", prifinaUser);
        const userInstalledApps = JSON.parse(prifinaUser.userInstalledApps);
        const appIdx = userInstalledApps.findIndex(app => app.name = appName.current);
        appID.current = userInstalledApps[appIdx].id;
        //console.log("APP IDX ", appIdx);
        const remoteUrl = [s3path, userInstalledApps[appIdx].id, userInstalledApps[appIdx].installedVersion, "remoteEntry.js"].join("/");


        componentProps.current.initials = prifinaUser?.appProfile?.initials;
        // notificationCount...
        const notificationCountResult = await getSystemNotificationCountQuery(
          {
            filter: {
              owner: { eq: activeUser.uuid },
              status: { eq: 0 },
            },
          },
        );

        console.log("COUNT ", notificationCountResult);

        componentProps.current.notificationCount = notificationCountResult.data.getSystemNotificationCount;
        componentProps.current.listSystemNotificationsByDateQuery = listSystemNotificationsByDateQuery;
        componentProps.current.appID = appID.current;
        //componentProps.current.remoteUrl = remoteUrl;
        componentProps.current.remoteUrl = "apps/cw9aphqcofZkv8pCE9nE181/dist/remoteEntry.js";
        //s3://prifina-apps-749067669980-eu-west-1/cw9aphqcofZkv8pCE9nE181/0.0.1/remoteEntry.js

        //lastActivity.current = new Date().getTime();
        await updateUserActivityMutation({
          id: activeUser.uuid,
          activeApp: "userApp-" + appID.current
        });


        setReady(true);

      } catch (error) {
        ///NotAuthorizedException ... idToken has expired...
        console.error("ERROR :", error);

      }

    }
    if (!effectCalled.current) {
      init();
    }


  }, [])

  return <>

    {ready && <>
      <PrifinaProvider
        stage={"sandbox"}
        Context={PrifinaContext}
        activeUser={activeUser}
        activeApp={"userApps"}
      >
        <React.Suspense fallback={"Loading ..."}>

          <Content
            {...componentProps.current}
            activeUser={activeUser}
            ref={(ref) => {
              if (ref) {

                ref.style.height = "100%";
                ref.style.width = "100%";
              }
            }}
          />
        </React.Suspense>
      </PrifinaProvider>

    </>}
  </>
}

//export default UserApps;

//export default withUsermenu()(CoreApps);
export default withUsermenu()(UserApps);