import React, { useRef, useState, useEffect, forwardRef } from "react";
import { usePrifina } from "@prifina/hooks";

import { useTransition, animated } from "react-spring";

import { RemoteComponent } from "../RemoteComponent";
import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import { API as GRAPHQL, Storage } from "aws-amplify";

import gql from "graphql-tag";

import * as C from "./display-app/components";

import { i18n, getAthenaResults, Navbar } from "@prifina-apps/utils";

import { ReactComponent as DisplayAppLogo } from "../assets/display-app-logo.svg";

import PropTypes from "prop-types";

import { Flex, Box, Text, Button } from "@blend-ui/core";
import AddWidgetModal from "../components/AddWidgetModal";

i18n.init();

function getSystemSettings(settings, currentSettings) {
  console.log("getSystemSettings ", settings, currentSettings);
  // default values.... should not be needed, if all is configured correctly.
  let theme = "dark";
  let size = "300x300";

  if (settings && settings.length > 0) {
    settings.forEach(s => {
      if (s.field === "sizes") {
        size = currentSettings[s.field] || JSON.parse(s.value)[0].value;
        //"[{\"option\":\"300x300\",\"value\":\"300x300\"}]"
      }
      if (s.field === "theme") {
        theme = currentSettings[s.field] || JSON.parse(s.value)[0].value;
      }
    });
  }
  return { theme: theme, size: size };
}
const DisplayApp = ({
  widgetConfigData,
  appSyncClient,
  prifinaID,
  dataSources,
}) => {
  console.log("PROPS ", widgetConfigData, Object.keys(widgetConfigData));
  console.log("WIDGET CONFIG DATA ", widgetConfigData);
  console.log("DISPLAY APP ", prifinaID);
  const { currentUser, setSettings, getCallbacks, registerClient, Prifina } =
    usePrifina();
  console.log("DISPLAY APP ", currentUser);
  console.log("DISPLAY APP DATASOURCES", dataSources);
  const WidgetHooks = new Prifina({ appId: "WIDGETS" });
  const athenaSubscription = useRef(null);

  const short = require("short-uuid");

  const [views, setViews] = useState(() => {
    const defaultView = [
      {
        id: 0,
        title: `${currentUser.name}'s home`,
      },
    ];

    const savedViews = localStorage.getItem("views");

    const parsedViews = JSON.parse(savedViews);

    console.log("parsed views", parsedViews);

    if (parsedViews === null) {
      return defaultView;
    } else if (parsedViews) {
      return parsedViews;
    } else {
      return [];
    }
  });

  const defaultViewID = 0;
  console.log("default view id", defaultViewID);

  const [viewID, setViewID] = useState(0);
  console.log("viewID", viewID);

  const [activeTab, setActiveTab] = useState(0);
  console.log("active tab", activeTab);

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);

    console.log("view target value", e.currentTarget.id);
    setViewID(Number(e.currentTarget.id));
  };

  const [defaultWidgetsToRender, setDefaultWidgetsToRender] = useState([
    {
      id: defaultViewID,
      widgetConfig: [
        {
          url: "https://prifina-apps-352681697435-eu-west-1.s3.amazonaws.com/xkn9NGTH6eNyWUbaLxtMe1/0.0.1/main.bundle.js",
          settings: true,
          currentSettings: {
            city: "london",
            size: "300x300",
            theme: "dark",
          },
          dataSources: [],
          widget: {
            settings: [
              {
                value: "New York",
                field: "city",
                label: "City",
                type: "text",
              },
              {
                value: '[{"option":"300x300","value":"300x300"}]',
                field: "sizes",
                label: "Sizes",
                type: "select",
              },
              {
                value: '[{"option":"Dark","value":"dark"}]',
                field: "theme",
                label: "Theme",
                type: "select",
              },
            ],
            installCount: 0,
            appID: "xkn9NGTH6eNyWUbaLxtMe1",
            name: "weatherWidget",
            title: "Weather",
            shortDescription:
              "Heads up widget for showing you the weather in relevant locations to you.",
            version: "0.0.1",
            image:
              "https://prifina-apps-352681697435-eu-west-1.s3.amazonaws.com/xkn9NGTH6eNyWUbaLxtMe1/assets/weatherly-ss-1.png",
            publisher: "Prifina Inc",
            userGenerated: ["Location input"],
            userHeld: ["Session time", "Session duration"],
            public: ["Weather data"],
            category: "Weather",
            icon: "https://prifina-apps-352681697435-eu-west-1.s3.amazonaws.com/xkn9NGTH6eNyWUbaLxtMe1/assets/weatherly-icon.png",
          },
        },
        {
          url: "https://prifina-apps-352681697435-eu-west-1.s3.amazonaws.com/3LSdcSs1kcPskBWBJvqGto/0.0.1/main.bundle.js",
          settings: true,
          currentSettings: {
            size: "300x300",
            theme: "dark",
            city: "London",
          },
          dataSources: ["@prifina/oura"],
          widget: {
            settings: [
              {
                value: '[{"option":"300x300","value":"300x300"}]',
                field: "sizes",
                label: "Sizes",
                type: "select",
              },
              {
                value: '[{"option":"Dark","value":"dark"}]',
                field: "theme",
                label: "Theme",
                type: "select",
              },
              {
                value: "London",
                field: "city",
                label: "City",
                type: "text",
              },
            ],
            installCount: 0,
            appID: "3LSdcSs1kcPskBWBJvqGto",
            name: "dryRunWidget",
            title: "Dry Run",
            shortDescription:
              "Tired of running in bad weather? With Dry Run, utilize your activity data and you get a heads up when your typical time for a run collides with a sleet or a tropical storm.",
            version: "0.0.1",
            image:
              "https://prifina-apps-352681697435-eu-west-1.s3.amazonaws.com/3LSdcSs1kcPskBWBJvqGto/assets/dryrun-ss-1.png",
            publisher: "Prifina Inc",
            userGenerated: ["Location input"],
            userHeld: ["Session time", "Session duration"],
            public: ["Weather data"],
            category: "Health & Fitness",
            icon: "https://prifina-apps-352681697435-eu-west-1.s3.amazonaws.com/3LSdcSs1kcPskBWBJvqGto/assets/dryrun-icon.png",
          },
        },
      ],
    },
    {
      id: 2,
      widgetConfig: [
        {
          url: "https://prifina-apps-352681697435-eu-west-1.s3.amazonaws.com/3LSdcSs1kcPskBWBJvqGto/0.0.1/main.bundle.js",
          settings: true,
          currentSettings: {
            size: "300x300",
            theme: "dark",
            city: "London",
          },
          dataSources: ["@prifina/oura"],
          widget: {
            settings: [
              {
                value: '[{"option":"300x300","value":"300x300"}]',
                field: "sizes",
                label: "Sizes",
                type: "select",
              },
              {
                value: '[{"option":"Dark","value":"dark"}]',
                field: "theme",
                label: "Theme",
                type: "select",
              },
              {
                value: "London",
                field: "city",
                label: "City",
                type: "text",
              },
            ],
            installCount: 0,
            appID: "3LSdcSs1kcPskBWBJvqGto",
            name: "dryRunWidget",
            title: "Dry Run",
            shortDescription:
              "Tired of running in bad weather? With Dry Run, utilize your activity data and you get a heads up when your typical time for a run collides with a sleet or a tropical storm.",
            version: "0.0.1",
            image:
              "https://prifina-apps-352681697435-eu-west-1.s3.amazonaws.com/3LSdcSs1kcPskBWBJvqGto/assets/dryrun-ss-1.png",
            publisher: "Prifina Inc",
            userGenerated: ["Location input"],
            userHeld: ["Session time", "Session duration"],
            public: ["Weather data"],
            category: "Health & Fitness",
            icon: "https://prifina-apps-352681697435-eu-west-1.s3.amazonaws.com/3LSdcSs1kcPskBWBJvqGto/assets/dryrun-icon.png",
          },
        },
      ],
    },
  ]);

  const [widgetsToRender, setWidgetsToRender] = useState(() => {
    const savedViews = localStorage.getItem(`viewsContent-${0}`);

    const parsedViews = JSON.parse(savedViews);

    console.log("views content", parsedViews);

    return parsedViews;
  });

  useEffect(() => {
    // setCart(JSON.parse(localStorage.getItem("myCart")) || []);
    const savedViews = localStorage.getItem(`viewsContent-${0}`);

    const parsedViews = JSON.parse(savedViews);
    console.log("views content", parsedViews);

    setWidgetsToRender(parsedViews);
  }, [activeTab, viewID]);

  // const [widgetsToRender, setWidgetsToRender] = useState(
  //   defaultWidgetsToRender,
  // );

  // console.log("WIDGETS TO RENDER", widgetsToRender);

  useEffect(() => {
    console.log("Something happened");

    activeTab;
  }, [viewID]);

  console.log("widgets to render", widgetsToRender);

  const [widgetList, setWidgetList] = useState([]);
  const [widgetConfig, setWidgetConfig] = useState(
    // widgetsToRender.map((w, i) => {
    defaultWidgetsToRender[0].widgetConfig.map((w, i) => {
      //parse theme and sizes....
      const { theme, size } = getSystemSettings(
        w.widget.settings,
        w.currentSettings,
      );
      return {
        dataSources: w.dataSources,
        currentSettings: w.currentSettings,
        url: w.url,
        settings: w.settings,
        widget: { theme: theme, size: size, ...w.widget },
        version: w.version,
      };
    }),
  );

  const settings = useRef({
    left: "0px",
    top: "0px",
    height: "0px",
    width: "0px",
    widget: -1,
  });

  const widgetSettings = useRef(
    // widgetsToRender.map((w, i) => {
    defaultWidgetsToRender[0].widgetConfig.map((w, i) => {
      //parse theme and sizes....
      const { theme, size } = getSystemSettings(
        w.widget.settings,
        w.currentSettings,
      );
      console.log("w", w);
      return {
        theme: theme,
        size: size,
        settings: w.widget.settings || [],
        title: w.widget.title,
        appId: w.widget.appID,
        installCount: w.widget.installCount,
        currentSettings: w.currentSettings,
        image: w.widget.image,
        dataSources: w.dataSources,
        publisher: w.publisher,
        version: w.version,
      };
    }),
  );
  console.log("WIDGET SETTINGS after parsing theme&sizes ", widgetSettings);

  ///transition animation///////////////////////////////////
  const [isVisible, setIsVisible] = useState(false);

  const transition = useTransition(isVisible, {
    from: {
      transform: "translateY(100%) rotateX(90deg)",
      transition: "all 0.1s ease-out",
      opacity: 0,
    },
    enter: {
      transform: "translateY(0%) rotateX(0deg)",
      opacity: 1,
      width: 568,
      height: 504,
    },
    leave: {
      transform: "translateY(0%) rotateX(90deg)",
      transition: "all 0.1s ease-out",
      opacity: 0,
    },
  });
  ///////////////////////////////////////////////////////
  ///settings config
  const openSettings = w => {
    if (!isVisible) {
      console.log("CLICK...", w);

      const ww = document
        .querySelectorAll("[data-widget-index='" + w + "']")[0]
        .getBoundingClientRect();

      console.log("WW...", ww);

      settings.current = {
        left: ww.left + "px",
        top: ww.top + "px",
        height: ww.height + "px",
        width: ww.width + "px",
        widget: w,
      };

      setIsVisible(true);
    }
  };

  useEffect(() => {
    let ignore = false;
    console.log("OPEN CHANGE ", isVisible);

    return () => {
      ignore = true;
    };
  }, [isVisible]);

  useEffect(() => {
    registerClient([appSyncClient, GRAPHQL, Storage]);

    athenaSubscription.current = appSyncClient
      .subscribe({
        query: gql(getAthenaResults),
        variables: { id: prifinaID },
      })
      .subscribe({
        next: res => {
          console.log("ATHENA SUBS RESULTS ", res);

          const currentAppId = res.data.athenaResults.appId;
          console.log(currentAppId, widgetSettings.current);
          const widgetIndex = widgetSettings.current.findIndex(
            w => w.appId === currentAppId,
          );
          const widgetInstallCount =
            widgetSettings.current[widgetIndex].installCount;

          console.log(widgetIndex, widgetInstallCount);
          const c = getCallbacks();
          console.log("CALLBACKS ", c);

          if (
            c.hasOwnProperty(currentAppId) &&
            typeof c[currentAppId][widgetInstallCount] === "function"
          ) {
            console.log("FOUND CALLBACK ");
            c[currentAppId][widgetInstallCount]({
              data: JSON.parse(res.data.athenaResults.data),
            });
          }
        },
        error: error => {
          console.log("ATHENA SUBS ERROR ");
          console.error(error);
          // handle this error ???
          ///message: "Connection failed: com.amazon.coral.service#ExpiredTokenException"
        },
      });

    console.log("WIDGET CONFIG ", widgetConfig);

    return () => {
      // unsubscribe...
      if (athenaSubscription.current) {
        console.log("UNSUBS ATHENA ");
        athenaSubscription.current.unsubscribe();
      }
    };
  }, []);



  useEffect(() => {
    console.log("WIDGET CONFIG, create widgets... ");

    console.log("widget config in use", widgetConfig);
    if (widgetConfig.length > 0) {
      console.log("CREATE WIDGETS...");
      // const widgets = widgetConfig.map((w, i) => {
      const widgets = widgetConfig.map((w, i) => {
        console.log("WIDGET COMPONENT ", w);
        //React.forwardRef((props, ref) =>
        let dataSourceModules = {};

        Object.keys(dataSources).forEach(s => {
          if (dataSources[s].modules !== null) {
            for (let m = 0; m < dataSources[s].modules.length; m++) {
              const moduleName = dataSources[s].modules[m];
              dataSourceModules[moduleName] = {
                source: s,
                sourceType: dataSources[s].sourceType,
              };
            }
          }
        });
        console.log("MODULES ", dataSourceModules);
        const userDataSources = Object.keys(currentUser.dataSources);
        console.log("USER DATASOURCES...", i, userDataSources);
        let userDataSourceStatus = 0;
        let dataSourceType = 0;
        let datasourcesFound = false;
        if (
          w.hasOwnProperty("dataSources") &&
          w.dataSources !== null &&
          w.dataSources.length > 0
        ) {
          console.log("DATASOURCE FOUND ", w);
          datasourcesFound = true;
          const widgetDataSourceModule = w.dataSources[0];
          const widgetDataSource =
            dataSourceModules[widgetDataSourceModule].source;
          if (
            userDataSources.length > 0 &&
            userDataSources.indexOf(widgetDataSource) > -1
          ) {
            // check dataSource status
            userDataSourceStatus =
              currentUser.dataSources[widgetDataSource].status;
          }

          dataSourceType = dataSources[widgetDataSource].sourceType;
        }
        console.log(
          "USER DATASOURCE STATUS ",
          i,
          userDataSourceStatus,
          dataSourceType,
          datasourcesFound,
        );
        const Widget = forwardRef((props, ref) => {
          console.log("W ", props);


          // if (w && w.widget.size) {
          //   const size = w.widget.size.split("x");
          //   setSize(size);
          // }
          const size = w.widget.size.split("x");
          return (
            <React.Fragment>
              <div
                style={{
                  width: size[0] + "px",
                  height: size[1] + "px",
                  margin: "10px",
                  position: "relative",
                }}
              >
                <div>
                  <div>
                    {w.settings && (
                      <C.IconDiv
                        open={props.open}
                        onClick={() => openSettings(i)}
                        widgetTheme={w.widget.theme}
                      />
                    )}
                    {!w.settings && <C.EmptyDiv />}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <C.WidgetWrapper
                      className={"prifina-widget"}
                      data-widget-index={i}
                      key={"widget-wrapper-" + i}
                      ref={ref}
                    >
                      {userDataSourceStatus < 3 && datasourcesFound && (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <C.BlurImageDiv
                            testing={"OK"}
                            key={"prifina-widget-" + i}
                            style={{
                              backgroundImage: `url(${w.widget.image})`,
                            }}
                          />
                          {userDataSourceStatus === 2 && (
                            <div>
                              <div
                                key={"widget-dot-" + i}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  top: "0px",
                                  zIndex: 19,
                                  position: "absolute",
                                  alignItems: "center",
                                }}
                              >
                                <C.DotLoader widgetTheme={w.widget.theme} />
                              </div>
                              <div
                                style={{
                                  width: size[0] + "px",
                                  bottom: 0,
                                  position: "absolute",
                                  padding: "5px",
                                  textAlign: "center",
                                }}
                              >
                                <Text
                                  textStyle={"h6"}
                                  color={
                                    w.widget.theme === "dark"
                                      ? "white"
                                      : "black"
                                  }
                                >
                                  Prosessing your data...
                                </Text>
                                <Text
                                  textStyle={"caption"}
                                  color={
                                    w.widget.theme === "dark"
                                      ? "white"
                                      : "black"
                                  }
                                >
                                  You will be notified as soon as the data
                                  becomes available in your cloud.
                                </Text>
                              </div>
                            </div>
                          )}
                          {userDataSourceStatus < 2 && (
                            <div
                              style={{
                                width: size[0] + "px",
                                bottom: "10px",
                                padding: "10px",
                                position: "absolute",
                                textAlign: "center",
                              }}
                            >
                              <Text
                                textStyle={"h6"}
                                color={
                                  w.widget.theme === "dark" ? "white" : "black"
                                }
                              >
                                {w.widget.title}
                              </Text>
                              <Text
                                textStyle={"caption"}
                                color={
                                  w.widget.theme === "dark" ? "white" : "black"
                                }
                              >
                                {w.widget.shortDescription}
                              </Text>
                              <div
                                style={{
                                  marginTop: "10px",
                                }}
                              >
                                {userDataSourceStatus === 0 && (
                                  <Button>
                                    {dataSourceType === 1
                                      ? "Connect Data"
                                      : "Import"}
                                  </Button>
                                )}
                                {userDataSourceStatus === 1 && (
                                  <Button>Activate</Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {userDataSourceStatus === 3 && datasourcesFound && (
                        <RemoteComponent url={w.url} {...props} />
                      )}
                      {dataSourceType === 0 && !datasourcesFound && (
                        <RemoteComponent url={w.url} {...props} />
                      )}
                    </C.WidgetWrapper>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        });

        Widget.displayName = "Widget";

        return Widget;
      });

      console.log("WIDGETS ", widgets);

      setWidgetList(widgets);
    }
  }, [widgetConfig, viewID]);

  const onUpdate = data => {
    console.log("Update settings ", data);
    console.log("HOOK ", WidgetHooks);

    console.log(settings.current, widgetSettings);
    // deep-copy...
    const currentSettings = JSON.parse(
      JSON.stringify(
        widgetSettings.current[settings.current.widget].currentSettings,
      ),
    );

    let systemSettingsUpdated = false;

    let currentWidgetConfig = JSON.parse(JSON.stringify(widgetConfig));
    Object.keys(data).forEach(k => {
      let dataField = k;

      if (
        ["theme"].indexOf(dataField) > -1 &&
        currentSettings[dataField] !== data[dataField]
      ) {
        systemSettingsUpdated = true;
        currentWidgetConfig[settings.current.widget].widget[dataField] =
          data[dataField];
      }

      if (
        ["sizes"].indexOf(dataField) > -1 &&
        currentSettings["size"] !== data[k]
      ) {
        dataField = "size";
        systemSettingsUpdated = true;
        currentWidgetConfig[settings.current.widget].widget["size"] = data[k];
      }

      // note the dataField is not used with data object...
      widgetSettings.current[settings.current.widget].currentSettings[
        dataField
      ] = data[k];
    });
    // update settings...
    let newSettings = [];
    Object.keys(currentSettings).forEach(k => {
      if (k === "size" && data.hasOwnProperty("sizes")) {
        newSettings.push({ field: k, value: data["sizes"] });
      } else if (data.hasOwnProperty(k)) {
        newSettings.push({ field: k, value: data[k] });
      } else {
        newSettings.push({ field: k, value: currentSettings[k] });
      }
    });

    const currentAppId = widgetSettings.current[settings.current.widget].appId;

    console.log("NEW SETTINGS ", newSettings, currentAppId);
    console.log("UPDATED SETTINGS ", widgetSettings.current, currentAppId);

    setSettings(currentAppId, prifinaID, {
      type: "WIDGET",
      index: settings.current.widget,
      settings: newSettings,
    });
    const c = getCallbacks();
    console.log("CALLBACKS ", c);
    const widgetInstallCount =
      widgetSettings.current[settings.current.widget].installCount;
    console.log(
      " CALLBACK ",
      c.hasOwnProperty(currentAppId),
      widgetInstallCount,
    );
    console.log(" CALLBACK ", typeof c[currentAppId][widgetInstallCount]);
    if (
      c.hasOwnProperty(currentAppId) &&
      typeof c[currentAppId][widgetInstallCount] === "function"
    ) {
      console.log("FOUND CALLBACK ");
      c[currentAppId][widgetInstallCount]({ settings: data });
    }

    //widgetConfig...
    if (systemSettingsUpdated) {
      console.log(
        "SystemSettingsUpdated ",
        systemSettingsUpdated,
        currentWidgetConfig,
      );
      setWidgetConfig(currentWidgetConfig);
    }
  };

  console.log("widget settings", widgetSettings);
  console.log("widget config", widgetConfig);
  console.log("widget list", widgetList);

  // VIEWS CONFIGURATION ================================================================================================================

  const [view, setView] = useState("");

  useEffect(() => {
    localStorage.setItem("views", JSON.stringify(views));
  }, [views]);

  const handleInputChange = e => {
    setView(e.target.value);
  };

  const handleFormSubmit = e => {
    e.preventDefault();

    if (view !== "") {
      setViews([
        ...views,
        {
          // id: short.generate(),
          id: views.length,
          title: view.trim(),
        },
      ]);
    }

    setView("");
  };

  function handleDeleteClick(id) {
    const removeItem = views.filter(view => {
      return view.id !== id;
    });
    setViews(removeItem);
  }

  console.log("views", views);
  console.log("view", view);
  // ================================================================================================================

  const [addWidgetModalOpen, setAddWidgetModalOpen] = useState(false);

  return (
    <>
      {isVisible && (
        <C.ModalBackground>
          {transition((style, item) =>
            item ? (
              <animated.div style={style}>
                <div>
                  <C.SettingsDiv>
                    <C.SettingsDialog
                      onBack={() => {
                        setIsVisible(false);
                      }}
                      isVisible={isVisible}
                      onUpdate={onUpdate}
                      widgetIndex={settings.current.widget}
                      widgetSettings={
                        widgetSettings.current[settings.current.widget]
                      }
                      data={widgetConfig}
                    />
                  </C.SettingsDiv>
                </div>
              </animated.div>
            ) : null,
          )}
        </C.ModalBackground>
      )}
      {addWidgetModalOpen && (
        <AddWidgetModal
          onClose={() => {
            setAddWidgetModalOpen(false);
          }}
          widgetData={widgetConfigData}
          viewID={viewID}
        />
      )}
      <Button
        onClick={() => {
          setAddWidgetModalOpen(true);
        }}
      >
        Add widgets
      </Button>
      <Navbar backgroundColor="white">
        <DisplayAppLogo style={{ marginTop: 17 }} />
      </Navbar>
      <div className="App">
        <form onSubmit={handleFormSubmit}>
          <input
            name="view"
            type="text"
            placeholder="Create a new view"
            value={view}
            onChange={handleInputChange}
          />
        </form>

        <ul className="view-list">
          {views.map(view => (
            <li key={view.id}>
              {view.title}
              <button onClick={() => handleDeleteClick(view.id)}>X</button>
            </li>
          ))}
        </ul>
      </div>
      <C.PageContainer>
        <div
          style={{
            overflow: "hidden",
          }}
        >
          <Tabs
            activeTab={activeTab}
            // onClick={e => {
            //   tabClick;
            // }}
            onClick={tabClick}
            style={{ height: "100%" }}
            variant={"line"}
          >
            <TabList>
              {views.length > 0
                ? views.map((item, index) => (
                    <Tab key={item.id} id={item.id}>
                      <C.TabText>{item.title}</C.TabText>
                    </Tab>
                  ))
                : null}
            </TabList>
            <TabPanelList style={{ backgroundColor: null }}>
              {views.length > 0
                ? views.map((item, index) => (
                    <TabPanel
                      style={{
                        height: "100vh",
                        paddingBottom: "50px",
                        overflow: "auto",
                      }}
                    >
                      <div style={{ overflow: "auto" }}>
                        <div>{item.title}</div>
                        <C.WidgetContainer className="prifina-widget-container">
                          {widgetList.length > 0 && (
                            <C.WidgetList
                              widgetList={widgetList}
                              widgetData={widgetConfig}
                              currentUser={currentUser}
                              dataSources={dataSources}
                            />
                          )}
                        </C.WidgetContainer>
                      </div>
                    </TabPanel>
                  ))
                : null}
            </TabPanelList>
          </Tabs>
        </div>
      </C.PageContainer>
    </>
  );
};

DisplayApp.propTypes = {
  widgetConfigData: PropTypes.instanceOf(Array).isRequired,
  appSyncClient: PropTypes.instanceOf(Object).isRequired,
  prifinaID: PropTypes.string.isRequired,
  open: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  visibility: PropTypes.string,
  transform: PropTypes.string,
  dataSources: PropTypes.instanceOf(Object),
};

export default DisplayApp;
