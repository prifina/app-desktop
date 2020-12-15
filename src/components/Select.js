import React, { forwardRef } from "react";
import styled from "styled-components";
import { space, typography } from "styled-system";
import { default as styledProps } from "@styled-system/prop-types";
import { menuDownIcon as ChevronDown, BlendIcon } from "@blend-ui/icons";
import i18n from "../lib/i18n";
i18n.init();

//import PropTypes from "prop-types";

const selectVariation = props => {
  //console.log("VARIATION ", props);
  let selectProps = props.theme.componentStyles.select;

  return selectProps;
};

const SelectElement = styled.select`
  appearance: none;
  display: block;
  width: 100%;
  font-family: inherit;
  margin:0;
  ${selectVariation}
  ${space} ${typography}
  ::-ms-expand {
    display: none;
  }
  &:disabled {
    opacity: 0.25;
  }
`;


const ClickableIcon = styled(BlendIcon).attrs(props => ({
  color: props.theme.colors.black,
}))`
  pointer-events: none;
  margin-left: -32px;
`;

const Select = forwardRef((props, ref) => {
  // console.log("child",props)
  return (
    <React.Fragment>
      <SelectElement {...props} ref={ref} className={props.className} >
          <option value="1"> {i18n.__("listFirstName")}  </option>
        {/*props.child.length > 0 && props.child.map(row=>)
          <option value={row.value}> {i18n.__(row.label)}  </option>
        */}
      </SelectElement>
      
    </React.Fragment>
  );
});

Select.propTypes = {
  ...styledProps.space,
  ...styledProps.typography,
};
Select.displayName = "Select";
Select.isField = true;

export default Select;
