import React, { useState, useRef, useEffect } from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  useTheme,
} from "@blend-ui/core";

import styled from "styled-components";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import { useTranslate } from "@prifina-apps/utils";

import { ProjectContainer, InnerContainer } from "../pages/ProjectDetails-v2";
import DataSourcesDetails from "./DataSourcesDetails";

import PropTypes from "prop-types";

const CustomSelect = styled.select`
  border-radius: 8px;
  /* border: none; */
  color: white;
  padding: 5px;
  font-size: 12px;
  /* background: #aa076b; */
  background: transparent;
  height: 32px;
  width: 300px;
  outline: none;
  /*
  &:focus {
    border: none;
  }
  */
`;


const DataSourceForm = ({ addDataSource, selectOptions, selectedDataSources }) => {

  const selectRef = useRef();

  return (
    <Box>
      <Flex alignItems="center">
        <CustomSelect ref={selectRef} >
          <option value={"none"}>Choose Data Source...</option>
          {selectOptions.map((item, index) => {

            if (selectedDataSources.indexOf(item.source) === -1) {
              return <option key={index} value={item.source}>{item.name}</option>
            } else {
              return null;
            }

          })}
        </CustomSelect>
        <Button
          size="xs"
          ml={4}
          onClick={e => {
            //console.log("CLICK ", selectRef.current.value);
            if (selectRef.current.value !== 'none') {
              addDataSource(selectRef.current.value);
            }
          }}
        >
          Add
        </Button>
      </Flex>
    </Box>
  );
}

DataSourceForm.propTypes = {
  addDataSource: PropTypes.func,
  selectOptions: PropTypes.array,
  selectedDataSources: PropTypes.array
};


const DataSourcesSurvey = ({ inputState, options, publicDatasources, prifinaDatasources, ...props }) => {

  console.log("MARKETPLACE DETAILS ", options);

  const { colors } = useTheme();

  const { __ } = useTranslate();

  const allDataSources = useRef({});
  const selectedDataSources = useRef([]);
  const effectCalled = useRef(false);
  const [initialised, setInitialised] = useState(false);
  //const [selected, setSelected] = useState([]);

  useEffect(() => {
    function init() {

      effectCalled.current = true;
      const ds = {};
      publicDatasources.forEach(s => {
        ds[s.source] = s;
      })
      prifinaDatasources.forEach(s => {
        ds[s.source] = s;
      })
      allDataSources.current = ds;
      selectedDataSources.current = options.defaults.dataSources();
      //setSelected(options.defaults.dataSources());
      setInitialised(true);
    }
    if (!effectCalled.current) {
      init();
    }
  }, [])
  const [activeTab, setActiveTab] = useState(0);

  const tabClick = (e, tab) => {
    setActiveTab(tab);
  };
  /*
    const dataSources = [{ "source": "garmin", "sourceType": 1, "modules": ["@prifina/garmin"], "name": "Garmin" },
    { "source": "fitbit", "sourceType": 1, "modules": ["@prifina/fitbit"], "name": "Fitbit" }];
  */
  const addDataSource = (source) => {
    //console.log("ADD ", source, options.defaults.dataSources(), allDataSources.current[source]);
    selectedDataSources.current = selectedDataSources.current.concat(source);
    inputState({ id: "p-dataSources", value: selectedDataSources.current });
  }
  const deleteDataSource = idx => {
    console.log("DELETE DATA SOURCE CLICK ", idx);
    selectedDataSources.current.splice(idx, 1);
    inputState({ id: "p-dataSources", value: selectedDataSources.current });
  };

  return <>
    {!initialised && null}
    {initialised && <ProjectContainer alt="dataSources" mb={24}>
      <Box mb={45}>
        <Text style={{ textTransform: "uppercase" }}>
          Data Resources survey (optional)
        </Text>
        <Text mt={5} color={colors.textSecondary}>
          Let us know how your application uses data by logging your
          sources (or lack of) here. This information helps us provide
          quality support and helps direct our product roadmap.
        </Text>
      </Box>
      <InnerContainer>
        <Flex>
          <div
            style={{
              overflow: "hidden",
              width: 600,
            }}
          >
            <Tabs
              activeTab={activeTab}
              onClick={tabClick}
              style={{
                height: "100%",
                background: "transparent",
                padding: 0,
              }}
              variant="rectangle"
            >
              <TabList>
                <Tab>
                  <Text>{__("publicApi")}</Text>
                </Tab>
                <Tab>
                  <Text>{__("prifinaUserCloud")}</Text>
                </Tab>
                <Tab>
                  <Text>{__("noData")}</Text>
                </Tab>
              </TabList>
              <TabPanelList style={{ backgroundColor: null }}>
                <TabPanel>
                  <DataSourceForm selectOptions={publicDatasources} addDataSource={addDataSource} selectedDataSources={selectedDataSources.current} />
                </TabPanel>
                <TabPanel>
                  <DataSourceForm selectOptions={prifinaDatasources} addDataSource={addDataSource} selectedDataSources={selectedDataSources.current} />
                </TabPanel>


                <TabPanel>
                  <div style={{ overflow: "auto" }}>
                    <Flex>
                      <Box
                        width="426px"
                        height="80px"
                        borderRadius="6px"
                        paddingLeft="10px"
                        bg={colors.baseLinkHover}
                        style={{
                          border: `2px solid ${colors.baseLink}`,
                        }}
                      >
                        <Flex>
                          <Text>{__("noDataText")}</Text>
                          <Button
                            variation="link"
                            onClick={() => {
                              window.open("https://prifina.com");
                            }}
                          >
                            {__("learnMoreHere")}
                          </Button>
                        </Flex>
                      </Box>


                    </Flex>
                  </div>
                </TabPanel>

              </TabPanelList>
            </Tabs>
          </div>
          <Box width="320px">
            <Text fontSize="13px">
              Search for public data sources in our list or add them if
              they are not there yet.
            </Text>
            <Text mt="15px" fontSize="13px">
              This information helps us provide quality support and helps
              direct our product roadmap.
            </Text>
          </Box>
        </Flex>

        <DataSourcesDetails deleteDataSource={deleteDataSource} allDataSources={allDataSources.current} selectedDataSources={selectedDataSources.current} />
      </InnerContainer>
    </ProjectContainer>
    }
  </>
}

export default DataSourcesSurvey;