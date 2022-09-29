import React, { useRef, forwardRef, useEffect, useState } from "react";

//import { useHistory } from "react-router-dom";

import styled, { keyframes, css } from "styled-components";

import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Divider,
  Label,
  Select,
} from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";

import bxSearchAlt2 from "@iconify/icons-bx/bx-search-alt-2";
import bxChevronUp from "@iconify/icons-bx/bx-chevron-up";
import bxChevronDown from "@iconify/icons-bx/bx-chevron-down";
import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";

import mdiTrashCanOutline from "@iconify/icons-mdi/trash-can-outline";

import mdiPlusBoxMultipleOutline from "@iconify/icons-mdi/plus-box-multiple-outline";
import mdiEyeOffOutline from "@iconify/icons-mdi/eye-off-outline";
import mdiGearOutline from "@iconify/icons-mdi/gear-outline";

import { API_KEY, GOOGLE_URL, SEARCH_ENGINE } from "../../config";

import { i18n, useFetch, useFormFields } from "@prifina-apps/utils";
import moment from "moment";
import "moment-timezone";
import PropTypes from "prop-types";

import { useTheme } from "@blend-ui/core";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

import { ReactComponent as AddWidgetLogo } from "../../assets/display-app/add-widget.svg";

import { BlendIcon } from "@blend-ui/icons";

i18n.init();


export const StyledBlendIcon = styled(BlendIcon)`
  cursor: pointer;
`;


export const TabText = styled(Text)`
  padding-left: 20px;
  padding-top: 25px;
`;

export const PageContainer = styled(Box)`
  margin-left: 64px;
  margin-right: 64px;
  margin-top: 24px;
  background: #ffffff;
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 20px 20px 0px 0px;
  height: 718px;
  // padding: 16px 16px 16px 16x;
  padding-left: 16px;
  padding-top: 3px;
  padding-right: 16px;
`;

export const WidgetWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 2px outset;
  border-radius: 8px;
  /*
  margin: 10px;
  min-height: 200px;
  min-width: 200px;
  */
`;

export const IconDiv = styled.div`
  &:hover {
    transform: scale(0.9);
    box-shadow: 3px 2px 30px 1px rgb(0 0 0 / 24%);
  }
  height: 20px;
  width: 20px;
  /*
  position: relative;
  left: 290px;
  top: 20px;
  */
  position: absolute;
  left: 282px;
  top: 24px;

  opacity: 1;
  cursor: ${props => (props.open ? "default" : "pointer")};
  background-image: radial-gradient(
    circle,
    ${props => (props.widgetTheme === "dark" ? "white" : "black")} 2px,
    transparent 0px
  );
  background-size: 100% 33.33%;
  z-index: 10;
`;

export const EmptyDiv = styled.div`
  height: 20px;
  width: 20px;
  position: relative;
  left: 180px;
  top: 20px;
  opacity: 1;
`;
export const WidgetContainer = styled(Flex)`
  /*
width: 100%;
height: 100vh;
display: flex;
*/
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
  position: relative;
  top: 0px;
  left: 0px;
  overflow-y: auto;
`;

export const InfoBox = styled(Flex)`
  padding: 16px;

  flex-direction: column;
  align-content: center;
  justify-content: center;
  border: 1px solid blue;
  background: #ebf4fe;
  border-radius: 8px;
`;

export const ScrollableBox = styled(Box)`
  scrollbar-width: 4px;
  scrollbar-color: ${props =>
    props.colors ? props.colors.baseSecondary : "#00847A"}
    ${props =>
    props.colors ? props.colors.baseTertiary : "rgba(0, 132, 122, 0.1)"};

  overflow-y: scroll;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  ::-webkit-scrollbar:vertical {
    width: 4px;
    height: 77px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: ${props =>
    props.colors ? props.colors.baseTertiary : "rgba(0, 132, 122, 0.1)"};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    height: 77px;
    background-color: ${props =>
    props.colors ? props.colors.baseSecondary : "#00847A"};
  }
  ::-webkit-scrollbar-thumb:vertical {
    height: 77px;
  }
`;

export const ModalBackground = styled.div`
  width: 100%;
  height: 100vh;
  z-index: 40;
  background-color: rgba(30, 29, 29, 0.3);
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 600px;
`;

export const SearchContainer = styled.div`
  width: ${props => props.width}px;
  /* height: 100vh; */
  max-height: 400px;
  overflow-y: auto;
  z-index: 20;
  background-color: white;
  position: absolute;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;
export const SettingsDiv = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  /*border: 2px outset; */
  border-radius: 8px;
  z-index: 50;
`;

export const SettingsDialogBox = styled(Box)`
  padding: 25px;
  width: 564px;
  height: 504px;
  background: #fafafa;
  border-radius: 20px;
`;

export const BlurImageDiv = styled.div`
  filter: blur(4px);
  -webkit-filter: blur(4px);

  height: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const dots = colors => keyframes`
{
  10% {
   background-color: ${colors[0]}; 
  }
  0%, 20%,100% {
    background-color: ${colors[1]};
  }
}
`;

const DotsContainer = styled.div`
  color: ${props => (props.widgetTheme === "dark" ? "white" : "black")};
  /*
  position: absolute;
  top: 110px;
  */
  height: 69px;
  width: 69px;
  margin: 0 10px 0 0;
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid
    ${props => (props.widgetTheme === "dark" ? "white" : "black")};
  border-radius: 50%;
  z-index: 20;
  div {
    animation: ${props =>
    dots(
      props.widgetTheme === "dark" ? ["white", "gray"] : ["black", "gray"],
    )}
      4s linear infinite;
  }
  div:nth-child(1) {
    animation-delay: 1s;
  }

  div:nth-child(2) {
    animation-delay: 2s;
  }
  div:nth-child(3) {
    animation-delay: 3s;
  }
`;

const Dot = styled.div`
  position: relative;

  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props =>
    props.widgetTheme === "dark" ? "white" : "black"}

  float: left;
  z-index: 21;
  margin-right: 9px;
  &:last-of-type {
    margin-right: 0;
  }
`;
export const DotLoader = props => {
  const theme = useTheme();
  console.log(theme.colors);
  return (
    <DotsContainer theme={theme} {...props}>
      <Dot theme={theme} {...props} />
      <Dot theme={theme} {...props} />
      <Dot theme={theme} {...props} />
    </DotsContainer>
  );
};


const OverlayStyles = styled.div`
 position: relative;
 /*
 width:100%;
 height:100%;
 */
`;

export const WidgetList = ({
  widgetList,
  widgetData,
  currentUser,
  dataSources,
  openWidgetMenu
}) => {
  console.log("WIDGET LIST ", widgetList);
  console.log("WIDGET DATA", widgetData);
  console.log("WIDGET USER", currentUser);
  console.log("DATASOURCES", dataSources);

  const toggleWidgetMenu = (elem) => {
    //console.log(e.currentTarget.getBoundingClientRect());
    const menuProps = elem.getBoundingClientRect();
    const idx = parseInt(elem.dataset["widgetIdx"]);
    //console.log("CLICK ", idx, menuProps);
    openWidgetMenu(menuProps, idx);
  }

  return (
    <>
      {widgetList.length === widgetData.length &&
        widgetList.map((Widget, i) => {
          // const size = widgetData[i].widget.size.split("x");
          const w = widgetData[i];

          return (
            <OverlayStyles key={"prifina-widget-" + i}>
              <div style={{ position: "absolute", top: 0, left: 0 }}>

                {w.settingsExists && (
                  <>
                    <IconDiv
                      widgetTheme={w.widget.theme}
                      data-widget-idx={i}
                      onClick={(e) => {
                        e.preventDefault();
                        //console.log(e.currentTarget.getBoundingClientRect());
                        //const itemIndex = parseInt(e.currentTarget.dataset["widgetIdx"]);
                        toggleWidgetMenu(e.currentTarget);
                      }}
                    />

                  </>
                )}
              </div>
              <Widget

                data={{
                  settings:
                    widgetData.length === 1
                      ? widgetData[0].currentSettings
                      : widgetData[i].currentSettings,
                  // settings: widgetData[i].currentSettings,
                  currentUser: currentUser,
                }}

              />
            </OverlayStyles>
          );
        })}
    </>
  );
};

WidgetList.propTypes = {
  widgetList: PropTypes.instanceOf(Array).isRequired,
  widgetData: PropTypes.instanceOf(Array).isRequired,
  currentUser: PropTypes.instanceOf(Object),
  dataSources: PropTypes.instanceOf(Object),
};

WidgetList.displayName = "WidgetList";

export const SettingsDialog = ({
  widgetIndex,
  widgetSettings,
  onUpdate,
  ...props
}) => {
  console.log("SETTINGS ", widgetIndex, widgetSettings);
  let inputFields = useRef({});
  let timezones = useRef([]);
  const inputRef = useRef();
  const systemFields = useRef({});
  //const [fieldInit, setFieldInit] = useState(false);

  const { colors } = useTheme();

  // note size.... not sizes
  const settingsSystemFields = ["theme", "size"];

  Object.keys(widgetSettings.currentSettings).forEach(f => {
    if (settingsSystemFields.indexOf(f) > -1) {
      if (f === "size") {
        systemFields.current["sizes"] = widgetSettings.currentSettings[f];
      } else {
        systemFields.current[f] = widgetSettings.currentSettings[f];
      }
    } else {
      inputFields.current[f] = widgetSettings.currentSettings[f];
    }
  });
  console.log("FLDS ", inputFields, systemFields);
  console.log("DIALOG ", props);
  let fieldTypeCheck = [];
  widgetSettings.settings.forEach(s => {
    console.log(s);
    if (fieldTypeCheck.indexOf(s.type) === -1) fieldTypeCheck.push(s.type);
  });

  // have timezone field type...
  if (fieldTypeCheck.indexOf("TZ") > -1) {
    moment.tz.names().forEach(function (timezone) {
      timezones.current.push({
        text: timezone + ": " + moment.tz(timezone).format("Z"),
        tz: timezone,
        offset: moment.tz(timezone).utcOffset(),
      });
    });
  }

  // 1== widget settings, 2== system settings like theme,size...
  const settingsType = 1;

  const [fields, handleChange] = useFormFields(
    settingsType === 1 ? inputFields.current : systemFields.current,
  );

  console.log("RENDER FIELDS ", fields, inputFields);

  if (timezones.current.length > 0) {
    const tzOffset = moment.tz(fields.tz).utcOffset();
    console.log("TZ ", inputFields, tzOffset);
    if (tzOffset !== inputFields.current.offset) {
      inputFields.current.offset = tzOffset;
      inputFields.current.tz = fields.tz;
      console.log("INPUT ", inputRef);
      if (inputRef.current) {
        inputRef.current.value = tzOffset;
      }

      handleChange({
        target: {
          id: "offset",
          value: tzOffset,
        },
      });
    }
  }

  const [activeTab, setActiveTab] = useState(1);

  const tabClick = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab(tab);
  };

  console.log("Widget INDEX", widgetIndex);
  console.log("Widget SETTINGS", widgetSettings);

  function docsButton() {
    //history.push("https://docs.prifina.com");
  }

  let number = 0;

  return (
    <SettingsDialogBox>
      <>
        <Flex alignItems="baseline">
          <StyledBlendIcon

            iconify={mdiArrowLeft}
            width="18px"
            onClick={props.onBack}
          />
          <Text textStyle={"h3"} mt={10} ml={15} mb={15}>
            {widgetSettings.title}
          </Text>
        </Flex>

        {/* <Divider /> */}
        <div
          style={{
            overflow: "scroll",
          }}
        >
          <CustomTabs
            activeTab={activeTab}
            onClick={tabClick}
            variant="rectangle"
          >
            <TabList>
              {number === 1 ? (
                <Tab>
                  <Text>System Settings</Text>
                </Tab>
              ) : null}
              <Tab>
                <Text>User Settings</Text>
              </Tab>
              <Tab>
                <Text>About this widget</Text>
              </Tab>
            </TabList>
            <TabPanelList>
              <TabPanel>System Settings</TabPanel>
              <TabPanel
                style={
                  {
                    // height: "auto",
                  }
                }
              >
                <div style={{ overflow: "auto" }}>

                  <Box mt={10} ml={5} mr={5}>
                    {widgetSettings.settings.map((setting, i) => {
                      if (
                        settingsType === 1 &&
                        Object.keys(inputFields.current).indexOf(
                          setting.field,
                        ) > -1
                      ) {
                        return (
                          <React.Fragment key={"settings-" + i}>
                            {setting.type === "text" && (
                              <Input
                                mt={15}
                                key={"widget-setting-" + i}
                                placeholder={setting.label}
                                mb={2}
                                id={setting.field}
                                name={setting.field}
                                defaultValue={fields[setting.field]}
                                onChange={handleChange}
                                ref={inputRef}
                              />
                            )}
                            {setting.type === "TZ" && (
                              <>
                                <Label key={"setting-label-" + i} mt={10}>
                                  {setting.label}
                                </Label>
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
                              </>
                            )}
                          </React.Fragment>
                        );
                      }
                      if (
                        settingsType === 2 &&
                        Object.keys(systemFields.current).indexOf(
                          setting.field,
                        ) > -1
                      ) {
                        let defaultValue = "";
                        let selectOptions = [];
                        let currentField = setting.field;

                        if (
                          setting.type === "select" &&
                          setting.field === "theme"
                        ) {
                          selectOptions = JSON.parse(setting.value);
                          //selectOptions.push({ option: "Dark", value: "dark" });
                          defaultValue = systemFields.current[currentField];
                        }

                        if (
                          setting.type === "select" &&
                          setting.field === "sizes"
                        ) {
                          selectOptions = JSON.parse(setting.value);
                          selectOptions.push({
                            option: "600x600",
                            value: "600x600",
                          });
                          //"[{\"option\":\"300x300\",\"value\":\"300x300\"}]"
                          defaultValue = systemFields.current[currentField];
                        }
                        return (
                          <React.Fragment key={"settings-" + i}>
                            {setting.type === "text" && (
                              <Input
                                mt={15}
                                key={"widget-setting-" + i}
                                placeholder={setting.label}
                                mb={2}
                                id={currentField}
                                name={currentField}
                                defaultValue={fields[currentField]}
                                onChange={handleChange}
                                ref={inputRef}
                              />
                            )}
                            {setting.type === "select" && (
                              <>
                                <Label key={"setting-label-" + i} mt={10}>
                                  {setting.label}
                                </Label>
                                <Select
                                  mb={10}
                                  size={"sm"}
                                  key={"widget-setting-" + i}
                                  id={currentField}
                                  name={currentField}
                                  defaultValue={defaultValue}
                                  onChange={handleChange}
                                >
                                  {selectOptions.map((t, ii) => {
                                    return (
                                      <option
                                        key={"widget-setting-" + i + "-" + ii}
                                        value={t.value}
                                      >
                                        {t.option}
                                      </option>
                                    );
                                  })}
                                </Select>
                              </>
                            )}
                          </React.Fragment>
                        );
                      }
                    })}
                    <Box mt={10}>
                      <Button
                        // width={"100%"}
                        onClick={e => {
                          console.log("UPDATE BUTTON ", fields);

                          if (
                            timezones.length > 0 &&
                            fields.hasOwnProperty("tz")
                          ) {
                            onUpdate({
                              tz: fields.tz,
                              offset: moment.tz(fields.tz).utcOffset(),
                            });
                          } else {
                            onUpdate(fields);
                          }
                        }}
                      >
                        Update
                      </Button>
                    </Box>
                  </Box>

                </div>
              </TabPanel>
              <TabPanel
                style={{
                  height: 340,
                  paddingBottom: "50px",
                  // background: "white",
                  padding: 16,
                }}
              >
                <>
                  <Text mb={8}>{widgetSettings.title}</Text>
                  <Text mb={16}>{widgetSettings.publisher || ""}</Text>
                  <Text mb={16} color={colors.textMuted}>
                    {widgetSettings.shortDescription || ""}
                  </Text>
                  <Text textStyle="h7" bold mb={36}>
                    Author Details
                  </Text>
                  <Flex justifyContent="space-between" mb={40}>
                    <Text fontSize="xs">Author</Text>
                    <Text
                      color={colors.brandAccent}
                      fontSize="xs"
                      style={{ textTransform: "uppercase" }}
                    >
                      {widgetSettings.publisher || ""}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" mb={40}>
                    <Text fontSize="xs">Size</Text>
                    <Text
                      color={colors.brandAccent}
                      fontSize="xs"
                      style={{ textTransform: "uppercase" }}
                    >
                      {widgetSettings.size}
                    </Text>
                  </Flex>

                  <Flex justifyContent="space-between" mb={40}>
                    <Text fontSize="xs">Version</Text>
                    <Text
                      color={colors.brandAccent}
                      fontSize="xs"
                      style={{ textTransform: "uppercase" }}
                    >
                      {widgetSettings.version}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" mb={40}>
                    <Text fontSize="xs">Copyright</Text>
                    <Text
                      color={colors.brandAccent}
                      fontSize="xs"
                      style={{ textTransform: "uppercase" }}
                    >
                      @{widgetSettings.publisher || ""}
                    </Text>
                  </Flex>
                  <Button
                    variation="link"
                    onClick={docsButton}
                    mb={40}
                    style={{ color: colors.textLink }}
                  >
                    Developer Website
                  </Button>
                  <Flex justifyContent="space-between" mb={40}>
                    <Text fontSize="xs">LEDSupport</Text>
                    <Text
                      color={colors.brandAccent}
                      fontSize="xs"
                      style={{ textTransform: "uppercase" }}
                    >
                      @LedSupport
                    </Text>
                  </Flex>
                  <InfoBox>
                    <Text textStyle="h7" mb={4}>
                      Experiencing problems ?
                    </Text>
                    <Text fontSize="12px">
                      If this widget is not working properly the best way to get
                      in touch with the author is through our LEDSupport Slack
                      channel .You can find the widget developers slack details
                      in the table above.
                    </Text>
                  </InfoBox>
                </>
              </TabPanel>
            </TabPanelList>
          </CustomTabs>
        </div>
      </>
    </SettingsDialogBox>
  );
};

SettingsDialog.propTypes = {
  widgetIndex: PropTypes.number.isRequired,
  // widgetSettings: PropTypes.instanceOf(Object).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export const SearchBox = forwardRef(
  ({ showHistory, chevronOpen, searchKey, searchOpen, saveSearchKey }, ref) => {
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
                saveSearchKey(fields.search);
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
SearchBox.propTypes = {
  showHistory: PropTypes.func.isRequired,
  chevronOpen: PropTypes.bool.isRequired,
  searchKey: PropTypes.func.isRequired,
  searchOpen: PropTypes.bool,
  saveSearchKey: PropTypes.func.isRequired,
};

SearchBox.displayName = "SearchBox";

export const SearchResults = props => {
  const { searchBox, searchKey, roleKey, saveSearchResult } = props;

  const boxRect = searchBox.current.getBoundingClientRect();
  const containerProps = {
    width: boxRect.width,
    left: boxRect.left,
    top: boxRect.top + boxRect.height + 5,
  };
  console.log(containerProps);

  console.log("NEW SEARCH ", searchKey);
  const [content, setContent] = useState(null);
  const { data, error, isLoading, setUrl } = useFetch();

  useEffect(() => {
    if (!isLoading)
      setUrl(
        `${GOOGLE_URL}?cx=${SEARCH_ENGINE}&exactTerms=${roleKey.length > 0 ? encodeURIComponent(roleKey) : ""
        }&q=${encodeURIComponent(searchKey)}&lr=lang_en&key=${API_KEY}`,
      );
    if (error) setContent(<h2>Error when fetching: {error}</h2>);
    if (!data && isLoading) setContent(<h2>LOADING...</h2>);
    if (!data && !isLoading) setContent(null);
    if (data) {
      console.log(data);
      const items = data.items.map((item, i) => {
        return (
          <li key={"search-result-" + i}>
            <div>
              <a
                href={item.link}
                data-link={i}
                onClick={e => {
                  const itemIndex = parseInt(e.currentTarget.dataset["link"]);
                  console.log("LINK CLICK ", data.items[itemIndex]);
                  saveSearchResult(searchKey, data.items[itemIndex]);
                }}
                target={"_blank"}
              >
                {item.title}
              </a>
            </div>
            <div style={{ fontSize: "0.75rem" }}>{item.snippet}</div>
          </li>
        );
      });
      setContent(<ol>{items}</ol>);
    }
  }, [searchKey, error, isLoading, data]);

  return (
    <>
      <SearchContainer {...containerProps}>
        <Text textStyle={"h4"}>Search results</Text>
        <Divider />
        {content}
      </SearchContainer>
    </>
  );
};
SearchResults.propTypes = {
  searchBox: PropTypes.instanceOf(Object).isRequired,
  searchKey: PropTypes.string,
  roleKey: PropTypes.string,
  saveSearchResult: PropTypes.func.isRequired,
};

export const SearchHistory = props => {
  const { searchBox } = props;
  console.log("HISTORY ", searchBox);

  const boxRect = searchBox.current.getBoundingClientRect();
  const containerProps = {
    width: boxRect.width,
    left: boxRect.left,
    top: boxRect.top + boxRect.height + 5,
  };
  console.log(containerProps);
  let searchHistory = [];

  return (
    <>
      <SearchContainer {...containerProps}>
        <Text textStyle={"h4"}>Search history</Text>
        <Divider />
        <ol>
          {searchHistory.length > 0 &&
            searchHistory.map((item, i) => {
              return <li key={"search-" + i}>{item.search}</li>;
            })}
        </ol>
      </SearchContainer>
    </>
  );
};

SearchHistory.propTypes = {
  searchBox: PropTypes.instanceOf(Object).isRequired,
};

export const AddWidgetContainer = styled(Flex)`
  width: 284px;
  height: 284px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #979b9b;
  border-radius: 10px;
`;

export const AddWidget = ({ onClick, ...props }) => {
  return (
    <Box padding={16}>
      <AddWidgetContainer>
        <AddWidgetLogo />
        <Button mt={34} variation="outline" onClick={onClick}>
          Add Widget +
        </Button>
      </AddWidgetContainer>
    </Box>
  );
};

export const DropDownContainer = styled(Flex)`
  width: 36px;
  height: 32px;
  cursor: pointer;
  justify-content: center;
  // align-items: center;
  position: relative;
  border-radius: 8px;
  border: 1px dashed #dbf0ee;
  margin: 0 auto;
  bottom: 35px;
`;

export const DropDownListContainer = styled(Flex)`
  margin-top: 40px;
  position: absolute;
  background: #f8fcfc;
  border: 1px solid #bec1c0;
  height: auto;
  width: 170px;
  // height: 133px;
  box-shadow: 0px 4px 8px rgba(91, 92, 91, 0.2);
  border-radius: 5px;
  flex-direction: column;

  z-index: 11;
  // padding: 10px;
`;

export const DropDownList = styled("ul")`
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
`;

export const ListItem = styled(Flex)`
  justify-content: space-between;
  align-items: center;

  padding: 2px 14px 2px 12px;
`;

export const InteractiveListItem = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px 10px 12px;

  height: 40px;
  pointer: cursor;
  &:active {
    background: #eaebeb;
  }
  &:hover {
    background: #eaebeb;
  }
`;


const menuProps = (props) => {
  //console.log("MENU POS ", props);
  const menuPos = {
    left: props.pos_x - 86,
    top: props.pos_y - 16

  }
  return [menuPos];
}

export const WidgetDropDownContainer = styled(Flex)`
  width: 36px;
  height: 32px;
  cursor: pointer;
  justify-content: center;
  // align-items: center;
  position: absolute;
  border-radius: 8px;

  margin: 0 auto;
  //bottom: 35px;

  ${menuProps};
`;

export const InteractiveMenuItem = ({ title, iconify, onClick, ...props }) => {
  return (
    <InteractiveListItem
      justifyContent="space-between"
      alignItems="center"
      style={{ pointer: "cursor" }}
      height="40px"
      onClick={onClick}
      {...props}
    >
      <Text fontSize="sm">{title}</Text>
      <BlendIcon
        iconify={iconify}
        width="16px"
        variation="outline"

      />
    </InteractiveListItem>
  );
};

export const CustomTabs = styled(Tabs)`
  height: 100%;
  background: transparent;
  padding: 0px;

  ul {
    // background: orange;
  }
  // ul > li {

  //   &:hover {
  //     background: red;
  //   }
  //   &:active {
  //     background: red;
  //   }
  //   &:visited {
  //     background: red;
  //   }
  //   &:focused {
  //     background: red;
  //   }
  // }
`;

export const CategoryBadge = styled.span`
  height: 27px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 16px;
  padding-left: 16px;
  text-transform: uppercase;
  font-size: 10px;
  color: #153e75;
`;
