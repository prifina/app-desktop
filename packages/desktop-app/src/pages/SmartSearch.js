import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text, Input, Select, Button, Label, Divider } from "@blend-ui/core";

import styled, { css } from "styled-components";
import shallow from "zustand/shallow";


import { useStore, } from "@prifina-apps/utils";

//import { useEffectOnce, } from 'usehooks-ts'

const buttonVariant = (props) => {

  let buttonProps = null;

  if (props.selected) {
    buttonProps = css`
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border: 0.0625rem solid #1CAA9F;
  color: #F5F8F7;
  background-color: #1CAA9F;
  `;
  }


  return [buttonProps];
}

const StyledButton = styled(Button)`
 ${buttonVariant};
`;

const StyledTextarea = styled('textarea')`
margin-top:10px;
width: 500px;
    height: 300px;
    overflow-y: scroll;
    padding: 10px;
    overflow-wrap: break-word;

    `;

const SmartSearch = props => {
  console.log("SMART SEARCH PROPS ", props);
  const selectedDataSource = "fitbit";

  const { activeUser, listUserDataconnectorsQuery, getParserAIQuery } = useStore(
    state => ({
      activeUser: state.activeUser,
      listUserDataconnectorsQuery: state.listUserDataconnectorsQuery,
      getParserAIQuery: state.getParserAIQuery
    }),
    shallow,
  );

  const queryEntry = useRef("");
  const dataSource = useRef("");
  const metaTags = useRef("");

  const effectCalled = useRef(false);
  const [dataConnectorList, setDataConnectorList] = useState([]);
  const [selectedConnectorDescription, setSelectedConnectorDescription] = useState("");
  const [timePeriod, setTimePeriod] = useState("unknown");
  const [testResult, setTestResult] = useState(-1);

  const [accuracyLevel, setAccuracyLevel] = useState(1);

  const dataObject = JSON.stringify({ "deepCount": 3, "deepMinutes": 108, "deepThirtyDayAvgMinutes": 78, "lightCount": 31, "lightMinutes": 259, "lightThirtyDayAvgMinutes": 241, "remCount": 8, "remMinutes": 103, "remThirtyDayAvgMinutes": 137, "wakeCount": 28, "wakeMinutes": 65, "wakeThirtyDayAvgMinutes": 67, "startTimeTS": 1680111690000, "endTimeTS": 1680143820000, "startTime": "2023-03-29T17:41:30.000Z", "endTime": "2023-03-30T02:37:00.000Z", "minutesAfterWakeup": 3, "minutesAsleep": 470, "minutesAwake": 65, "minutesToFallAsleep": 0, "timeInBed": 535 });


  useEffect(() => {
    //console.log("EFFECT CALLED ", effectCalled.current);
    async function init() {
      effectCalled.current = true;
      const dataconnectors = await listUserDataconnectorsQuery({ dataSource: selectedDataSource });

      console.log("listUserDataconnectorsQuery ", dataconnectors);
      setDataConnectorList([{ "description": "", "id": "none", "name": "Select datasource..." },
      ...dataconnectors.data.listDataconnectors.items]);

    }
    if (!effectCalled.current) {
      init();
    }
  }, []);

  // <React.Suspense fallback={"Loading ..."}> 
  /* 
    <Select
    mb={10}
    size={"sm"}
    key={"widget-setting-" + i}
    id={setting.field}
    name={setting.field}
    defaultValue={fields[setting.value]}
    onChange={handleChange}
  >
    {timezones.current.map((t, ii) => {
      return (
        <option
          key={"widget-setting-" + i + "-" + ii}
          value={t.tz}
        >
          {t.text}
        </option>
      );
    })}
  </Select>
  {
      "data": {
          "listDataconnectors": {
              "items": [
                  {
                      "dataSource": "fitbit",
                      "description": "Good for overall heart rate queries",
                      "id": "Fitbit/queryHeartRateSummary",
                      "name": "Fitbit heart rate summary"
                  },
                  {
                      "dataSource": "fitbit",
                      "description": "Good for detailed activity level queries",
                      "id": "Fitbit/queryActivities",
                      "name": "Fitbit activity level data"
                  },
                  {
                      "dataSource": "fitbit",
                      "description": "Good for overall activity queries",
                      "id": "Fitbit/queryActivitySummary",
                      "name": "Fitbit activity summary"
                  },
                  {
                      "dataSource": "fitbit",
                      "description": "Good for detailed heart rate level queries",
                      "id": "Fitbit/queryHeartRateData",
                      "name": "Fitbit heart rate level data"
                  },
                  {
                      "dataSource": "fitbit",
                      "description": "Good for all sleep related queries",
                      "id": "Fitbit/querySleepSummary",
                      "name": "Fitbit sleep summary"
                  },
                  {
                      "dataSource": "fitbit",
                      "description": "Good for detailed sleep level queries",
                      "id": "Fitbit/querySleepData",
                      "name": "Fitbit sleep level data"
                  }
              ]
          }
      }
  }
   */
  return (
    <Box width={"100vw"} height={"100vh"}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >

        <Box width={"80%"}>
          <Flex>
            <Input width={"400px"} placeholder="Your query" ref={queryEntry} />
            <Box width={"300px"} height={"60px"} pl={"30px"}>
              <Select
                ref={dataSource}
                size={"sm"}
                onChange={() => {
                  console.log("SELECTED ", dataSource);
                  setSelectedConnectorDescription(dataConnectorList[dataSource.current.selectedIndex].description);
                }}
              >
                {dataConnectorList.map((dc, i) => {
                  return <option key={"connector-" + i} value={dc.id}>{dc.name}</option>
                })}
              </Select>
              <Text textStyle={"caption2"}>{selectedConnectorDescription}</Text>
            </Box>
            <Box width={"100px"} pl={"10px"}><Button>Connect</Button></Box>
          </Flex>
          <Divider />
          <Flex>
            <Box width={"200px"}>
              <Button onClick={async () => {
                const answer = await getParserAIQuery({ queryStr: queryEntry.current.value });
                console.log(answer);
                const dcParts = dataConnectorList[dataSource.current.selectedIndex].id.split("/");
                const parts = JSON.parse(answer.data.getParserAIQuery.result).text.trim().split(":::");
                console.log(parts);
                if (parts[0] === "not-found") {
                  setTimePeriod("unknown");
                  setTestResult(0);

                }
                if (parts.length === 3 && parts[0] === dcParts[0] && parts[1] === dcParts[1]) {
                  setTimePeriod(parts[2]);
                  setTestResult(2);
                }
                /*
                if (parts.length === 3 && parts[0] === dcParts[0] && parts[1] === dcParts[1] && parts[2] !== dcParts[2]) {
                  setTestResult(1);
                }
                */
                /*
                {
                  "data": {
                      "getParserAIQuery": {
                          "result": "{\"status\":200,\"statusText\":\"OK\",\"text\":\" Fitbit:::querySleepSummary:::latest\"}"
                      }
                  }
              }

              {
    "data": {
        "getParserAIQuery": {
            "result": "{\"status\":200,\"statusText\":\"OK\",\"text\":\" not-found\"}"
        }
    }
}
              */
              }}>Test query</Button>
            </Box>
            <Box width={"200px"}>
              <Label style={{ textDecoration: "underline" }}>Time period</Label>
              <Text textStyle={"h6"} >{timePeriod}</Text>
            </Box>
            <Box>
              {testResult === 2 && "\u2713  Good Match"}
              {testResult === 1 && "! Time Period unrecognised"}
              {testResult === 0 && "Query Not Recognised"}
              {(testResult === 1 || testResult === 0) && <Button ml={"10px"}>Add new training example</Button>}
            </Box>
          </Flex>
          <Divider />

          <Flex mt={"20px"}>
            <Box width={"300px"}>
              <Text>Add meta tags</Text>
              <Input placeholder={"Enter comma separated tag list"} ref={metaTags} />
            </Box>
            <Box pl={"20px"}>
              <Text>Accuracy Level</Text>
              <StyledButton onClick={() => {
                setAccuracyLevel(0)
              }} selected={accuracyLevel === 0}>Low</StyledButton><StyledButton onClick={() => {
                setAccuracyLevel(1)
              }} selected={accuracyLevel === 1}>Mid</StyledButton><StyledButton onClick={() => {
                setAccuracyLevel(2)
              }} selected={accuracyLevel === 2}>High</StyledButton>
            </Box>
            <Button ml={"20px"}>Add meta information</Button>

          </Flex>
          <Text>Data object</Text>
          <StyledTextarea readOnly>{dataObject}</StyledTextarea>
        </Box>

        {/* 
        <Text textAlign={"center"} textStyle={"h3"}>
          SmartSearch
        </Text>
*/}
      </Flex>

    </Box>
  );
};

SmartSearch.displayName = "SmartSearch";

export default SmartSearch;
