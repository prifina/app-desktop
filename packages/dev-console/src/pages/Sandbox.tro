/* eslint-disable react/display-name */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  forwardRef,
  useReducer,
  useContext,
  createContext,
} from "react";

import { PrifinaProvider, PrifinaContext, usePrifina } from "@prifina/hooks-v2";
import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";

import gql from "graphql-tag";
import {
  useAppContext,
  createClient,
  getPrifinaUserQuery,
  updateUserProfileMutation,
  getAthenaResults,
  useFormFields,
  getAppVersionQuery,
  updateAppVersionMutation,
  i18n,
  checkUrl,
} from "@prifina-apps/utils";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router";

import { Box, Flex, Text, Button, Input, useTheme } from "@blend-ui/core";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import { useToast } from "@blend-ui/toast";

//import { useRemoteComponent } from "../useRemoteComponent";

import { Remote } from "@prifina-apps/remote";
import styled, { keyframes } from "styled-components";
import ReactJson from "react-json-view";

import PropTypes from "prop-types";

import { BlendIcon } from "@blend-ui/icons";

import SystemSettingsSandbox from "../components/SystemSettingsSandbox";
import SettingsSandbox from "../components/SettingsSandbox";

import ErrorStateScreen from "../components/ErrorStateScreen";

import mdiPowerPlug from "@iconify/icons-mdi/power-plug";
import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";
import mdiArrowExpand from "@iconify/icons-mdi/arrow-expand";

import bxSun from "@iconify/icons-bx/sun";
import bxMoon from "@iconify/icons-bx/moon";

import feClose from "@iconify/icons-fe/close";

import UploadAsset from "../components/UploadAsset";

import * as C from "../components/components";

const SandboxContext = createContext(null);

const breatheAnimation = keyframes`
0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
50% {opacity: 1.0;}
100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;}
webkit-animation: pulsate 0.03 ease-out;
webkit-animation-iteration-count: infinite; 
`;
const Circle = styled.div`
width: 9px;
height: 9px;
background-color: #62bd19;
border-radius: 50%;
position: absolute;

}
`;

const Ring = styled.div`
border: 3px solid #62bd19;
-webkit-border-radius: 30px;
height: 25px;
width: 25px;
position: absolute;
left: -8px;
top: -8px;
-webkit-animation: pulsate 2s ease-out;
-webkit-animation-iteration-count: infinite; 
opacity: 0.0
}
animation-name: ${breatheAnimation};
`;

const Container = styled.div`
  position: relative;
  margin-bottom: 5px;
  margin-left: 10px;
`;

const Breathe = () => {
  return (
    <Container>
      <Circle />
      <Ring />
    </Container>
  );
};

const BottomContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: ${props => props.height}px;
  background-color: ${props => props.theme.colors.baseMuted};
  border-radius: 16px 16px 0px 0px;
  border-top: 1px solid #4b484a;
`;

const WidgetWrapper = styled.div`
  width: 100%;
  height: 100%;
  // border: 2px outset;
  border-radius: 8px;
`;

const IconDiv = styled.div`
  &:hover {
    transform: scale(0.9);
    box-shadow: 3px 2px 30px 1px rgb(0 0 0 / 24%);
  }
  height: 20px;
  width: 20px;
  /*
  position: relative;
  left: 290px;
  top: 20px;
  */
  position: absolute;
  // left: 275px;
  // top: 15px;

  left: ${props => props.position.left};
  top: ${props => props.position.top};

  opacity: 1;
  cursor: ${props => (props.open ? "default" : "pointer")};
  background-image: radial-gradient(
    circle,
    ${props => (props.widgetTheme === "dark" ? "black" : "white")} 2px,
    transparent 0px
  );
  background-size: 100% 33.33%;
  z-index: 10;
`;

const RedStatusCircle = styled.div`
  margin-left: 10px;
  margin-top: 2px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
`;

const TypeBadge = styled.span`
  height: 18px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 8px;
  padding-left: 8px;
  font-size: 10px;
  border: 1px solid ${props => (props.type === 2 ? "#FC62C1" : "#CB8E12")};
  color: ${props => (props.type === 2 ? "#FC62C1" : "#CB8E12")};
`;

export const CustomSelect = styled.select`
  border-radius: 8px;
  border: 1px solid: #6B6669;
  color: #F5F8F7DE;
  padding: 5px;
  font-size: 12px;
  background: transparent;
  height: 32px;
  width: 110px;
  outline: none;
  cursor:pointer;

`;

const IconContainer = styled(Flex)`
  border-radius: 2px;
  padding: 4px;
  background: ${props => (props.disabled === true ? "#4B484A" : "gray")};
  height: 32px;
  width: 32px;
  cursor: pointer;

  :active {
    background: ${props => (props.disabled === true ? null : "lightgray")};
  }
`;

//const Widget = forwardRef((props, ref) => {

//const Content = ({ appSyncClient, url, prifinaID, ...props }) => {
const Content = forwardRef((props, ref) => {
  const { appSyncClient, url, prifinaID, updateDebug, appSettings, appID } =
    props;
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
  const { update } = useContext(SandboxContext);

  console.log("APP-ID", appID, stage);
  //https://prifina-apps-352681697435-eu-west-1.s3.eu-west-1.amazonaws.com/x866fscSq5Ae7bPgUtb6ffB/0.0.1/remoteEntry.js
  //REACT_APP_PRIFINA_APPS_BUCKET=prifina-apps-352681697435-eu-west-1
  /*
  const remoteUrl = [
    "https:/",
    process.env.REACT_APP_PRIFINA_APPS_BUCKET + ".s3.amazonaws.com",
    w.id,
    widgetData[w.id].version,
    "remoteEntry.js",
  ].join("/");
  */

  console.log("appsett", appSettings);

  const athenaSubscription = useRef({});
  let settingsInit = {};
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
  /*
  // const debugUpdate = useCallback(content => {
  const debugUpdate = content => {
    console.log("DEBUG ", states);

    //  if (states.isOpen) {
    const newContent = states.content;
    newContent.unshift(content);
    console.log("DEBUG 2", newContent);
    update({
      content: newContent,
    });
    //}
  };
  */

  function stringify(obj) {
    if (typeof obj !== "object" || obj === null || obj instanceof Array) {
      console.log("WRONG OBJ TYPE ", typeof obj);
      return value(obj);
    }

    const logicalOperators = Object.getOwnPropertySymbols(obj);
    const objKeys = Object.keys(obj);
    if (logicalOperators.length > 0) {
      return (
        "{" +
        logicalOperators
          .map(function (k) {
            if (typeof k === "symbol") {
              return '"' + k.toString() + '":' + value(obj[k]);
            } else {
              return null;
            }
          })
          .filter(function (i) {
            return i;
          }) +
        "}"
      );
    }

    if (objKeys.length > 0) {
      return (
        "{" +
        objKeys
          .map(function (k) {
            return typeof obj[k] === "function"
              ? null
              : '"' + k + '":' + value(obj[k]);
          })
          .filter(function (i) {
            return i;
          }) +
        "}"
      );
    }

    /*
    return '{' + Object.keys(obj).map(function (k) {
        return (typeof obj[k] === 'function') ? null : '"' + k + '":' + value(obj[k]);
    }).filter(function (i) { return i; }) + '}';
    */
  }

  function value(val) {
    //console.log("VAL TYPE ",typeof val);
    switch (typeof val) {
      case "string":
        return '"' + val.replace(/\\/g, "\\\\").replace('"', '\\"') + '"';
      case "number":
      case "boolean":
        return "" + val;
      case "function":
        return "null";
      case "symbol":
        return val.toString();
      case "object":
        if (val instanceof Date) return '"' + val.toISOString() + '"';
        if (val instanceof Array) return "[" + val.map(value).join(",") + "]";
        if (val === null) return "null";
        return stringify(val);
    }
  }

  const updateTest = data => {
    console.log("UPDATE TEST ", data, Object.keys(data));
    const payload = Object.assign({}, data);

    if (data.hasOwnProperty("connectorFunction")) {
      console.log("QUERY UPDATE ");
      //console.log("SERIALIZE ",stringify(data.query.filter));
      // data.query.filter=stringify(data.query.filter);
      //const filter=Object.assign({},data.query.filter);
      /*
       const filter=stringify(data.connectorFunction.filter);
       delete payload.connectorFunction;
       payload[data.connectorFunction.name]=data.connectorFunction;
       payload[data.connectorFunction.name].filter=filter;
       */
    }
    updateDebug(payload);
  };
  useEffect(() => {
    onUpdate("sandbox", updateTest);
    registerClient([appSyncClient, GRAPHQL, Storage]);

    athenaSubscription.current = appSyncClient
      .subscribe({ query: gql(getAthenaResults), variables: { id: prifinaID } })
      .subscribe({
        next: res => {
          console.log("ATHENA SUBS RESULTS ", res);
          const currentAppId = res.data.athenaResults.appId;

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
          update(JSON.parse(res.data.athenaResults.data));

          /*

           if (state.isOpen) {
      const newContent = state.content;
      newContent.unshift(content);
      console.log("DEBUG 2", newContent);
      setState({
        content: newContent,
      });
    }
          update(res.data.athenaResults.data);
          console.log("STATES ", getStates());
          console.log("CURRENT STATES ", currentStates);
          */
        },
        error: error => {
          console.log("ATHENA SUBS ERROR ");
          console.error(error);
          // update({ ERROR: JSON.stringify(error) });
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

  if (props.widget) {
    return (
      <>
        <div
          ref={ref}
          style={{
            width: props.size.width,
            height: props.size.height,
            margin: "10px",
            position: "relative",
          }}
        >
          <IconDiv
            widgetTheme={props.theme}
            position={{ left: props.position.left, top: props.position.top }}
            onClick={() => {
              // test sending settings...

              const settingsUpdate = {
                settings: {
                  city: "Helsinki",
                },
              };

              const c = getCallbacks();
              console.log("CALLBACKS ", c);
              if (
                c.hasOwnProperty(appID) &&
                typeof c[appID][0] === "function"
              ) {
                console.log("FOUND CALLBACK ");

                c[appID][0](settingsUpdate);
              }
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <WidgetWrapper>
              <Remote
                ref={ref}
                componentProps={{ ...settingsInit }}
                system={{
                  //remote: "x866fscSq5Ae7bPgUtb6ffB",

                  //remote: "cECGHdLTCpjaimqviz7N2s",
                  //remote: "sCUiMz2m9JsRSnRJ5favnP",
                  //remote: "csd88KWnuft8fHfMrKSBAD",

                  //remote: appID,
                  remote: "o3CH1e2kbrLgBxjbG2iLzd",
                  //url: appSettings.remoteUrl,
                  url: "dist/remoteEntry.js",
                  //url:"http://internal.prifina.com.s3-website-us-east-1.amazonaws.com/dist/remoteEntry.js",
                  //url: "https://cdn.jsdelivr.net/gh/data-modelling/builder-plugins@main/packages/json-view/dist/remoteEntry.js",
                  //https://github.com/tro9999/module-federation-examples/blob/master/dynamic-system-host/app2/dist/remoteEntry.js

                  module: "./App",
                }}
              />
            </WidgetWrapper>
          </div>
        </div>
      </>
    );
  } else {
    return null;
    {
      /* return <RemoteContent url={url} ref={ref} {...settingsInit} />;
       */
    }
  }
});

Content.propTypes = {
  //Component: PropTypes.elementType.isRequired,
  appSyncClient: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  prifinaID: PropTypes.string.isRequired,
};

const Sandbox = props => {
  console.log("SANDBOX --->", props, props.hasOwnProperty("app"));

  const { colors } = useTheme();

  const toast = useToast();

  const { AUTHConfig, APIConfig, userAuth, currentUser } = useAppContext();
  //const activeUser = useRef({});

  //const history = useHistory();

  const navigate = useNavigate();

  const location = useLocation();

  let allValues = location.state.allValues;

  console.log("hist", allValues);

  // const currentAppId = "866fscSq5Ae7bPgUtb6ffB";
  const currentAppId = allValues.id;
  const componentProps = useRef({});
  const [ready, setReady] = useState(false);
  const [asyncContent, setAsyncContent] = useState([]);
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      size: { y: 35 },
      isOpen: false,
      updated: new Date().toString(),
    },
  );

  const remoteRef = useRef();
  const currentAppRef = useRef({});

  const [validUrl, setValidUrl] = useState(allValues.remoteUrl);
  const [validStatus, setValidStatus] = useState();

  const [remoteLink, setRemoteLink] = useState("");

  const [render, setRender] = useState(false);

  function handleCheckUrl(event) {
    checkUrl(event.target.value)
      .then(result => setValidUrl(result))
      .then(setRemoteLink(event.target.value))
      .catch(err => console.log("error", err));
  }

  checkUrl(validUrl)
    .then(result => setValidStatus(result))
    .catch(err => console.log("error validStatus", err));

  console.log("check url valid", validUrl);
  console.log("check remote link valid", remoteLink);
  console.log("check valid status", validStatus);

  useEffect(() => {
    async function init() {
      // const remoteAppUrl = localStorage.getItem("remoteWidget")
      // https://prifina-apps-352681697435-eu-west-1.s3.eu-west-1.amazonaws.com/1u3f465t4cNSWYiyKFVwBG/0.0.1/main.bundle.js
      //componentProps.current = { url: remoteApp };

      const remoteAppUrl = allValues.remoteUrl;

      const session = await Auth.currentSession();
      const prifinaID = session.idToken.payload["custom:prifina"];
      const currentPrifinaUser = await getPrifinaUserQuery(GRAPHQL, prifinaID);

      console.log("CURRENT USER ", currentPrifinaUser);
      let appProfile = JSON.parse(
        currentPrifinaUser.data.getPrifinaUser.appProfile,
      );

      const currentApp = await getAppVersionQuery(GRAPHQL, currentAppId);
      console.log("currentApp", currentApp);
      currentAppRef.current = {
        appID: currentAppId,
        settings: currentApp.data.getAppVersion.settings,
        remoteUrl: currentApp.data.getAppVersion.remoteUrl,
      };
      if (currentAppRef.current.settings === null) {
        currentAppRef.current.settings = [];
      }

      console.log("APP INFO", currentAppRef.current);
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

      const client = await createClient(clientEndpoint, clientRegion, session);
      componentProps.current.appSyncClient = client;
      componentProps.current.prifinaID = prifinaID;
      componentProps.current.initials = appProfile.initials;
      componentProps.current.url = remoteAppUrl;
      componentProps.current.widget = true;
      componentProps.current.appID = currentAppId;

      console.log("COMPONENT PROPS....", componentProps);

      if (remoteAppUrl === null) {
        setReady(false);
      } else {
        setReady(true);
      }
    }
    init();
  }, []);

  // const debugUpdate = useCallback(content => {
  const debugUpdate = data => {
    console.log("DEBUG ", state, data);

    // if (state.isOpen) {
    //const newContent = asyncContent;
    //content=content.replace(/\"/g, "").split("\n");
    //newContent.unshift({ ...data });
    //console.log("DEBUG 2", newContent);
    updateDebugInfo(data);
    //setAsyncContent(newContent);
    //setState({ updated: new Date().toString() });
  };
  //}, []);

  const updateDebugInfo = data => {
    let newContent = asyncContent;
    const maxElements = 20;
    if (newContent.length > maxElements) {
      newContent = newContent.slice(0, maxElements);
    }
    newContent.unshift({ ...data });
    console.log("UPDATE DEBUG", newContent);
    setAsyncContent(newContent);
    setState({ updated: new Date().toString() });
  };

  const onSubmitSystemSettings = (e, data) => {
    currentAppRef.current = {
      appID: currentAppId,
      settings: data,
    };

    console.log("currentappref", currentAppRef.current);

    updateAppVersionMutation(GRAPHQL, {
      id: currentAppRef.current.appID,
      settings: currentAppRef.current.settings,
    }).then(res => {
      console.log("UPDATE ", res);
      toast.success("System settings updated", {});
    });

    setRender(prevValue => !prevValue);
    e.preventDefault();
  };

  const onUpdateSettings = (e, data) => {
    currentAppRef.current = {
      appID: currentAppId,
      settings: JSON.parse(data),
    };
    updateAppVersionMutation(GRAPHQL, {
      id: currentAppRef.current.appID,
      settings: currentAppRef.current.settings,
    }).then(res => {
      console.log("UPDATE ", res);
      toast.success("Settings updated", {});
    });

    e.preventDefault();
  };

  const onUpdateRemoteLink = () => {
    currentAppRef.current = {
      appID: currentAppId,
      remoteUrl: remoteLink,
    };
    updateAppVersionMutation(GRAPHQL, {
      id: currentAppRef.current.appID,
      remoteUrl: currentAppRef.current.remoteUrl,
    }).then(res => {
      console.log("UPDATE ", res);
      toast.success("Remote link updated", {});
      window.location.reload();
    });
  };

  const [activetab, setactivetab] = useState(0);

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setactivetab(tab);
  };

  const settingsArray = currentAppRef.current.settings;

  console.log("Settings array ", settingsArray);
  console.log("Settings array ", currentAppRef);

  const availableSettings = useRef([]);

  let sizes = [];
  let themes = [];

  if (settingsArray !== undefined) {
    let sizeValues = JSON.parse(settingsArray[0].value);
    let themeValues = JSON.parse(settingsArray[1].value);

    availableSettings.current.sizes = sizeValues.map(item => item.value);

    availableSettings.current.themes = themeValues.map(item => item.value);

    sizes = availableSettings.current.sizes;
    themes = availableSettings.current.themes;
  }

  console.log("availableSettings ", availableSettings);
  console.log("themes", themes);

  const [size, setSize] = useState({
    height: 300,
    width: 300,
  });
  const [position, setPosition] = useState({
    left: "275px",
    top: "15px",
  });

  const [theme, setTheme] = useState();

  const [renderSize, setRenderSize] = useState();

  console.log("render size", renderSize);

  useEffect(() => {
    setRenderSize(sizes[0]);
    setTheme(themes[0]);
  }, [settingsArray]);

  useEffect(() => {
    if (renderSize === "600x300") {
      setSize({
        ...size,
        height: 600,
        width: 300,
      });
      setPosition({
        ...position,
        left: "275px",
        top: "15px",
      });
    } else if (renderSize === "300x600") {
      setSize({
        ...size,
        height: 300,
        width: 600,
      });
      setPosition({
        ...position,
        left: "575px",
        top: "15px",
      });
    } else if (renderSize === "600x600") {
      setSize({
        ...size,
        height: 600,
        width: 600,
      });
      setPosition({
        ...position,
        left: "575px",
        top: "15px",
      });
    } else {
      setSize({
        ...size,
        height: 300,
        width: 300,
      });
      setPosition({
        ...position,
        left: "275px",
        top: "15px",
      });
    }
  }, [renderSize, theme]);

  console.log("themes", themes);
  console.log("theme", theme);

  const IconButton = ({ icon, onClick, disabled }) => {
    return (
      <IconContainer onClick={onClick} disabled={disabled}>
        <BlendIcon iconify={icon} color="white" width="24px" />
      </IconContainer>
    );
  };

  const [banner, setBanner] = useState(true);

  return (
    <>
      <PrifinaProvider
        stage={"sandbox"}
        Context={PrifinaContext}
        activeUser={{ uuid: currentUser.prifinaID }}
        activeApp={"Sandbox"}
      >
        <React.Suspense fallback={"Loading ..."}>
          <SandboxContext.Provider
            value={{
              update: debugUpdate,
            }}
          >
            <Flex
              flexDirection="column"
              width={"100vw"}
              height={"100vh"}
              bg={theme === "light" ? "basePrimary" : "white"}
            >
              {banner ? (
                <Flex
                  height="42px"
                  alignItems="center"
                  justifyContent="space-between"
                  padding="10px"
                  style={{ background: colors.sandboxGradient }}
                  position="relative"
                >
                  <Box widthe="100px" />
                  <Flex alignSelf="center">
                    <BlendIcon
                      size="18px"
                      iconify={mdiPowerPlug}
                      className="icon"
                      color={colors.textPrimary}
                    />
                    <Text ml={20}>
                      This is a live Sandbox session you are seeing how your
                      project will render on Prifina
                    </Text>
                  </Flex>
                  <BlendIcon
                    style={{
                      top: 10,
                      right: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setBanner(false);
                    }}
                    size="18px"
                    iconify={feClose}
                    className="icon"
                    color={colors.textPrimary}
                  />
                </Flex>
              ) : null}

              <Flex
                height="64px"
                bg="baseMuted"
                alignItems="center"
                // justifyContent="space-between"
                padding="0px 24px 0px 24px"
              >
                <Flex alignItems="center">
                  <BlendIcon
                    size="18px"
                    iconify={mdiArrowLeft}
                    className="icon"
                    color={colors.textPrimary}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      //history.goBack();
                      navigate(-1);
                    }}
                  />
                  <Text ml={16} mr={100}>
                    {allValues.name}
                  </Text>
                  <TypeBadge type={allValues.appType}>
                    {allValues.appType === 1 ? "APPLICATION" : "WIDGET"}
                  </TypeBadge>
                  <Text ml={16} mr={8}>
                    Session Status
                  </Text>
                  {ready && validUrl !== "" && validUrl !== null ? (
                    <Breathe />
                  ) : (
                    <RedStatusCircle />
                  )}
                </Flex>
                <Flex>
                  <CustomSelect
                    name="age"
                    defaultValue={sizes[0]}
                    onChange={e => {
                      setRenderSize(e.target.value);
                    }}
                    width={"150px"}
                    style={{ marginRight: 24, marginLeft: 180 }}
                  >
                    {sizes.map((item, index) => (
                      <option key={index}>{item}</option>
                    ))}
                  </CustomSelect>
                  <IconButton icon={bxSun} onClick={() => setTheme("light")} />
                  <div style={{ marginLeft: 8 }}>
                    <IconButton
                      icon={bxMoon}
                      onClick={() => setTheme("dark")}
                    />
                  </div>
                </Flex>
                {/* <Button
                  ml="15px"
                  onClick={() => {
                    saveChanges();
                  }}
                >
                  Save Changes
                </Button> */}
              </Flex>
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                height={"100%"}
              >
                {currentAppRef.current.remoteUrl !== null ||
                  currentAppRef.current.remoteUrl !== "" ? (
                  <>
                    {ready && (
                      <Content
                        size={{ height: size.height, width: size.width }}
                        position={{ left: position.left, top: position.top }}
                        theme={theme}
                        ref={ref => {
                          if (ref) {
                            remoteRef.current = ref;
                          }
                        }}
                        updateDebug={updateDebugInfo}
                        {...componentProps.current}
                        appSettings={currentAppRef.current}
                      />
                    )}
                    {!ready && (
                      <Text textAlign={"center"} textStyle={"h3"}>
                        Sandbox
                      </Text>
                      // <ErrorStateScreen />
                    )}
                  </>
                ) : (
                  <Text
                    textAlign={"center"}
                    textStyle={"h3"}
                    colorStyle="error"
                  >
                    Remote link unavailable
                  </Text>
                )}
              </Flex>
              <BottomContainer height={state.size.y}>
                <BlendIcon
                  iconify={mdiArrowExpand}
                  color={colors.textPrimary}
                  style={{
                    position: "absolute",
                    left: "5px",
                    top: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (state.isOpen) {
                      setState({ size: { y: 35 }, isOpen: false });
                    } else {
                      setState({
                        size: { y: 416 },
                        isOpen: true,
                      });
                    }
                  }}
                />
                <Flex>
                  <div
                    style={{
                      overflow: "scroll",
                      height: state.size.y,
                      width: "100%",
                      marginLeft: 65,
                    }}
                  >
                    <Tabs
                      activeTab={activetab}
                      onClick={tabClick}
                      variant={"line"}
                    >
                      <TabList
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          paddingBottom: 10,
                        }}
                      >
                        <Tab>
                          <Text>Test settings</Text>
                        </Tab>
                        <Tab>
                          <Text>System settings</Text>
                        </Tab>
                        <Tab>
                          <Text>Settings</Text>
                        </Tab>
                        <Tab>
                          <Text>Debugger</Text>
                        </Tab>
                        <Tab>
                          <Text>Native assets</Text>
                        </Tab>
                        <Tab>
                          <Text>Support</Text>
                        </Tab>
                      </TabList>
                      <TabPanelList>
                        <TabPanel
                          style={{
                            height: "100%",
                            paddingBottom: "50px",
                          }}
                        >
                          <div style={{ overflow: "clip" }}>
                            <Flex>
                              <div>
                                <Flex mb={16}>
                                  <Box>
                                    <Text fontSize="sm" mb={5}>
                                      App ID
                                    </Text>
                                    <Input
                                      disabled
                                      width="661px"
                                      label="text"
                                      value={allValues.id}
                                      color={colors.textMuted}
                                      style={{ background: "transparent" }}
                                    />
                                    <Text
                                      fontSize="xs"
                                      mt={5}
                                      color={colors.textMuted}
                                    >
                                      Unique Prifina project identifier
                                    </Text>
                                  </Box>
                                </Flex>
                                <Flex mb={16}>
                                  <Box>
                                    <Text fontSize="sm" mb={5}>
                                      Remote link
                                    </Text>
                                    <Input
                                      width="661px"
                                      label="text"
                                      defaultValue={
                                        currentAppRef.current.remoteUrl
                                      }
                                      color={colors.textPrimary}
                                      style={{ background: "transparent" }}
                                      onChange={handleCheckUrl}
                                    />
                                    {validUrl ? null : (
                                      <Text fontSize="xxs" color="red">
                                        Your remote link is not valid
                                      </Text>
                                    )}
                                    {remoteLink !=
                                      allValues.remoteUrl ? null : (
                                      <Text fontSize="xxs" color="red">
                                        This remote link already exists
                                      </Text>
                                    )}
                                    <Text
                                      fontSize="xs"
                                      mt={5}
                                      color={colors.textSecondary}
                                    >
                                      Links to your build
                                    </Text>
                                  </Box>
                                </Flex>

                                <Button
                                  disabled={
                                    validUrl &&
                                      remoteLink.length > 0 &&
                                      remoteLink != allValues.remoteUrl
                                      ? false
                                      : true
                                  }
                                  onClick={onUpdateRemoteLink}
                                >
                                  Update
                                </Button>
                                <Button
                                  ml={25}
                                  onClick={() => window.location.reload()}
                                >
                                  Refresh
                                </Button>
                              </div>
                              {/* <EmptyContainer /> */}
                            </Flex>
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <div style={{ overflow: "auto" }}>
                            <SystemSettingsSandbox
                              onClick={onSubmitSystemSettings}
                              appSettings={currentAppRef.current}
                            />
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <div>
                            <SettingsSandbox
                              onClick={onUpdateSettings}
                              appSettings={currentAppRef.current}
                            />
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <div>
                            <ReactJson key={state.updated} src={asyncContent} />
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <Box>
                            <Text
                              style={{ textTransform: "uppercase" }}
                              mb={15}
                            >
                              Native assets
                            </Text>
                            <Box width="650px">
                              <Text color={colors.textSecondary} mb={30}>
                                If your application requires any addtional
                                assets to keep it lightweight consider using
                                native assets rather than having them in the
                                build deployment package.
                              </Text>
                            </Box>
                            <Flex alignItems="center">
                              <UploadAsset
                                variant="native"
                                id={allValues.id}
                                onFinish={() => { }}
                              />

                              <Box width="340px">
                                <Text
                                  fontSize="xs"
                                  ml={25}
                                  color={colors.textSecondary}
                                >
                                  Upload native assets for use in your project.
                                  Test them out in sandbox mode before packaging
                                  up in you application package.
                                </Text>
                                <Text
                                  fontSize="xs"
                                  ml={25}
                                  color={colors.textSecondary}
                                >
                                  For more information on using native assets
                                  visit our documentation
                                </Text>
                              </Box>
                            </Flex>
                          </Box>
                        </TabPanel>
                      </TabPanelList>
                    </Tabs>
                  </div>
                </Flex>
              </BottomContainer>
            </Flex>
          </SandboxContext.Provider>
        </React.Suspense>
      </PrifinaProvider>
    </>
  );
};
Sandbox.displayName = "Sandbox";

//export default withUsermenu()(Sandbox);
export default Sandbox;
