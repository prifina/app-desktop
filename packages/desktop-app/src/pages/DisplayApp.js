import React, { useRef, useState, useEffect, forwardRef } from "react";
import { usePrifina } from "@prifina/hooks";

//import html2canvas from "html2canvas";
//import ReactDOM from "react-dom";
import {
  useSprings,
  animated,
  config as SpringConfig,
} from "@react-spring/web";

import { RemoteComponent } from "../RemoteComponent";
import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";
//import i18n from "../lib/i18n";

//import widgetData from "./widgetData";
//import installedWidgets from "./installedWidgets";

import Amplify, { API as GRAPHQL, Storage } from "aws-amplify";
import config from "../config";

import gql from "graphql-tag";

import * as C from "./display-app/components";

//import { addSearchResultMutation, addSearchKeyMutation } from "../graphql/api";
/*
import { addSearchResult, addSearchKey } from "../graphql/mutations";
*/
import {
  addSearchResult,
  addSearchKey,
  i18n,
  getAthenaResults,
} from "@prifina-apps/utils";

import { PrifinaLogo } from "../components/PrifinaLogo";
import PropTypes from "prop-types";

import { Text, Button } from "@blend-ui/core";
const short = require("short-uuid");
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

const S3Config = {
  AWSS3: {
    bucket: config.S3.bucket, //REQUIRED -  Amazon S3 bucket name
    region: config.S3.region, //OPTIONAL -  Amazon service region
  },
};

const fn = animations => index => animations[index];

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
  console.log("DISPLAY APP ", prifinaID);
  const {
    check,
    currentUser,
    getLocalization,
    getSettings,
    setSettings,
    getCallbacks,
    registerClient,
    API,
    Prifina,
    activeRole,
  } = usePrifina();

  console.log("DISPLAY APP ", currentUser);
  console.log("DISPLAY APP DATASOURCES", dataSources);
  const WidgetHooks = new Prifina({ appId: "WIDGETS" });
  //console.log(check());
  Amplify.configure(S3Config);

  const [widgetList, setWidgetList] = useState([]);
  const [widgetConfig, setWidgetConfig] = useState(
    widgetConfigData.map((w, i) => {
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
      };
    }),
  );

  const [activeTab, setActiveTab] = useState(0);

  const [searchHistory, setSearchHistory] = useState(false);
  const searchBox = useRef();
  const [searchKey, setSearchKey] = useState("");

  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [finish, setFinish] = useState(false);
  //const [imagesReady, setImagesReady] = useState(false);
  //const widgetImage = useRef();
  const imageCache = useRef([]);

  const settings = useRef({
    left: "0px",
    top: "0px",
    height: "0px",
    width: "0px",
    widget: -1,
  });

  /*
  const images = [
    "https://prifina-apps-352681697435.s3.amazonaws.com/fNBCsuKbikFG7VahRjRNaN/assets/Clock.png",
    "https://prifina-apps-352681697435.s3.amazonaws.com/fNBCsuKbikFG7VahRjRNaN/assets/Sunny.png",
  ];
*/
  //const items = [{}, {}];
  const items = [
    {
      //transform: `perspective(1000px) rotateY(360deg)`,  // right-to-left
      transform: `perspective(1000px) rotateY(0deg)`,
      backgroundColor: `currentColor`,
      background: null,
      /* "https://prifina-apps-352681697435.s3.amazonaws.com/fNBCsuKbikFG7VahRjRNaN/assets/Sunny.png", */
    },
    {
      transform: null,
      background: "",
      backgroundColor: `white`,
    },
  ];
  const animationItems = useRef(items.map((_, index) => index));
  console.log("ITEMS ", animationItems);
  const [springs, setSprings] = useSprings(items.length, index => {
    return {
      from: {
        transform: items[index].transform,
        opacity: 1,
        width: "300px",
        height: "300px",
      },
      config: {
        mass: 5,
        tension: 400,
        friction: 150,
      },
    };
  });

  /*
  const [springs, setSprings] = useSprings(items.length, index => ({
    from: {
      transform: items[index].transform,
      opacity: 1,
    },
    config: {
      mass: 5,
      tension: 500,
      friction: 220,
    },
  }));
  */
  /*
  const { transform } = useSpring({
    transform: `perspective(600px) rotateX(${open ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 180 },
  });
*/
  console.log("SPRINGS ", springs);
  const refs = useRef([]);
  const settingsRef = useRef([]);
  const widgetSettings = useRef(
    widgetConfigData.map((w, i) => {
      //parse theme and sizes....
      const { theme, size } = getSystemSettings(
        w.widget.settings,
        w.currentSettings,
      );

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
      };
    }),
  );
  console.log("WIDGET SETTINGS after parsing theme&sizes ", widgetSettings);
  const roleKeys = ["", "work", "family", "hobbies"];

  const athenaSubscription = useRef(null);

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };

  useEffect(async () => {
    // browser cache images....
    const promises = widgetConfigData.map(src => {
      return new Promise(function (resolve, reject) {
        const img = new Image();
        img.src = src.widget.image;
        img.onload = resolve(img);
        img.onerror = reject();
        imageCache.current.push(src.widget.image);
      });
    });
    await Promise.all(promises).then(cachedImages => {
      console.log("Images loaded....", cachedImages);
      //imageCache.current = cachedImages;
      //setImagesReady(true);
    });
  }, []);

  const takeSnapshot = async w => {
    const DEFAULT_PNG = {
      fileName: "component.png",
      type: "image/png",
      html2CanvasOptions: {},
    };
    if (w !== -1) {
      /*
      const ww = document.querySelectorAll(
        "[data-widget-index='" + w + "']",
      )[0];

      const element = ReactDOM.findDOMNode(ww);
      const canvas = await html2canvas(element, {
        scrollY: -window.scrollY,
        useCORS: true,
        //backgroundColor: null,
        ...DEFAULT_PNG,
      });
      const f = canvas.toDataURL(DEFAULT_PNG.type, 1.0);
      //console.log("FILE2 ", f);
      console.log("NEW SNAPSHOT TAKEN...");
      */
      //widgetImage.current = f;
      //widgetImage.current = "https://via.placeholder.com/400";
      //setOpen(true);
      //setWidgetImage(f);
    }
  };
  const openSettings = w => {
    if (!open) {
      console.log("CLICK...", w);
      //console.log("REFS...", refs.current[0].getBoundingClientRect());
      //const ww = refs.current[w].getBoundingClientRect();
      //console.log(document.querySelectorAll("[data-widget-index='" + w + "']"));

      const ww = document
        .querySelectorAll("[data-widget-index='" + w + "']")[0]
        .getBoundingClientRect();
      // const element = ReactDOM.findDOMNode(refs.current[settings.widget]);
      //const ww = { left: 0, top: 0, height: 0, width: 0 };
      console.log("WW...", ww);

      settings.current = {
        left: ww.left + "px",
        top: ww.top + "px",
        height: ww.height + "px",
        width: ww.width + "px",
        widget: w,
      };
      /*
      animationItems.current = [
        {
          opacity: 1,
          transform: `perspective(1000px) rotateX(${open ? 180 : 0}deg)`,
          //transform: `perspective(1000px) rotateY(180deg)`,
          height: ww.height + "px",
          width: ww.width + "px",
          visibility: "visible",
          //reset: true,
          config: {
            mass: 5,
            tension: 500,
            friction: 220,
          },
        },
        
        {
          delay: 500,
          reset: true,
          from: {
            transform: "none",
            width: ww.width + "px",
            height: ww.height + "px",
            visibility: "hidden",
          },
          to: {
            transform: "none",
            width: "400px",
            height: "400px",
            visibility: "hidden",
          },
        },
        
      ];
*/
      //setSprings(fn(animationItems.current));

      //takeSnapshot(w);

      setSprings(index => {
        if (index === 0) {
          return {
            //transform: `perspective(1000px) rotateY(180deg)`, right-toleft

            transform: `perspective(1000px) rotateY(150deg)`,
            onRest: () => {
              setFlipped(true);
              setFinish(true);
            },
          };
        }

        return {
          transform: null,

          opacity: 0,
          from: {
            width: "300px",
            height: "300px",
          },
          to: {
            width: "400px",
            height: "400px",
          },
          config: { ...SpringConfig.molasses, duration: 3500 },
          onRest: () => {
            //setFinish(true);
          },
        };
      });

      setOpen(true);
    }
  };

  useEffect(() => {
    let ignore = false;
    console.log("OPEN CHANGE ", open);
    if (false) {
      //if (open) {
      //console.log("REFS....", document.querySelectorAll(".prifina-widget[data-widget-index='0']"));
      //console.log("REFS....", document.querySelectorAll(".prifina-widget"));
      /*
      animationItems.current = [
        {
          opacity: 1,
          transform: `perspective(1000px) rotateY(180deg)`,
          width: settings.current.width,
          height: settings.current.height,
          visibility: "visible",
          config: { mass: 5, tension: 500, friction: 80 },
          reset: true,
          onStart: () => {
            // hide widget...
            //refs.current[settings.widget].style.visibility = "hidden";
          },
        },
        {
          delay: 500,
          reset: true,
          from: {
            transform: "none",
            width: settings.current.width,
            height: settings.current.height,
            visibility: "visible",
          },
          to: {
            transform: "none",
            width: "400px",
            height: "400px",
            visibility: "visible",
          },
          onStart: () => {
            if (settingsRef.current[0]) {
              //console.log("ENDS...", settingsRef.current[0]);
              setFlipped(true);
              //settingsRef.current[0].style.display = "none";
            }
          },
          onRest: () => {
            if (settingsRef.current[1]) {
              //console.log("ENDS...", settingsRef.current[1]);
              // settingsRef.current[0].style.visibility = "hidden";
            }
          },
        },
      ];
*/
      //setSprings(fn(animationItems.current));
    } else {
      if (settings.current.widget != -1) {
        console.log("INIT SPRINGS....");

        settingsRef.current = [];
        if (flipped && finish) {
          setSprings(index => {
            return {
              from: {
                transform: items[index].transform,
                opacity: 1,
                width: "300px",
                height: "300px",
              },
              config: {
                mass: 5,
                tension: 500,
                friction: 220,
              },
            };
          });
        }

        setFlipped(false);
        setFinish(false);
      }
    }
    return () => {
      ignore = true;
    };
  }, [open]);

  useEffect(() => {
    registerClient([appSyncClient, GRAPHQL, Storage]);

    athenaSubscription.current = appSyncClient
      .subscribe({ query: gql(getAthenaResults), variables: { id: prifinaID } })
      .subscribe({
        next: res => {
          console.log("ATHENA SUBS RESULTS ", res);
          /*
          data:
          athenaResults:
          appId: "866fscSq5Ae7bPgUtb6ffB"
          content:
          id
          */
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

    /*
    let data = installedWidgets.map(w => {
      return {
        url: widgetData[w].url,
        settings: widgetData[w].settings.length > 0,
        currentSetting: {},
      };
    });
*/
    console.log("WIDGET CONFIG ", widgetConfig);
    /*
    //await getSettings(appID, "f902cbca-8748-437d-a7bb-bd2dc9d25be5")
    let allSettings = [];
    getSettings("", "f902cbca-8748-437d-a7bb-bd2dc9d25be5").then(res => {
      //console.log("SETTINGS ", res);
      const widgets = JSON.parse(res.data.getInstalledWidgets.installedWidgets);
      console.log("INSTALLED ", widgets);
      widgetSettings.current = widgetConfig.map((w, i) => {
        let defaultValues = {};
        if (w.settings) {
          w.widget.settings.forEach(v => {
            // if type=text...
            defaultValues[v.value] = "";
          });
          if (widgets.hasOwnProperty(w.widget.appID)) {
            //console.log("SEETINGS FOUND ", w.widget.appID);
            widgets[w.widget.appID].forEach(w => {
              if (defaultValues.hasOwnProperty(w.field)) {
                defaultValues[w.field] = w.value;
              }
            });
          }
        }
        widgetConfig[i].currentSetting = defaultValues;
        return {
          settings: w.widget.settings || [],
          title: w.widget.title,
          appId: w.widget.appID,
          currentSetting: defaultValues,
        };
      });

      console.log("WIDGET CONFIG 2", widgetConfig);
    });
    */
    /*
    widgetSettings.current = widgetConfig.map((w, i) => {
      let defaultValues = {};
      console.log("WIDGET SETTINGS ", w);
      if (w.settings) {
        w.widget.settings.forEach(v => {
          // if type=text...
          defaultValues[v.value] = "";
        });
        allSettings.push(getSettings(w));
      } else {
        allSettings.push(Promise.resolve({}));
      }

      return {
        settings: w.widget.settings || [],
        title: w.widget.title,
        appId: w.widget.appID,
        currentSetting: defaultValues,
      };
    });
    */
    /*
    Promise.all(allSettings).then(r => {
      //console.log("GET SETTINGS ", r);
      r.forEach((d, i) => {
        //console.log("GET SETTINGS 2", d);
        let defaultValues = {};
        if (Object.keys(d).length > 0) {
          Object.keys(d).forEach(k => {
            defaultValues[k] = d[k];
          });
          widgetConfig[i].currentSetting = defaultValues;
          widgetSettings.current[i].currentSetting = defaultValues;
        }
      });
      //console.log("WIDGET CONFIG ", data);
      //setWidgetConfig(data);
    });
    */
    /*
    console.log("GET SETTINGS ", d);
        if (Object.keys(d).length > 0) {
          Object.keys(d).forEach(k => {
            defaultValues[k] = d[k];
          });
        }
        data[i].currentSetting = defaultValues;

    console.log("WIDGET CONFIG ", data);
    setWidgetConfig(data);
    */
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
    if (widgetConfig.length > 0) {
      console.log("CREATE WIDGETS...");
      const widgets = widgetConfig.map((w, i) => {
        console.log("WIDGET COMPONENT ", w);
        //React.forwardRef((props, ref) =>
        let dataSourceModules = {};

        Object.keys(dataSources).forEach(s => {
          for (let m = 0; m < dataSources[s].modules.length; m++) {
            const moduleName = dataSources[s].modules[m];
            dataSourceModules[moduleName] = {
              source: s,
              sourceType: dataSources[s].sourceType,
            };
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
                  <C.IconDiv open={props.open} onClick={() => openSettings(i)}>
                    <BlendIcon iconify={bxCog} />
                  </C.IconDiv>
                  */}
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

        //const Widget = (props) => <RemoteComponent url={remoteUrl} {...props} />;

        //return <Widget key={"prifina-widget-" + i} test={"ok"} />;
        return Widget;
      });
      //refs.current = widgets;
      // <RemoteComponent url={remoteUrl} fallback={<div>Testing...</div>} />;
      console.log("WIDGETS ", widgets);

      setWidgetList(widgets);
    }
  }, [widgetConfig]);

  const onUpdate = data => {
    console.log("Update settings ", data);
    console.log("HOOK ", WidgetHooks);
    //console.log(getCallbacks());
    console.log(settings.current, widgetSettings);
    // deep-copy...
    const currentSettings = JSON.parse(
      JSON.stringify(
        widgetSettings.current[settings.current.widget].currentSettings,
      ),
    );
    //console.log("CURRENT SETTINGS COPY", currentSettings);
    let systemSettingsUpdated = false;

    let currentWidgetConfig = JSON.parse(JSON.stringify(widgetConfig));
    Object.keys(data).forEach(k => {
      let dataField = k;
      // check system settings... and update widgetConfig
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
    /*
    for (let s = 0; s < newSettings.length; s++) {
      // only keep field+values
      delete newSettings[s].label;
      delete newSettings[s].type;
      console.log("NEW SETTING LOOP ", newSettings[s]);
      if (newSettings[s].field === "size" && data.hasOwnProperty("sizes")) {
        newSettings[s].value = data["sizes"];
      } else if (data.hasOwnProperty(newSettings[s].field)) {
        newSettings[s].value = data[newSettings[s].field];
      }
    }
    */

    /*
    Object.keys(data).forEach(k => {
      widgetSettings.current[settings.current.widget].currentSetting[k] =
        data[k];
      newSettings.push({ field: k, value: data[k] });
    });
    */

    const currentAppId = widgetSettings.current[settings.current.widget].appId;
    //"f902cbca-8748-437d-a7bb-bd2dc9d25be5"
    /*
    input WidgetSettingInput {
      field: String!
      value: String!
    }
*/
    console.log("NEW SETTINGS ", newSettings, currentAppId);
    console.log("UPDATED SETTINGS ", widgetSettings.current, currentAppId);
    // useCallback((appID, uuid, settings = [{}])

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

    //setWidgetData([data]);
    //setOpen(false);
    //console.log(check());
    /*
    console.log(settings, widgetSettings[settings.current.widget]);
    const currentSettings = widgetSettings[settings.current.widget];
    console.log(prifina.getCallbacks());
    const c = prifina.getCallbacks();
    if (typeof c[currentSettings.appID] === "function") {
      prifina.setSettings(currentSettings.appID, data);
      c[currentSettings.appID](data);
      setOpen(false);
    }
    */
    setSprings(index => {
      return {
        from: {
          transform: items[index].transform,
          opacity: 1,
          width: "300px",
          height: "300px",
        },
        config: {
          mass: 5,
          tension: 500,
          friction: 220,
        },
      };
    });

    setOpen(false);
    setFlipped(false);
    setFinish(false);

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

  const saveSearchKey = async searchKey => {
    if (searchKey.length > 0)
      await appSyncClient.mutate({
        mutation: gql(addSearchKey),
        variables: {
          input: {
            owner: currentUser.uuid,
            searchKey: searchKey,
            role: activeTab === 0 ? "" : roleKey[activeTab],
          },
        },
      });

    /*
      addSearchKeyMutation(GRAPHQL, {
        owner: currentUser.uuid,
        searchKey: searchKey,
        role: activeTab === 0 ? "" : roleKey[activeTab],
      });
      */
    /*
input SearchKeyInput {
	owner: String!
	searchKey: String
	role: String
}
*/
  };
  const saveSearchResult = async (searchKey, searchResult) => {
    if (searchKey.length > 0) {
      const searchBuckeyKey = "search-results/" + short.generate() + ".json";

      await appSyncClient.mutate({
        mutation: gql(addSearchResult),
        variables: {
          input: {
            owner: currentUser.uuid,
            searchKey: searchKey,
            role: activeTab === 0 ? "" : roleKey[activeTab],
            selectedResult: searchBuckeyKey,
          },
        },
      });

      /*
      addSearchResultMutation(GRAPHQL, {
        owner: currentUser.uuid,
        searchKey: searchKey,
        role: activeTab === 0 ? "" : roleKey[activeTab],
        selectedResult: searchBuckeyKey,
      });
      */
      await Storage.put(searchBuckeyKey, JSON.stringify(searchResult), {
        level: "public",
        contentType: "application/json",

        metadata: {
          owner: currentUser.uuid,
          searchKey: searchKey,
          created: new Date().toISOString(),
        },
      });
    }

    /*

input SearchResultInput {
	owner: String!
	searchKey: String!
	selectedResult: AWSJSON
}

*/
  };
  /*
  useEffect(() => {
    if (widgetList.length > 0) {
      const widgets = document.querySelectorAll(
        ".prifina-widget >*:first-child",
      );
      console.log(widgets);
      widgets.forEach((w, i) => {
        console.log(w.getBoundingClientRect());
      });
    }
  }, [widgetList]);
*/
  return (
    <>
      {open && (
        <C.ModalBackground
          className={"widget-modal"}
          onClick={e => {
            console.log("TARGET ", e);
            console.log("WIDGET SETTINGS ", refs.current, settings);
            console.log("MODAL ", e.target.className);

            if (e.target.className.indexOf("widget-modal") > -1) {
              setOpen(false);
            }
          }}
        >
          {springs.map((props, i) => {
            console.log("PROPS ", i, props);
            console.log("IMAGE ", imageCache.current);
            // widget settings...
            console.log(settings.current);
            console.log(widgetSettings);

            return (
              <animated.div
                style={{
                  transform: props.transform,
                  /*opacity: props.opacity, */
                  left: settings.current.left,
                  top: settings.current.top,

                  width: props.width,
                  height: props.height,

                  position: "absolute",

                  /*border: i === 0 ? "2px outset" : null,*/
                  borderRadius: i === 0 ? "8px" : null,
                  visibility: open ? "visible" : "hidden",
                  /*
                  visible: props.transform.interpolate(
                    [0, 150],
                    ["visible", "hidden"],
                  ),
                  */
                  zIndex: 50,
                  backgroundSize: "cover",
                  /*backgroundColor: flipped ? "white" : null,*/
                  backgroundImage:
                    i > 0
                      ? null
                      : flipped
                      ? null
                      : `url(${imageCache.current[settings.current.widget]})`,
                }}
                ref={ref => {
                  if (ref !== null) settingsRef.current.push(ref);
                }}
                key={"animated-" + i}
              >
                {finish && i === 1 && (
                  <C.SettingsDiv>
                    <C.SettingsDialog
                      spring={i}
                      flipped={flipped}
                      open={open}
                      onUpdate={onUpdate}
                      widgetIndex={settings.current.widget}
                      widgetSettings={
                        widgetSettings.current[settings.current.widget]
                      }
                    />
                  </C.SettingsDiv>
                )}
              </animated.div>
            );
          })}
        </C.ModalBackground>
      )}

      <PrifinaLogo title={"Display App"} />
      <C.PageContainer>
        <div
          style={{
            overflow: "hidden",
          }}
        >
          <Tabs
            activeTab={activeTab}
            onClick={tabClick}
            style={{ height: "100%" }}
            variant={"line"}
          >
            <TabList>
              <Tab>
                <C.TabText>{currentUser.name}</C.TabText>
              </Tab>
              <Tab>
                <C.TabText>Work</C.TabText>
              </Tab>
              <Tab>
                <C.TabText>Family</C.TabText>
              </Tab>
              <Tab>
                <C.TabText>Hobbies</C.TabText>
              </Tab>
            </TabList>
            <TabPanelList style={{ backgroundColor: null }}>
              <TabPanel
                style={{
                  height: "100vh",
                  paddingBottom: "50px",
                  overflow: "auto",
                }}
              >
                {/* 
              <div style={{ overflow: "hidden" }}>
                <C.SearchBox
                  ref={searchBox}
                  showHistory={setSearchHistory}
                  chevronOpen={searchHistory}
                  searchKey={setSearchKey}
                  searchOpen={searchKey.length > 0}
                  saveSearchKey={saveSearchKey}
                />
                {searchKey.length > 0 && !searchHistory && (
                  <C.SearchResults
                    searchBox={searchBox}
                    searchKey={searchKey}
                    roleKey={roleKeys[activeTab]}
                    saveSearchResult={saveSearchResult}
                  />
                )}
                {searchHistory && <C.SearchHistory searchBox={searchBox} />}
              </div>
*/}
                <div style={{ overflow: "auto" }}>
                  <C.WidgetContainer className={"prifina-widget-container"}>
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
              <TabPanel>Work panel</TabPanel>
              <TabPanel>Family panel</TabPanel>
              <TabPanel>Hobbies panel</TabPanel>
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
  dataSources: PropTypes.instanceOf(Array),
};

export default DisplayApp;
