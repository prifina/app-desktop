/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */

import React, { useRef, forwardRef, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Divider,
  IconField,
  Label,
  Select,
} from "@blend-ui/core";
import { useFormFields } from "../../lib/formFields";
import bxSearchAlt2 from "@iconify/icons-bx/bx-search-alt-2";
import bxChevronUp from "@iconify/icons-bx/bx-chevron-up";
import bxChevronDown from "@iconify/icons-bx/bx-chevron-down";

import useFetch from "../../lib/hooks/useFetch";
import { API_KEY, GOOGLE_URL, SEARCH_ENGINE } from "../../config";

import i18n from "../../lib/i18n";

import moment from "moment";
import "moment-timezone";
import PropTypes from "prop-types";

import { useTheme } from "@blend-ui/core";

i18n.init();

/*
position: absolute;
width: 1309px;
height: 716px;
left: 64px;
top: 182px;

background: #FFFFFF;
box-shadow: 0px -4px 8px #F5F6F6;
*/
export const TabText = styled(Text)`
  padding-left: 20px;
  padding-top: 25px;
`;

export const PageContainer = styled.div`
  margin-left: 64px;
  margin-right: 64px;
  margin-top: 24px;

  background: #ffffff;
  box-shadow: 0px -4px 8px #f5f6f6;
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
/*
div {
  width: 100px;
  height: 100px;
  background-image: radial-gradient(circle, black 10px, transparent 11px);
  background-size: 100% 33.33%;
}
{
    height: 20px;
    width: 30px;
    position: relative;
    left: 188px;
    top: 41px;
    opacity: 1;
    cursor: pointer;
    background-image: radial-gradient(circle,black 2px,transparent 0px);
    background-size: 100% 33.33%;
}
*/
/*
export const IconDiv = styled.div`
  height: 24px;
  position: relative;
  left: 197px;
  top: 23px;
  opacity: 0;
  cursor: ${props => (props.open ? "default" : "pointer")};
  &:hover {
    opacity: ${props => (props.open ? 0 : 1)};
  }
`;
*/

export const IconDiv = styled.div`
  &:hover {
    transform: scale(0.9);
    box-shadow: 3px 2px 30px 1px rgb(0 0 0 / 24%);
  }
  height: 20px;
  width: 20px;
  position: absolute;
  left: 275px;
  top: 20px;
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
  position: absolute;
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
export const ModalBackground = styled.div`
  width: 100%;
  height: 100vh;
  z-index: 40;
  background-color: rgba(30, 29, 29, 0.3);
  position: absolute;
  left: 0;
  top: 0;
`;
/*
export const SearchModal = styled.div`
width: 100%;
height: 100vh;
z-index: 15;
background-color: rgba(30, 29, 29, 0.3);
position: absolute;
left: 0;
top: 0;
`;
*/
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

/*
.bg-image {
  
  background-image: url("photographer.jpg");

  filter: blur(8px);
  -webkit-filter: blur(8px);

  height: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
*/
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
  position: absolute;
  top: 110px;
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
const DotLoader = props => {
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

export const WidgetList = React.memo(
  ({ widgetList, widgetData, currentUser, dataSources }) => {
    // currentUser
    // localization
    // settings
    console.log("WIDGET LIST ", widgetList);
    console.log("WIDGET DATA", widgetData);
    console.log("WIDGET USER", currentUser);
    console.log("DATASOURCES", dataSources);
    const userDataConnectors = Object.keys(currentUser.dataConnectors);
    //const dataSources = { "@prifina/google-timeline": { sourceType: 2 } };
    return (
      <>
        {widgetList.map((Widget, i) => {
          // only first datasource is used ????
          const widgetDataSource = widgetData[i].dataConnectors[0];

          if (widgetData[i].dataConnectors.length > 0) {
            // data source is not connected....
            let userDataSourceStatus = 0;
            if (
              userDataConnectors.length > 0 &&
              userDataConnectors.indexOf(widgetDataSource) > -1
            ) {
              // check dataSource status
              userDataSourceStatus =
                currentUser.dataConnectors[widgetDataSource].status;
            }

            const dataSourceType = dataSources[widgetDataSource].sourceType;
            console.log("DATASOURCE TYPE", i, widgetDataSource, dataSourceType);
            if (userDataSourceStatus < 2) {
              return (
                <div
                  key={"widget-processing-" + i}
                  style={{
                    width: widgetData[i].widget.size.width + "px",
                    height: widgetData[i].widget.size.height + "px",
                    margin: "10px",
                  }}
                >
                  <EmptyDiv />
                  <WidgetWrapper key={"widget-wrapper-" + i}>
                    <BlurImageDiv
                      key={"prifina-widget-" + i}
                      style={{
                        backgroundImage: `url(${widgetData[i].widget.image})`,
                      }}
                    />

                    <div
                      style={{
                        width: widgetData[i].widget.size.width + "px",
                        bottom: "60px",
                        padding: "10px",
                        position: "absolute",
                        textAlign: "center",
                      }}
                    >
                      <Text
                        textStyle={"h6"}
                        color={
                          widgetData[i].widget.theme === "dark"
                            ? "white"
                            : "black"
                        }
                      >
                        {widgetData[i].widget.title}
                      </Text>
                      <Text
                        textStyle={"caption"}
                        color={
                          widgetData[i].widget.theme === "dark"
                            ? "white"
                            : "black"
                        }
                      >
                        {widgetData[i].widget.shortDescription}
                      </Text>
                    </div>
                    <div
                      style={{
                        width: widgetData[i].widget.size.width + "px",
                        bottom: "15px",
                        paddingLeft: "10px",
                        position: "absolute",
                      }}
                    >
                      {userDataSourceStatus === 0 && (
                        <Button>
                          {dataSourceType === 1 ? "Connect Data" : "Import"}
                        </Button>
                      )}
                      {userDataSourceStatus === 1 && <Button>Activate</Button>}
                    </div>
                  </WidgetWrapper>
                </div>
              );
            }

            // processing
            if (userDataSourceStatus === 2) {
              return (
                <div
                  key={"widget-processing-" + i}
                  style={{
                    width: widgetData[i].widget.size.width + "px",
                    height: widgetData[i].widget.size.height + "px",
                    margin: "10px",
                  }}
                >
                  <EmptyDiv />
                  <WidgetWrapper key={"widget-wrapper-" + i}>
                    <BlurImageDiv
                      key={"prifina-widget-" + i}
                      style={{
                        backgroundImage: `url(${widgetData[i].widget.image})`,
                      }}
                    />
                    <div
                      key={"widget-dot-" + i}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        top: "0px",
                        zIndex: 19,
                      }}
                    >
                      <DotLoader widgetTheme={widgetData[i].widget.theme} />
                      <div
                        style={{
                          width: widgetData[i].widget.size.width + "px",
                          bottom: "70px",
                          padding: "5px",
                          position: "absolute",
                          textAlign: "center",
                        }}
                      >
                        <Text
                          textStyle={"h6"}
                          color={
                            widgetData[i].widget.theme === "dark"
                              ? "white"
                              : "black"
                          }
                        >
                          Prosessing your data...
                        </Text>
                        <Text
                          textStyle={"caption"}
                          color={
                            widgetData[i].widget.theme === "dark"
                              ? "white"
                              : "black"
                          }
                        >
                          You will be notified as soon as the data becomes
                          available in your cloud.
                        </Text>
                      </div>
                    </div>
                  </WidgetWrapper>
                </div>
              );
            }
          }
          return (
            <Widget
              data={{
                settings: widgetData[i].currentSettings,
                currentUser: currentUser,
              }}
              key={"prifina-widget-" + i}
            />
          );
        })}
      </>
    );
  },
);

WidgetList.propTypes = {
  widgetList: PropTypes.array.isRequired,
  widgetData: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

//moment.tz.guess()
//console.log("MOMENT ", moment.tz.names());
/*
  var select = document.getElementById('timezones');
moment.tz.names().forEach(function(timezone){
	var option = document.createElement('option');
  option.textContent = timezone + ': ' + moment.tz(timezone).format('Z');
  select.appendChild(option);
});
*/
/*
moment.tz.names().forEach(function (timezone) {
  //console.log(moment.tz(timezone).utcOffset());
});
*/
//console.log(moment.tz.names());
/*
<Label htmlFor="cabinClass">Cabin Class</Label>
<Select
  id="cabinClass"
  name="cabinClass"
  defaultValue="Premium Economy"
  onChange={changeAction}
>
  <option>Economy</option>
  <option>Premium Economy</option>
  <option>Business</option>
  <option>First Class</option>
  <option>
    With a super long label that doesn't get clobbered by the chevron
  </option>
</Select>
*/

export const SettingsDialog = ({
  widgetIndex,
  widgetSettings,
  onUpdate,
  ...props
}) => {
  //const currentSettings = widgetSettings[widget];
  console.log("SETTINGS ", widgetIndex, widgetSettings);
  let inputFields = useRef({});
  let timezones = useRef([]);
  const inputRef = useRef();
  const [fieldInit, setFieldInit] = useState(false);
  useEffect(() => {
    Object.keys(widgetSettings.currentSettings).forEach(f => {
      inputFields.current[f] = widgetSettings.currentSettings[f];
    });
    console.log("FLDS ", inputFields);
    console.log("DIALOG ", props);
    let fieldTypeCheck = [];
    widgetSettings.settings.forEach(s => {
      console.log(s);
      if (fieldTypeCheck.indexOf(s.type) === -1) fieldTypeCheck.push(s.type);
    });
    //console.log(fieldTypeCheck);

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
    setFieldInit(true);
  }, []);
  //console.log(timezones);

  const [fields, handleChange] = useFormFields(inputFields.current);

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

  return (
    <Box m={2}>
      <Text textStyle={"h3"} textAlign={"center"} mt={10}>
        {widgetSettings.title}
      </Text>
      <Divider />
      {fieldInit && (
        <Box mt={10} ml={5} mr={5}>
          {widgetSettings.settings.map((setting, i) => {
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
          })}
          <Box mt={10}>
            <Button
              width={"100%"}
              onClick={e => {
                console.log("UPDATE BUTTON ", fields);
                //console.log(fields);
                if (timezones.length > 0 && fields.hasOwnProperty("tz")) {
                  onUpdate({
                    tz: fields.tz,
                    offset: moment.tz(fields.tz).utcOffset(),
                  });
                } else {
                  onUpdate(fields);
                }
                //console.log("UPDATE CLICK ", e.target.className);
                //onUpdate(fields);
              }}
            >
              Update
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

SettingsDialog.propTypes = {
  widgetIndex: PropTypes.number.isRequired,
  widgetSettings: PropTypes.object.isRequired,
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
                //console.log("SEARCH ....", fields.search);
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

export const SearchResults = props => {
  const { searchBox, searchKey, roleKey, saveSearchResult } = props;
  //console.log(searchBox);
  //console.log(searchBox.current.getBoundingClientRect());
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
  /*
  setUrl(
    `${GOOGLE_URL}?cx=${SEARCH_ENGINE}&exactTerms=${
      roleKey.length > 0 ? encodeURIComponent(roleKey) : ""
    }&q=${encodeURIComponent(searchKey)}&lr=lang_en&key=${API_KEY}`,
  );
*/
  //let searchHistory = [];
  /*
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory === null) {
    searchHistory = [];
  } else {
    searchHistory.unshift({ search: searchKey });
  }
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
*/
  useEffect(() => {
    if (!isLoading)
      setUrl(
        `${GOOGLE_URL}?cx=${SEARCH_ENGINE}&exactTerms=${
          roleKey.length > 0 ? encodeURIComponent(roleKey) : ""
        }&q=${encodeURIComponent(searchKey)}&lr=lang_en&key=${API_KEY}`,
      );
    if (error) setContent(<h2>Error when fetching: {error}</h2>);
    if (!data && isLoading) setContent(<h2>LOADING...</h2>);
    if (!data && !isLoading) setContent(null);
    if (data) {
      //console.log(Object.keys(data));
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
  /*
  const getContent = newSearch => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!data && isLoading) return <h2>LOADING...</h2>;
    if (!data) return null;
    console.log(Object.keys(data));
    console.log(data);
    console.log("NEW SEARCH2 ", searchKey);
    console.log("NEW SEARCH3 ", newSearch);
    console.log("NEW SEARCH4 ", prevSearchKey);

    prevSearchKey.current = newSearch;
    return (
      <ol>
        {data.items.map((item, i) => {
          return (
            <li key={"search-result-" + i}>
              <div>
                <a href={item.link} target={"_blank"}>
                  {item.title}
                </a>
              </div>
              <div style={{ fontSize: "0.75rem" }}>{item.snippet}</div>
            </li>
          );
        })}
      </ol>
    );
  };
*/

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
  searchBox: PropTypes.object.isRequired,
  searchKey: PropTypes.string,
  roleKey: PropTypes.string,
  saveSearchResult: PropTypes.func.isRequired,
};

export const SearchHistory = props => {
  const { searchBox } = props;
  console.log("HISTORY ", searchBox);
  //console.log(searchBox.current.getBoundingClientRect());
  const boxRect = searchBox.current.getBoundingClientRect();
  const containerProps = {
    width: boxRect.width,
    left: boxRect.left,
    top: boxRect.top + boxRect.height + 5,
  };
  console.log(containerProps);
  let searchHistory = [];
  /*
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory === null) {
    searchHistory = [{ search: "Testing..." }];
  }
*/
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
  searchBox: PropTypes.object.isRequired,
};
