/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */

import React, { useRef, forwardRef, useEffect, useState } from "react";
import styled from "styled-components";

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

i18n.init();

export const WidgetWrapper = styled.div`
  margin: 10px;
  border: 2px outset;
  border-radius: 8px;
  min-height: 200px;
  min-width: 200px;
`;
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
  z-index: 5;
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
  border: 2px outset;
  border-radius: 8px;
  z-index: 10;
`;

export const WidgetList = React.memo(({ widgetList, widgetData }) => {
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

WidgetList.propTypes = {
  widgetList: PropTypes.array.isRequired,
  widgetData: PropTypes.array.isRequired,
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
  widgetSetting,
  onUpdate,
  ...props
}) => {
  //const currentSettings = widgetSettings[widget];
  console.log("SETTINGS ", widgetIndex, widgetSetting);
  let inputFields = useRef({});
  let timezones = useRef([]);
  const inputRef = useRef();
  const [fieldInit, setFieldInit] = useState(false);
  useEffect(() => {
    Object.keys(widgetSetting.currentSetting).forEach(f => {
      inputFields.current[f] = widgetSetting.currentSetting[f];
    });
    console.log("FLDS ", inputFields);
    console.log("DIALOG ", props);
    let fieldTypeCheck = [];
    widgetSetting.settings.forEach(s => {
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
        {widgetSetting.title}
      </Text>
      <Divider />
      {fieldInit && (
        <Box mt={10} ml={5} mr={5}>
          {widgetSetting.settings.map((setting, i) => {
            return (
              <React.Fragment key={"settings-" + i}>
                {setting.type === "text" && (
                  <Input
                    mt={15}
                    key={"widget-setting-" + i}
                    placeholder={setting.label}
                    mb={2}
                    id={setting.value}
                    name={setting.value}
                    defaultValue={fields[setting.value]}
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
                      id={setting.value}
                      name={setting.value}
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
  widgetSetting: PropTypes.object.isRequired,
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
