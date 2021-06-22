/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {
  forwardRef,
  useRef,
  createRef,
  useEffect,
  useState,
} from "react";
import PhoneNumberField from "../components/PhoneNumberField";
import {
  Text,
  SearchSelect,
  useTheme,
  Input,
  Box,
  Divider,
  Flex,
} from "@blend-ui/core";

import bxPhone from "@iconify/icons-bx/bx-phone";

import styled from "styled-components";
import { BlendIcon } from "@blend-ui/icons";
import { countryList } from "../lib/utils";

import useFlags from "../hooks/UseFlags";

//console.log("CC", countryList());
/*
const selectOptions = [
  {
    key: "0",
    value: "This is component",
    component: (
      <React.Fragment>
        <Text as="span">This is component</Text>
        <Text as="span">(+358)</Text>
      </React.Fragment>
    ),
  },
  { key: "1", value: "Premium Economy" },
  { key: "2", value: "Something" },
];
*/

const continents = {
  XX: { name: "", order: 0 }, //popular...
  AF: { name: "Africa", order: 5 },
  AN: { name: "Antarctica", order: 7 },
  AS: { name: "Asia", order: 3 },
  EU: { name: "Europe", order: 2 },
  NA: { name: "North America", order: 1 },
  OC: { name: "Oceania", order: 6 },
  SA: { name: "South America", order: 4 },
  ZZ: { name: "", order: 8 }, //unknowns...
};
const popularList = ["US", "GB", "FI"];

const selectOptions = countryList(continents, popularList).nList.map(cc => {
  return {
    key: "+" + cc.countryCode,
    value: cc.regionName,
    component: (
      <React.Fragment>
        <Text as="span">{cc.regionName}</Text>
        <Text as="span" color={"#C3C2C2"} fontSize={"xs"} pl={4}>
          +{cc.countryCode}
        </Text>
      </React.Fragment>
    ),
  };
});
export default { title: "Phone number Field" };

export const fieldinput = () => {
  const { cList, nList } = countryList(continents, popularList);

  /*
  let orderedList = new Array(Object.keys(continents).length + 1);
  orderedList[0] = { XX: [] };
  Object.keys(continents).forEach(k => {
    orderedList[continents[k].order] = { [k]: [] };
  });
   console.log("LIST ", orderedList);
*/

  /*
  orderedList.push({ XX: [] });
  orderedList.push({ NA: [] });
  orderedList.push({ EU: [] });
  orderedList.push({ AS: [] });
  orderedList.push({ SA: [] });
  orderedList.push({ AF: [] });
  orderedList.push({ OC: [] });
  orderedList.push({ AN: [] });

  cList.forEach(c => {
    if (popularList.indexOf(c.regionCode) > -1) {
      orderedList[0]["XX"].push(c);
    } else {
      orderedList[continents[c.continent].order][c.continent].push(c);
    }
  });
  */
  //console.log(orderedList);

  const { icons, isLoading } = useFlags(nList);
  //const [flags, setFlags] = useState([]);
  //const [countryOptions, setOptions] = useState([]);
  const countryOptions = useRef([]);
  const [flags, setFlags] = useState(false);

  useEffect(() => {
    if (!icons && isLoading) countryOptions.current = <h2>LOADING...</h2>;
    if (!icons && !isLoading) countryOptions.current = null;
    if (isLoading && icons) {
      console.log("ITEMS ", icons);
      let items = [];
      cList.forEach(item => {
        //console.log(item);
        const l = Object.keys(item)[0];
        if (item[l].length > 0) {
          //console.log(l, item[l].length);
          if (l !== "XX") {
            items.push({
              key: "XX",
              value: "XX",
              regionCode: "000",
              component: (
                <React.Fragment>
                  <Text mt={18}>{continents[l].name}</Text>
                  <Divider mb={10} />
                </React.Fragment>
              ),
            });
          }
          item[l].forEach(cc => {
            const flag = icons[cc.regionCode] || null;
            items.push({
              key: "+" + cc.countryCode,
              value: cc.regionName,
              regionCode: cc.regionCode,
              searchValue: cc.regionName + " +" + cc.countryCode,
              component: (
                <React.Fragment>
                  <Flex mb={6} alignContent={"center"}>
                    {flag}
                    <Text
                      ml={flag === null ? 22 : 6}
                      as="span"
                      fontSize={"xs"}
                      lineHeight={"16px"}
                    >
                      {cc.regionName}
                    </Text>
                    <Text
                      as="span"
                      color={"#C3C2C2"}
                      fontSize={"xs"}
                      pl={4}
                      lineHeight={"16px"}
                    >
                      +{cc.countryCode}
                    </Text>
                  </Flex>
                </React.Fragment>
              ),
            });
          });
        }
      });
      console.log(items);
      countryOptions.current = items;
      /*
      countryOptions.current = cList.map(cc => {
        const flag = icons[cc.regionCode] || null;
        //console.log("FLAG ", flag, cc.regionCode);
        return {
          key: "+" + cc.countryCode,
          value: cc.regionName,
          regionCode: cc.regionCode,
          searchValue: cc.regionName + " +" + cc.countryCode,
          component: (
            <React.Fragment>
              {flag}
              <Text ml={6} as="span">
                {cc.regionName}
              </Text>
              <Text as="span" color={"#C3C2C2"} fontSize={"xs"} pl={4}>
                +{cc.countryCode}
              </Text>
            </React.Fragment>
          ),
        };
      });
      */
      /*
      const items = Object.keys(icons).map((item, i) => {
        return icons[item];
      });
      */
      //console.log("SELECT ", selectOptions);
      //console.log("ITEMS ", items);
      //setOptions(selectOptions);
      //countryOptions.current = selectOptions;

      //console.log(countryOptions.current);
      setFlags(true);
      //setOptions([]);
    }
  }, [isLoading, icons]);

  return (
    <Box m={10}>
      <PhoneNumberField>
        <PhoneNumberField.RegionField
          defaultValue="000"
          options={flags ? countryOptions.current : []}
          searchLength={1}
          showList={true}
          maxHeight={"200px"}
        />
        <PhoneNumberField.InputField placeholder={"Enter value here"} />
      </PhoneNumberField>
    </Box>
  );
};

fieldinput.story = {
  name: "PhoneNumber",
};

export const fieldinput2 = () => (
  <>
    <div style={{ display: "flex" }}>
      <div style={{ display: "inline-block" }}>
        <LeftIcon iconify={bxPhone} color={"componentPrimary"} size={"17"} />
      </div>
      <div style={{ display: "inline-block" }}>
        <SelectField
          defaultValue={"000"}
          options={selectOptions}
          searchLength={2}
          showList={false}
          /* id="select-search" */
          onChange={(e, code) => {
            //console.log("REGION", e);
            //console.log("REGION", code);
            console.log("REGION SELECT ", e, code);
          }}
        />
      </div>
      <div style={{ display: "inline-block" }}>
        <InputField placeholder={"Enter value here"} />
      </div>
    </div>
  </>
);
fieldinput2.story = {
  name: "PhoneNumber 2",
};

const InputField = forwardRef(
  ({ children, errorMsg, promptMsg, ...props }, ref) => {
    //const { disabled, inputId } = useInputContext();
    const inputId = "input-id";
    const theme = useTheme();
    //console.log("INPUT ", defaultValue);
    /*
    if (defaultValue === "000" && renderStatus) {
      setSelectFocus();
    }
    */
    return (
      <Input
        id={inputId}
        name={inputId}
        ref={ref}
        isIcon={true}
        borders={0}
        {...props}
        paddingLeft={theme.sizeOptions[10]}
        paddingRight={theme.sizeOptions[10]}
      />
    );
  },
);
const SelectField = forwardRef(
  (
    {
      options,
      defaultValue,
      searchLength = 3,
      showList = false,
      selectOption = "key",
      ...props
    },
    ref,
  ) => {
    //const { selectId, boxRef } = useInputContext();
    const selectId = "test-id";
    const boxRef = createRef();

    //const theme = useTheme();
    //console.log("DEFAULT ", defaultValue);

    return (
      <SearchSelect
        id={selectId}
        name={selectId}
        defaultValue={defaultValue}
        options={options}
        showList={showList}
        searchLength={searchLength}
        size={"sm"}
        width={"60px"}
        selectOption={selectOption}
        containerRef={boxRef}
        containerOffset={"-38px"}
        ref={ref}
        {...props}
      />
    );
  },
);
const LeftIcon = styled(props => {
  //const { color, ...rest } = props;
  //color={disabled ? theme.colors.baseMuted : color}
  const theme = useTheme();
  return (
    <BlendIcon
      {...props}
      fill={"transparent"}
      color={"red"}
      theme={theme}
      style={{
        marginLeft: theme.sizeOptions[10],
        marginRight: theme.sizeOptions[10],
      }}
    />
  );
})`
  flex: none;
  align-self: center;
  pointer-events: none;
  position: relative;
`;
