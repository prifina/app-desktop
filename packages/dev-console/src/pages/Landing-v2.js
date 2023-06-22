/* global localStorage */

import React, { useEffect, useState, useRef, } from "react";


import { Box, Flex, Text, Image, } from "@blend-ui/core";

import { ToastContextProvider } from "@blend-ui/toast";
import shallow from "zustand/shallow";

import { useTranslate, useStore, useGraphQLContext } from "@prifina-apps/utils";

import docs from "../assets/docs.png";
import starterResources from "../assets/starterResources.png";
import slackResources from "../assets/slackResources.png";
import zendeskResources from "../assets/zendeskResources.png";


import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { CssGrid as Grid, CssCell as Cell } from "@blend-ui/css-grid";

import mdiWidget from "@iconify/icons-mdi/widgets";
import AppStudioSidebar from "../components/AppStudioSidebar";

import Header from "../components/Header";
import ResourceCard from "../components/ResourceCard";

const Projects = React.lazy(() => import("../components/Projects"));

const ProjectDetails = React.lazy(() => import("./ProjectDetails-v2"));

//import Projects from "../components/Projects";
import { useUserMenu, withUsermenu } from "@prifina-apps/ui-lib";


import PropTypes from "prop-types";

/*
const userMenu = useUserMenu();

const effectCalled = useRef(false);

useEffect(() => {
  if (!effectCalled.current) {
    effectCalled.current = true;
    const userMenuInit = {
      //effect: { hover: { width: 42 } },
      notifications: notificationCount,
      RecentApps: [],
      prifinaID: activeUser.uuid,
      activeUser: activeUser,
      listSystemNotificationsByDateQuery: listSystemNotificationsByDateQuery,
      coreApiClient: coreApiClient
    };
    //console.log("User menu init ", userMenuInit);
    userMenu.show(userMenuInit);
  }

}, [])
*/

const Layout = ({ componentProps, activeUser, menuItems, resourceCardItems }) => {

  const userMenu = useUserMenu();
  const { pathname, search } = useLocation();
  const { notificationCount, listSystemNotificationsByDateQuery, coreApiClient } = componentProps;
  const footerExists = pathname === '/projects';

  //base: `${borderWidths["2xs"]} solid ${colors.baseMuted}`,
  const areas = ["header header", "menu content"];
  if (footerExists) {
    areas.push("menu footer")
  }
  console.log("PATH ", pathname);
  const effectCalled = useRef(false);

  const [menuReady, setMenuReady] = useState(false);

  useEffect(() => {
    if (!effectCalled.current) {
      effectCalled.current = true;
      console.log("INIT USERMENU ", coreApiClient);
      const userMenuInit = {
        //effect: { hover: { width: 42 } },
        notifications: notificationCount,
        RecentApps: [],
        prifinaID: activeUser.uuid,
        activeUser: activeUser,
        listSystemNotificationsByDateQuery: listSystemNotificationsByDateQuery,
        coreApiClient: coreApiClient
      };
      //console.log("User menu init ", userMenuInit);
      userMenu.show(userMenuInit);
      setMenuReady(true);
    }

  }, [])
  return <>
    {!menuReady && null}
    {menuReady && <Box style={{ minHeight: "100vh", height: "100vh" }}>
      <Grid
        height="100%"
        bg="basePrimary"
        columns={"280px 1fr"}
        rows={`${footerExists ? "50px 1fr 225px" : "50px 1fr"}`}
        areas={areas}
      >
        <Cell area="header">
          {/* <Header  {...componentProps} 

            activeUser={activeUser} />
*/}
          <Header />

        </Cell>
        <Cell area="content">
          {/* 
        <Box height={`calc(100vh - 270px)`} >

          <Outlet />
        </Box>
        */}
          <Outlet />

        </Cell>
        <Cell area="menu">
          <AppStudioSidebar items={menuItems} />
        </Cell>
        {footerExists && <Cell area="footer">

          <Box marginTop="48px" marginLeft={"20px"}>
            <Grid columns="repeat(auto-fit,minmax(120px,1fr))">
              {resourceCardItems.map((item, index) => (
                <Cell key={"card-" + index}>
                  <ResourceCard
                    src={item.src}
                    title={item.title}
                    description={item.description}
                  />
                </Cell>
              ))}
            </Grid>
          </Box>

        </Cell>
        }
      </Grid>
    </Box>
    }
  </>
}
const Landing = props => {
  const { __ } = useTranslate();
  const navigate = useNavigate();

  const { activeUser, getSystemNotificationCountQuery, updateUserActivityMutation,
    listSystemNotificationsByDateQuery, setAppsyncConfig
  } = useStore(
    state => ({
      activeUser: state.activeUser,
      getSystemNotificationCountQuery: state.getSystemNotificationCountQuery,
      updateUserActivityMutation: state.updateUserActivityMutation,
      listSystemNotificationsByDateQuery: state.listSystemNotificationsByDateQuery,
      setAppsyncConfig: state.setAppsyncConfig

    }),
    shallow,
  );


  const { CoreApiClient, UserApiClient } = useGraphQLContext();
  const effectCalled = useRef(false);
  const componentProps = useRef({});

  const lastActivity = useRef(new Date().getTime());
  const notificationCount = useRef(0);

  const [appReady, setAppReady] = useState(false);
  const menuItems = [

    {
      label: __("projects"),
      icon: mdiWidget,
      onClick: () => {
        navigate("/app/projects", { replace: true });
      },
    },
  ];
  const resourceCardItems = [
    {
      src: docs,
      title: __("prifinaDocsResourcesCardHeading"),
      description: __("docsResourcesCardPara"),
    },
    {
      src: starterResources,
      title: __("gitResourcesResourcesCardHeading"),
      description: __("gitResourcesCardPara"),
    },
    {
      src: zendeskResources,
      title: __("zenDeskResourcesCardHeading"),
      description: __("zenResourcesCardPara"),
    },
    {
      src: slackResources,
      title: __("slackResourcesCardHeading"),
      description: __("slackResourcesCardPara"),
    },
  ];

  useEffect(() => {
    async function fetchData() {
      effectCalled.current = true;

      console.log("ACTIVE USER ", activeUser);
      setAppsyncConfig({
        aws_appsync_graphqlEndpoint: activeUser.endpoint,
        aws_appsync_region: activeUser.region,
        graphql_endpoint_iam_region: activeUser.region
      })

      const notificationCountResult = await getSystemNotificationCountQuery(
        {
          filter: {
            owner: { eq: activeUser.uuid },
            status: { eq: 0 },
          },
        },
      );

      console.log("COUNT ", notificationCountResult);
      notificationCount.current =
        notificationCountResult.data.getSystemNotificationCount;

      componentProps.current.notificationCount = notificationCount.current;
      componentProps.current.listSystemNotificationsByDateQuery = listSystemNotificationsByDateQuery;
      componentProps.current.coreApiClient = CoreApiClient

      lastActivity.current = new Date().getTime();
      await updateUserActivityMutation({
        id: activeUser.uuid,
        activeApp: "appStudio-Home"
      });



      setAppReady(true)

    }
    if (!effectCalled.current) {
      fetchData();
    }
  }, []);


  // const Layout = ({componentProps,activeUser,menuItems,resourceCardItems}) => {
  // <ToastContextProvider>
  return (
    <> {appReady && (
      <ToastContextProvider>
        <Routes>
          <Route element={<Layout componentProps={componentProps.current} activeUser={activeUser} menuItems={menuItems} resourceCardItems={resourceCardItems} />}>
            <Route path="/:app" element={<ProjectDetails />} />
            <Route path="/" element={<Projects currentUser={activeUser} />} />
          </Route>
        </Routes>
      </ToastContextProvider>
    )}
    </>
  )
};

Landing.displayName = "Landing";

//export default Home;
export default withUsermenu()(Landing);