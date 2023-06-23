
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
import { useNavigate, useParams } from "react-router-dom";


import { Box, Flex, Text, Button, Input, useTheme } from "@blend-ui/core";

import { useToast } from "@blend-ui/toast";

import shallow from "zustand/shallow";

import { useStore } from "@prifina-apps/utils";

//import { useRemoteComponent } from "../useRemoteComponent";

import LoadingFallback from "../components/LoadingFallback";
import SandboxBanner from "../components/SandboxBanner";
import SandboxHeader from "../components/SandboxHeader";
import SandboxFooter from "../components/SandboxFooter";
import SandboxContent from "../components/SandboxContent";

import styled from "styled-components";

import { useAppStudioStore } from "../hooks/UseAppStudio";

//import ReactJson from "react-json-view";

import PropTypes from "prop-types";

export const SandboxContext = createContext(null);

export const ParseSettings = (settingsArray, defaultSettings) => {

  const updatedSettings = Object.assign({}, defaultSettings);

  settingsArray.forEach(s => {
    // sizes is the deprecated key,... 
    if (["theme", "size", "sizes"].indexOf(s.field) === -1) {
      updatedSettings[s.field] = s.value;
    }
  });
  return updatedSettings;
}

const MainContainer = styled(Flex)`
height: ${`calc(100vh - 166px)`};
/*
display: flex;
flex-wrap: wrap;
flex-flow: row;
*/

justify-content: center;
align-content: center;

width: 100%;
overflow-y: auto;
scrollbar-width: 12px;
scrollbar-color: #D62929 #F5F5F5;

::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar
{
  width: 12px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #D62929;
}
`

const StyledContainer = styled(Box)`
  border:5px solid transparent;
  /*

  width:  ${props => `calc(prop.size.w + 10px)`}px;  // 2x border width
  height:  ${props => `calc(prop.size.h + 10px)`}px;  // 2x border width
  */
`;

const MarginContainer = styled(Flex)`
  /*  */
 
justify-content: center;
align-content: center;
`;


const Sandbox = () => {

  const { colors } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  //const { pathname, search } = useLocation();
  // routing /:app
  const { app } = useParams();

  console.log("APP ", app);

  const {
    getAppVersionQuery, activeUser, setAppsyncConfig
  } = useStore(
    state => ({
      activeUser: state.activeUser,
      getAppVersionQuery: state.getAppVersionQuery,
      setAppsyncConfig: state.setAppsyncConfig
    }),
    shallow,
  );

  const { initSettings, updateSettings, setDebugInfo, getDebugInfo, addDebugInfo } = useAppStudioStore((state) => ({
    initSettings: state.initSettings,
    updateSettings: state.updateSettings, setDebugInfo: state.setDebugInfo, getDebugInfo: state.getDebugInfo, addDebugInfo: state.addDebugInfo
  }),
    shallow);

  const defaultSize = "300x300";
  const defaultTheme = "light";
  const [sandboxTheme, setSandboxTheme] = useState(defaultTheme);

  const [appReady, setAppReady] = useState(false);
  const effectCalled = useRef(false);
  const appData = useRef({});
  const currentSize = useRef(defaultSize);

  //const currentUser = { prifinaID: "xxxxx" };
  const debugUpdate = {};

  useEffect(() => {
    async function init() {
      effectCalled.current = true;

      setAppsyncConfig({
        aws_appsync_graphqlEndpoint: activeUser.endpoint,
        aws_appsync_region: activeUser.region,
        graphql_endpoint_iam_region: activeUser.region
      })
      const appVersion = await getAppVersionQuery({ id: app });
      appData.current = appVersion.data.getAppVersion;
      // local remoteURL ??
      if (appData.current?.settings === undefined || appData.current.settings === null) {
        appData.current.settings = [];
      }

      const defaultSettings = ParseSettings(appData.current.settings, { size: defaultSize, theme: defaultTheme });

      // init settings in appStudio store
      initSettings(defaultSettings);
      setAppReady(true);
    }

    if (!effectCalled.current) {
      init();
    }

  }, []);

  const [showBanner, setShowBanner] = useState(() => {
    const sandboxBannerVisible = localStorage.getItem("appStudioSandboxBannerVisible");
    //console.log("BANNER ", sandboxBannerVisible, typeof sandboxBannerVisible);
    const bannerInit = sandboxBannerVisible != null ? sandboxBannerVisible === "true" : true;
    return bannerInit;
  });

  const containerBorderWidth = 5
  const currentContainerSize = useRef({});
  const [containerSize, setContainerSize] = useState(() => {
    currentContainerSize.current = { w: 300 + (containerBorderWidth * 2), h: 300 + (containerBorderWidth * 2) };
    // so the state change is recognized.... object type is not handled similarly
    return defaultSize;
  });
  useEffect(() => {

    const size = containerSize.split("x");
    currentContainerSize.current = { w: parseInt(size[0]) + (containerBorderWidth * 2), h: parseInt(size[1]) + (containerBorderWidth * 2) };
    //console.log("CURRENT ", currentContainerSize.current)
    if (currentSize.current !== containerSize) {
      console.log("NEW SIZE", containerSize);
      currentSize.current = containerSize;
      updateSettings({ size: containerSize })
    }
  }, [containerSize])


  const updateDebugInfo = data => {

    let newContent = getDebugInfo();
    const maxElements = 20;
    if (newContent.length > maxElements) {
      newContent = newContent.slice(0, maxElements);
    }
    newContent.unshift({ ...data });
    console.log("UPDATE DEBUG", newContent);
    setDebugInfo(newContent);

    //setAsyncContent(newContent);
    //setState({ updated: new Date().toString() });
  };


  return (
    <>
      {appReady &&
        <PrifinaProvider
          stage={"sandbox"}
          Context={PrifinaContext}
          activeUser={{ uuid: activeUser.uuid }}
          activeApp={"Sandbox"}
        >
          <React.Suspense fallback={<LoadingFallback />}>
            <SandboxContext.Provider
              value={{
                updateDebug: updateDebugInfo,
                appID: appData.current.id,
                prifinaID: activeUser.uuid,
                remoteUrl: appData.current.remoteUrl

              }}
            >
              <Box
                width={"100vw"}
                minHeight={"100vh"}
                bg={sandboxTheme === "light" ? "basePrimary" : "white"}
              >
                {showBanner && <SandboxBanner closeBanner={() => {
                  localStorage.setItem("appStudioSandboxBannerVisible", false);
                  setShowBanner(false);
                }} />}
                <SandboxHeader appData={{ appType: appData.current.appType, appName: appData.current.name, selectedSize: "300x300" }} sandboxTheme={sandboxTheme} setSandboxTheme={setSandboxTheme} setContainerSize={setContainerSize} />

                <MainContainer flexWrap={"wrap"} >
                  {appData.current.appType === 2 &&
                    containerSize !== "" &&
                    <MarginContainer flexWrap={"wrap"} width={parseInt(containerSize.split("x")[0]) + 100} height={parseInt(containerSize.split("x")[1]) + 100}>
                      <StyledContainer sandboxtheme={sandboxTheme} width={parseInt(containerSize.split("x")[0]) + (containerBorderWidth * 2)} height={parseInt(containerSize.split("x")[1]) + (containerBorderWidth * 2)}>

                        {/*  HERE REMOTE COMPONENT */}
                        <SandboxContent />
                      </StyledContainer>
                    </MarginContainer>

                  }
                  {appData.current.appType === 1 &&
                    <MarginContainer flexWrap={"wrap"} width={"100%"} height={"100%"}>
                      <SandboxContent ref={(ref) => {
                        if (ref) {
                          // console.log("REMOTE REF ", ref);
                          // console.log("REMOTE REF STYLE ", ref.style);
                          ref.style.height = "100%";
                        }
                      }} />
                    </MarginContainer>
                  }

                </MainContainer>
                <Box style={{ position: "fixed", bottom: 0, width: "100%" }}>
                  <SandboxFooter appData={appData.current} />
                </Box>
              </Box>
            </SandboxContext.Provider>
          </React.Suspense>
        </PrifinaProvider>
      }
    </>

  );
};
Sandbox.displayName = "Sandbox";

//export default withUsermenu()(Sandbox);
export default Sandbox;
