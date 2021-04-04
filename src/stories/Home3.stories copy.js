/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
import React, { useRef, useState, useEffect, forwardRef } from "react";
import { RemoteComponent } from "../RemoteComponent";
import styled from "styled-components";

import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Divider,
  IconField,
} from "@blend-ui/core";
import { BlendIcon } from "@blend-ui/icons";
import bxCog from "@iconify/icons-bx/bx-cog";
import bxSearchAlt2 from "@iconify/icons-bx/bx-search-alt-2";
import bxChevronUp from "@iconify/icons-bx/bx-chevron-up";
import bxChevronDown from "@iconify/icons-bx/bx-chevron-down";

import { useSprings, animated } from "react-spring";
import { useFormFields } from "../lib/formFields";

import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";
import i18n from "../lib/i18n";
import { PrifinaProvider, usePrifina } from "@prifina/hooks";

i18n.init();
import Image from "./fingerpori.png";

export default { title: "Remote" };

const components = [
  "https://raw.githubusercontent.com/prifina/widgets/master/packages/hello/dist/main.bundle.js",

  "https://raw.githubusercontent.com/prifina/widgets/master/packages/watch/dist/main.bundle.js",
  //"https://raw.githubusercontent.com/prifina/widgets/master/packages/weather/dist/main.bundle.js",
  "https://raw.githubusercontent.com/prifina/widgets/master/packages/file-drop/dist/main.bundle.js",
];

const WidgetWrapper = styled.div`
  margin: 10px;
  border: 2px outset;
  border-radius: 8px;
  height: 200px;
  width: 200px;
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
`;
const IconDiv = styled.div`
  height: 24px;
  position: relative;
  left: 220px;
  opacity: 0;
  cursor: ${(props) => (props.open ? "default" : "pointer")};
  &:hover {
    opacity: ${(props) => (props.open ? 0 : 1)};
  }
`;
const SettingsDiv = styled.div`
  background-color: white;

  width: 100%;
  height: 100%;
  border: 2px outset;
  border-radius: 8px;
  z-index: 10;
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
  width: ${(props) => props.width}px;
  height: 100vh;
  z-index: 20;
  background-color: white;
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;
const widgetSettings = [
  {
    appID: "helloWidget",
    title: "Hello",
    settings: [
      {
        label: "Message",
        value: "msg",
        type: "text",
      },
    ],
  },
  {
    appID: "watchWidget",
    title: "Watch",
    settings: [],
  },
  /*
  {
    appID: "weatherWidget",
    title: "Weather",
    settings: [
      {
        label: "Location",
        value: "location",
        type: "text",
      },
    ],
  },
  */
  {
    appID: "fileDropWidget",
    title: "FileDrop",
    settings: [],
  },
];

const SearchBox = forwardRef(({ onClick, chevronOpen }, ref) => {
  return (
    <Box ml={10} mr={10} ref={ref}>
      <IconField>
        <IconField.LeftIcon
          iconify={bxSearchAlt2}
          color={"componentPrimary"}
          size={"17"}
        />
        <IconField.InputField
          autoFocus={true}
          placeholder={i18n.__("Search")}
          id={"search"}
          name={"search"}
          onChange={(e) => {
            //handleChange(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              //const userError = checkUsername(e.target.value, true);
            }
          }}
        />
        <Box
          display={"inline-flex"}
          onClick={() => onClick((prevState) => !prevState)}
        >
          <IconField.RightIcon
            iconify={chevronOpen ? bxChevronUp : bxChevronDown}
            color={"componentPrimary"}
            size={"17"}
          />
        </Box>
      </IconField>
    </Box>
  );
});

const SearchHistory = (props) => {
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
        <ul>
          {searchHistory.map((item, i) => {
            return <li key={"search-" + i}>{item.search}</li>;
          })}
        </ul>
      </SearchContainer>
    </>
  );
};
const SettingsDialog = ({ widget, onUpdate, ...props }) => {
  const currentSettings = widgetSettings[widget];
  let inputFields = {};
  currentSettings.settings.forEach((f) => {
    inputFields[f.value] = "";
  });
  console.log("FLDS ", inputFields);
  console.log("DIALOG ", props);
  const [fields, handleChange] = useFormFields(inputFields);

  return (
    <Box m={2}>
      <Text textStyle={"h3"} textAlign={"center"} mt={10}>
        {currentSettings.title}
      </Text>
      <Divider />
      <Box mt={10} ml={5} mr={5}>
        {currentSettings.settings.map((setting, i) => {
          return (
            <Input
              key={"widget-setting-" + i}
              placeholder={setting.label}
              mb={2}
              id={setting.value}
              name={setting.value}
              onChange={handleChange}
            />
          );
        })}
        <Box mt={10}>
          <Button
            width={"100%"}
            onClick={(e) => {
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

const WidgetList = React.memo(({ widgetList, widgetData }) => {
  // currentUser
  // localization
  // settings
  return (
    <>
      {widgetList.map((Widget, i) => {
        return <Widget data={widgetData[i]} key={"prifina-widget-" + i} />;
      })}
    </>
  );
});
const fn = (animations) => (index) => animations[index];

export const widgetStory2 = () => {
  //const { getCallbacks, check } = usePrifina({ appID: "PrifinaWidgets" });
  const prifina = usePrifina({ appID: "WIDGETS" });

  const [widgetList, setWidgetList] = useState([]);
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [provider, setProvider] = useState(false);
  //const [widgetImage, setWidgetImage] = useState("");
  const widgetImage = useRef();
  const wSettings = widgetSettings.map((w) => {
    //console.log(w);
    return {
      settings: prifina.getSettings(w.appID),
      currentUser: prifina.currentUser,
      localization: prifina.getLocalization(),
    };
  });
  console.log("WIDGET SETTINGS ", wSettings);
  const [widgetData, setWidgetData] = useState(wSettings);

  const [activeTab, setActiveTab] = useState(0);
  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };

  const [searchHistory, setSearchHistory] = useState(false);
  const searchBox = useRef();
  const searchKey = useRef();
  /*
  let animations = [];
  useSprings(
    animations.length,
    animations.map((item) => item)
  )
*/

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
    fn(animationItems.current)
  );

  //const [springs, setSprings] = useState(useSprings(0, []));

  /*
  const [settings, setSettings] = useState({
    left: "0px",
    top: "0px",
    height: "0px",
    width: "0px",
    widget: -1,
  });
  */

  const refs = useRef([]);
  const settingsRef = useRef([]);
  //const [items, setItems] = useState([]);

  const takeSnapshot = async (w) => {
    const DEFAULT_PNG = {
      fileName: "component.png",
      type: "image/png",
      html2CanvasOptions: {},
    };
    if (w !== -1) {
      //console.log("IMAGE REF ", Object.keys(refs.current), refs.current[settings.widget]);

      const ww = document.querySelectorAll(
        "[data-widget-index='" + w + "']"
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

  const openSettings = (w) => {
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

      //transform: `perspective(600px) rotateY(${!open ? 180 : 0}deg)`,
      /*
      setItems([
        {
          to: {
            transform: `perspective(600px) rotateY(0deg)`,
            width: ww.width + "px",
            height: ww.height + "px",
          },
          from: {
            transform: `perspective(600px) rotateY(180deg)`,
            width: ww.width + "px",
            height: ww.height + "px",
          },
          onRest: () => {
            if (settingsRef.current[0]) {
              console.log("ENDS...", settingsRef.current[0]);
              //settingsRef.current[0].style.visibility = "hidden";
            }
          },
          config: { mass: 5, tension: 500, friction: 80, duration: 1000 },
        },
        {
          delay: 3000,
          from: {
            transform: "none",
            width: ww.width + "px",
            height: ww.height + "px",
          },
          to: {
            transform: "none",
            width: "400px",
            height: "400px",
          },
          onStart: () => {
            if (settingsRef.current[0]) {
              console.log("ENDS...", settingsRef.current[0]);
              settingsRef.current[0].style.visibility = "hidden";
            }
          },
          onRest: () => {
            if (settingsRef.current[1]) {
              console.log("ENDS...", settingsRef.current[1]);
              // settingsRef.current[0].style.visibility = "hidden";
            }
          },
        },
      ]);
      */
      /*
      items.push({
        visibility: !open ? "visible" : "hidden",
        width: !open ? ww.width : "400px",
        height: !open ? ww.height : "400px",
        transform: "none",
      });
      */
      //settingsRef.current[0].style.width = ww.width + "px";
      //settingsRef.current[0].style.height = ww.height + "px";

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
    } else {
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
  };
  /*
  const style = useSpring({
    width: !open ? "0px" : settingsStyle.width,
    height: !open ? "0px" : settingsStyle.height,
    left: settingsStyle.left,
    top: settingsStyle.top,
    position: "absolute",
  });
  */
  /*
  const style = useSpring({
    width: open ? settings.width : "0px",
    height: open ? settings.height : "0px",
    left: "0px",
    
    position: "absolute",
    visibility: open ? "visible" : "hidden",
  });
  */
  /*
  const items = [
    {
      opacity: open ? 1 : 0,
      transform: `perspective(600px) rotateY(${open ? 180 : 0}deg)`,
      config: { mass: 5, tension: 500, friction: 80 },
      width: settings.width,
      height: settings.height,
      visibility: open ? "visible" : "hidden",
    },
    {
      visibility: open ? "visible" : "hidden",
      width: open ? settings.width : "400px",
      height: open ? settings.height : "400px",
      transform: "none",
    },
  ];
  */

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
    }
  }, [open]);

  /*
  const springs = useSprings(
    animations.length,
    animations.map((item) => item)
  );
*/
  /*
  const { transform, opacity } = useSpring({
    opacity: open ? 1 : 0,
    transform: `perspective(600px) rotateY(${open ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  */

  useEffect(() => {
    const widgets = components.map((remoteUrl, i) => {
      //React.forwardRef((props, ref) =>

      const Widget = forwardRef((props, ref) => {
        console.log("W ", props);
        return (
          <React.Fragment>
            {widgetSettings[i].settings.length > 0 && (
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
              <RemoteComponent url={remoteUrl} {...props} />
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
  }, []);
  //visibility: props.opacity.interpolate(o => o === 0 ? 'hidden' : 'visible')
  // <a.div class="c front" style={{ opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`) }} />
  /*
  <animated.div
  style={{
    ...style,
    left: settings.left,
    top: settings.top,
  }}
  ref={settingsRef}
>
  <SettingsDiv />
</animated.div>

return springs.map(props => <animated.div style={props} />)

        <animated.div
          style={{
            opacity,
            transform: transform.interpolate((t) => `${t} rotateX(180deg)`),
            left: settings.left,
            top: settings.top,
            width: settings.width,
            height: settings.height,
            position: "absolute",
          }}
          ref={settingsRef}
        >
          <SettingsDiv />
        </animated.div>
 {springs.map((props, i) => {
         <animated.div
            style={{
              opacity: props.opacity,
              transform: props.transform.interpolate(
                (t) => `${t} rotateX(180deg)`
              ),
              left: settings.left,
              top: settings.top,
              width: settings.width,
              height: settings.height,
              position: "absolute",
            }}
            ref={settingsRef}
          >
            <SettingsDiv />
          </animated.div>;
            })}
             transform: props.transform.interpolate(
                  (t) => `${t} rotateX(0deg)`
                ),

*/
  /*
  useEffect(async () => {
    const DEFAULT_PNG = {
      fileName: "component.png",
      type: "image/png",
      html2CanvasOptions: {},
    };
    if (settings.current.widget !== -1) {
      //console.log("IMAGE REF ", Object.keys(refs.current), refs.current[settings.widget]);

      const ww = document.querySelectorAll(
        "[data-widget-index='" + settings.current.widget + "']"
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
      //setWidgetImage(f);
    }
  }, [settings.current]);
*/
  const onUpdate = (data) => {
    console.log("Update settings ", data);
    console.log("HOOK ", prifina);
    //setWidgetData([data]);
    //setOpen(false);
    //console.log(check());
    console.log(settings, widgetSettings[settings.current.widget]);
    const currentSettings = widgetSettings[settings.current.widget];
    console.log(prifina.getCallbacks());
    const c = prifina.getCallbacks();
    if (typeof c[currentSettings.appID] === "function") {
      prifina.setSettings(currentSettings.appID, data);
      c[currentSettings.appID](data);
      setOpen(false);
    }
  };

  console.log("SPRINGS ", springs);
  /*
  transform: props.transform.interpolate(
    (t) => `${t} rotateX(0deg)`
  ),
*/
  /*
  const ttest = (t) => {
    return t;
  };
  useEffect(
    (data) => {
      console.log("TTEST ", data);
    },
    [ttest]
  );

  const timer = setTimeout(() => {
    console.log("TIMER ");
    ttest(100);
  }, 3000);
*/
  return (
    <>
      {open && (
        <ModalBackground
          className={"widget-modal"}
          onClick={(e) => {
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
                ref={(ref) => {
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
                      widget={settings.current.widget}
                    />
                  )}
                </SettingsDiv>
              </animated.div>
            );
          })}
        </ModalBackground>
      )}
      <Tabs activeTab={activeTab} onClick={tabClick} title={"Widgets"}>
        <TabList>
          <Tab>Tero</Tab>
          <Tab>Work</Tab>
          <Tab>Family</Tab>
          <Tab>Hobbies</Tab>
        </TabList>
        <TabPanelList>
          <TabPanel>
            <SearchBox
              ref={searchBox}
              onClick={setSearchHistory}
              chevronOpen={searchHistory}
            />
            {searchHistory && <SearchHistory searchBox={searchBox} />}
            <WidgetContainer>
              <WidgetList widgetList={widgetList} widgetData={widgetData} />
            </WidgetContainer>
          </TabPanel>
          <TabPanel>Work panel</TabPanel>
          <TabPanel>Family panel</TabPanel>
          <TabPanel>Hobbies panel</TabPanel>
        </TabPanelList>
      </Tabs>
    </>
  );
};

widgetStory2.story = {
  name: "Remote widgets",
  decorators: [
    (Story) => {
      return (
        <PrifinaProvider stage={"dev"}>
          <Story />
        </PrifinaProvider>
      );
    },
  ],
};
/*

widgetStory2.story = {
  name: "Remote widgets",
};
*/
/*
{widgetList.length > 0 &&
  widgetList.map((Widget, i) => {
    return (
      <Widget
        data={widgetData[i]}
        key={"prifina-widget-" + i}
        ref={(ref) => {
          //console.log("WREF ", ref);
          if (ref !== null) {
            console.log("NEW WIDGET REF... ", i);
            refs.current.push(ref);
          }
        }}
        open={open}
      />
    );
  })}
  */
