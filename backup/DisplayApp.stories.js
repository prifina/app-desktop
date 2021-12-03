/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React, { useRef, useState, useEffect } from "react";
import { PrifinaProvider, PrifinaContext } from "@prifina/hooks";

import i18n from "../lib/i18n";

import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";
import config from "../config";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

import DisplayApp from "../pages/DisplayApp";

i18n.init();

const APIConfig = {
  aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
  aws_appsync_region: config.main_region,
  aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
};

const AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.main_region,
};

const S3Config = {
  AWSS3: {
    bucket: config.S3.bucket, //REQUIRED -  Amazon S3 bucket name
    region: config.S3.region, //OPTIONAL -  Amazon service region
  },
};

export default { title: "DisplayApp" };

export const displayApp = () => {
  console.log("COMPONENT --->");
  console.log("CONFIG ", config);
  const [settingsReady, setSettingsReady] = useState(false);

  const data = useRef([]);

  const prifinaID = useRef("");

  const client = new AWSAppSyncClient({
    url: APIConfig.aws_appsync_graphqlEndpoint,
    region: APIConfig.aws_appsync_region,
    auth: {
      type: AUTH_TYPE.AWS_IAM,
      credentials: () => Auth.currentCredentials(),
    },
    /*
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () =>
        (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    */
    disableOffline: true,
  });
  Auth.configure(AUTHConfig);
  Amplify.configure(APIConfig);
  Amplify.configure(S3Config);
  console.log("AUTH CONFIG ", AUTHConfig);

  // get user auth...
  useEffect(async () => {
    try {
      const session = await Auth.currentSession();
      /*
      const user = await Auth.currentAuthenticatedUser();
      console.log("USER ", user);
      if (!user) {
        console.log("NO CURRENT USER FOUND");
      }
      */
      console.log("SESSION ", session);
      if (!session) {
        console.log("NO CURRENT SESSION FOUND");
      }
      console.log("PRIFINA-ID", session.idToken.payload["custom:prifina"]);
      prifinaID.current = session.idToken.payload["custom:prifina"];
      /*
      const s3Data = await Storage.put(
        "widgetData.json",
        JSON.stringify(widgetData),
        {
          level: "public",
        },
      );
      console.log("S3 DATA ", s3Data);
      */

      const getPrifina = `query MyQuery {
  getPrifinaApp(id: "WIDGETS") {
    widgets
  }
}`;
      const prifinaWidgets = await GRAPHQL.graphql({
        query: getPrifina,
        variables: { id: "WIDGETS" },
        authMode: "AWS_IAM",
      });
      console.log(
        "CURRENT CONFIG ",
        JSON.parse(prifinaWidgets.data.getPrifinaApp.widgets),
      );
      const widgetData = JSON.parse(prifinaWidgets.data.getPrifinaApp.widgets);

      const getUser = `query prifinaUser($id:String!){
        getPrifinaUser(id: $id) {
          installedApps
          installedWidgets
        }
      }`;
      const currentPrifinaUser = await GRAPHQL.graphql({
        query: getUser,
        variables: { id: prifinaID.current },
        authMode: "AWS_IAM",
      });
      console.log("CURRENT USER ", currentPrifinaUser);
      const installedWidgets = JSON.parse(
        currentPrifinaUser.data.getPrifinaUser.installedWidgets,
      );
      let widgetCounts = {};
      data.current = installedWidgets.map(w => {
        if (widgetCounts.hasOwnProperty(w.name)) {
          widgetCounts[w.name]++;
        } else {
          widgetCounts[w.name] = 0;
        }
        let defaultValues = {};
        if (widgetData[w.name].settings) {
          widgetData[w.name].settings.forEach(v => {
            // if type=text...
            defaultValues[v.value] = "";
          });

          if (w.hasOwnProperty("settings") && w.settings.length > 0) {
            console.log("SETTINGS FOUND ", w);
            w.settings.forEach(k => {
              if (defaultValues.hasOwnProperty(k.field)) {
                defaultValues[k.field] = k.value;
              }
            });
          }
          /*
          if (installedWidgets[w].length > 0) {
            //console.log("SEETINGS FOUND ", w.widget.appID);
            installedWidgets[w].forEach(i => {
              if (defaultValues.hasOwnProperty(i.field)) {
                defaultValues[i.field] = i.value;
              }
            });
          }
          */
        }
        return {
          url: widgetData[w.name].url,
          settings: widgetData[w.name].settings.length > 0,
          currentSetting: defaultValues,
          widget: {
            settings: widgetData[w.name].settings,
            installCount: widgetCounts[w.name],
            appID: w.name,
            name: widgetData[w.name].name,
            title: widgetData[w.name].title,
          },
        };
      });
      /*
      const data = useRef(
        installedWidgets.map(w => {
          return {
            url: widgetData[w].url,
            settings: widgetData[w].settings.length > 0,
            currentSetting: {},
            widget: {
              settings: widgetData[w].settings,
              appID: w,
              name: widgetData[w].name,
              title: widgetData[w].title,
            },
          };
        }),
      );
*/
      /*
data.current.map((w, i) => {
  let defaultValues = {};
  if (w.settings) {
    w.widget.settings.forEach(v => {
      // if type=text...
      defaultValues[v.value] = "";
    });
    if (widgets.hasOwnProperty(w.widget.appID)) {
      //console.log("SEETINGS FOUND ", w.widget.appID);
      widgets[w.widget.appID].forEach(w => {
        if (defaultValues.hasOwnProperty(w.field)) {
          defaultValues[w.field] = w.value;
        }
      });
    }
  }
  data.current[i].currentSetting = defaultValues;
  
});
*/

      /*

{
  "data": {
    "getPrifinaApp": {
      "widgets": "{

const s3Data = await Storage.get("widgetData.json", {
        download: true,
        level: "public",
      });

      //const s3Json = await s3Data.Body.text();
      const s3Json = await new Response(s3Data.Body).json();
      console.log("S3 DATA ", s3Json.helloWidget);

      //console.log("WIDGETS ", JSON.stringify(JSON.stringify(s3Json)));
      */

      /*


  "data": {
    "getPrifinaUser": {
      "installedApps": "[\"Settings\",\"DataConsole\",\"AppMarket\",\"SmartSearch\",\"DisplayApp\",\"ProfileCards\",\"DevConsole\"]",
      "installedWidgets": "{\"helloWidget\":[{\"field\":\"msg\",\"value\":\"Hello2\"}]}"
    }
  }
}

      // get user Widgets Settings....
      const getSettings = `query MyQuery($id:String!,$widget:String) {
  getInstalledWidgets(id: $id, widget: $widget) {
    id
    installedWidgets
  }
}`;

      const currentSettings = await GRAPHQL.graphql({
        query: getSettings,
        variables: { id: "f902cbca-8748-437d-a7bb-bd2dc9d25be5", widget: "" },
        authMode: "AWS_IAM",
      });
      console.log("CURRENT SETTINGS ", currentSettings);
      */

      //console.log("SETTINGS ", res);
      /*
      const widgets = JSON.parse(
        currentPrifinaUser.data.getPrifinaUser.installedWidgets,
      );
      */
      //console.log("INSTALLED ", widgets);

      console.log("CURRENT SETTINGS 2", data);

      /*
      data:
getInstalledWidgets:
id: "f902cbca-8748-437d-a7bb-bd2dc9d25be5"
installedWidgets: "{"helloWidget":[{"field":"msg","value":"Hello2"}]}
*/
      setSettingsReady(true);
    } catch (e) {
      if (typeof e === "string" && e === "No current user") {
        //const user = await Auth.signIn("tahola", "xxxx");
        //console.log("AUTH ", user);
        //console.log("APP DEBUG ", appCode);
      }

      console.log("AUTH ", e);
    }
  }, []);

  return (
    <>
      {settingsReady && (
        <DisplayApp
          widgetConfigData={data.current}
          appSyncClient={client}
          prifinaID={prifinaID.current}
        />
      )}
      {!settingsReady && <div />}
    </>
  );
};

displayApp.story = {
  name: "Display App",
};

displayApp.story = {
  name: "Display APP",
  decorators: [
    Story => {
      //console.log("PROVIDER ", PrifinaProvider);
      return (
        <PrifinaProvider
          stage={"alpha"}
          Context={PrifinaContext}
          activeUser={{
            name: "Active user tero",
            uuid: "13625638c207ed2fcd5a7b7cfb2364a04661",
          }}
        >
          <Story />
        </PrifinaProvider>
      );
    },
  ],
};
