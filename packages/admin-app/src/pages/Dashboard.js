/* eslint-disable max-len */
/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect, useRef } from "react";

import { CssGrid, CssCell } from "@blend-ui/css-grid";
import { NotFoundPage } from "@prifina-apps/utils";

import { useNavigate, useLocation } from "react-router";

import shallow from "zustand/shallow";
// import PropTypes from "prop-types";
import { useStore } from "../stores/PrifinaStore";

import { CognitoMetricData } from "../lib";

const lazyImport = (path, file) => {
  console.log("IMPORT ", path, file);
  return React.lazy(() =>
    import(`../components/${path}/${file}`).catch(() => <NotFoundPage />));
};

// const formatAreas = areas => areas.map(area => `"${area}"`).join(" ");

const Dashboard = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();
  let activeMenuItem = 1;
  let activeContent = "Dashboard.js";
  switch (pathname) {
    case "/":
      activeMenuItem = 1;
      activeContent = "Dashboard.js";
      break;
    case "/users":
      activeMenuItem = 2;
      activeContent = "CognitoUsers.js";
      break;
    default:
      break;
  }

  const [menuItem, setMenuItem] = useState(activeMenuItem);

  console.log("DASHBOARD PATH ", pathname);

  const { getCognitoUserCount, getCognitoMetricImage, getCognitoMetrics } = useStore(
    state => ({
      getCognitoUserCount: state.getCognitoUserCount,
      getCognitoMetricImage: state.getCognitoMetricImage,
      getCognitoMetrics: state.getCognitoMetrics,
    }),
    shallow,
  );

  const [cardProps, setCardProps] = useState({});
  const [contentImported, setContentImported] = useState(false);
  const effectCalled = useRef(false);

  const SideBar = useRef();
  const Content = useRef();
  const importedContent = useRef("");

  useEffect(() => {
    console.log("GET DATA ", activeContent, effectCalled);
    async function getData() {
      console.log("GET DATA ", activeMenuItem);
      SideBar.current = lazyImport("sidebars", "Dashboard.js");

      Content.current = lazyImport("contents", activeContent);
      // console.log("MAIN ", Content);
      importedContent.current = activeContent;

      effectCalled.current = true;
      if (activeMenuItem === 1) {
        const cnt = await getCognitoUserCount();
        const image = await getCognitoMetricImage();
        const metrics = await getCognitoMetrics();
        // console.log("IMAGE ", image);
        console.log("COUNT ", cnt);

        setCardProps({
          userCount: cnt.data.getCognitoUserCount,
          cognitoMetricImage: image.data.getCognitoMetricImage.result,
          metrics: CognitoMetricData(JSON.parse(metrics.data.getCognitoMetrics.result)),
        });
      }
      setMenuItem(activeMenuItem);
      setContentImported(true);
    }
    if (!effectCalled.current || importedContent.current !== activeContent) {
      getData();
    }
  }, [activeContent, activeMenuItem, getCognitoMetricImage, getCognitoMetrics, getCognitoUserCount, setContentImported]);

  const gridRows = ["65px", "1fr"];

  let gridCols = [];
  // let templateMain = [];
  const gridAreas = [];
  gridAreas.push(["header", "headerMenu"]);

  gridAreas.push(["", ""]);

  gridCols = ["230px", "1fr"];
  gridAreas[1][0] = "nav";
  gridAreas[1][1] = "main";

  // console.log(gridAreas.map(r => r.join(" ").trim()));
  const templateMain = gridAreas.map(r => r.join(" ").trim());
  // console.log(`${formatAreas(templateMain)}`);
  //  console.log(theme.dashboard.header);
  // "header headerMenu" "nav main" "nav";

  const navClick = (path, opt) => {
    console.log("NAV ", path, opt);
    navigate(path, opt);
  };
  return (
    <React.Suspense fallback="Loading...">
      <CssGrid
        areas={templateMain}
        rows={gridRows.join(" ")}
        columns={gridCols.join(" ")}
        h="100vh"
        gap="0"
        bg="#FFFFFF"
        fontWeight="bold"
      >
        <CssCell
          area="header"
          pl="33px"
          borderBottom="1px solid #E2E5E6"
        />

        <CssCell
          area="headerMenu"
          borderBottom="1px solid #E2E5E6"
        />

        <CssCell
          pt={4}
          pl="2"
          area="nav"
          height="100vh"
          boxShadow="rgb(0 0 0 / 6%) 6px 0px 18px"
        >
          {contentImported
            && <SideBar.current activeMenuItem={menuItem} navigate={navClick} />}
        </CssCell>

        <CssCell pl="2" area="main">
          {contentImported && menuItem === 1 && Object.keys(cardProps).length > 0 && <Content.current {...cardProps} />}
          {contentImported && menuItem === 2 && <Content.current />}
        </CssCell>
      </CssGrid>
    </React.Suspense>
  );
};

// {contentImported && <Content.current />}
// {contentImported && menuItem === 1 && Object.keys(cardProps).length > 0 && <Content.current {...cardProps} />}
Dashboard.displayName = "Dashboard";

export default Dashboard;
