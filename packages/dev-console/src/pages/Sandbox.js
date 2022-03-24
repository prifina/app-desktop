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
} from "@prifina-apps/utils";
import { useLocation, useHistory } from "react-router-dom";

import { Box, Flex, Text, Button, useTheme } from "@blend-ui/core";

import { useRemoteComponent } from "../useRemoteComponent";
import styled, { keyframes } from "styled-components";
import ReactJson from "react-json-view";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@blend-ui/modal";
import { List, ListDivider, ListItem } from "@blend-ui/list-item";
import { useFloating, shift, arrow } from "@floating-ui/react-dom";
import { computePosition, offset } from "@floating-ui/dom";
import PropTypes from "prop-types";

const SandboxContext = createContext(null);

const OptionListItem = styled(ListItem)`
  /* */
`;
const Options = styled.div`
  width: 100px;
  background: white;
  color: white;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  font-size: 90%;
  /* pointer-events: none; */
  box-shadow: 0px 4px 8px rgba(91, 92, 91, 0.2);
`;

const Arrow = styled.div`
  position: absolute;
  background: white;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
`;

const BottomContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: ${props => props.height}px;
  background-color: red;
`;

const SetupButton = styled.div`
  position: absolute;
  bottom: 80px;
  right: 80px;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  border: solid 1px #555;
  background-color: #eed;
  box-shadow: 2px 2px 10px 2px rgb(0 0 0 / 60%);

  span {
    color: #424242;
    font-size: 50px;
    position: absolute;
    line-height: 80px;
    text-align: center;
    width: 80px;
  }
  &:hover {
    span {
      color: black;
    }
    cursor: pointer;
  }
`;

const WidgetWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 2px outset;
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

const SettingsModal = ({ onClose, onButtonClick, appSettings, ...props }) => {
  const theme = useTheme();

  const { colors } = useTheme();

  const [dialogOpen, setDialogOpen] = useState(true);

  const onCloseCheck = e => {
    console.log("MODAL CLOSE ", e);
    onClose(e);
    e.preventDefault();
  };
  /*
  "settings": [
    { "field": "year", "value": "2020", "label": "Year", "type": "text" },
    { "field": "month", "value": "1", "label": "Month", "type": "text" },
    {"field":"sizes","value":"[{\"option\":\"300x300\",\"value\":\"300x300\"}]","label":"Sizes","type":"select"},
      {"field":"theme","value": "[{\"option\":\"Light\",\"value\":\"light\"}]","label":"Theme","type":"select"}
  ],
*/

  console.log("MODAL SETTINGS ", appSettings);
  let defaultTheme = "light";
  let defaultSize = "300x300";
  let defaultSettings = [];
  if (
    appSettings.hasOwnProperty("settings") &&
    appSettings.settings.length > 0
  ) {
    appSettings.settings.forEach(s => {
      if (s.field === "theme") {
        const themeValues = JSON.parse(s.value);
        defaultTheme = themeValues[0].value;
      } else if (s.field === "sizes") {
        const sizeValues = JSON.parse(s.value);
        defaultSize = sizeValues[0].value;
      } else {
        defaultSettings.push(s);
      }
    });
  }

  console.log("THEME DEFAULT ", defaultTheme);
  const [themeFields, handleThemeChange] = useFormFields({
    theme: defaultTheme,
    size: defaultSize,
  });

  const [settingsFields, handleSettingsChange] = useFormFields({
    type: "text",
    label: "",
    field: "",
    value: "",
  });
  //const settingsListRef = useRef();
  const [settingsList, setSettings] = useState(defaultSettings);

  return (
    <>
      <Modal
        isOpen={dialogOpen}
        onClose={onCloseCheck}
        scrollBehavior={"inside"}
        theme={theme}
        size={"3xl"}
        {...props}
      >
        <ModalContent>
          <ModalHeader>TITLE</ModalHeader>
          <ModalBody>
            <div style={{ margin: "10px" }}>
              <div>
                <select
                  id={"theme"}
                  name={"theme"}
                  onChange={handleThemeChange}
                  defaultValue={defaultTheme}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div>
                <select
                  id={"size"}
                  name={"size"}
                  onChange={handleThemeChange}
                  defaultValue={defaultSize}
                >
                  <option value="300x300">300x300</option>
                  <option value="300x600">300x600</option>
                  <option value="600x300">600x300</option>
                  <option value="600x600">600x600</option>
                </select>
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Label</th>
                      <th>Field</th>
                      <th>Value</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <select
                          id={"type"}
                          name={"type"}
                          onChange={handleSettingsChange}
                        >
                          <option value="text">Input</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          id={"label"}
                          name={"label"}
                          onChange={handleSettingsChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          id={"field"}
                          name={"field"}
                          onChange={handleSettingsChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          id={"value"}
                          name={"value"}
                          onChange={handleSettingsChange}
                        />
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "40px",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          onClick={e => {
                            console.log("SETTINGS ", settingsFields);
                            setSettings([...settingsList, settingsFields]);

                            e.preventDefault();
                          }}
                        >
                          {"<Add>"}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <ul>
                  {settingsList.map((s, i) => {
                    let setting = `Type=${s.type}, Label=${s.label}, Field=${s.field}, DefaultValue=${s.value}`;

                    return (
                      <li key={"set-" + i}>
                        {setting}
                        <span
                          style={{ marginLeft: "5px", cursor: "pointer" }}
                          data-li={i}
                          onClick={e => {
                            const itemIndex = parseInt(
                              e.currentTarget.dataset["li"],
                            );
                            const temp = [...settingsList];
                            temp.splice(itemIndex, 1);

                            setSettings(temp);
                            e.preventDefault();
                          }}
                        >
                          {"<Delete>"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter m={0}>
            <div style={{ width: "100%", textAlign: "center" }}>
              <button
                onClick={e => {
                  //setDialogOpen(false);
                  onButtonClick(e, "cancel", {});
                }}
              >
                Cancel
              </button>
              <button
                onClick={e => {
                  // setDialogOpen(false);
                  const settings = [...settingsList];
                  /*  
                  "settings": [
                    { "field": "year", "value": "2020", "label": "Year", "type": "text" },
                    { "field": "month", "value": "1", "label": "Month", "type": "text" },
                    {"field":"sizes","value":"[{\"option\":\"300x300\",\"value\":\"300x300\"}]","label":"Sizes","type":"select"},
                      {"field":"theme","value": "[{\"option\":\"Light\",\"value\":\"light\"}]","label":"Theme","type":"select"}
                  ],
                  */
                  console.log("CLICK ", settings);
                  console.log("CLICK2 ", themeFields);

                  settings.push({
                    field: "sizes",
                    label: "Sizes",
                    type: "select",
                    value: JSON.stringify([
                      { option: themeFields.size, value: themeFields.size },
                    ]),
                  });

                  settings.push({
                    field: "theme",
                    label: "Theme",
                    type: "select",
                    value: JSON.stringify([
                      { option: themeFields.theme, value: themeFields.theme },
                    ]),
                  });

                  onButtonClick(e, "update", settings);
                }}
              >
                Update
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
const RemoteContent = ({ url, ...props }) => {
  console.log("COMPONENT URL ", url);
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

  const athenaSubscription = useRef({});
  let settingsInit = {};
  if (appSettings.hasOwnProperty("settings")) {
    //console.log("APP SETTINGS INIT ", appSettings);
    let data = {};
    appSettings.settings.forEach(s => {
      if (s.field != "sizes" && s.field != "theme") {
        data[s.field] = s.value;
      }
    });
    console.log("APP SETTINGS INIT ", data);
    settingsInit = data;
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

const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

const Sandbox = props => {
  console.log("SANDBOX --->", props, props.hasOwnProperty("app"));
  const history = useHistory();
  const { AUTHConfig, APIConfig, userAuth, currentUser } = useAppContext();
  //const activeUser = useRef({});
  const currentAppId = "3LSdcSs1kcPskBWBJvqGto";
  const componentProps = useRef({});
  const [ready, setReady] = useState(false);
  const [openSettings, setSettings] = useState(false);
  const [openOptions, setOptions] = useState(false);
  const [asyncContent, setAsyncContent] = useState([]);
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      size: { y: 35 },
      isOpen: false,
      updated: new Date().toString(),
    },
  );
  /*
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "left",
    middleware: [shift()],
  });
  */

  const arrowRef = useRef(null);
  const {
    x,
    y,
    reference,
    floating,
    strategy,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
  } = useFloating({
    placement: "left",
    middleware: [offset(10), arrow({ element: arrowRef })],
  });
  //console.log("OFF ", offset);

  /*
  const update = opts => {
    console.log("FLOATING REF UPDATE ", opts);
    //console.log("MOUNT33 ", typeof reference.getBoundingClientRect);
    if (arrowRef.current) {
      computePosition(reference, floating, {
        middleware: [
          arrow({
            element: arrowRef,
          }),
        ],
      }).then(({ middlewareData }) => {
        console.log("MIDDLE ", middlewareData);
      });
    }
  };
  */

  const remoteRef = useRef();
  const currentAppRef = useRef({});

  const [referenceElement, setReferenceElement] = useState(null);
  const [optionsElement, setOptionsElement] = useState(null);
  /*
  const optionsRef = useRef(null);

  useLayoutEffect(() => {
    console.log("OPTIONS ", optionsRef);
    floating(optionsRef.current);
  }, [optionsRef]);
*/
  /*
  useEffect(async () => {
    if (openOptions) {
      console.log("REF UPDATE ", reference.current);
      console.log("FLOAT UPDATE ", floating.current);
      const { middlewareData } = await computePosition(
        reference.current,
        floating.current,
        {
          middleware: [
            arrow({
              element: arrowRef.current,
            }),
          ],
        },
      );
      console.log("MIDDLE ", middlewareData);
    }
  }, [openOptions]);
  */
  useEffect(async () => {
    const remoteAppUrl = localStorage.getItem("remoteWidget");
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
    /*
    activeUser.current = {
      name: appProfile.name,
      uuid: prifinaID,
      endpoint: clientEndpoint,
      region: clientRegion,
      dataSources: currentPrifinaUser.data.getPrifinaUser.dataSources
        ? JSON.parse(currentPrifinaUser.data.getPrifinaUser.dataSources)
        : {},
    };
    */

    //const _currentSession = await Auth.currentSession();
    const client = await createClient(clientEndpoint, clientRegion, session);
    componentProps.current.appSyncClient = client;
    componentProps.current.prifinaID = prifinaID;
    componentProps.current.initials = appProfile.initials;
    componentProps.current.url = remoteAppUrl;
    componentProps.current.widget = true;

    //componentProps.current.Component = RemoteContent({ url: remoteAppUrl });
    console.log("COMPONENT PROPS....", componentProps);
    //console.log("ACTIVEUSER ....", activeUser);
    setReady(true);
  }, []);

  useEffect(async () => {
    console.log("REFS ", reference, floating);
    if (openOptions && optionsElement) {
      //reference(referenceElement);
      //floating(optionsElement);
      reference(referenceElement);
      const placement = "left";
      const { x, y } = await computePosition(referenceElement, optionsElement, {
        placement: placement,
        middleware: [offset(10), arrow({ element: arrowRef.current })],
      });
      console.log("FLOATING...", x, y);
      Object.assign(optionsElement.style, {
        left: x != null ? `${x}px` : "",
        top: y != null ? `${y}px` : "",
      });

      floating(optionsElement);

      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
      }[placement.split("-")[0]];

      const { middlewareData } = await computePosition(
        referenceElement,
        optionsElement,
        {
          placement: "left",
          middleware: [
            offset(10),
            arrow({
              element: arrowRef.current,
            }),
          ],
        },
      );
      console.log("MIDDLE ", middlewareData);
      Object.assign(arrowRef.current.style, {
        left:
          middlewareData.arrow.x != null ? `${middlewareData.arrow.x}px` : "",
        top:
          middlewareData.arrow.y != null ? `${middlewareData.arrow.y}px` : "",
        right: "",
        bottom: "",
        [staticSide]: "-4px",
      });

      /*
      const { x, y } = await computePosition(referenceElement, optionsElement, {
        placement: "left",
        middleware: [offset(10), arrow({ element: arrowRef })],
      });

      //console.log("REF ELEM ", referenceElement.getBoundingClientRect());
      Object.assign(optionsElement.style, {
        left: x != null ? `${x}px` : "",
        top: y != null ? `${y}px` : "",
      });

      floating(optionsElement);
     */
      /*
       Object.assign(arrowEl.style, {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
  });
      const { middlewareData } = await computePosition(
        referenceElement,
        optionsElement,
        {
          middleware: [
            arrow({
              element: arrowRef,
            }),
          ],
        },
      );
      */

      //console.log("REFS ELEMS ", referenceElement, optionsElement);
    }
  }, [optionsElement, openOptions]);

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
  const onDialogClose = e => {
    setOptions(false);
    setSettings(false);
    e.preventDefault();
  };
  const onDialogClick = (e, action, data) => {
    if (action === "update") {
      currentAppRef.current = {
        appID: currentAppId,
        settings: data,
      };

      console.log(currentAppRef.current);

      updateAppVersionMutation(GRAPHQL, {
        id: currentAppRef.current.appID,
        settings: currentAppRef.current.settings,
      }).then(res => {
        console.log("UPDATE ", res);
        setOptions(false);
        setSettings(false);
      });
    } else {
      setOptions(false);
      setSettings(false);
    }
    e.preventDefault();
  };

  const remoteUser = opts => {
    return Promise.resolve({});
  };
  const remoteClient = async (endpoint, region) => {
    return Promise.resolve({});
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
            <Box width={"100vw"} height={"100vh"}>
              {openSettings && (
                <SettingsModal
                  onClose={onDialogClose}
                  onButtonClick={onDialogClick}
                  appSettings={currentAppRef.current}
                />
              )}
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
              <SetupButton
                ref={setReferenceElement}
                onClick={() => {
                  //setSettings(true);
                  setOptions(true);
                }}
              >
                <span>+</span>
              </SetupButton>
              {openOptions && (
                <Options
                  ref={setOptionsElement}
                  style={{
                    position: strategy,
                    top: y ?? "",
                    left: x ?? "",
                  }}
                >
                  <div>
                    <List spacing={3}>
                      <OptionListItem
                        onClick={e => {
                          e.preventDefault();
                          setSettings(true);
                        }}
                      >
                        Settings
                      </OptionListItem>
                      <OptionListItem>QueryBuilder</OptionListItem>
                      <OptionListItem>SQL</OptionListItem>
                      <OptionListItem
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        Remote URL
                      </OptionListItem>
                    </List>
                  </div>
                  <Arrow ref={arrowRef} />
                </Options>
              )}
              {/* 
              <div
                ref={floating}
                style={{
                  position: strategy,
                  top: y ?? "",
                  left: x ?? "",
                }}
              >
                Tooltip
              </div>
              */}
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
                        size: { y: newSize },
                        isOpen: true,
                        // content: testingJSON,
                      });
                    }
                  }}
                >
                  {state.isOpen ? "\u21F2" : "\u21F1"}
                </div>
                {state.isOpen && (
                  <>
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "5px",
                        marginTop: "35px",
                        height: "100%",
                      }}
                    >
                      <ReactJson key={state.updated} src={asyncContent} />
                    </div>
                  </>
                )}
              </BottomContainer>
            </Box>
          </SandboxContext.Provider>
        </React.Suspense>
      </PrifinaProvider>
    </>
  );
};
Sandbox.displayName = "Sandbox";

//export default withUsermenu()(Sandbox);
export default Sandbox;
