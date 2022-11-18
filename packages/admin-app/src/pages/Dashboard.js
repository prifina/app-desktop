/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect, useRef } from "react";

import { CssGrid, CssCell } from "@blend-ui/css-grid";
import { NotFoundPage } from "@prifina-apps/utils";

import { useNavigate } from "react-router";

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

  const { getCognitoUserCount, getCognitoMetricImage, getCognitoMetrics } = useStore(
    state => ({
      getCognitoUserCount: state.getCognitoUserCount,
      getCognitoMetricImage: state.getCognitoMetricImage,
      getCognitoMetrics: state.getCognitoMetrics,
    }),
    shallow,
  );

  const [cardProps, setCardProps] = useState({});
  const effectCalled = useRef(false);

  const SideBar = useRef();
  const Content = useRef();

  useEffect(() => {
    async function getData() {
      console.log("GET DATA ");
      SideBar.current = lazyImport("sidebars", "Dashboard.js");

      Content.current = lazyImport("contents", "Dashboard.js");

      effectCalled.current = true;
      const cnt = await getCognitoUserCount();
      const image = await getCognitoMetricImage();
      const metrics = await getCognitoMetrics();
      // console.log("METRICS ", metrics);
      setCardProps({
        userCount: cnt,
        cognitoMetricImage: image,
        metrics: CognitoMetricData(metrics),
      });
    }
    if (!effectCalled.current) {
      getData();
    }
  }, []);

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
          {Object.keys(cardProps).length > 0
            && <SideBar.current activeMenuItem={1} navigate={navClick} />}
        </CssCell>

        <CssCell pl="2" area="main">
          {Object.keys(cardProps).length > 0 && <Content.current {...cardProps} />}
        </CssCell>
      </CssGrid>
    </React.Suspense>
  );
};
Dashboard.displayName = "Dashboard";

export default Dashboard;
