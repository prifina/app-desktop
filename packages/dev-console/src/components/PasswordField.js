import React, { useState, forwardRef } from "react";
import { Text, Box, useTheme } from "@blend-ui/core";
import { IconField } from "@blend-ui/icon-field";

import { default as eyeIcon } from "@iconify/icons-bx/bx-show";
import bxLockAlt from "@iconify/icons-bx/bx-lock-alt";
import bxHide from "@iconify/icons-bx/bx-hide";

import { usePopper } from "react-popper";
import styled from "styled-components";

import PropTypes from "prop-types";
import config from "../config";

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

const PopperContainer = styled.div`
  padding: 15px;
  padding-bottom:24px;
  box-shadow: ${props =>
    props.theme.boxShadows[5]}; //0px 4px 8px rgba(91, 92, 91, 0.2); from theme
  border-radius: 5px; // from theme
  background-color: ${props =>
    props.theme.colors.baseTertiary}; // #f5f8f7;  from theme

  width: 371px;
  .arrow {
    position: absolute;
    width: 20px;
    height: 20px;

    &:after {
      content: " ";
      position: absolute;
      top: -20px; // we account for the PopperContainer padding
      left: 0;
      transform: rotate(45deg);
      width: 20px;
      height: 20px;
      background-color: ${props =>
        props.theme.colors.baseTertiary}; // from theme
      box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
    }
  }
  &[data-popper-placement^="top"] > .arrow {
    bottom: -30px;
    :after {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
`;

const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

const PasswordField = forwardRef(
  ({ placeholder, addPopper = false, verifications = [], ...props }, ref) => {
    const theme = useTheme();

    const [referenceElement, setReferenceElement] = useState(ref);
    const [popperElement, setPopperElement] = useState(null);

    const [hidePassword, setHidePassword] = useState(true);
    const [arrowElement, setArrowElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      placement: "top",
      modifiers: [
        { name: "arrow", options: { element: arrowElement } },
        {
          name: "offset",
          options: {
            offset: [0, 20],
          },
        },
      ],
    });

    const onHide = e => {
      e.preventDefault();
      setHidePassword(!hidePassword);
    };
    let popperStyles = { ...styles.popper };

    return (
      <React.Fragment>
        {addPopper && (
          <PopperContainer
            id="passwordPopperContainer"
            theme={theme}
            ref={setPopperElement}
            style={popperStyles}
            {...attributes.popper}
          >
            <div ref={setArrowElement} style={styles.arrow} className="arrow" />
            <Text fontSize={"xs"} bold>
              Create a password that:
              <UnorderedList>
                <ListItem verified={verifications[0]} theme={theme}>
                  <Text as={"span"} fontSize={"xxs"}>
                    Contains at least {config.passwordLength} characters
                  </Text>
                </ListItem>
                <ListItem verified={verifications[1]} theme={theme}>
                  <Text as={"span"} fontSize={"xxs"}>
                    Contains both lower (a-z) and upper case letters (A-Z)
                  </Text>
                </ListItem>

                <ListItem verified={verifications[2]} theme={theme}>
                  <Text as={"span"} fontSize={"xxs"}>
                    Contains at least one number (0-9) and a symbol
                  </Text>
                </ListItem>
                <ListItem verified={verifications[3]} theme={theme}>
                  <Text as={"span"} fontSize={"xxs"}>
                    Does not contain your name or email address
                  </Text>
                </ListItem>
                <ListItem verified={verifications[4]} theme={theme}>
                  <Text as={"span"} fontSize={"xxs"}>
                    Is not commonly used
                  </Text>
                </ListItem>
              </UnorderedList>
            </Text>
          </PopperContainer>
        )}

        <IconField onClick={onHide}>
          <IconField.LeftIcon
            iconify={bxLockAlt}
            color={"componentPrimary"}
            size={"17"}
          />
          <IconField.InputField
            type={hidePassword ? "password" : "text"}
            placeholder={placeholder}
            {...props}
            ref={mergeRefs(setReferenceElement, ref)}
          />
          <Box
            display={"inline-flex"}
            onClick={onHide}
            className={"PasswordRightIcon"}
          >
            {hidePassword && (
              <IconField.RightIcon
                iconify={bxHide}
                color={"componentPrimary"}
                size={"17"}
                className={hidePassword ? "EyeIcon" : "HideIcon"}
              />
            )}
            {!hidePassword && (
              <IconField.RightIcon
                iconify={eyeIcon}
                color={"componentPrimary"}
                size={"17"}
                className={hidePassword ? "EyeIcon" : "HideIcon"}
              />
            )}
          </Box>
        </IconField>
      </React.Fragment>
    );
  },
);

PasswordField.displayName = "PasswordField";

PasswordField.propTypes = {
  placeholder: PropTypes.string,
  addPopper: PropTypes.bool,
  verifications: PropTypes.instanceOf(Array),
};

export default PasswordField;
