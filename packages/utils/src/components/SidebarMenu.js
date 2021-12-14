/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */

import React from "react";
// import { List, ListItem, ListDivider } from "@blend-ui/list";
import { Flex, Text } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import PropTypes from "prop-types";

import styled from "styled-components";
import { backgroundColor } from "styled-system";

const SidebarContainer = styled(Flex)`
  width: 286px;
  height: 100%;
  z-index: 1;
  padding-left: 64px;
  padding-right: 24px;
  padding-top: 130px;
  position: fixed;
  border-radius: 0 40px -40px 0;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  ::before,
  ::after {
    position: absolute;
    top: 65px;

    width: 30px;
    height: 30px;
    content: " ";
  }
  ::before {
    left: -52px;
    border-bottom-right-radius: 15px;
    border-width: 0 1px 1px 0;
  }
  ::after {
    right: -30px;
    border-bottom-left-radius: 11px;
    border-width: 0 1px 1px;
  }
  ::after,
  ::before {
    border: 1px solid !transparent;
    transform: rotate(-270deg);
  }

  ::after {
    box-shadow: -6px 5px 0 #f6f7f9;
  }
`;

export const ListMenuItem = styled.li`
  /* */

  list-style: none;
  width: 100%;
  &:hover {
    background: ${props => props.pointerBackground || "#d7eeff"};
    .icon {
      color: ${props => props.pointerIconColor || "#9fcde3"};
    }
    .text {
      color: ${props => props.pointerTextColor || "#9fcde3"};
    }
  }
  .focus {
    background: ${props => props.pointerBackground || "#d7eeff"} !important;
    .icon {
      color: ${props => props.pointerIconColor || "#9fcde3"};
    }
    .text {
      color: ${props => props.pointerTextColor || "#9fcde3"};
    }
  }
  .active {
    background: ${props => props.pointerBackground || "#d7eeff"} !important;
    .icon {
      color: ${props => props.pointerIconColor || "#9fcde3"};
    }
    .text {
      color: ${props => props.pointerTextColor || "#9fcde3"};
    }
  }
  background-color: ${props => props.backgroundColor};

  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  padding-left: 16px;
`;

export const ListMenu = styled.ul`
  margin: 0;
  width: 100%;
  list-style-position: outside;
  align-items: center;
  margin-block-start: 0px;
  padding: 0;
`;

export const MarketBadge = styled.span`
  height: 27px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 16px;
  padding-left: 16px;
`;

const MenuBadge = styled.span`
  width: 91px;
  height: 34px;
  opacity: 0.35;
  display: flex;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
`;

export const ListItemIconLink = ({
  children,
  icon,
  onClick,
  label,
  color,
  ...props
}) => (
  <Flex flexDirection="row" alignItems="center" height="50px">
    <BlendIcon size="18px" iconify={icon} className="icon" />
    <Text
      className="text"
      color={color}
      ml="16px"
      fontSize="14px"
      textStyle="h7"
      {...props}
    >
      {label}
    </Text>
    <Flex ml="16px">{children}</Flex>
  </Flex>
);

const SidebarMenu = ({
  //theme,
  items,
  pointerBackground,
  pointerIconColor,
  pointerTextColor,
  backgroundColor,
  ...props
}) => {
  console.log("SIDEBAR ", props);
  return (
    <SidebarContainer bg="baseWhite">
      <ListMenu {...props}>
        {items.map(
          ({
            id,
            label,
            onClick,
            icon,
            badge,
            badgeColor,
            disabled,
            ...rest
          }) => (
            <ListMenuItem
              key={label}
              onClick={onClick}
              backgroundColor={backgroundColor}
              style={disabled ? { pointerEvents: "none" } : null}
              pointerBackground={pointerBackground}
              pointerIconColor={pointerIconColor}
              pointerTextColor={pointerTextColor}
              {...rest}
            >
              <ListItemIconLink icon={icon} label={label}>
                {badge ? (
                  <MenuBadge style={{ background: badgeColor }}>
                    <Text fontSize="xs">{badge}</Text>
                  </MenuBadge>
                ) : null}
              </ListItemIconLink>
            </ListMenuItem>
          ),
        )}
      </ListMenu>
    </SidebarContainer>
  );
};

SidebarMenu.propTypes = {
  items: PropTypes.array,
  pointerBackground: PropTypes.string,
  pointerIconColor: PropTypes.string,
  pointerTextColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default SidebarMenu;
