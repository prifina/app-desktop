import React, { forwardRef } from "react";

import styled, { css } from "styled-components";
import {
  space,
  layout,
  typography,
  border,
  color,
  compose,
} from "styled-system";
//import PropTypes from "prop-types";

const systemProps = compose(layout, color, space, border, typography);

const inputTheme = css`
  appearance: none;
  display: block;
  font-family: inherit;
  font-size: ${props => props.theme.componentStyles[props.as].base.fontSize};
  line-height: ${props =>
    props.theme.componentStyles[props.as].base.lineHeight};
  color: inherit;
  background-color: transparent;
  border: ${props =>
    typeof props.borders !== "undefined"
      ? props.borders
      : props.theme.componentStyles[props.as].base.border};
  border-radius: ${props =>
    typeof props.borderRadius !== "undefined"
      ? props.borderRadius
      : props.theme.componentStyles[props.as].base.borderRadius};
  margin: 0;
  padding-left: ${props =>
    props.theme.componentStyles[props.as].base.paddingLeft};
  padding-right: ${props =>
    props.theme.componentStyles[props.as].base.paddingRight};
  padding-top: ${props =>
    props.theme.componentStyles[props.as].base.paddingTop};
  padding-bottom: ${props =>
    props.theme.componentStyles[props.as].base.paddingBottom};
  ::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }
  &:disabled {
    opacity: 0.25;
  }
  &:focus {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  ::-ms-clear {
    display: none;
  }
  ${systemProps}
`;
const themeColorStyles = props => {
  // console.log("custom ", props);
  return props.colorStyle ? props.theme.colorStyles[props.colorStyle] : null;
};
const InputElement = styled.input`
  ${inputTheme}
  ${themeColorStyles}
`;

const Input = forwardRef((props, ref) => {
  // console.log("INPUT  ", props, ref);
  return <InputElement {...props} ref={ref} />;
});
Input.defaultProps = {
  as: "input",
  type: "text",
  width: "100%",
};

Input.displayName = "Input";
Input.isField = true;
/*
Input.propTypes = {
  type: PropTypes.string.isRequired,
};
*/
export default Input;
