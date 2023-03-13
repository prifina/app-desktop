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
import { withUsermenu } from "@prifina-apps/ui-lib";

import PropTypes from "prop-types";


const Layout = ({ componentProps, activeUser, menuItems, resourceCardItems }) => {

  const { pathname, search } = useLocation();

  console.log("PATH ", pathname)
  return <>
    <Box style={{ minHeight: "100vh" }}>
      <Grid
        height="100%"
        bg="basePrimary"
        columns={"280px 1fr"}
        rows={"50px 1fr 225px"}
        areas={["header header", "menu content", "menu footer"]}
      >
        <Cell area="header">
          <Header  {...componentProps}
            activeUser={activeUser} />
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
        <Cell area="footer">
          {pathname.startsWith('/app/projects') &&
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
          }
        </Cell>
      </Grid>
    </Box>
  </>
}
const Landing = props => {
  const { __ } = useTranslate();
  const navigate = useNavigate();

  const { activeUser, getSystemNotificationCountQuery, updateUserActivityMutation,
    listSystemNotificationsByDateQuery,
  } = useStore(
    state => ({
      activeUser: state.activeUser,
      getSystemNotificationCountQuery: state.getSystemNotificationCountQuery,
      updateUserActivityMutation: state.updateUserActivityMutation,
      listSystemNotificationsByDateQuery: state.listSystemNotificationsByDateQuery

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