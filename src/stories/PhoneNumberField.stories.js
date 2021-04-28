/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { forwardRef, useRef, createRef } from "react";
import PhoneNumberField from "../components/PhoneNumberField";
import { Text, SearchSelect, useTheme, Input } from "@blend-ui/core";

import bxPhone from "@iconify/icons-bx/bx-phone";

import styled from "styled-components";
import { BlendIcon } from "@blend-ui/icons";
import { countryList } from "../lib/utils";

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
const selectOptions = countryList().map(cc => {
  return {
    key: "+" + cc.countryCode,
    value: cc.regionName,
    component: (
      <React.Fragment>
        <Text as="span">{cc.regionName}</Text>
        <Text as="span" color={"#C3C2C2"} fontSize={"xs"} pl={4}>
          (+{cc.countryCode})
        </Text>
      </React.Fragment>
    ),
  };
});
export default { title: "Phone number Field" };

export const fieldinput = () => (
  <PhoneNumberField>
    <PhoneNumberField.RegionField
      defaultValue="000"
      options={selectOptions}
      searchLength={1}
      showList={true}
    />
    <PhoneNumberField.InputField placeholder={"Enter value here"} />
  </PhoneNumberField>
);
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
