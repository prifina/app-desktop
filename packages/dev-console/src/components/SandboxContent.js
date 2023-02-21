
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useContext,
} from "react";

import { usePrifina } from "@prifina/hooks-v2";
import { Remote } from "@prifina-apps/remote";
import { SandboxContext } from "../pages/Sandbox-v2";
import styled from "styled-components";

import shallow from "zustand/shallow";

import { useAppStudioStore } from "../hooks/UseAppStudio";

import { useGraphQLContext } from "../utils-v2/graphql/GraphQLContext";
import { getAthenaResults } from "@prifina-apps/utils";
import PropTypes from "prop-types";


const WidgetWrapper = styled.div`
  width: 100%;
  height: 100%;
  // border: 2px outset;
  border-radius: 8px;
`;


const RemoteContent = forwardRef(({ settingsInit, system, ...props }, ref) => {
  return <WidgetWrapper>
    <Remote
      ref={ref}
      componentProps={{ ...settingsInit }}
      system={{ ...system }}
    />
  </WidgetWrapper>
});

const MemoizedRemoteContent = React.memo(RemoteContent);

const Content = forwardRef((props, ref) => {
  /*
  const { appSyncClient, url, prifinaID, updateDebug, appSettings, appID } =
    props;
    */
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

  const { updateDebug, appID, prifinaID } = useContext(SandboxContext);

  const { CoreApiClient, UserApiClient, S3Storage } = useGraphQLContext();

  const athenaSubscription = useRef(null);
  const effectCalled = useRef(false);


  const { settings, updateSettings } = useAppStudioStore((state) => ({ settings: state.settings, updateSettings: state.updateSettings }),
    shallow);

  const unsubStore = useAppStudioStore.subscribe((state) => {
    console.log("STORE SUBSCRIBE ", state.updatedSettings);
    //[{ "label": "City", "field": "city", "type": "text", "value": "Pori" }]
    if (Object.keys(state.updatedSettings).length > 0) {
      const c = getCallbacks();
      console.log("CALLBACKS ", c);
      console.log("CALLBACKS ", c.hasOwnProperty(appID));
      if (
        c.hasOwnProperty(appID) &&
        typeof c[appID][0] === "function"
      ) {
        console.log("FOUND CALLBACK ");
        c[appID][0]({ settings: state.updatedSettings });
        // resest back to empty object..
        updateSettings({});
        /* 
        const settingsUpdate = {
          settings: {
            city: "Pori"
          },
        }; */
      }
    }


  })


  console.log("CONTENT ", settings)

  let settingsInit = {};
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

  /*
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
  */
  /*
    const updateTest = data => {
      console.log("UPDATE TEST ", data, Object.keys(data));
      const payload = Object.assign({}, data);
  
      if (data.hasOwnProperty("connectorFunction")) {
        console.log("QUERY UPDATE ");
  
      }
      updateDebug(payload);
    };
  */

  /*
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
  */

  const updateTest = data => {
    console.log("UPDATE TEST ", data, Object.keys(data));
    const payload = Object.assign({}, data);

    if (data.hasOwnProperty("connectorFunction")) {
      console.log("QUERY UPDATE ");

    }
    updateDebug(payload);
  };

  useEffect(() => {
    function init() {

      effectCalled.current = true;
      onUpdate("sandbox", updateTest);
      registerClient([UserApiClient, CoreApiClient, S3Storage]);

      UserApiClient.setCallback((res) => {
        console.log("ATHENA SUBS RESULTS ", res);

        const currentAppId = res.data.athenaResults.appId;
        //console.log("SUBS CHECK ", currentAppId, state,widgetSettings.current);

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
      }
      )
      const subsID = UserApiClient.subscribe(getAthenaResults, { id: prifinaID });
      athenaSubscription.current = subsID;

    }
    if (!effectCalled.current) {
      init();
    }
    // unsubscribe...
    if (athenaSubscription.current) {
      console.log("UNSUBS ATHENA ");
      //athenaSubscription.current.unsubscribe();
    }
  }, [])


  let remoteUrl = "";
  //const widgetID = "cw9aphqcofZkv8pCE9nE181";
  //const widgetID = "o3CH1e2kbrLgBxjbG2iLzd";
  // cECGHdLTCpjaimqviz7N2s  oura-sleep
  // x866fscSq5Ae7bPgUtb6ffB  data-test

  if (true) {
    remoteUrl = [
      "widgets",
      appID,
      "dist",
      "remoteEntry.js",
    ].join("/");
  }
  console.log("REMOTE ", remoteUrl);
  return <>
    <MemoizedRemoteContent ref={ref} componentProps={{ ...settingsInit }}
      system={{
        remote: appID,
        url: remoteUrl,
        module: "./App",
      }} />
    {/*
    <WidgetWrapper>
      <Remote
        ref={ref}
        componentProps={{ ...settingsInit }}
        system={{
          //remote: "csd88KWnuft8fHfMrKSBAD",

          //remote: appID,
          remote: widgetID,
          url: remoteUrl,
          //url: appSettings.remoteUrl,
          //url: "dist/remoteEntry.js",
          //url:"http://internal.prifina.com.s3-website-us-east-1.amazonaws.com/dist/remoteEntry.js",
          //url: "https://cdn.jsdelivr.net/gh/data-modelling/builder-plugins@main/packages/json-view/dist/remoteEntry.js",
          //https://github.com/tro9999/module-federation-examples/blob/master/dynamic-system-host/app2/dist/remoteEntry.js

          module: "./App",
        }}
      />
    </WidgetWrapper>
*/}

  </>

});

/*

                        <Text
                          textAlign={"center"}
                          textStyle={"h3"}
                          colorStyle="error"
                        >
                          Remote link unavailable
                        </Text>
Content.propTypes = {
  //Component: PropTypes.elementType.isRequired,
  appSyncClient: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  prifinaID: PropTypes.string.isRequired,
};
*/

export default Content;