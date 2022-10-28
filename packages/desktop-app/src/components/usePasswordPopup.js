import React, { useState, useRef, forwardRef } from "react";
import {
  useFloating,
  shift,
  offset,
  flip,
  arrow
} from "@floating-ui/react-dom";

import styled from "styled-components";
import { Text, Box, useTheme } from "@blend-ui/core";


import config from "../config";
import PropTypes from "prop-types";


const UnorderedList = styled.ul`
  /* */
  list-style-type: none;
  margin: 0;
  list-style-position: outside;
  padding-inline-start: 20px;
  margin-block-start: 0px;
  padding: 0;
  padding-left: 20px;
`;

const ListItem = styled.li`
  /* */
  ::before {
    content: "•";
    color: ${props =>
    props.verified
      ? props.theme.colors.baseSecondary
      : props.theme.colors.baseMuted}; // from theme
    display: inline-block;
    width: 0.9em;
    margin-left: -0.9em;
    font-size: 2em;
  }
  span {
    position: relative;
    top: -5px;
  }
`;


const PopupContainer = styled.div`
  
  padding: 15px;
  padding-bottom:24px;

  box-shadow: ${props =>
    props.theme.boxShadows[5]}; //0px 4px 8px rgba(91, 92, 91, 0.2); from theme
  border-radius: 5px; // from theme
  background-color: ${props =>
    props.theme.colors.baseWhite}; // #f5f8f7;  from theme
  width: 371px;
  
    position: absolute;
    pointer-events: none;
  }

`;


const Popup = ({ floating, strategy, x, y, arrowRef, arrowX, className, verifications, ...props }) => {

  //const verifications = Array(5).fill(false);

  return <div className={className}>
    <PopupContainer

      ref={floating}
      style={{
        position: strategy,
        top: y ?? "",
        left: x ?? ""
      }}
    >
      <Text fontSize={"xs"} bold>
        {i18n.__("passwordRequirementsText")}
        <UnorderedList>
          <ListItem data-testid="condition-1" verified={verifications[0]} >
            <Text as={"span"} fontSize={"xxs"}>
              Contains at least {config.passwordLength} characters
            </Text>
          </ListItem>
          <ListItem data-testid="condition-2" verified={verifications[1]} >
            <Text as={"span"} fontSize={"xxs"}>
              {i18n.__("passwordRequirement1")}
            </Text>
          </ListItem>

          <ListItem data-testid="condition-3" verified={verifications[2]} >
            <Text as={"span"} fontSize={"xxs"}>
              {i18n.__("passwordRequirement2")}
            </Text>
          </ListItem>
          <ListItem data-testid="condition-4" verified={verifications[3]} >
            <Text as={"span"} fontSize={"xxs"}>
              {i18n.__("passwordRequirement3")}
            </Text>
          </ListItem>
          {/* 
          <ListItem verified={verifications[4]}>
            <Text as={"span"} fontSize={"xxs"}>
              Is not commonly used
            </Text>
          </ListItem>
          */}
        </UnorderedList>
      </Text>
      <div id="password-arrow" ref={arrowRef} style={{ left: arrowX != null ? `${arrowX}px` : "", }} />
    </PopupContainer>
  </div>
}

Popup.propTypes = {
  floating: PropTypes.func,
  strategy: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  arrowRef: PropTypes.object,
  arrowX: PropTypes.number,
  className: PropTypes.string,
  verifications: PropTypes.array
}

const Tooltip = styled(Popup)`

#password-tooltip {
  position: absolute;
  background: #222;
  color: white;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  font-size: 90%;
  pointer-events: none;
}

#password-arrow {
  position: absolute;
  width: 20px;
  height: 20px;

  &:after {
    content: " ";
    position: absolute;
    top: 15px; // we account for the PopperContainer padding
    left: 0;
    transform: rotate(225deg);
    width: 20px;
    height: 20px;
    background-color: ${props => props.theme.colors.baseWhite}; // from theme
    box-shadow: -1px -1px 1px  rgba(0, 0, 0, 0.1);
  }

}
`;

const usePasswordPopup = (props) => {

  //console.log("PROPS ", props);
  const arrowRef = useRef(null);
  const {
    x,
    y,
    reference,
    floating,
    strategy,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} }
  } = useFloating({
    placement: "top",
    middleware: [
      shift(),
      flip(),

      offset(15),
      arrow({
        element: arrowRef,

      })
    ]
  });

  /*
    offset(({ reference, placement }) => ({
      mainAxis: TIP_WIDTH,
      crossAxis:
        reference.width / 2 < TIP_SIZE
          ? placement.endsWith("start")
            ? -TIP_WIDTH
            : TIP_WIDTH
          : 0
    })),
  */
  /*
  const Popup = <div
    id="tooltip"
    ref={floating}
    style={{
      position: strategy,
      top: y ?? "",
      left: x ?? ""
    }}
  >
    Tooltip
    <div id="arrow" ref={arrowRef} />
  </div>
*/
  const TooltipComponent = <Tooltip {...props} floating={floating} strategy={strategy} x={x} y={y} arrowRef={arrowRef} arrowX={arrowX} {...props} />

  //console.log("TEST ", arrowX)
  return { reference, TooltipComponent }
};

export default usePasswordPopup;
