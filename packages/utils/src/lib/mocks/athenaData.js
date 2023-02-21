import React from 'react';
/*
  const { filter, format, fields, queryType,
    dataModel,
    mockupFunction,
    mockupModule } = parsePayload(payload);
*/

import { UserDataConnectors } from './Dataconnectors';

import SANDBOX from "@prifina-backend/utils";
//import OURA from "@dynamic-data/oura-mockups";

const xpayload = {
  "params": {
    "executionId": "74c814ab-cbb5-437c-95ae-feac84e527e8",
    "args": {
      "input": {
        "dataconnector": "Oura/queryActivitySummariesAsync",
        "userId": "6145b3af07fa22f66456e20eca49e98bfe35",
        "fields": [
          "day_start",
          "class_5min"
        ],
        "filter": "{\"s3::date\":{\">=\":\"2022-11-24\"}}",
        "appId": "x3LSdcSs1kcPskBWBJvqGto",
        "execId": "z36j2yx6r4",
        "stage": "sandbox"
      },
      "sql": "SELECT * FROM core_athena_tables.oura_activity_summary where user='id_6145b3af07fa22f66456e20eca49e98bfe35' and day >= '2022-11-24' order by day desc"
    },
    "source": "SANDBOX",
    "idToken": "eyJraWQiOiJ1RFFlcHVrUDdNTmNabWtKcitqc0JaWGNsaXNYK2RqdUh6S0hMblZuNHI4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNjQwMTI3NC1lNWEwLTQzMTQtODc1ZS1iNGUwZGRiNThkMDgiLCJjb2duaXRvOmdyb3VwcyI6WyJVU0VSIiwiREVWIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJjdXN0b206aWRlbnRpdHlQb29sIjoiZXUtd2VzdC0xOjU3NjZmNGI3LTAwNDMtNGE2ZC04Yzg1LTBlY2JkNzk1MmMyMiIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTEuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0xX3V3eTNSMTJGTSIsInBob25lX251bWJlcl92ZXJpZmllZCI6dHJ1ZSwiY29nbml0bzp1c2VybmFtZSI6InRlc3RVc2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdC11c2VyIiwib3JpZ2luX2p0aSI6IjRmOTAwZmQ0LWQ0NDMtNDA0NS05OGVmLTZhZWI2YWNmYzljMiIsImF1ZCI6IjJ2aDRjbmo5a3NsMzRxNnZ1NW81NnRyaGJpIiwiZXZlbnRfaWQiOiJhNzJlYTlkZC0wZTIyLTRkNWEtYjNhMy1hNmNlZWZlOTJmYWQiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY3MDUxNjI5NCwiY3VzdG9tOnByaWZpbmEiOiI2MTQ1YjNhZjA3ZmEyMmY2NjQ1NmUyMGVjYTQ5ZTk4YmZlMzUiLCJwaG9uZV9udW1iZXIiOiIrMzU4MTIzNDU2NzgiLCJleHAiOjE2NzA1MTk4OTQsImlhdCI6MTY3MDUxNjI5NCwianRpIjoiM2I5ZmUxN2MtOTQ1YS00NzE3LTliYTItMmFhMGM5OGJjOWI3IiwiZW1haWwiOiJ0cm85OTk5K2FscGhhLXRlc3RAZ21haWwuY29tIn0.ssnVbKKNWwlL_hHFgAJeZXmfe2wsF8r5vPnKqTpiA2O7VeWcf_njm52rndis8N1oSubHU1A0WkqGz8OAp5sgiOstmPGg59x0v_m8dqBXv3u5Mh54Gt4cWtun8aH2pnvSOy7YbxcO7AvIwDhbc2dkQpl_CHVnemGJPYHQDYOsFWz2OrL6gaXxuZ3TQpSHJjDMCYUmxuXIIzLRmjjVw1OB8znmEgkZ5YQzt_oqaAxRyWoX8Vz1Wvv2LLxrCWtw_iSH9aLQYD2eCDAqP2GnajpXNqYSKLFOmLacS8STfsLRwwOZbkjZoJboBHwgQ2-SXV4s4yCOlkD9Ex8bxUoEhRHSkw",
    "fields": [
      "day_start",
      "class_5min"
    ],
    "dataconnector": {
      "partitions": [
        "day"
      ],
      "mockupModule": "@dynamic-data/oura-mockups",
      "dataModel": "ActivitySummary",
      "orderBy": "day desc",
      "source": "ATHENA",
      "id": "Oura/queryActivitySummariesAsync",
      "mockupFunction": "getActivityMockupData",
      "mockup": "queryActivitySummariesAsync",
      "queryType": "ASYNC",
      "sql": "SELECT * FROM core_athena_tables.oura_activity_summary"
    }
  }
}
/*
{
    "input": {
        "dataconnector": "Oura/querySleepDataAsync",
        "userId": "6145b3af07fa22f66456e20eca49e98bfe35",
        "fields": [
            "summary_date",
            "hr_lowest"
        ],
        "filter": "{\"s3::date\":{\">=\":\"2023-01-11\"}}",
        "appId": "nsEjj21WhsSAhPigePiLSY",
        "execId": "z677p3xu1z",
        "stage": "alpha"
    }
}
*/

/*
const importApp = appName => {
  console.log("APP ", appName);
  return React.lazy(() =>
    import("../pages/" + appName).catch((e) => {
      console.log("IMPORT ERROR ", e);
      return import("./NotFoundPage");
    }),
  );
};
*/

const getSandboxData = (event, cb) => {
  console.log("EVENT ", event);

  const dataConnector = UserDataConnectors.filter(d => {
    return (d.id === event.input.dataconnector)
  });
  //console.log("DC ", dataConnector);
  const payload = { "params": {} };
  payload.params.args = event;
  payload.params.dataconnector = dataConnector[0];

  /*
  if (payload.hasOwnProperty("params")) {
    dataconnector = payload.params.args.input.dataconnector;
    filter =
      payload.params.args.input.filter.length > 0
        ? JSON.parse(payload.params.args.input.filter)
        : "";
    fields = payload.params.args.input.fields;
    format = "CSV";
    queryType = payload.params.dataconnector.queryType;
    dataModel = payload.params.dataconnector.dataModel;
    mockupFunction = payload.params.dataconnector.mockupFunction;
    mockupModule = payload.params.dataconnector.mockupModule;
  }
    */

  /*
  UserDataConnectors=[
    {
      "mockupFunction": "getDailiesMockupData",
      "mockup": "queryDailiesDataAsync",
      "mockupModule": "@dynamic-data/garmin-mockups",
      "partitions": [
        "day",
        "period"
      ],
      "queryType": "ASYNC",
      "orderBy": "day desc",
      "source": "ATHENA",
      "id": "Garmin/queryDailiesDataAsync",
      "dataModel": "DailiesData",
      "sql": "SELECT * FROM core_athena_tables.garmin_dailies_data"
    },
  */
  //console.log("PAYLOAD: ", payload);
  try {
    const appID = event.input.appId;
    const userID = event.input.userId;
    const inputDataConnector = event.input.dataconnector;
    const { filter, format, fields, queryType,
      dataModel,
      mockupFunction,
      mockupModule } = SANDBOX.parsePayload(payload);
    console.log(filter, format, fields, queryType, mockupFunction, mockupModule, dataModel);
    const { dataDate, startDate, endDate, filterCondition } = SANDBOX.parseFilter(filter);
    console.log(dataDate, startDate, endDate, filterCondition);
    //"@dynamic-data/oura-mockups"
    return new Promise(function (resolve, reject) {
      import("./datasources/" + mockupModule.split("/")[1] + "/src/index.js")
        .then((module) => {
          console.log("DATAMODULE MOCKUP IMPORT  ", module);

          let mockContent = SANDBOX.getMockedData(module, queryType, format, dataModel, mockupFunction, { filter, filterCondition, startDate, endDate, dataDate }, fields)
          console.log(mockContent); // this should be ok for both async and sync requests...

          const athenaResults = {
            "getDataObject": {
              "result": "{\"headers\":{\"content-length\":\"150\",\"Content-Type\":\"application/x-amz-json-1.0\",\"Date\":\"Wed, 18 Jan 2023 14:36:36 GMT\",\"x-amzn-RequestId\":\"30fb7950-0fe5-4060-aafa-47d812ce9c39\"},\"statusCode\":200,\"body\":\"{\\\"executionArn\\\":\\\"arn:aws:states:us-east-1:429117803886:execution:User-StateMachine:6b764132-7803-41c4-b5e8-2f723266328f\\\",\\\"startDate\\\":1.674052596266E9}\"}",
              "__typename": "ObjectData"
            }
          };
          /*
          // provider response...
          getDataObject:result: "{\"content\":{\"summary_date\":\"2023-02-19\",\"awake\":6330,\"light\":14100,\"deep\":7950,\"rem\":2220,\"total\":24270},\"next\":1650}"

            result...     
                    {
                      "getDataObject": {
                          "content": {
                              "summary_date": "2023-02-19",
                              "awake": 6330,
                              "light": 14100,
                              "deep": 7950,
                              "rem": 2220,
                              "total": 24270
                          },
                          "next": 1650
                      }
                  }
          */
          /*
          {
            "getDataObject": {
                "result": "{\"headers\":{\"content-length\":\"150\",\"Content-Type\":\"application/x-amz-json-1.0\",\"Date\":\"Wed, 18 Jan 2023 14:36:36 GMT\",\"x-amzn-RequestId\":\"30fb7950-0fe5-4060-aafa-47d812ce9c39\"},\"statusCode\":200,\"body\":\"{\\\"executionArn\\\":\\\"arn:aws:states:us-east-1:429117803886:execution:User-StateMachine:6b764132-7803-41c4-b5e8-2f723266328f\\\",\\\"startDate\\\":1.674052596266E9}\"}",
                "__typename": "ObjectData"
            }
        }
        */

          /*
          {
            "data": {
                "athenaResults": {
                    "data": "{\"content\":[\"summary_date,hr_lowest\",\"2023-01-12,39\",\"2023-01-14,40\",\"2023-01-15,46\",\"2023-01-16,39\"],\"dataconnector\":\"Oura/querySleepDataAsync\"}",
                    "appId": "nsEjj21WhsSAhPigePiLSY",
                    "id": "6145b3af07fa22f66456e20eca49e98bfe35",
                    "__typename": "AthenaData"
                }
            }
        }
        */

          if (queryType === "ASYNC") {
            resolve({
              data: athenaResults
            });

            cb({
              "data": {
                "athenaResults": {
                  "data": JSON.stringify({ content: mockContent, dataconnector: inputDataConnector }),
                  "appId": appID,
                  "id": userID,
                  "__typename": "AthenaData"
                }
              }
            })
          } else {
            resolve({
              data: {
                "getDataObject": {
                  result: JSON.stringify({
                    "content": mockContent
                  })
                }
              }
            });
          }

        })
        .catch((err) => {
          console.log("DATAMODULE MOCKUP IMPORT ERROR ", err);
          reject(err);
        });
    });
    //let mockContent = SANDBOX.getMockedData(mockupModule, queryType, format, dataModel, mockupFunction, { filter, filterCondition, startDate, endDate, dataDate }, fields)
    //console.log(mockContent);
  } catch (e) {
    console.log("ERROR ", e)
  }
}

export { getSandboxData };