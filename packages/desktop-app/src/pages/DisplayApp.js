import React, { useRef, useState, useEffect, forwardRef, useReducer } from "react";
import { usePrifina } from "@prifina/hooks-v2";

import { useTransition, animated } from "react-spring";

//import { RemoteComponent } from "../RemoteComponent";
import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import { API as GRAPHQL, Storage } from "aws-amplify";

import gql from "graphql-tag";

import * as C from "./display-app/components";

import { i18n, getAthenaResults, Navbar, updatePrifinaUserMutation, useIsMountedRef } from "@prifina-apps/utils";

import { ReactComponent as DisplayAppLogo } from "../assets/display-app-logo.svg";

import PropTypes from "prop-types";

import {
  Flex,
  Box,
  Text,
  Button,
  Divider,
  Input,
  colors,
} from "@blend-ui/core";
import AddWidgetModal from "../components/AddWidgetModal";

import styled, { css } from "styled-components";
import { BlendIcon } from "@blend-ui/icons";

import mdiAddCircleOutline from "@iconify/icons-mdi/add-circle-outline";
import mdiGearOutline from "@iconify/icons-mdi/gear-outline";

import mdiPencilOutline from "@iconify/icons-mdi/pencil-outline";
import mdiTrashCanOutline from "@iconify/icons-mdi/trash-can-outline";

import mdiPlusBoxMultipleOutline from "@iconify/icons-mdi/plus-box-multiple-outline";
import mdiEyeOffOutline from "@iconify/icons-mdi/eye-off-outline";

import fePlus from "@iconify/icons-fe/plus";

import { Remote } from "@prifina-apps/remote";

i18n.init();

/* 
const StyledBlendIcon = styled(BlendIcon)`
  cursor: pointer;
`;
 */

function saveViewSettings(uuid, viewSettings) {

  /*
  return new Promise((resolve, reject) => {

  localStorage.setItem(
      "localViews",
       JSON.stringify({"uuid":uuid,views:viewSettings}),
     );

     resolve(true);  
  });
*/
  return updatePrifinaUserMutation(GRAPHQL, {
    id: uuid,
    viewSettings: JSON.stringify(viewSettings),
  });


}
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
  widgetViewSettings,
  appSyncClient,
  prifinaID,
  dataSources,
}) => {

  console.log("PROPS ", widgetConfigData, Object.keys(widgetConfigData));
  console.log("WIDGET CONFIG DATA ", widgetConfigData);
  console.log("WIDGET VIEW SETTINGS ", widgetViewSettings);
  console.log("DISPLAY APP ", prifinaID);

  const isMountedRef = useIsMountedRef();

  const { currentUser, getCallbacks, removeCallbacks, deleteCallback, registerClient, Prifina, check } =
    usePrifina();
  console.log("DISPLAY APP ", currentUser);
  console.log("DISPLAY APP DATASOURCES", dataSources);
  //const WidgetHooks = new Prifina({ appId: "WIDGETS" });

  const athenaSubscription = useRef(null);

  /*
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
  */

  //const [viewID, setViewID] = useState(0);
  //console.log("viewID", viewID);
  const [activeTab, setActiveTab] = useState(0);
  console.log("active tab", activeTab);
  // const [view, setView] = useState("");
  const [editView, setEditView] = useState(false);
  const [addWidgetModalOpen, setAddWidgetModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      widgetConfig: [],
      //widgetSettings:[],
      widgetList: [],
      views: []
      //widgetViewSettings:widgetViewSettings
    },
  );


  const widgetSettings = useRef([]);

  const savedViews = localStorage.getItem("localViews");

  const viewSettings = useRef(widgetViewSettings);
  //const viewSettings=useRef(JSON.parse(savedViews).views);

  const inputRef = useRef(Array(widgetViewSettings.length + 1).fill(null));

  const viewsRef = useRef(Array(widgetViewSettings.length).fill(null));

  const settings = useRef({
    left: "0px",
    top: "0px",
    height: "0px",
    width: "0px",
    widget: -1,
  });

  const [reloadViewWidgets, setReloadViewWidgets] = useState(false);

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);

    console.log("view target value", e.target.value);
    const newViewID = Number(e.currentTarget.id);

    if (activeTab !== newViewID) {
      setActiveTab(tab);

      //setViewID(Number(e.currentTarget.id));
    }
  };

  ///transition animation///////////////////////////////////
  const [isVisible, setIsVisible] = useState(false);

  const [widgetMenuOpen, setWidgetMenu] = useState(-1);
  const widgetMenuPos = useRef({});

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

  const openWidgetMenu = (pos, idx) => {
    console.log("OPEN ", pos);
    widgetMenuPos.current = { pos_x: pos.x, pos_y: pos.y };
    setWidgetMenu(widgetMenuOpen === idx ? -1 : idx);
  }

  ///////////////////////////////////////////////////////
  ///settings config
  const openSettings = w => {
    if (!isVisible) {
      console.log("CLICK...", w, activeTab);

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
  /*
    useEffect(() => {
      let ignore = false;
      console.log("OPEN CHANGE ", isVisible);
  
      return () => {
        ignore = true;
      };
    }, [isVisible]);
  */


  useEffect(() => {
    registerClient([appSyncClient, GRAPHQL, Storage]);
    console.log("SUBSCRIPTION INIT...");
    athenaSubscription.current = appSyncClient
      .subscribe({
        query: gql(getAthenaResults),
        variables: { id: prifinaID },
      })
      .subscribe({
        next: res => {
          console.log("ATHENA SUBS RESULTS ", res);

          const currentAppId = res.data.athenaResults.appId;
          //console.log("SUBS CHECK ", currentAppId, state,widgetSettings.current);

          const widgetIndex = widgetSettings.current.findIndex(
            w => w.appId === currentAppId,
          );
          const widgetInstallCount = widgetSettings.current[widgetIndex].installCount;

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



    return () => {
      // unsubscribe...
      if (athenaSubscription.current) {
        console.log("UNSUBS ATHENA ");
        athenaSubscription.current.unsubscribe();
      }
    };

  }, []);


  useEffect(() => {
    console.log("WIDGET VIEW, create widgets... ");

    console.log("widgets in view", state.views, viewSettings.current[activeTab]);
    let widgets = [];
    let currentViewConfig = [];
    let currentViewSettings = [];
    let currentViews = viewSettings.current.map(v => {
      return { ...v.view }
    });

    if (isMountedRef.current && viewSettings.current[activeTab] !== "undefied") {
      const visibleWidgets = Object.keys(viewSettings.current[activeTab].widgets).length;
      currentViewConfig = Array(visibleWidgets).fill({});

      if (visibleWidgets > 0) {
        widgetConfigData.forEach((w, i) => {

          console.log("CREATE WIDGET ", w)

          if (viewSettings.current[activeTab].widgets?.[w.widget.appID]) {



            const { theme, size } = getSystemSettings(
              w.widget.settings, // config settings... 
              viewSettings.current[activeTab].widgets[w.widget.appID].currentSettings
            );

            currentViewConfig[viewSettings.current[activeTab].widgets[w.widget.appID].order] = {
              dataSources: w.dataSources,
              currentSettings: viewSettings.current[activeTab].widgets[w.widget.appID].currentSettings,
              url: w.url,
              settingsExists: viewSettings.current[activeTab].widgets[w.widget.appID].settingsExists,
              widget: { theme: theme, size: size, ...w.widget },
              //version: w.version,
            };

            currentViewSettings[viewSettings.current[activeTab].widgets[w.widget.appID].order] = {
              theme: theme,
              size: size,
              settings: w.widget.settings || [],
              title: w.widget.title,
              appId: w.widget.appID,
              installCount: w.widget.installCount,
              currentSettings: viewSettings.current[activeTab].widgets[w.widget.appID].currentSettings,
              image: w.widget.image,
              dataSources: w.dataSources,
              publisher: w.widget.publisher,
              version: w.widget.version,
              shortDescription: w.widget.shortDescription
            };
          }

        });
      }
      console.log(" CURRENT ", currentViewConfig, currentViewSettings)

      console.log("CREATE WIDGETS...");
      // const widgets = widgetConfig.map((w, i) => {
      widgets = currentViewConfig.map((w, i) => {
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
          console.log("W 2", w);

          // save this to currentViewConfig 
          let widgetRef = useRef();

          // const removeWidget = e => {
          //   var array = [...widgetConfig];
          //   var index = array[e];
          //   if (index !== -1) {
          //     array.splice(index, 1);
          //     setWidgetConfig(array);
          //   }
          // };

          // localStorage.setItem(
          //   `viewsContent-${viewID}`,
          //   JSON.stringify(widgetConfig),
          // );

          //let settingsInit = {};
          /*
              if (appSettings.hasOwnProperty("settings") || appSettings.settings != null) {
                //console.log("APP SETTINGS INIT ", appSettings);
                let data = {};
                appSettings.settings.forEach(s => {
                  if (s.field != "sizes" && s.field != "theme") {
                    data[s.field] = s.value;
                  }
                });
                console.log("APP SETTINGS INIT ", data);
                settingsInit = data;
              } else {
                appSettings.settings = {};
              }
            */

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
                  {/* 
                  <div>
                    {w.settingsExists && (
                      <C.IconDiv
                        open={props.open}

                        onClick={toggleWidgetMenu}
                        widgetTheme={w.widget.theme}
                      />
                    )}
                    {!w.settingsExists && <C.EmptyDiv />}
                  </div>
                  <div>


                    {widgetMenu && (
                      <C.WidgetDropDownContainer
                        ref={widgetMenuRef}
                        className="dropdown-menu+1"
                      >
                        <C.DropDownListContainer>
                          <C.DropDownList>
                            <C.InteractiveMenuItem
                              title="Duplicate"
                              iconify={mdiPlusBoxMultipleOutline}
                            />

                            <C.InteractiveMenuItem
                              title="Remove"
                              iconify={mdiEyeOffOutline}
                              data-widgetindex={i}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleWidgetMenu();
                                removeWidget(Number(e.currentTarget.dataset['widgetindex']));
                              }}
                            />
                            <Divider as="div" />
                            <C.InteractiveMenuItem
                              title="Settings >"
                              iconify={mdiGearOutline}
                              data-widgetindex={i}
                              onClick={(e) => {
                                e.preventDefault();
                                //console.log("SETTINGS CLICK ",e.currentTarget.dataset,e.currentTarget.dataset['widgetindex']);
                                toggleWidgetMenu();
                                openSettings(Number(e.currentTarget.dataset['widgetindex']));
                              }}
                            />
                          </C.DropDownList>
                        </C.DropDownListContainer>
                      </C.WidgetDropDownContainer>
                    )}

                    {!w.settingsExists && <C.EmptyDiv />}
                  </div>
                  */}
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


                        <Remote ref={widgetRef}
                          componentProps={{ ...props }}
                          system={{

                            remote: w.widget.appID,
                            url: w.url,

                            module: "./App",
                          }} />

                      )}

                      {dataSourceType === 0 && !datasourcesFound && (
                        <Remote ref={widgetRef}
                          componentProps={{ ...props }}
                          system={{

                            remote: w.widget.appID,
                            url: w.url,

                            module: "./App",
                          }} />

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

      console.log("WIDGETS ON VIEW", widgets);

      //setWidgetList(widgets);
      widgetSettings.current = currentViewSettings;
      setState({
        widgetConfig: currentViewConfig,
        //widgetSettings:currentViewSettings,
        widgetList: widgets,
        views: currentViews
      });
    }

    return () => {

      widgets = [];
      currentViewSettings = [];
      currentViewConfig = [];
      currentViews = [];

      console.log("CLEANUP....");
      removeCallbacks();
    };

  }, [isMountedRef, widgetConfigData, activeTab, reloadViewWidgets]);

  const onUpdate = data => {
    console.log("Update settings ", data, activeTab);
    //console.log("HOOK ", WidgetHooks);

    console.log("SETTINGS CURRENT", settings.current);

    console.log(settings.current, widgetSettings.current);
    // deep-copy...
    const currentSettings = JSON.parse(
      JSON.stringify(widgetSettings.current[settings.current.widget].currentSettings),
    );

    let systemSettingsUpdated = false;

    const currentAppId = widgetSettings.current[settings.current.widget].appId;
    let currentWidgetConfig = JSON.parse(JSON.stringify(state.widgetConfig));


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
      currentSettings[dataField] = data[k];
    });
    /*
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
    */

    const currentViewSettings = viewSettings.current;
    const currentWidgetSettings = widgetSettings.current;

    currentViewSettings[activeTab].widgets[currentAppId].currentSettings = currentSettings;
    currentWidgetSettings[settings.current.widget].currentSettings = currentSettings;

    console.log("UPDATED SETTINGS ", widgetSettings.current, currentAppId, currentViewSettings, currentWidgetSettings);



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

    //widgetSettings:
    //widgetConfig...
    if (systemSettingsUpdated) {
      console.log(
        "SystemSettingsUpdated ",
        systemSettingsUpdated,
        currentWidgetConfig,
      );
      // setWidgetConfig(currentWidgetConfig);

      setState({ widgetConfig: currentWidgetConfig })
    }
    widgetSettings.current = currentWidgetSettings;
    viewSettings.current = currentViewSettings;
    saveViewSettings(prifinaID, viewSettings.current).then(res => {
      setIsVisible(false);
    })

  };


  // VIEWS CONFIGURATION ================================================================================================================
  /*
    useEffect(() => {
      localStorage.setItem("views", JSON.stringify(views));
      console.log("log3");
    }, [views]);
  */
  /*
    const handleInputChange = e => {
      setView(e.target.value);
    };
  */
  /*
  const handleFormSubmit = e => {
    e.preventDefault();

    if (view !== "") {
      setViews([
        ...views,
        {
          // id: short.generate(),
          id: 'prifina-view-'+views.length,
          title: view.trim(),
        },
      ]);
    }

    setView("");
  };
*/
  /*
    function handleDeleteClick(id) {
      //console.log("DELE CLICK ",id)
      viewSettings.current.splice(id,1);
     // set new active tab 
      setActiveTab(viewSettings.current.length-1);
      
    }
  */
  //console.log("views", views);
  // console.log("view", view);
  // ================================================================================================================

  // ====================== MENU

  const toggling = () => setMenuOpen(!menuOpen);

  let menuRef = useRef(null);

  //FOR OUTSIDE CLICK CLOSE
  // function onOutsideClose(ref, state, setState, listener) {
  //   const handleClickOutside = event => {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       setState(false);
  //     }
  //   };

  //   useEffect(() => {
  //     document.addEventListener("menu", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("menu", handleClickOutside);
  //     };
  //   }, [ref, state]);

  //   return { ref, state, setState };
  // }
  // onOutsideClose(menuRef, menuOpen, setMenuOpen, "menu");

  // console.log("ref", menuRef);

  // ==========================================================================

  const addWidgetToView = (appID) => {
    console.log("ADD THIS WIDGET ", widgetConfigData.find(w => w.widget.appID === appID));
    console.log("VIEW SETTINGS ", viewSettings.current[activeTab]);
    const selectedWidget = widgetConfigData.find(w => w.widget.appID === appID);
    const currentPos = Object.keys(viewSettings.current[activeTab].widgets).length;

    viewSettings.current[activeTab].widgets[appID] = {
      order: currentPos,
      currentSettings: selectedWidget.currentSettings,
      settingsExists: selectedWidget.settings
    };
    saveViewSettings(prifinaID, viewSettings.current).then(res => {
      setReloadViewWidgets(!reloadViewWidgets);
    })

  }

  const removeWidget = (wi) => {

    console.log("Widget Index ", wi);
    console.log("Widget Index ", widgetSettings.current[wi]);

    const selectedWidgetAppId = widgetSettings.current[wi].appId;
    const currentViewSettings = viewSettings.current[activeTab];

    // later should also know the installCount index... if multiple widgets are installed on same view
    delete currentViewSettings.widgets[selectedWidgetAppId];
    viewSettings.current[activeTab] = currentViewSettings;

    saveViewSettings(prifinaID, viewSettings.current).then(res => {
      setReloadViewWidgets(!reloadViewWidgets);
    })

  }

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
                      widgetSettings={widgetSettings.current[settings.current.widget]}
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
          widgetSettings={widgetSettings.current}
          widgetConfigs={widgetConfigData}
          addWidget={addWidgetToView}
          viewName={state.views[activeTab].title}
        />
      )}
      <Navbar backgroundColor="white">
        <DisplayAppLogo style={{ marginTop: 17 }} />
      </Navbar>
      <C.PageContainer>
        <div
          style={{
            overflow: "hidden",
          }}
        >
          <C.CustomTabs
            activeTab={activeTab}
            onClick={tabClick}
            variant="rectangle"
          >
            <TabList
              style={{
                display: "flex",
                flexDirection: "row",
                maxWidth: 500,
                overflowX: "scroll",
              }}
            >
              {state.views.length > 0
                ? state.views.map((view, index) => (
                  <Tab key={"prifina-view-" + index} id={"prifina-view-" + index} ref={el => viewsRef.current[index] = el}>
                    {view.title}
                  </Tab>
                ))
                : null}
            </TabList>
            <TabPanelList style={{ backgroundColor: null, padding: 0 }}>
              {state.views.length > 0
                ? state.views.map((view, index) => (
                  <TabPanel
                    key={index}
                    style={{
                      height: "100vh",
                      paddingBottom: "50px",
                      overflow: "auto",
                    }}
                  >
                    <C.DropDownContainer
                      ref={menuRef}
                      id="dropdown-menu"
                      style={{ right: 120, alignSelf: "center" }}
                    >
                      <BlendIcon
                        iconify={mdiAddCircleOutline}
                        width="16px"

                        onClick={toggling}
                        color={colors.brandAccent}
                      />
                      {menuOpen && (
                        <C.DropDownListContainer>
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                            padding={10}

                          >
                            <Text fontSize="sm">Your Views</Text>
                            <C.StyledBlendIcon
                              iconify={mdiPencilOutline}
                              onClick={() => setEditView(!editView)}
                              width="13px"

                            />
                          </Flex>
                          {state.views.map((view, index) => (
                            <C.DropDownList style={{ paddingBottom: 10 }}>
                              {editView ? (
                                <C.ListItem key={"edit-view-" + index}>
                                  <Input
                                    height="25px"
                                    width="120px"
                                    defaultValue={view.title}
                                    ref={el => inputRef.current[index] = el}
                                    data-view={index}
                                    onKeyDown={ev => {
                                      const viewIndex = ev.currentTarget.dataset['view'];
                                      const viewTitle = inputRef.current[viewIndex].value;

                                      if (ev.key === "Enter" && viewTitle !== "") {
                                        ev.preventDefault();

                                        saveViewSettings(prifinaID, viewSettings.current).then(res => {
                                          viewsRef.current[viewIndex].innerText = viewTitle;
                                          viewSettings.current[viewIndex].view.title = viewTitle;
                                        })
                                      }
                                    }}
                                    onBlur={e => {
                                      // ref={el => itemsRef.current[i] = el} 
                                      //views[view.id].title = e.target.value;
                                      //setViews([...views]);

                                      const viewIndex = e.currentTarget.dataset['view'];
                                      const viewTitle = inputRef.current[viewIndex].value;

                                      console.log("EDIT VIEW ", inputRef, inputRef.current[viewIndex]);
                                      if (viewTitle !== "") {
                                        //console.log("TAB TITLE ",viewsRef.current[viewIndex],viewsRef.current[viewIndex].innerText);

                                        saveViewSettings(prifinaID, viewSettings.current).then(res => {
                                          viewsRef.current[viewIndex].innerText = viewTitle;
                                          viewSettings.current[viewIndex].view.title = viewTitle;
                                        })
                                      }

                                    }}
                                  />
                                  {index > 0 &&
                                    <C.StyledBlendIcon
                                      iconify={mdiTrashCanOutline}
                                      data-view={index}
                                      onClick={(e, index) => {
                                        e.preventDefault();
                                        //console.log("DELE CLICK ",index, e.currentTarget.dataset)
                                        viewSettings.current.splice(e.currentTarget.dataset['view'], 1);

                                        saveViewSettings(prifinaID, viewSettings.current);

                                        setEditView(!editView);
                                        setMenuOpen(!menuOpen);
                                        // set new active tab 
                                        setActiveTab(viewSettings.current.length - 1);
                                        //handleDeleteClick(index);
                                      }
                                      }
                                      width="13px"

                                    />
                                  }
                                </C.ListItem>
                              ) : (
                                <C.ListItem key={"edit-view-" + index}>
                                  <Text fontSize="sm">{view.title}</Text>
                                </C.ListItem>
                              )}
                            </C.DropDownList>
                          ))}

                          {editView && (
                            <>
                              <Divider
                                color="#E7DBF0"
                                foo="bar"
                                height="1px"
                                ml={16}
                                mr={16}
                                mt={5}
                                mb={5}
                              />
                              <div>
                                <C.ListItem
                                  style={{
                                    marginBottom: 10,
                                  }}
                                >
                                  <Input
                                    height="25px"
                                    width="120px"
                                    defaultValue=""
                                    placeholder="Create new view"

                                    ref={el => inputRef.current[viewSettings.current.length] = el}
                                    onKeyDown={ev => {
                                      const viewIndex = viewSettings.current.length
                                      const viewTitle = inputRef.current[viewIndex].value;

                                      if (ev.key === "Enter" && viewTitle !== "") {
                                        ev.preventDefault();
                                        viewSettings.current.push({ widgets: {}, view: { title: viewTitle } });
                                        saveViewSettings(prifinaID, viewSettings.current).then(res => {
                                          setEditView(!editView);
                                          setMenuOpen(!menuOpen);
                                          // set active tab +1 
                                          setActiveTab(viewSettings.current.length - 1);
                                          inputRef.current[viewIndex] = "";
                                          inputRef.current.push(null);
                                        })



                                      }
                                    }}
                                    mr={15}
                                  />
                                  <C.StyledBlendIcon
                                    iconify={fePlus}
                                    onClick={e => {
                                      e.preventDefault();
                                      const viewIndex = viewSettings.current.length
                                      const viewTitle = inputRef.current[viewIndex].value;
                                      if (viewTitle !== "") {
                                        // inputRef length is views +1 
                                        viewSettings.current.push({ widgets: {}, view: { title: viewTitle } });
                                        saveViewSettings(prifinaID, viewSettings.current).then(res => {
                                          setEditView(!editView);
                                          setMenuOpen(!menuOpen);
                                          // set active tab +1 
                                          setActiveTab(viewSettings.current.length - 1);
                                          inputRef.current[viewIndex] = "";
                                          inputRef.current.push(null);
                                        })



                                        //handleFormSubmit(e);
                                        //setView("");
                                        //console.log("EDIT VIEW ADD CLICK ",e);
                                      }

                                    }}
                                    width="13px"

                                  />
                                </C.ListItem>
                              </div>
                            </>
                          )}
                        </C.DropDownListContainer>
                      )}
                    </C.DropDownContainer>
                    <Divider color="#E7DBF0" foo="bar" height="1px" />
                    <div style={{ overflow: "auto" }}>
                      {state.widgetList.length > 0 ? (
                        <>
                          <C.WidgetContainer className="prifina-widget-container">

                            <C.WidgetList
                              widgetList={state.widgetList}
                              widgetData={state.widgetConfig}
                              currentUser={currentUser}
                              dataSources={dataSources}
                              openWidgetMenu={openWidgetMenu}
                            />

                            {state.widgetList.length <= 7 ? (
                              <C.AddWidget
                                onClick={() => {
                                  setAddWidgetModalOpen(true);
                                }}
                              />
                            ) : null}
                          </C.WidgetContainer>
                        </>
                      ) : (
                        <C.AddWidget
                          onClick={() => {
                            setAddWidgetModalOpen(true);
                          }}
                        />
                      )}
                    </div>
                  </TabPanel>
                ))
                : null}
            </TabPanelList>
          </C.CustomTabs>
        </div>
      </C.PageContainer>

      {widgetMenuOpen > -1 && (
        <C.WidgetDropDownContainer {...widgetMenuPos.current}
          /* ref={widgetMenuRef} */
          className="dropdown-menu+1"
        >
          <C.DropDownListContainer>
            <C.DropDownList>
              <C.InteractiveMenuItem
                title="Duplicate"
                iconify={mdiPlusBoxMultipleOutline}
              />

              <C.InteractiveMenuItem
                title="Remove"
                iconify={mdiEyeOffOutline}
                data-widgetindex={widgetMenuOpen}
                onClick={(e) => {
                  e.preventDefault();
                  const idx = parseInt(e.currentTarget.dataset['widgetindex']);
                  openWidgetMenu({}, idx);
                  //toggleWidgetMenu(parseInt(e.currentTarget.dataset['widgetindex']));
                  removeWidget(idx);
                }}
              />
              <Divider as="div" />
              <C.InteractiveMenuItem
                title="Settings >"
                iconify={mdiGearOutline}
                data-widgetindex={widgetMenuOpen}
                onClick={(e) => {
                  e.preventDefault();
                  //console.log("SETTINGS CLICK ",e.currentTarget.dataset,e.currentTarget.dataset['widgetindex']);
                  const idx = parseInt(e.currentTarget.dataset['widgetindex']);
                  openWidgetMenu({}, idx);
                  openSettings(idx);
                  //toggleWidgetMenu(parseInt(e.currentTarget.dataset['widgetindex']));
                  //openSettings(parseInt(e.currentTarget.dataset['widgetindex']));
                }}
              />
            </C.DropDownList>
          </C.DropDownListContainer>
        </C.WidgetDropDownContainer>
      )}
    </>
  );
};

DisplayApp.propTypes = {
  widgetConfigData: PropTypes.instanceOf(Array).isRequired,
  widgetViewSettings: PropTypes.instanceOf(Array).isRequired,
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