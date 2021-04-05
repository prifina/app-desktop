/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */

import React, { useRef, forwardRef } from "react";
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
import { useFormFields } from "../../lib/formFields";
import bxSearchAlt2 from "@iconify/icons-bx/bx-search-alt-2";
import bxChevronUp from "@iconify/icons-bx/bx-chevron-up";
import bxChevronDown from "@iconify/icons-bx/bx-chevron-down";

import useFetch from "../../lib/hooks/useFetch";
import { API_KEY, GOOGLE_URL, SEARCH_ENGINE } from "../../config";

import i18n from "../../lib/i18n";

import PropTypes from "prop-types";

i18n.init();

export const WidgetWrapper = styled.div`
  margin: 10px;
  border: 2px outset;
  border-radius: 8px;
  height: 200px;
  width: 200px;
`;
export const IconDiv = styled.div`
  height: 24px;
  position: relative;
  left: 220px;
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

export const SettingsDialog = ({ widgetSetting, onUpdate, ...props }) => {
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

SettingsDialog.propTypes = {
  widgetSetting: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export const SearchBox = forwardRef(
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
SearchBox.propTypes = {
  showHistory: PropTypes.func.isRequired,
  chevronOpen: PropTypes.bool.isRequired,
  searchKey: PropTypes.func.isRequired,
  searchOpen: PropTypes.bool,
};

export const SearchResults = props => {
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
SearchResults.propTypes = {
  searchBox: PropTypes.object.isRequired,
  searchKey: PropTypes.string,
  roleKey: PropTypes.string,
};

export const SearchHistory = props => {
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

SearchHistory.propTypes = {
  searchBox: PropTypes.object.isRequired,
};
