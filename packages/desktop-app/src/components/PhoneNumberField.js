/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
import React, { createRef, forwardRef, createContext, useContext } from "react";
import { Input, Text, Box, useTheme, SearchSelect } from "@blend-ui/core";

import bxPhone from "@iconify/icons-bx/bx-phone";

import { BlendIcon } from "@blend-ui/icons";

import styled from "styled-components";
import { space } from "styled-system";
import { useId } from "@reach/auto-id";

import PropTypes from "prop-types";
//import { useFocus } from "../lib/componentUtils";

const StyledBox = styled("div")`
  ${space}
  /* remove flex and safari works....  */ 
  display: flex;
  opacity:0.999;
  
  height: ${props =>
    props.height
      ? props.height
      : props.theme.componentStyles.input.base.height};

  background-color: #F5F8F7;

/*
      background-color: ${props =>
        props.disabled
          ? props.theme.colors.text.muted
          : props.theme.componentStyles.input.base.backgroundColor ||
            "transparent"};
            */
  border: ${props =>
    typeof props.borders !== "undefined"
      ? props.borders
      : props.errorinput
      ? props.theme.borders.input.error
      : props.theme.componentStyles.input.base.border};
  border-radius: ${props =>
    typeof props.borderRadius !== "undefined"
      ? props.borderRadius
      : props.theme.componentStyles.input.base.borderRadius};

  &:focus,
  &:not([disabled]):hover {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: ${props => props.theme.borders.input.active};
  }
  
  /*
  &:disabled {
    background: ${props => props.theme.colors.text.muted};
    border: ${props => props.theme.borders.input.disabled};
     pointer-events: none; 
  }
  
  &:invalid {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: props.theme.borders.input.error};
  }
  */
`;

const InputContext = createContext();
const useInputContext = () => useContext(InputContext);

const PhoneNumberField = ({ children, disabled, id, ...props }) => {
  //console.log("ICON FIELD ", props);
  const isIcon = item => item.type.isIcon || item.type.isIconButton;
  const { colors } = useTheme();

  const uuid = useId();
  const _id = id || uuid;
  //console.log("ID ", uuid, _id);
  const formatIds = id => ({
    select: `search-${id}-select`,
    input: `search-${id}-input`,
  });
  const selectId = formatIds(_id)["select"];
  const inputId = formatIds(_id)["input"];
  //console.log("ID ", _id, inputId);
  let inputError = false;
  let errorMsg = "";
  let promptMsg = "";
  React.Children.toArray(children).forEach((child, i) => {
    if (!isIcon(child) && !inputError) {
      inputError = child.props.error || false;
    }
    if (!isIcon(child) && child.props.errorMsg) {
      errorMsg = child.props.errorMsg;
    }
    if (!isIcon(child) && child.props.promptMsg) {
      promptMsg = child.props.promptMsg;
    }
  });

  //width={"50px"}
  //containerRef={boxRef}
  const boxRef = createRef();
  //const searchRef = createRef();

  return (
    <InputContext.Provider
      value={{
        disabled,
        inputError,
        inputId,
        selectId,
        boxRef,
      }}
    >
      <StyledBox
        disabled={disabled || null}
        errorinput={inputError ? 1 : undefined}
        ref={boxRef}
      >
        <LeftIcon iconify={bxPhone} color={"componentPrimary"} size={"17"} />

        {children}
      </StyledBox>
      {errorMsg !== "" && inputError && (
        <Box mt={0} mb={10}>
          <Text textStyle={"caption2"} color={colors.baseError}>
            {errorMsg}
          </Text>
        </Box>
      )}
      {promptMsg !== "" && !inputError && (
        <Box mt={0} mb={10}>
          <Text textStyle={"caption2"} color={colors.baseSecondary}>
            {promptMsg}
          </Text>
        </Box>
      )}
    </InputContext.Provider>
  );
};

PhoneNumberField.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.array,
};
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
    const { selectId, boxRef } = useInputContext();

    // const theme = useTheme();
    // console.log("THEME ", theme);
    //const theme = useTheme();
    //console.log("DEFAULT ", defaultValue);

    return (
      <div
        style={{
          display: "inline-block",
          paddingTop: "3px",
        }}
      >
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
      </div>
    );
  },
);

SelectField.propTypes = {
  options: PropTypes.array,
  defaultValue: PropTypes.string,
  searchLength: PropTypes.number,
  showList: PropTypes.bool,
  selectOption: PropTypes.string,
};
const InputField = forwardRef(
  ({ children, errorMsg, promptMsg, ...props }, ref) => {
    const { disabled, inputId } = useInputContext();
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
        disabled={disabled || null}
        {...props}
        paddingLeft={theme.sizeOptions[10]}
        paddingRight={theme.sizeOptions[10]}
      />
    );
  },
);

InputField.propTypes = {
  errorMsg: PropTypes.string,
  promptMsg: PropTypes.string,
  children: PropTypes.array,
};
const LeftIcon = styled(props => {
  const { disabled, inputError } = useInputContext();
  const theme = useTheme();
  //const { color, ...rest } = props;
  //color={disabled ? theme.colors.baseMuted : color}

  return (
    <BlendIcon
      {...props}
      fill={disabled ? theme.colors.baseMuted : "transparent"}
      color={
        inputError
          ? theme.colors.baseError
          : props.color || theme.colors.baseSecondary
      }
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

InputField.displayName = "PhoneNumberInputField";
PhoneNumberField.InputField = InputField;
SelectField.displayName = "PhoneNumberRegionField";

PhoneNumberField.RegionField = SelectField;

export default PhoneNumberField;
