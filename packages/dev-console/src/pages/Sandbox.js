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

import { PrifinaProvider, PrifinaContext, usePrifina } from "@prifina/hooks";
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
import { useLocation, useHistory } from "react-router-dom";

import { Box, Flex, Text, Button, Input, useTheme } from "@blend-ui/core";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import { useToast } from "@blend-ui/toast";

import { useRemoteComponent } from "../useRemoteComponent";
import styled, { keyframes } from "styled-components";
import ReactJson from "react-json-view";

import PropTypes from "prop-types";

import { BlendIcon } from "@blend-ui/icons";

import SystemSettingsSandbox from "../components/SystemSettingsSandbox";

import mdiPowerPlug from "@iconify/icons-mdi/power-plug";
import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";
import SettingsSandbox from "../components/SettingsSandbox";

const SandboxContext = createContext(null);

const BottomContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: ${props => props.height}px;
  background-color: ${props => props.theme.colors.baseMuted};
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
  left: 275px;
  top: 15px;

  opacity: 1;
  cursor: ${props => (props.open ? "default" : "pointer")};
  background-image: radial-gradient(
    circle,
    ${props => (props.widgetTheme === "dark" ? "white" : "black")} 2px,
    transparent 0px
  );
  background-size: 100% 33.33%;
  z-index: 10;
`;

const StatusCircle = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${props => (props.status === true ? "#62bd19" : "red")};
  border-radius: 50%;
`;

const EmptyContainer = () => {
  return (
    <Flex
      alignItems="center"
      style={{ border: "1px dashed grey" }}
      mt={50}
      height="358px"
      width="676px"
      textAlign="center"
      borderRadius="8px"
      bg="#373436"
    >
      <Text>
        This area will contain content to help the developer complete the task
        in the left panelContent will be locked in as part of a later user story
      </Text>
    </Flex>
  );
};

const RemoteContent = ({ url, ...props }) => {
  console.log("COMPONENT URL ", url);
  // const [loading, err, Component] = useRemoteComponent(
  //   "https://raw.githubusercontent.com/prifina/widgets/master/packages/dry-run/dist/main.bundle.js",
  // );
  const [loading, err, Component] = useRemoteComponent(url);

  /*
      useEffect(() => {
        if (loading) {
          console.log("Still loading... ");
        } else {
          console.log("Componend loaded ");
        }
        if (err !== null) {
          console.log("ERRORS ", err);
        }
      }, [loading, err, Component]);
    
      return [];
      */

  if (loading) {
    return <div>Loading...</div>;
  }

  if (err != null) {
    console.log("REMOTE ERROR ", err);
    return (
      <React.Fragment>
        <div>Unknown Error: {err.toString()}</div>
        <div>Invalid URL {url} or Possible CORS problem.</div>
        <div>Check Browser console for more informations...</div>
      </React.Fragment>
    );
  }
  //console.log("COMPONENT ", Component);
  return <Component {...props} />;
};
//const Widget = forwardRef((props, ref) => {

//const Content = ({ appSyncClient, url, prifinaID, ...props }) => {
const Content = forwardRef((props, ref) => {
  const { appSyncClient, url, prifinaID, updateDebug, appSettings } = props;
  const {
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
            width: "300px",
            height: "300px",
            margin: "10px",
            position: "relative",
          }}
        >
          <IconDiv open={false} widgetTheme={"light"} />
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
              <RemoteContent url={url} {...settingsInit} />
            </WidgetWrapper>
          </div>
        </div>
      </>
    );
  } else {
    return <RemoteContent url={url} ref={ref} {...settingsInit} />;
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

  const history = useHistory();

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

  const [validUrl, setValidUrl] = useState();

  // checkUrl(
  //   "https://raw.githubusercontent.com/prifina/widgets/master/packages/dry-run/dist/main.bundle.js",
  // )
  //   .then(result => setValidUrl(result))
  //   .catch(err => console.log(err));

  const [remoteLink, setRemoteLink] = useState("");

  function handleCheckUrl(event) {
    checkUrl(event.target.value)
      .then(result => setValidUrl(result))
      .then(setRemoteLink(event.target.value))
      .catch(err => console.log("errror", err));
  }

  console.log("check url valid", validUrl);
  console.log("check remote link valid", remoteLink);

  useEffect(async () => {
    // const remoteAppUrl = localStorage.getItem("remoteWidget");
    // const remoteAppUrl =
    //   "https://raw.githubusercontent.com/prifina/widgets/master/packages/dry-run/dist/main.bundle.js";

    const remoteAppUrl = allValues.remoteUrl;

    // https://prifina-apps-352681697435-eu-west-1.s3.eu-west-1.amazonaws.com/1u3f465t4cNSWYiyKFVwBG/0.0.1/main.bundle.js
    //componentProps.current = { url: remoteApp };

    const session = await Auth.currentSession();
    const prifinaID = session.idToken.payload["custom:prifina"];
    const currentPrifinaUser = await getPrifinaUserQuery(GRAPHQL, prifinaID);

    console.log("CURRENT USER ", currentPrifinaUser);
    let appProfile = JSON.parse(
      currentPrifinaUser.data.getPrifinaUser.appProfile,
    );

    const currentApp = await getAppVersionQuery(GRAPHQL, currentAppId);
    currentAppRef.current = {
      appID: currentAppId,
      settings: currentApp.data.getAppVersion.settings,
    };
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

    console.log("COMPONENT PROPS....", componentProps);

    setReady(true);
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
      toast.info("System settings updated successfully", {});
    });

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
      toast.info("Settings updated successfully", {});
    });

    e.preventDefault();
  };

  const remoteUser = opts => {
    return Promise.resolve({});
  };
  const remoteClient = async (endpoint, region) => {
    return Promise.resolve({});
  };

  const [activetab, setactivetab] = useState(0);

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setactivetab(tab);
    // if (state.isOpen) {
    //   setState({ size: { y: 35 }, isOpen: false });
    //   setactivetab(tab);
    // } else {
    //   const remoteContainer = remoteRef.current.getBoundingClientRect();
    //   // const testingJSON = [{ testing: "OK" }];
    //   // const newSize = window.innerHeight - remoteContainer.bottom - 5;
    //   const newSize = "416px";
    //   setState({
    //     size: { y: 416 },
    //     isOpen: true,
    //     // content: testingJSON,
    //   });
    // }
  };

  return (
    <>
      <PrifinaProvider
        stage={"sandbox"}
        Context={PrifinaContext}
        activeUser={{ uuid: currentUser.prifinaID }}
        activeApp={"Sandbox"}
        remoteUser={remoteUser}
        remoteClient={remoteClient}
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
              bg="basePrimary"
            >
              <Flex
                height="42px"
                alignItems="center"
                justifyContent="center"
                style={{ background: colors.sandboxGradient }}
              >
                <BlendIcon
                  size="18px"
                  iconify={mdiPowerPlug}
                  className="icon"
                  color={colors.textPrimary}
                />
                <Text ml={20}>
                  This is a live Sandbox session you are seeing how your project
                  will render on Prifina
                </Text>
              </Flex>
              <Flex
                height="64px"
                bg="baseMuted"
                alignItems="center"
                paddingLeft="16px"
              >
                <BlendIcon
                  size="18px"
                  iconify={mdiArrowLeft}
                  className="icon"
                  color={colors.textPrimary}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history.goBack();
                  }}
                />
                <Text ml={16}>{allValues.name}</Text>
                <Text ml={100}>{allValues.appType}</Text>
                <Text ml={16} mr={8}>
                  Session Status
                </Text>
                <StatusCircle status={validUrl} />
              </Flex>
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                height={"100%"}
              >
                {ready && (
                  <Content
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
                )}
              </Flex>
              <BottomContainer height={state.size.y}>
                <div
                  style={{
                    position: "absolute",
                    left: "5px",
                    fontSize: "35px",
                    cursor: "pointer",
                  }}
                  onClick={e => {
                    //console.log(remoteRef);
                    //console.log(remoteRef.current.getBoundingClientRect());
                    // bottom
                    //window.innerHeight;
                    if (state.isOpen) {
                      setState({ size: { y: 35 }, isOpen: false });
                    } else {
                      const remoteContainer =
                        remoteRef.current.getBoundingClientRect();
                      // const testingJSON = [{ testing: "OK" }];
                      const newSize =
                        window.innerHeight - remoteContainer.bottom - 5;
                      setState({
                        size: { y: 416 },
                        isOpen: true,
                        // content: testingJSON,
                      });
                    }
                  }}
                >
                  {state.isOpen ? "\u21F2" : "\u21F1"}
                </div>
                <Flex>
                  <div
                    style={{
                      overflow: "scroll",
                      height: state.size.y,
                      width: "100%",
                      marginLeft: 30,
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
                          background: colors.baseMuted,
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
                                      color={colors.textPrimary}
                                      style={{ background: "transparent" }}
                                    />
                                    <Text fontSize="sm" mt={5}>
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
                                      defaultValue={allValues.remoteUrl}
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
                                    <Text fontSize="sm" mt={5}>
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
                          <div style={{ overflow: "auto" }}></div>
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
