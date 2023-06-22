import React, { useEffect, useRef, useState, useContext, } from "react";


import { createPortal } from "react-dom";

import { Box, Flex, TextArea, Button } from "@blend-ui/core";

import styled from "styled-components";
import { SmartContext } from "../pages/Home";

import config from "../config";

import { useEffectOnce, useIsMounted } from 'usehooks-ts'

const Send = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M29 3L3 15l12 2.5M29 3L19 29l-4-11.5M29 3L15 17.5" /></svg>
);

const Mic = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2a6 6 0 0 0-6 6v8a6 6 0 0 0 12 0V8a6 6 0 0 0-6-6Zm4 14a4 4 0 0 1-8 0V8a4 4 0 0 1 8 0v8ZM7 15a1 1 0 0 1 1 1a8 8 0 1 0 16 0a1 1 0 1 1 2 0c0 5.186-3.947 9.45-9.001 9.95L17 26v3a1 1 0 1 1-2 0v-3l.001-.05C9.947 25.45 6 21.187 6 16a1 1 0 0 1 1-1Z" /></svg>
);
/* 
const propsTest = props => {
  console.log("PROPS ", props)
} */

const StyledIconDiv = styled('div')`
flex: 0 0 auto;
color: rgba(0, 0, 0, 0.54);
/* margin-right: 5px; */
height:33px;
padding:4px;
overflow: visible;
text-align: center;
transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
border-radius: 50%;
&:hover {
  background-color: rgba(0, 0, 0, 0.04);
  cursor: pointer;
}
> svg {
  height:24px;
  width:24px;
}
> svg:hover {
  color: ${props => props.theme.colors.baseSecondary}; 
 
}

`;

const AnswerContainer = styled(Box)`
margin-top:10px;
border: 1px solid #C3C2C2;
max-height: calc(100vh - 270px);
padding:5px;
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
word-break: break-all;
`;

const Dots = styled('div')`

  margin-left: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
  color: black;
  width: 35px;
  height: 15px;
  --d: radial-gradient(farthest-side, currentColor 90%, #0000);
  background: var(--d), var(--d), var(--d), var(--d);
  background-size: 5px 5px;
  background-repeat: no-repeat;
  animation: m 1s infinite;

  @keyframes m {
    0% {
      background-position: calc(0*100%/3) 100%, calc(1*100%/3) 100%, calc(2*100%/3) 100%, calc(3*100%/3) 100%
    }
  
    12.5% {
      background-position: calc(0*100%/3) 0, calc(1*100%/3) 100%, calc(2*100%/3) 100%, calc(3*100%/3) 100%
    }
  
    25% {
      background-position: calc(0*100%/3) 0, calc(1*100%/3) 0, calc(2*100%/3) 100%, calc(3*100%/3) 100%
    }
  
    37.5% {
      background-position: calc(0*100%/3) 0, calc(1*100%/3) 0, calc(2*100%/3) 0, calc(3*100%/3) 100%
    }
  
    50% {
      background-position: calc(0*100%/3) 0, calc(1*100%/3) 0, calc(2*100%/3) 0, calc(3*100%/3) 0
    }
  
    62.5% {
      background-position: calc(0*100%/3) 100%, calc(1*100%/3) 0, calc(2*100%/3) 0, calc(3*100%/3) 0
    }
  
    75% {
      background-position: calc(0*100%/3) 100%, calc(1*100%/3) 100%, calc(2*100%/3) 0, calc(3*100%/3) 0
    }
  
    87.5% {
      background-position: calc(0*100%/3) 100%, calc(1*100%/3) 100%, calc(2*100%/3) 100%, calc(3*100%/3) 0
    }
  
    100% {
      background-position: calc(0*100%/3) 100%, calc(1*100%/3) 100%, calc(2*100%/3) 100%, calc(3*100%/3) 100%
    }
  }
  
`;


const ListResults = (result) => {
  let buildList = null;
  if (typeof result === 'string') {
    const parts = result.split(",");
    buildList = parts.map((m, i) => {
      return <li key={"ll-" + i}>{m}</li>
    });
  } else if (typeof result === "object") {
    buildList = result.map((m, i) => {
      return <li key={"ll-" + i}>{m.label}:{m.value}</li>
    });
  }
  return <ul>{buildList}</ul>
}

const searchResults = (result, query) => {

  const searchData = JSON.parse(result.data.googleSearch.result);
  const answer = [{ "propmt": query, "reply": <a href={searchData[0].link} target="_blank"><span dangerouslySetInnerHTML={{ __html: `${searchData[0].htmlTitle}` }} /></a> }];
  answer.push({ "propmt": "", "reply": <span dangerouslySetInnerHTML={{ __html: `${searchData[0].htmlSnippet}` }} /> });

  answer.push({
    "propmt": "", "reply": <div><div> <a href={searchData[1].link} target="_blank"><span dangerouslySetInnerHTML={{ __html: `${searchData[1].htmlTitle}` }} /></a></div>
      <div><span dangerouslySetInnerHTML={{ __html: `${searchData[1].htmlSnippet}` }} /></div></div>
  });

  answer.push({
    "propmt": "", "reply": <div><div> <a href={searchData[2].link} target="_blank"><span dangerouslySetInnerHTML={{ __html: `${searchData[2].htmlTitle}` }} /></a></div>
      <div><span dangerouslySetInnerHTML={{ __html: `${searchData[2].htmlSnippet}` }} /></div></div>
  });


  return answer;
  /*
  {
    "data": {
        "googleSearch": {
            "result": "[{\"kind\":\"customsearch#result\",\"title\":\"Merikarvia - Wikipedia\",
            \"htmlTitle\":\"<b>Merikarvia</b> - Wikipedia\",
            \"link\":\"https://en.wikipedia.org/wiki/Merikarvia\",
            \"displayLink\":\"en.wikipedia.org\",
            \"snippet\":\"Merikarvia is a municipality in Finland. It is located in the Satakunta region. 
            The neighboring municipalities are Isojoki, Kristinestad, Pomarkku, ...\",
            \"htmlSnippet\":\"<b>Merikarvia</b> is a municipality in Finland. It is located in the Satakunta region. 
            The neighboring municipalities are Isojoki, Kristinestad, Pomarkku,&nbsp;...\",
            \"cacheId\":\"f4YHp5HMX_wJ\",\"formattedUrl\":\"https://en.wikipedia.org/wiki/Merikarvia\",
            \"htmlFormattedUrl\":\"https://en.wikipedia.org/wiki/<b>Merikarvia</b>\",
            \"pagemap\":{\"hcard\":[{\"fn\":\"Merikarvia\",\"nickname\":\"Sastmola\",
            \"category\":\"Municipality\"}],\"metatags\":[{\"referrer\":\"origin\",
            \"og:image\":\"https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kauppatie_Merikarvia.jpg/1200px-Kauppatie_Merikarvia.jpg\",
            \"theme-color\":\"#eaecf0\",\"og:image:width\":\"1200\",\"og:type\":\"website\",
            \"viewport\":\"width=device-width, initial-scale=1.0, user-scalable=yes, minimum-scale=0.25,
             maximum-scale=5.0\",\"og:title\":\"Merikarvia - Wikipedia\",\"og:image:height\":\"675\",
             \"format-detection\":\"telephone=no\"}]}},{\"kind\":\"customsearch#result\",
             \"title\":\"Where is Merikarvia in Finland?\",
             \"htmlTitle\":\"<b>Where is Merikarvia</b> in Finland?\",
             \"link\":\"https://geotargit.com/index.php?qcountry_code=FI&qregion_code=15&qcity=Merikarvia\",
             \"displayLink\":\"geotargit.com\",\"snippet\":\"Distances. Where is Merikarvia relative to other places? 
             Top 10 cities in Western Finland and distance from Merikarvia. City, # ...\",
             \"htmlSnippet\":\"Distances. <b>Where is Merikarvia</b> relative to other places? Top 10 cities in 
             Western Finland and distance from <b>Merikarvia</b>. City, #&nbsp;...\",\"cacheId\":\"zT7YS36GZtwJ\",
             \"formattedUrl\":\"https://geotargit.com/index.php?qcountry_code=FI...15...Merikarvia\",
             \"htmlFormattedUrl\":\"https://geotargit.com/index.php?qcountry_code=FI...15...<b>Merikarvia</b>\",
             \"pagemap\":{\"metatags\":[{\"viewport\":\"width=device-width, initial-scale=1, shrink-to-fit=no\"}],
             \"place\":[{\"name\":\"Finland\"}]}},{\"kind\":\"customsearch#result\",\"title\":\"MICHELIN Merikarvia map 
             - ViaMichelin\",\"htmlTitle\":\"MICHELIN <b>Merikarvia</b> map - ViaMichelin\",
             \"link\":\"https://www.viamichelin.com/web/Maps/Map-Merikarvia-29700-Satakunta-Finland\",
             \"displayLink\":\"www.viamichelin.com\",\"snippet\":\"The MICHELIN Merikarvia map: Merikarvia town map,
              road map and tourist map, with MICHELIN hotels, tourist sites and restaurants for Merikarvia.\",
              \"htmlSnippet\":\"The MICHELIN <b>Merikarvia</b> map: <b>Merikarvia</b> town map, 
              road map and tourist map, with MICHELIN hotels, tourist sites and restaurants for <b>Merikarvia</b>.\",
              \"cacheId\":\"G11Lmr0iHDwJ\",\"formattedUrl\":\"https://www.viamichelin.com/.../Map-Merikarvia-29700-
              Satakunta-Finland\",\"htmlFormattedUrl\":\"https://www.viamichelin.com/.../Map-<b>Merikarvia</b>-29700-
              Satakunta-Finland\",\"pagemap\":{\"cse_thumbnail\":[{\"src\":\"https://encrypted-tbn0.gstatic.com/images?
              q=tbn:ANd9GcTBb4z59m8zMTiqo5CVexdMQCvetl6CMTCnfHszyXyogODpFr65uGPRy64\",\"width\":\"158\",\"height\":
              \"158\"}],\"question\":[{\"name\":\"Where is Merikarvia located?\"},{\"name\":\"What can you find on the 
              ViaMichelin map for Merikarvia?\"},{\"name\":\"What accommodation can you book in Merikarvia?\"}],
              \"answer\":[{\"text\":\"Merikarvia is located in: Suomi, Manner-Suomi, Satakunta, Merikarvia. Find
               detailed maps for Suomi, Manner-Suomi, Satakunta, Merikarvia on ViaMichelin, along with road traffic, 
               the option to...\"},{\"text\":\"For each location, ViaMichelin city maps allow you to display 
               classic mapping elements (names and types of streets and roads) as well as more detailed information: 
               pedestrian streets, building...\"},{\"text\":\"ViaMichelin offers free online accommodation booking in 
               Merikarvia. In partnership with Booking, we offer a wide range of accommodation (hotels, gîtes, B&Bs, 
                campsites, apartments) in the...\"}],\"metatags\":[{\"msapplication-tilecolor\":\"#1095f9\",
                \"apple-itunes-app\":\"app-id=443142682\",\"og:image\":\"https://www.viamichelin.com/logo-social.png\",
                \"theme-color\":\"#1095f9\",\"viewport\":\"width=device-width, initial-scale=1.0, user-scalable=no\",
                \"apple-mobile-web-app-capable\":\"yes\",\"og:title\":\"MICHELIN Merikarvia map - ViaMichelin\",
                \"msapplication-tileimage\":\"/favicon-192x192.png\",\"google-play-app\":\"app-id=com.viamichelin.
                android.viamichelinmobile\",\"og:description\":\"The MICHELIN Merikarvia map: Merikarvia town map, 
    
                oad map and tourist map, with MICHELIN hotels, tourist sites and restaurants for Merikarvia\"}],\"cse_image\":[{\"src\":\"https://www.viamichelin.com/logo-social.png\"}],\"listitem\":[{\"item\":\"Home Page\",\"name\":\"Home Page\",\"position\":\"0\"},{\"item\":\"Maps\",\"name\":\"Maps\",\"position\":\"1\"},{\"item\":\"Suomi\",\"name\":\"Suomi\",\"position\":\"2\"},{\"item\":\"Manner-Suomi\",\"name\":\"Manner-Suomi\",\"position\":\"3\"},{\"item\":\"Satakunta\",\"name\":\"Satakunta\",\"position\":\"4\"},{\"name\":\"Map of Merikarvia\",\"position\":\"5\",\"title\":\"Map of Merikarvia\"}]}}]"
        }
    }
}
*/
}

function toHoursAndMinutes(totalMinutes, opt = false) {
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  if (opt) {
    return `${hours} hours and ${minutes} minutes`;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}


const SmartInput = ({ status, container }) => {
  //console.log("CONTAINER ", container.getBoundingClientRect());
  const rect = container.getBoundingClientRect();
  const entry = useRef(null);
  const [newEntry, setNewEntry] = useState("");
  const [entryListLength, setEntryListLength] = useState(0);
  const entryList = useRef([]);
  const effectCalled = useRef(false);
  const { dataProps, AIDataQuery, googleSearch, AIQuery, UserApiClient } = useContext(SmartContext);
  //const timer = useRef(null);
  const objectLevel = useRef("");
  const dataDate = useRef("");
  const dataConnector = useRef("");
  const querySource = useRef("");

  const sendEntry = async () => {
    setNewEntry(entry.current.value);
    entry.current.style.height = '33px';

    if (entry.current.value.indexOf("@google") !== -1) {
      const query = entry.current.value.replace("@google", "").trim();
      const searchRes = await googleSearch({ q: query });
      const answer = searchResults(searchRes, entry.current.value);
      entryList.current = answer;
    } else {


      const usrlang = navigator.language || navigator.userLanguage;
      const hours = Intl.DateTimeFormat(usrlang, { hour: 'numeric' }).resolvedOptions().hourCycle;

      const createQuery = {
        "prifinaID": dataProps.prifinaID,
        "query": entry.current.value,
        "hours": hours,
        "stage": "sandbox"
      }

      //const localize = { localizeTime: { format: (hours === "h12" ? "12h" : "24h") } }

      const aiResult = await AIDataQuery(createQuery);
      console.log("AI PARSER ", aiResult);
      const answerJSON = JSON.parse(aiResult.data.getAIData.result);
      //objectLevel.current = answerJSON.objectMatchLevel;
      objectLevel.current = "Good"
      dataDate.current = answerJSON.lastModified;

      dataConnector.current = answerJSON.dataConnector;
      querySource.current = answerJSON.querySource;


      //console.log("QUERY ", answerJSON.code);
      /* 
            {
              "data": {
                  "getAIData": {
                      "result": "{\"message\":\"Query DataSource not found...\",\"code\":\"UNKNOWN_DATASOURCE\"}"
                  }
              }
          }
           */
      if (answerJSON?.code === "UNKNOWN_DATASOURCE") {

        const queryResult = await AIQuery({ prompt: entry.current.value });
        console.log("AI Query ", queryResult);
        const answer = JSON.parse(queryResult.data.getAIQuery.result)
        entryList.current = [{ "propmt": entry.current.value, "reply": answer.text.trim() }];
        /* 
        {
          "data": {
              "getAIQuery": {
                  "result": "{\"status\":200,\"statusText\":\"OK\",\"text\":\"\\nThis is a test of your understanding and how you would apply it in a real-world situation.\"}"
              }
          }
      } */

      } else if (answerJSON.answerType === "basic") {
        entryList.current = [{ "propmt": entry.current.value, "reply": ListResults(answerJSON.answer) }];
      } else {
        // summary
        entryList.current = [{ "propmt": entry.current.value, "reply": answerJSON.answer }];

        /*
        \"visualisation\":{\"fields\":[{\"field\":\"deep.minutes\",\"format\":\"hours and minutes\",
        \"label\":\"Deep\"},{\"field\":\"light.minutes\",\"format\":\"hours and minutes\",
        \"label\":\"Light\"},{\"field\":\"rem.minutes\",\"format\":\"hours and minutes\",
        \"label\":\"Rem\"},{\"field\":\"wake.minutes\",\"format\":\"hours and minutes\",
        \"label\":\"Wake\"}],
        */
        const queryResult = answerJSON.answerObject;
        const fieldResult = [];
        answerJSON.visualisation.fields.forEach(f => {
          const key = f.field.split(".");

          if (key.length == 2 && queryResult?.[key[0]] !== undefined && queryResult[key[0]]?.[key[1]] !== undefined) {
            switch (f.format) {
              case "hh:mm":
                fieldResult.push({ label: f.label, value: toHoursAndMinutes(queryResult[key[0]][key[1]]) });
                break;
              case "hours and minutes":
                fieldResult.push({ label: f.label, value: toHoursAndMinutes(queryResult[key[0]][key[1]], true) });
                break;

              default:
                fieldResult.push({ label: f.label, value: queryResult[key[0]][key[1]] });
            }
          }
        })
        entryList.current.push({ "propmt": "", "reply": ListResults(fieldResult) });
      }

    }
    entry.current.value = "";
    setEntryListLength(prev => prev + 1)
    setNewEntry("");
    /* 
       {
    "data": {
        "getAIData": {
            "result": "{\"message\":\"\",\"code\":\"OK\",\"objectMatchLevel\":\"\",
            \"answerType\":\"summary\",\"answerObject\":{\"deep\":{\"count\":16,\"minutes\":87,
            \"thirtyDayAvgMinutes\":78},\"light\":{\"count\":5,\"minutes\":331,\"thirtyDayAvgMinutes\":335},
            \"rem\":{\"count\":5,\"minutes\":162,\"thirtyDayAvgMinutes\":152},\"wake\":{\"count\":11,
            \"minutes\":95,\"thirtyDayAvgMinutes\":96},\"startTimeTS\":1681947878394,
            \"endTimeTS\":1681991018394,\"startTime\":\"2023-04-19T23:44:38.394Z\",
            \"endTime\":\"2023-04-20T11:43:38.394Z\",\"minutesAfterWakeup\":16,
            \"minutesAsleep\":580,\"minutesAwake\":95,\"minutesToFallAsleep\":28,\"timeInBed\":719},
            \"answer\":\"Over the last night, I slept for a total of 719 minutes in bed. During this time, 
            I spent 580 of those minutes asleep and 95 of them awake. I had 16 deep sleep cycles lasting 
            87 minutes and 5 light sleep cycles lasting 331 minutes. On average over the last 30 days, 
            my deep sleep has been 78 minutes and my light sleep has been 335 minutes. Additionally, 
            I had 5 REM cycles lasting 162 minutes with an average of 152 minutes over the past 30 days.
             It took me 28 minutes to fall asleep, and I woke up 16 minutes earlier than planned.\",
             \"visualisation\":{\"fields\":[{\"field\":\"deep.minutes\",\"format\":\"hours and minutes\",
             \"label\":\"Deep\"},{\"field\":\"light.minutes\",\"format\":\"hours and minutes\",
             \"label\":\"Light\"},{\"field\":\"rem.minutes\",\"format\":\"hours and minutes\",
             \"label\":\"Rem\"},{\"field\":\"wake.minutes\",\"format\":\"hours and minutes\",
             \"label\":\"Wake\"}],\"type\":\"generic\"},\"lastModified\":\"2023-04-19T12:45:31.829Z\",
             \"ContentLength\":468}"
        }
    }
}
       */
    /*
    {
      "data": {
          "getAIData": {
              "result": "{\"message\":\"\",\"code\":\"OK\",\"objectMatchLevel\":\"\",\"answer\":\"116 minutes\",
              \"visualisation\":{\"fields\":[{\"field\":\"deep.minutes\",\"format\":\"hours and minutes\",
              \"label\":\"Deep\"},{\"field\":\"light.minutes\",\"format\":\"hours and minutes\",
              \"label\":\"Light\"},{\"field\":\"rem.minutes\",\"format\":\"hours and minutes\",
              \"label\":\"Rem\"},{\"field\":\"wake.minutes\",\"format\":\"hours and minutes\",
              \"label\":\"Wake\"}],\"type\":\"generic\"},\"lastModified\":\"2023-04-19T11:31:51.951Z\",\"ContentLength\":470}"
          }
      }
  }
      */
  }
  /*
    const sendEntry = async () => {
      setNewEntry(entry.current.value);
      //console.log(entry.current.value.split("\n"));
      //console.log("HEIGHT ", entry.current.getBoundingClientRect());
      entry.current.style.height = '33px';
      let dataSource = "";
      let filter = "";
      let timePeriod = "";
      let timePeriodDate = "";
      let dataType = "";
      let dsConfig = {};
      let activity = "";
  
      const questionIndex = dataProps.dataSourceQuestions.findIndex(ds => {
        console.log(ds.question.toLowerCase())
        return entry.current.value.toLowerCase().startsWith(ds.question.toLowerCase().replace("?", ""));
      });
      if (questionIndex > -1) {
        dsConfig = JSON.parse(dataProps.dataSourceQuestions[questionIndex].config);
        dataSource = dsConfig.dataSource;
        filter = dsConfig.filter;
        timePeriod = dsConfig.timePeriod;
        timePeriodDate = getTimePeriodDate(timePeriod, (dsConfig.activity === "sleep"));
      } else {
        // use AIQuery.....
        let createQuery = { prompt: JSON.stringify(dataSourceParser.current.join("\n")) + "\n\n" + entry.current.value };
  
        createQuery["temperature"] = 0.01;
        createQuery["max_tokens"] = 256;
  
        const aiResult = await AIQuery(createQuery);
        console.log("AI PARSER ", aiResult);
        const resObj = JSON.parse(aiResult.data.getAIQuery.result);
        console.log("AI PARSER ", resObj);
        const parsedRes = resObj.text.split("\n");
        // check possible matches...
        if (parsedRes.length > 0) {
          parsedRes.forEach(m => {
            const parts = m.split("=");
            if (parts.length == 2) {
              if (parts[0] === "activity") {
                activity = parts[1].trim();
              }
              if (parts[0] === "datasource") {
                dataSource = parts[1].trim();
              }
            }
          })
        }
  
        console.log("PARSED ", activity, dataSource);
        // if we have dataSource, find out the time period... 
        if (dataSource !== "") {
          createQuery = { prompt: JSON.stringify(dateParser.join("\n")) + "\n\n" + entry.current.value };
  
          createQuery["temperature"] = 0.01;
          createQuery["max_tokens"] = 256;
  
          const aiResult2 = await AIQuery(createQuery);
          console.log("AI PARSER TIME PERIOD", aiResult2);
          const resObj2 = JSON.parse(aiResult2.data.getAIQuery.result);
          console.log("AI PARSER ", resObj2);
          const parts = resObj2.text.split("=");
  
          // filter is "=", if there are 2 parts... 
          if (parts.length == 2 && parts[1] !== "NOT-FOUND") {
            if (parts[0] === "timePeriod") {
              timePeriodDate = parts[1].trim();
              filter = "=";
            }
  
            // sleep activity is requires +1 date...
            if (timePeriodDate !== "" && activity === "sleep") {
              timePeriodDate = dateTomorrowDate(new Date(timePeriodDate));
            }
          } else if (resObj2.text !== "timePeriod=NOT-FOUND") {
            // ATHENA Query....
            timePeriod = resObj2.text.trim();
          }
  
          console.log("PARSED2 ", activity, dataSource, filter, timePeriodDate, timePeriod);
          //"{\"status\":200,\"statusText\":\"OK\",\"text\":\"timePeriod=2023-04-01\"}"
  
        }
  
      }
      console.log("Question IDX ", questionIndex);
      //console.log(dateParser);
      if (filter === "=") {
        dataType = "SYNC";
      }
  
      const dataConnectorIdx = dataProps.dataConnectors.findIndex(dc => {
       
        return dc.id == dataSource && dc.type == dataType;
      });
  
      console.log("CONNECTOR IDX ", dataConnectorIdx);
  
      let queryResult = "";
      let dataConnector = {}
      // if dataconnetor is found....
      if (dataConnectorIdx > -1) {
        dataConnector = JSON.parse(dataProps.dataConnectors[dataConnectorIdx].config);
        const buildQuery = dataConnector.input;
  
        buildQuery.userId = dataProps.prifinaID;
        // buildQuery.stage = "prod"; 
        buildQuery.stage = config.STAGE;
        buildQuery.filter = buildFilter(filter, timePeriodDate);
        //buildQuery.filter = buildFilter(filter, "2023-03-30");
  
        if (dsConfig?.fields !== undefined && dsConfig.fields.length > 0) {
          buildQuery.fields = dsConfig.fields;
        }
  
        console.log(buildQuery);
  
        const getData = await UserApiClient.query(
          dataQuery, {
          "input": buildQuery
        });
  
        const dataResult = JSON.parse(getData.data.getDataObject.result);
        queryResult = dataResult;
        if (dataResult?.content !== undefined) {
          queryResult = dataResult.content;
        }
      }
  
      if (Object.keys(dsConfig).length > 0) {
        if (dsConfig?.postProcess !== undefined && dsConfig.postProcess === "xai-summary") {
          const summary = dsConfig.aiOptions.propmt.join("\n");
          const ignoreFields = dsConfig?.processOptions?.ignoreFields || [];
          const convertDates = dsConfig?.processOptions?.convertDates || [];
          Object.keys(queryResult).forEach(k => {
            if (ignoreFields.indexOf(k) !== -1) {
              delete queryResult[k];
            }
            if (convertDates.indexOf(k) !== -1) {
              queryResult[k] = new Date(queryResult[k]).toLocaleString();
            }
          })
  
          const createQuery = { prompt: summary + "\nSleep data: " + JSON.stringify(queryResult) + "\n" };
          if (dsConfig?.aiOptions.temperature !== undefined) {
            createQuery["temperature"] = dsConfig?.aiOptions.temperature;
          }
          if (dsConfig?.aiOptions.tokens !== undefined) {
            createQuery["max_tokens"] = dsConfig?.aiOptions.tokens;
          }
  
          //{ prompt: summary + "\nSleep data: " + JSON.stringify(queryResult) + "\n", "max_tokens": 1000 }
          const aiResult = await AIQuery(createQuery);
          console.log("AI ", aiResult);
        }
        if (dsConfig?.visualisation !== undefined && dsConfig.visualisation.type === "field") {
  
          console.log("RESULT ", queryResult);
          console.log("VISUALISATION ", dsConfig.visualisation);
          const fieldResult = [];
          dsConfig.visualisation.fields.forEach(f => {
            const key = f.field.split(".");
            //console.log("KEY ", key, key.length);
            //console.log(queryResult?.[key[0]]);
  
            if (key.length == 2 && queryResult?.[key[0]] !== undefined && queryResult[key[0]]?.[key[1]] !== undefined) {
              switch (f.format) {
                case "hh:mm":
                  fieldResult.push(toHoursAndMinutes(queryResult[key[0]][key[1]]));
                  break;
                case "hours and minutes":
                  fieldResult.push(toHoursAndMinutes(queryResult[key[0]][key[1]], true));
                  break;
  
                default:
                  fieldResult.push(queryResult[key[0]][key[1]]);
              }
            }
          })
        }
  
        if (dsConfig?.visualisation !== undefined && dsConfig.visualisation.type === "generic") {
  
          console.log("RESULT ", queryResult);
          console.log("VISUALISATION ", dsConfig.visualisation);
          const fieldResult = [];
          dsConfig.visualisation.fields.forEach(f => {
            const key = f.field.split(".");
            //console.log("KEY ", key, key.length);
            //console.log(queryResult?.[key[0]]);
  
            if (key.length == 2 && queryResult?.[key[0]] !== undefined && queryResult[key[0]]?.[key[1]] !== undefined) {
              switch (f.format) {
                case "hh:mm":
                  fieldResult.push(toHoursAndMinutes(queryResult[key[0]][key[1]]));
                  break;
                case "hours and minutes":
                  fieldResult.push(toHoursAndMinutes(queryResult[key[0]][key[1]], true));
                  break;
  
                default:
                  fieldResult.push(queryResult[key[0]][key[1]]);
              }
            }
          })
  
          console.log("FIELD RES ", fieldResult);
  
          if (fieldResult.length > 0) {
            if (fieldResult.length === 1) {
              entryList.current = [{ "propmt": entry.current.value, "reply": ListResults(fieldResult[0]) }];
            } else {
              entryList.current = [{ "propmt": entry.current.value, "reply": "" }];
              entryList.current.push({ "propmt": "", "reply": ListResults(fieldResult.join(",")) });
            }
  
          }
  
        }
      } else {
        // not stored questions.... 
        console.log("DATA MODEL ", dataConnector);
        const createQuery = { prompt: answerParser(queryResult, dataConnector.dataModelExamples) + "\n\n" + entry.current.value };
  
        createQuery["temperature"] = 0.01;
        createQuery["max_tokens"] = 100;
  
        console.log("AI QUERY ANSWER ", createQuery);
  
        const aiResult = await AIQuery(createQuery);
        console.log("AI PARSER ANSWER", aiResult);
        const resObj = JSON.parse(aiResult.data.getAIQuery.result);
        if (resObj.text.indexOf("NOT-FOUND") !== -1) {
  
          const usrlang = navigator.language || navigator.userLanguage;
          const hours = Intl.DateTimeFormat(usrlang, { hour: 'numeric' }).resolvedOptions().hourCycle;
  
          const localize = { localizeTime: { format: (hours === "h12" ? "12h" : "24h") } }
          // create summary.... 
          const createQuery = { prompt: createObjSummary(queryResult, localize) };
  
          createQuery["temperature"] = 0.7;
          createQuery["max_tokens"] = 200;
  
          console.log("AI QUERY SUMMARY ANSWER ", createQuery);
          const aiResult = await AIQuery(createQuery);
          console.log("AI SUMMARY ANSWER", aiResult);
          const resObj = JSON.parse(aiResult.data.getAIQuery.result);
          const answer = resObj.text.trim();
          entryList.current = [{ "propmt": entry.current.value, "reply": answer }];
  
  
          console.log("DC VISUALISATION ", dataConnector.visualisation);
          const fieldResult = [];
          dataConnector.visualisation.fields.forEach(f => {
            const key = f.field.split(".");
            //console.log("KEY ", key, key.length);
            //console.log(queryResult?.[key[0]]);
  
            if (key.length == 2 && queryResult?.[key[0]] !== undefined && queryResult[key[0]]?.[key[1]] !== undefined) {
              switch (f.format) {
                case "hh:mm":
                  fieldResult.push({ label: f.label, value: toHoursAndMinutes(queryResult[key[0]][key[1]]) });
                  break;
                case "hours and minutes":
                  fieldResult.push({ label: f.label, value: toHoursAndMinutes(queryResult[key[0]][key[1]], true) });
                  break;
  
                default:
                  fieldResult.push({ label: f.label, value: queryResult[key[0]][key[1]] });
              }
            }
          });
  
          console.log("DC VISUALISATION RESULT :", fieldResult);
          entryList.current.push({ "propmt": "", "reply": ListResults(fieldResult) });
  
        } else {
          let answer = resObj.text.trim();
          if (answer.startsWith("A:")) {
            answer = answer.substring(2).trim();
          }
          entryList.current = [{ "propmt": entry.current.value, "reply": ListResults(answer) }];
        }
  
  
      }
  
      entry.current.value = "";
      setEntryListLength(prev => prev + 1)
      setNewEntry("");
    }
    */
  useEffect(() => {
    if (status > 0 || entryList.current.length > 0) {
      console.log("CLOSE ", status)
      entryList.current = [];
      setEntryListLength(0);
    }

  }, [status]);



  console.log("STATUS ", status, entryListLength);
  return <>
    <Box id={"smart-input"} style={{ width: rect.width, left: rect.left, top: rect.top, position: 'absolute', zIndex: 3 }} >
      <Flex>
        <StyledIconDiv mr={"5px"}>
          <Mic />
        </StyledIconDiv>
        <TextArea rows={0} expand={true} ref={entry} onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            sendEntry();
          }
          if (e.key === "Enter" && e.shiftKey) {
            //console.log("SHIFT ENTER ", entry.current.getAttribute("height"));
            entry.current.style.height = entry.current.getAttribute("height") + "px";
          }
        }} />
        <StyledIconDiv ml={"5px"} onClick={sendEntry} >
          <Send />
        </StyledIconDiv>
      </Flex>
      {(newEntry !== "" || entryListLength > 0) && <AnswerContainer>
        {newEntry !== "" && <>
          {newEntry}
          <Dots />
        </>}
        {(newEntry === "" && entryListLength > 0) && <>
          {entryList.current.map((m, i) => {
            //console.log("LIST ", m)
            return <div key={"entry-" + i}>

              <strong style={{ display: "block", backgroundColor: "lightgrey", margin: "5px" }}>{m.propmt}</strong>
              <div style={{ padding: "5px" }}>{m.reply}</div>
            </div>
          })}
          {dataDate.current !== "" && <>
            <div style={{ color: "darkgrey", marginLeft: "5px", fontSize: "0.75rem" }}>{new Date(dataDate.current).toLocaleString()}</div>
            <div style={{ backgroundColor: "lightgrey", margin: "5px" }}>
              <span style={{ borderRight: "1px solid white", paddingLeft: "5px", paddingRight: "5px" }}>
                {querySource.current === "question" && <Button size="lg" variation={"link"}>Edit</Button>}
                {querySource.current === "parser" && <Button size="lg" variation={"link"}>Save</Button>}
              </span>
              <span style={{ borderRight: "1px solid white", paddingLeft: "5px", paddingRight: "5px", fontSize: "0.75rem" }}>{dataConnector.current}</span>
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>{objectLevel.current}</span>
            </div>
          </>
          }
        </>
        }
      </AnswerContainer>
      }

    </Box>
  </>
}
const SmartBar = ({ containerStatus }) => {
  const effectCalled = useRef(false);
  const searchBar = useRef(null);
  //const mountNode = useRef(null);
  const [portalReady, setPortalReady] = useState(false);
  const isMounted = useIsMounted();

  /* 
    useEffectOnce(() => {
      console.log("MOUNT ONCE");
      setPortalReady(true);
    });
   */

  useEffect(() => {
    console.log("MOUNT ");
    setPortalReady(true);
  }, [isMounted])



  return <>
    <Flex width={"100%"} alignItems={"center"} justifyContent={"center"} >
      <Box width={"400px"} id={"search-bar"} ref={searchBar} height={"27px"} />
      {portalReady && createPortal(<SmartInput status={containerStatus} container={searchBar.current} />, document.body)}
    </Flex>
  </>
}

export default SmartBar;
