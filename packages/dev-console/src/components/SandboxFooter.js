import React, { useState } from "react";


import { Box, Flex, Text, Button, Input, Select, useTheme } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import shallow from "zustand/shallow";

import { useStore } from "../utils-v2/stores/PrifinaStore";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import mdiArrowExpand from "@iconify/icons-mdi/arrow-expand";
import mdiArrowCollapse from '@iconify/icons-mdi/arrow-collapse';

import styled, { keyframes } from "styled-components";

import { ToastContextProvider } from "@blend-ui/toast";
import SandboxFooterAppInfo from "./SandboxFooterAppInfo";
import SystemSettingsSandbox from "./SystemSettingsSandbox-v2";
import SettingsSandbox from "./SettingsSandbox-v2";
import { useAppStudioStore } from "../hooks/UseAppStudio";
import { ParseSettings } from "../pages/Sandbox-v2";
import SandboxDebugger from "./SandboxDebugger";

const BottomContainer = styled.div`
position: absolute;
left: 0;
bottom: 0;
width: 100%;
height: ${props => props.height};
background-color: ${props => props.theme.colors.baseMuted};
border-radius: 16px 16px 0px 0px;
border-top: 1px solid #4b484a;
`;


const SandboxFooter = ({ appData }) => {


  const { updateSettings } = useAppStudioStore((state) => ({ updateSettings: state.updateSettings }),
    shallow);

  const { updateAppVersionMutation } = useStore(
    state => ({
      updateAppVersionMutation: state.updateAppVersionMutation,
    }),
    shallow,
  );

  const fixedAppData = { systemSettings: [], appSettings: [] };

  ['id', 'name', 'remoteUrl'].forEach(key => {
    fixedAppData[key] = appData[key];
  });
  if (appData.settings.length > 0) {
    appData.settings.forEach(s => {
      if (s.field === "size" || s.field === 'sizes') {
        let sValue = [];
        if (typeof s.value === "string") {
          // lets use default size... 
          sValue.push('300x300');
        } else {
          sValue = s.value;
        }
        fixedAppData.systemSettings.push({
          label: s.label,
          field: 'size',
          type: 'system', // not select 
          value: sValue
        });

      } else if (s.field === "theme") {
        let sValue = [];
        if (typeof s.value === "string") {
          // lets use default size... 
          sValue.push('light');
        } else {
          sValue = s.value;
        }
        fixedAppData.systemSettings.push({
          label: s.label,
          field: 'theme',
          type: 'system', // not select 
          value: sValue
        });

      } else {
        fixedAppData.appSettings.push({
          label: s.label,
          field: s.field,
          type: s.type,
          value: s.value
        });
      }
    })
  }
  //appData.id, appData.name, appData.remoteUrl 
  /*
    const appData = {
      id: "xxxxxx",
      name: "Testing",
      remoteUrl: "http://localhost",
      systemSettings: [{ label: "Sizes", field: "size", type: "system", value: [] }, { label: "Themes", field: "theme", type: "system", value: [] }],
      appSettings: [{ "label": "City", "field": "city", "type": "text", "value": "New York" }],
    }
    */


  //"settings": [{ "label": "Sizes", "field": "sizes", "type": "select", "value": "[{\"option\":\"300x300\",\"value\":\"300x300\"},{\"option\":\"600x300\",\"value\":\"600x300\"},{\"option\":\"300x600\",\"value\":\"300x600\"},{\"option\":\"600x600\",\"value\":\"600x600\"}]" },
  //[{ "label": "City", "field": "city", "type": "text", "value": "New York" }, { "label": "Sizes", "field": "sizes", "type": "select", "value": "[{\"option\":\"300x300\",\"value\":\"300x300\"}]" }, { "label": "Theme", "field": "theme", "type": "select", "value": "[{\"option\":\"Dark\",\"value\":\"dark\"}]" }]

  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const [activetab, setActivetab] = useState(0);

  const tabClick = (e, tab) => {
    setActivetab(tab);
  };

  const updateRemoteUrl = (newUrl) => {
    return Promise.resolve(true);
    //await updateAppVersionMutation({ id: inputRefs.current['p-id'], remoteUrl:newUrl });
  };

  const updateSystemSettings = (newSettings) => {
    const systemSettings = newSettings.concat(fixedAppData.appSettings);
    console.log("UPDATE SYSTEM SETTINGS ", systemSettings)
    return Promise.resolve(true);
    //await updateAppVersionMutation({ id: inputRefs.current['p-id'], remoteUrl:newUrl });
  };

  const updateAppSettings = (newSettings) => {
    const appSettings = fixedAppData.systemSettings.concat(newSettings);
    console.log("UPDATE APP SETTINGS ", appSettings)


    //const defaultSettings=parseSettings(appData.current.settings,{ size: defaultSize, theme: defaultTheme });

    const updatedSettings = ParseSettings(newSettings, {});
    //Object.assign({},settings);
    /*
    newSettings.forEach(s => {
      if (["theme", "size"].indexOf(s.field) === -1) {
        updatedSettings[s.field] = s.value;
      }
    });
    */
    updateSettings(updatedSettings);

    return Promise.resolve(true);
    //await updateAppVersionMutation({ id: inputRefs.current['p-id'], remoteUrl:newUrl });
  };

  return <>
    <ToastContextProvider>
      <BottomContainer height={isOpen ? "420px" : "40px"} >
        <BlendIcon
          iconify={isOpen ? mdiArrowCollapse : mdiArrowExpand}
          color={colors.textPrimary}
          style={{
            position: "absolute",
            left: "5px",
            top: "5px",
            cursor: "pointer",
          }}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        />
        <Flex>
          <div
            style={{
              overflow: "scroll",
              height: "100%",
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
                  <Text>{fixedAppData.name}</Text>
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
              {isOpen &&
                <TabPanelList>

                  <TabPanel>
                    <SandboxFooterAppInfo updateRemoteUrl={updateRemoteUrl} appID={fixedAppData.id} remoteUrl={fixedAppData.remoteUrl} />
                  </TabPanel>
                  <TabPanel>
                    <SystemSettingsSandbox systemSettings={fixedAppData.systemSettings} updateSettings={updateSystemSettings} />
                  </TabPanel>
                  <TabPanel>
                    <SettingsSandbox appSettings={fixedAppData.appSettings} updateSettings={updateAppSettings} />

                  </TabPanel>
                  <TabPanel>
                    <SandboxDebugger />
                  </TabPanel>
                  <TabPanel>
                    native assets
                  </TabPanel>
                  <TabPanel>
                    {/* TBD */}
                  </TabPanel>
                </TabPanelList>
              }
            </Tabs>
          </div>
        </Flex>
      </BottomContainer>
    </ToastContextProvider>
  </>
}

export default SandboxFooter;


/*
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
                                */