/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React, { useRef, useState, useEffect, forwardRef } from "react";
import { PrifinaProvider, usePrifina, PrifinaContext } from "@prifina/hooks";
import styled from "styled-components";
import { BlendIcon } from "@blend-ui/icons";
import bxCog from "@iconify/icons-bx/bx-cog";
import bxSearchAlt2 from "@iconify/icons-bx/bx-search-alt-2";
import bxChevronUp from "@iconify/icons-bx/bx-chevron-up";
import bxChevronDown from "@iconify/icons-bx/bx-chevron-down";

import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Divider,
  IconField,
} from "@blend-ui/core";

import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
import { useSprings, animated } from "react-spring";

import { RemoteComponent } from "../RemoteComponent";
import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";
import { useFormFields } from "../lib/formFields";
import i18n from "../lib/i18n";

import useFetch from "../lib/hooks/useFetch";
import { API_KEY, GOOGLE_URL, SEARCH_ENGINE } from "../config";

//import widgetData from "./widgetData";
//import installedWidgets from "./installedWidgets";

import Amplify, { Auth, API as GRAPHQL, Storage } from "aws-amplify";
import config from "../config";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

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

const WidgetWrapper = styled.div`
  margin: 10px;
  border: 2px outset;
  border-radius: 8px;
  height: 200px;
  width: 200px;
`;
const IconDiv = styled.div`
  height: 24px;
  position: relative;
  left: 220px;
  opacity: 0;
  cursor: ${props => (props.open ? "default" : "pointer")};
  &:hover {
    opacity: ${props => (props.open ? 0 : 1)};
  }
`;
const WidgetContainer = styled(Flex)`
  /*
  width: 100%;
  height: 100vh;
  display: flex;
*/
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
`;
const ModalBackground = styled.div`
  width: 100%;
  height: 100vh;
  z-index: 5;
  background-color: rgba(30, 29, 29, 0.3);
  position: absolute;
  left: 0;
  top: 0;
`;
const SearchModal = styled.div`
  width: 100%;
  height: 100vh;
  z-index: 15;
  background-color: rgba(30, 29, 29, 0.3);
  position: absolute;
  left: 0;
  top: 0;
`;
const SearchContainer = styled.div`
  width: ${props => props.width}px;
  height: 100vh;
  z-index: 20;
  background-color: white;
  position: absolute;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;
const SettingsDiv = styled.div`
  background-color: white;

  width: 100%;
  height: 100%;
  border: 2px outset;
  border-radius: 8px;
  z-index: 10;
`;

const WidgetList = React.memo(({ widgetList, widgetData }) => {
  // currentUser
  // localization
  // settings
  console.log("WIDGET LIST ", widgetList);
  console.log("WIDGET DATA", widgetData);
  return (
    <>
      {widgetList.map((Widget, i) => {
        return (
          <Widget
            data={{ settings: widgetData[i].currentSetting }}
            key={"prifina-widget-" + i}
          />
        );
      })}
    </>
  );
});
const SettingsDialog = ({ widgetSetting, onUpdate, ...props }) => {
  //const currentSettings = widgetSettings[widget];
  console.log("SETTINGS ", widgetSetting);
  let inputFields = {};
  Object.keys(widgetSetting.currentSetting).forEach(f => {
    inputFields[f] = widgetSetting.currentSetting[f];
  });
  console.log("FLDS ", inputFields);
  console.log("DIALOG ", props);
  const [fields, handleChange] = useFormFields(inputFields);

  return (
    <Box m={2}>
      <Text textStyle={"h3"} textAlign={"center"} mt={10}>
        {widgetSetting.title}
      </Text>
      <Divider />
      <Box mt={10} ml={5} mr={5}>
        {widgetSetting.settings.map((setting, i) => {
          return (
            <Input
              key={"widget-setting-" + i}
              placeholder={setting.label}
              mb={2}
              id={setting.value}
              name={setting.value}
              defaultValue={fields[setting.value]}
              onChange={handleChange}
            />
          );
        })}
        <Box mt={10}>
          <Button
            width={"100%"}
            onClick={e => {
              console.log("CLICK ", fields);
              //console.log("UPDATE CLICK ", e.target.className);
              onUpdate(fields);
            }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
const SearchBox = forwardRef(
  ({ showHistory, chevronOpen, searchKey, searchOpen }, ref) => {
    const [fields, handleChange] = useFormFields({
      search: "",
    });
    const searchRef = useRef();
    return (
      <Box ml={10} mr={10} ref={ref}>
        <IconField>
          <IconField.LeftIcon
            iconify={bxSearchAlt2}
            color={"componentPrimary"}
            size={"17"}
          />
          <IconField.InputField
            ref={searchRef}
            autoFocus={true}
            placeholder={i18n.__("Search")}
            id={"search"}
            name={"search"}
            onChange={handleChange}
            onKeyDown={e => {
              if (e.key === "Enter") {
                //console.log("SEARCH ....", fields.search);
                searchKey(fields.search);
              }
            }}
          />
          <Box
            display={"inline-flex"}
            onClick={() => {
              if (!searchOpen) {
                showHistory(prevState => !prevState);
              }
              searchRef.current.value = "";
              searchKey("");
            }}
          >
            <IconField.RightIcon
              iconify={chevronOpen || searchOpen ? bxChevronUp : bxChevronDown}
              color={"componentPrimary"}
              size={"17"}
            />
          </Box>
        </IconField>
      </Box>
    );
  },
);
const SearchResults = props => {
  const { searchBox, searchKey, roleKey } = props;
  //console.log(searchBox);
  //console.log(searchBox.current.getBoundingClientRect());
  const boxRect = searchBox.current.getBoundingClientRect();
  const containerProps = {
    width: boxRect.width,
    left: boxRect.left,
    top: boxRect.top + boxRect.height + 5,
  };
  console.log(containerProps);

  const { data, error, isLoading, setUrl } = useFetch(
    `${GOOGLE_URL}?cx=${SEARCH_ENGINE}&exactTerms=${
      roleKey.length > 0 ? encodeURIComponent(roleKey) : ""
    }&q=${encodeURIComponent(searchKey)}&lr=lang_en&key=${API_KEY}`,
  );

  let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory === null) {
    searchHistory = [];
  } else {
    searchHistory.unshift({ search: searchKey });
  }
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  const getContent = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!data && isLoading) return <h2>LOADING...</h2>;
    if (!data) return null;
    console.log(Object.keys(data));
    return (
      <ol>
        {data.items.map((item, i) => {
          return <li key={"search-result-" + i}>{item.title}</li>;
        })}
      </ol>
    );
  };

  return (
    <>
      <SearchContainer {...containerProps}>
        <Text textStyle={"h4"}>Search results</Text>
        <Divider />
        {getContent()}
      </SearchContainer>
    </>
  );
};
const SearchHistory = props => {
  const { searchBox } = props;
  //console.log(searchBox);
  //console.log(searchBox.current.getBoundingClientRect());
  const boxRect = searchBox.current.getBoundingClientRect();
  const containerProps = {
    width: boxRect.width,
    left: boxRect.left,
    top: boxRect.top + boxRect.height + 5,
  };
  console.log(containerProps);
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory === null) {
    searchHistory = [{ search: "Testing..." }];
  }

  /*
  localStorage.setItem(
    "WidgetImage",
    JSON.stringify({ image: res.target.result })
  );
  */

  return (
    <>
      <SearchContainer {...containerProps}>
        <Text textStyle={"h4"}>Search history</Text>
        <Divider />
        <ol>
          {searchHistory.map((item, i) => {
            return <li key={"search-" + i}>{item.search}</li>;
          })}
        </ol>
      </SearchContainer>
    </>
  );
};

const fn = animations => index => animations[index];

export default { title: "DisplayApp" };

export const displayApp = () => {
  console.log("COMPONENT --->");

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

      data.current = Object.keys(installedWidgets).map(w => {
        let defaultValues = {};
        if (widgetData[w].settings) {
          widgetData[w].settings.forEach(v => {
            // if type=text...
            defaultValues[v.value] = "";
          });

          if (installedWidgets[w].length > 0) {
            //console.log("SEETINGS FOUND ", w.widget.appID);
            installedWidgets[w].forEach(i => {
              if (defaultValues.hasOwnProperty(i.field)) {
                defaultValues[i.field] = i.value;
              }
            });
          }
        }
        return {
          url: widgetData[w].url,
          settings: widgetData[w].settings.length > 0,
          currentSetting: defaultValues,
          widget: {
            settings: widgetData[w].settings,
            appID: 1,
            name: widgetData[w].name,
            title: widgetData[w].title,
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

const DisplayApp = ({
  widgetConfigData,
  appSyncClient,
  prifinaID,
  ...props
}) => {
  console.log("PROPS ", widgetConfigData, Object.keys(widgetConfigData));
  console.log("DISPLAY APP ", prifinaID);
  const {
    check,
    currentUser,
    getLocalization,
    getSettings,
    setSettings,
    getCallbacks,
    registerClient,
    API,
    Prifina,
  } = usePrifina();
  const WidgetHooks = new Prifina({ appId: "WIDGETS" });
  //console.log(check());

  const [widgetList, setWidgetList] = useState([]);
  const [widgetConfig, setWidgetConfig] = useState(widgetConfigData);

  const [activeTab, setActiveTab] = useState(0);

  const [searchHistory, setSearchHistory] = useState(false);
  const searchBox = useRef();
  const [searchKey, setSearchKey] = useState("");

  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const widgetImage = useRef();

  const settings = useRef({
    left: "0px",
    top: "0px",
    height: "0px",
    width: "0px",
    widget: -1,
  });

  const items = [{}, {}];
  const animationItems = useRef(items.map((_, index) => index));

  const [springs, setSprings] = useSprings(
    items.length,
    fn(animationItems.current),
  );

  const refs = useRef([]);
  const settingsRef = useRef([]);
  const widgetSettings = useRef(
    widgetConfigData.map((w, i) => {
      return {
        settings: w.widget.settings || [],
        title: w.widget.title,
        appId: w.widget.appID,
        currentSetting: w.currentSetting,
      };
    }),
  );

  const roleKeys = ["", "work", "family", "hobbies"];
  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };

  const takeSnapshot = async w => {
    const DEFAULT_PNG = {
      fileName: "component.png",
      type: "image/png",
      html2CanvasOptions: {},
    };
    if (w !== -1) {
      const ww = document.querySelectorAll(
        "[data-widget-index='" + w + "']",
      )[0];

      const element = ReactDOM.findDOMNode(ww);
      const canvas = await html2canvas(element, {
        scrollY: -window.scrollY,
        useCORS: true,
        //backgroundColor: null,
        ...DEFAULT_PNG,
      });
      const f = canvas.toDataURL(DEFAULT_PNG.type, 1.0);
      //console.log("FILE2 ", f);
      console.log("NEW SNAPSHOT TAKEN...");
      widgetImage.current = f;
      setOpen(true);
      //setWidgetImage(f);
    }
  };
  const openSettings = w => {
    if (!open) {
      console.log("CLICK...", w);
      //console.log("REFS...", refs.current[0].getBoundingClientRect());
      //const ww = refs.current[w].getBoundingClientRect();
      //console.log(document.querySelectorAll("[data-widget-index='" + w + "']"));

      const ww = document
        .querySelectorAll("[data-widget-index='" + w + "']")[0]
        .getBoundingClientRect();
      // const element = ReactDOM.findDOMNode(refs.current[settings.widget]);
      //const ww = { left: 0, top: 0, height: 0, width: 0 };
      console.log("WW...", ww);

      settings.current = {
        left: ww.left + "px",
        top: ww.top + "px",
        height: ww.height + "px",
        width: ww.width + "px",
        widget: w,
      };

      animationItems.current = [
        {
          opacity: 1,
          transform: `perspective(1000px) rotateY(0deg)`,
          height: ww.height + "px",
          width: ww.width + "px",
          visibility: "visible",
          reset: true,
          config: {
            mass: 5,
            tension: 500,
            friction: 80,
            duration: 1000,
          },
          onRest: () => {
            //setFlipped(true);
          },
          onStart: () => {
            //refs.current[0].style.visibility = "hidden";
          },
        },

        {
          delay: 500,
          reset: true,
          from: {
            transform: "none",
            width: ww.width + "px",
            height: ww.height + "px",
            visibility: "hidden",
          },
          to: {
            transform: "none",
            width: "400px",
            height: "400px",
            visibility: "hidden",
          },
        },
      ];

      setSprings(fn(animationItems.current));

      takeSnapshot(w);
      //setOpen(true);
    }
  };

  useEffect(() => {
    console.log("OPEN CHANGE ", open);
    if (open) {
      //console.log("REFS....", document.querySelectorAll(".prifina-widget[data-widget-index='0']"));
      //console.log("REFS....", document.querySelectorAll(".prifina-widget"));

      animationItems.current = [
        {
          opacity: 1,
          transform: `perspective(1000px) rotateY(180deg)`,
          width: settings.current.width,
          height: settings.current.height,
          visibility: "visible",
          config: { mass: 5, tension: 500, friction: 80 },
          reset: true,
          onStart: () => {
            // hide widget...
            //refs.current[settings.widget].style.visibility = "hidden";
          },
        },
        {
          delay: 500,
          reset: true,
          from: {
            transform: "none",
            width: settings.current.width,
            height: settings.current.height,
            visibility: "visible",
          },
          to: {
            transform: "none",
            width: "400px",
            height: "400px",
            visibility: "visible",
          },
          onStart: () => {
            if (settingsRef.current[0]) {
              //console.log("ENDS...", settingsRef.current[0]);
              setFlipped(true);
              //settingsRef.current[0].style.display = "none";
            }
          },
          onRest: () => {
            if (settingsRef.current[1]) {
              //console.log("ENDS...", settingsRef.current[1]);
              // settingsRef.current[0].style.visibility = "hidden";
            }
          },
        },
      ];

      setSprings(fn(animationItems.current));
    } else {
      if (settings.current.widget != -1) {
        console.log("INIT SPRINGS....");
        animationItems.current = [{}, {}];
        setSprings(fn(animationItems.current));
        setFlipped(false);
        settingsRef.current = [];
        settings.current = {
          left: "0px",
          top: "0px",
          height: "0px",
          width: "0px",
          widget: -1,
        };
      }
    }
  }, [open]);

  useEffect(() => {
    registerClient([appSyncClient, GRAPHQL]);
    /*
    let data = installedWidgets.map(w => {
      return {
        url: widgetData[w].url,
        settings: widgetData[w].settings.length > 0,
        currentSetting: {},
      };
    });
*/
    console.log("WIDGET CONFIG ", widgetConfig);
    /*
    //await getSettings(appID, "f902cbca-8748-437d-a7bb-bd2dc9d25be5")
    let allSettings = [];
    getSettings("", "f902cbca-8748-437d-a7bb-bd2dc9d25be5").then(res => {
      //console.log("SETTINGS ", res);
      const widgets = JSON.parse(res.data.getInstalledWidgets.installedWidgets);
      console.log("INSTALLED ", widgets);
      widgetSettings.current = widgetConfig.map((w, i) => {
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
        widgetConfig[i].currentSetting = defaultValues;
        return {
          settings: w.widget.settings || [],
          title: w.widget.title,
          appId: w.widget.appID,
          currentSetting: defaultValues,
        };
      });

      console.log("WIDGET CONFIG 2", widgetConfig);
    });
    */
    /*
    widgetSettings.current = widgetConfig.map((w, i) => {
      let defaultValues = {};
      console.log("WIDGET SETTINGS ", w);
      if (w.settings) {
        w.widget.settings.forEach(v => {
          // if type=text...
          defaultValues[v.value] = "";
        });
        allSettings.push(getSettings(w));
      } else {
        allSettings.push(Promise.resolve({}));
      }

      return {
        settings: w.widget.settings || [],
        title: w.widget.title,
        appId: w.widget.appID,
        currentSetting: defaultValues,
      };
    });
    */
    /*
    Promise.all(allSettings).then(r => {
      //console.log("GET SETTINGS ", r);
      r.forEach((d, i) => {
        //console.log("GET SETTINGS 2", d);
        let defaultValues = {};
        if (Object.keys(d).length > 0) {
          Object.keys(d).forEach(k => {
            defaultValues[k] = d[k];
          });
          widgetConfig[i].currentSetting = defaultValues;
          widgetSettings.current[i].currentSetting = defaultValues;
        }
      });
      //console.log("WIDGET CONFIG ", data);
      //setWidgetConfig(data);
    });
    */
    /*
    console.log("GET SETTINGS ", d);
        if (Object.keys(d).length > 0) {
          Object.keys(d).forEach(k => {
            defaultValues[k] = d[k];
          });
        }
        data[i].currentSetting = defaultValues;

    console.log("WIDGET CONFIG ", data);
    setWidgetConfig(data);
    */
  }, []);

  useEffect(() => {
    if (widgetConfig.length > 0) {
      console.log("CREATE WIDGETS...");
      const widgets = widgetConfig.map((widget, i) => {
        console.log("WIDGET COMPONENT ", widget);
        //React.forwardRef((props, ref) =>

        const Widget = forwardRef((props, ref) => {
          console.log("W ", props);
          return (
            <React.Fragment>
              {widget.settings && (
                <IconDiv open={props.open} onClick={() => openSettings(i)}>
                  <BlendIcon iconify={bxCog} />
                </IconDiv>
              )}
              <WidgetWrapper
                className={"prifina-widget"}
                data-widget-index={i}
                key={"widget-wrapper-" + i}
                ref={ref}
              >
                <RemoteComponent url={widget.url} {...props} />
              </WidgetWrapper>
            </React.Fragment>
          );
        });

        //const Widget = (props) => <RemoteComponent url={remoteUrl} {...props} />;

        //return <Widget key={"prifina-widget-" + i} test={"ok"} />;
        return Widget;
      });
      //refs.current = widgets;
      // <RemoteComponent url={remoteUrl} fallback={<div>Testing...</div>} />;
      console.log("WIDGETS ", widgets);

      setWidgetList(widgets);
    }
  }, [widgetConfig]);

  const onUpdate = data => {
    console.log("Update settings ", data);
    console.log("HOOK ", WidgetHooks);
    console.log(getCallbacks());
    console.log(settings.current);
    let newSettings = [];
    Object.keys(data).forEach(k => {
      widgetSettings.current[settings.current.widget].currentSetting[k] =
        data[k];
      newSettings.push({ field: k, value: data[k] });
    });
    const currentAppId = widgetSettings.current[settings.current.widget].appId;
    //"f902cbca-8748-437d-a7bb-bd2dc9d25be5"
    /*
    input WidgetSettingInput {
      field: String!
      value: String!
    }
*/
    console.log("NEW SETTINGS ", newSettings);
    // useCallback((appID, uuid, settings = [{}])
    setSettings(currentAppId, prifinaID, newSettings);
    const c = getCallbacks();
    if (typeof c[currentAppId] === "function") {
      c[currentAppId](data);
    }
    //setWidgetData([data]);
    //setOpen(false);
    //console.log(check());
    /*
    console.log(settings, widgetSettings[settings.current.widget]);
    const currentSettings = widgetSettings[settings.current.widget];
    console.log(prifina.getCallbacks());
    const c = prifina.getCallbacks();
    if (typeof c[currentSettings.appID] === "function") {
      prifina.setSettings(currentSettings.appID, data);
      c[currentSettings.appID](data);
      setOpen(false);
    }
    */
    setOpen(false);
  };

  return (
    <>
      {open && (
        <ModalBackground
          className={"widget-modal"}
          onClick={e => {
            console.log("TARGET ", e);
            console.log("WIDGET SETTINGS ", refs.current, settings);
            console.log("MODAL ", e.target.className);

            /*
            console.log("CURRENT ", refs.current[settings.widget]);
            refs.current[settings.widget].style.visibility = "visible";
            */
            if (e.target.className.indexOf("widget-modal") > -1) {
              setOpen(false);
            }
          }}
        >
          {springs.map((props, i) => {
            console.log("IMAGE ", widgetImage);
            // widget settings...
            console.log(settings.current);
            console.log(widgetSettings);
            /*
            const title = widgetSettings.current[settings.current.widget].title;
            const settingsFields =
              widgetSettings.current[settings.current.widget].settings;
            const currentSetting =
              widgetSettings.current[settings.current.widget].currentSetting;
*/
            return (
              <animated.div
                style={{
                  transform: props.transform,

                  left: settings.current.left,
                  top: settings.current.top,
                  width: props.width,
                  height: props.height,
                  position: "absolute",
                  visibility: props.visibility,
                  zIndex: 2,
                }}
                ref={ref => {
                  if (ref !== null) settingsRef.current.push(ref);
                }}
                key={"animated-" + i}
              >
                <SettingsDiv>
                  {i === 0 && (
                    <img
                      src={widgetImage.current}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: `${flipped ? "none" : "block"}`,
                      }}
                    />
                  )}
                  {flipped && i === 1 && (
                    <SettingsDialog
                      spring={i}
                      flipped={flipped}
                      open={open}
                      onUpdate={onUpdate}
                      widgetSetting={
                        widgetSettings.current[settings.current.widget]
                      }
                    />
                  )}
                </SettingsDiv>
              </animated.div>
            );
          })}
        </ModalBackground>
      )}
      <Tabs activeTab={activeTab} onClick={tabClick}>
        <TabList>
          <Tab>{currentUser.name}</Tab>
          <Tab>Work</Tab>
          <Tab>Family</Tab>
          <Tab>Hobbies</Tab>
        </TabList>
        <TabPanelList>
          <TabPanel>
            <SearchBox
              ref={searchBox}
              showHistory={setSearchHistory}
              chevronOpen={searchHistory}
              searchKey={setSearchKey}
              searchOpen={searchKey.length > 0}
            />
            {searchKey.length > 0 && !searchHistory && (
              <SearchResults
                searchBox={searchBox}
                searchKey={searchKey}
                roleKey={roleKeys[activeTab]}
              />
            )}
            {searchHistory && <SearchHistory searchBox={searchBox} />}
            <WidgetContainer>
              {widgetList.length > 0 && (
                <WidgetList widgetList={widgetList} widgetData={widgetConfig} />
              )}
            </WidgetContainer>
          </TabPanel>
          <TabPanel>Work panel</TabPanel>
          <TabPanel>Family panel</TabPanel>
          <TabPanel>Hobbies panel</TabPanel>
        </TabPanelList>
      </Tabs>

      <div>
        {" "}
        Something{" "}
        <button
          onClick={() => {
            console.log(check());
            console.log("API ", API);
          }}
        >
          Check
        </button>{" "}
      </div>
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
        <PrifinaProvider stage={"alpha"} Context={PrifinaContext}>
          <Story />
        </PrifinaProvider>
      );
    },
  ],
};

const model = {
  getInfo: function () {
    return "OK";
  },
};

function Test(appId) {
  let config = { appId: appId };
  //this.appId = appId;
  this.queries = {
    get: function () {
      console.log("GET ", config);
    },
  };
  this.queries["model"] = model;
}
