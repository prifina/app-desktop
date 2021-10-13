/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */

import React from "react";
// import { List, ListItem, ListDivider } from "@blend-ui/list";
import { Box, Flex, Text, Button, Image, Divider } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import { PrifinaLogo } from "../../components/PrifinaLogo";
import bxsCheckCircle from "@iconify/icons-bx/bxs-check-circle";

import appMenu from "@iconify/icons-fe/app-menu";
import bxsWidget from "@iconify/icons-bx/bxs-widget";
import bxMinusBack from "@iconify/icons-bx/bx-minus-back";

import styled, { createGlobalStyle } from "styled-components";

const SidebarContainer = styled(Flex)`
  width: 286px;
  height: 100%;
  padding-left: 64px;
  padding-right: 24px;
  padding-top: 130px;
  position: fixed;

  border-radius: 0 40px -40px 0;

  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  content: "";
`;

export const ListMenuItem = styled.li`
  /* */
  color: #969595;
  list-style: none;
  width: 100%;
  &:hover {
    background: #d7eeff;
    .icon {
      color: #9fcde3;
    }
    .text {
      color: #9fcde3;
    }
  }
  &:focus {
    background: #d7eeff;
  }

  font-size: 14px;
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
  width: 91px;
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
  opacity: 0.15;
  display: flex;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
`;

export const ListItemIconLink = ({ children, icon, onClick, ...props }) => (
  <Flex flexDirection="row" alignItems="center" height="50px">
    <BlendIcon size="18px" iconify={icon} className="icon" />
    <Text
      className="text"
      ml="16px"
      fontSize={"14px"}
      textStyle={"h7"}
      //   colorStyle={"textMuted"}
      {...props}
    >
      {children}
    </Text>
  </Flex>
);

export const AppMarketSidebar = ({
  theme,
  blockNav,
  activeMenuItem,
  menuItemClick,
  onClick1,
  onClick2,
  ...props
}) => {
  console.log("SIDEBAR ", props);

  return (
    <SidebarContainer bg="baseWhite">
      <ListMenu {...props}>
        <ListMenuItem
          // onClick={{e => menuItemClick(e, "/schema/" + schemaInfo.uuid, 0)}}
          onClick={onClick1}
        >
          <ListItemIconLink icon={appMenu}>Market</ListItemIconLink>
        </ListMenuItem>
        <ListMenuItem onClick={onClick2}>
          <ListItemIconLink icon={bxsWidget}>Widgets</ListItemIconLink>
        </ListMenuItem>
        <ListMenuItem onClick={onClick2}>
          <ListItemIconLink icon={bxMinusBack}>Apps</ListItemIconLink>
          <MenuBadge style={{ background: "yellow" }}>
            <Text fontSize="xs" color="black">
              Coming Soon
            </Text>
          </MenuBadge>
        </ListMenuItem>
      </ListMenu>
    </SidebarContainer>
  );
};

export const WidgetBase = styled.div`
  display: flex;
  position: relative;
  width: 326px;
  height: 262px;
  background: ${props => `url(${props.backgroundImage})`};
  box-shadow: 0px 4px 8px #ebf0f1; // color missing,... shadow missing from theme
  border-radius: 0.625rem; // missing from theme...
  margin-right: 24px;
  margin-bottom: 24px;
  .overContainer:hover {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 0.5s;
  }
  @keyframes fadeInOpacity {
    0% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const StyledText = styled(Text)`
  width: 190px;
  font-weight: ${props =>
    props.hasOwnProperty("fontWeight")
      ? Object.keys(props.theme.fontWeights).indexOf(props.fontWeight) > -1
        ? props.theme.fontWeights[props.fontWeight]
        : props.fontWeight
      : "null"};
`;

//not in blend theme
export const Badge = styled.span`
  min-width: 98px;
  height: 27px;
  border-radius: 20px;
  background: #d1eaf9;
  font-size: 12px;
  line-height: 27px;
  color: #066fe1;
  font-weight: 700;
  text-transform: capitalize;
  text-align: center;
`;

//not in blend theme
export const OrderedList = styled.ol`
  margin: 0;
  list-style-position: outside;
  padding-inline-start: 20px;
  margin-block-start: 0px;
  padding: 0;
  padding-left: 20px;
`;
export const ListItem = styled.li`
  /* */
  color: #969595;
`;

export const NavbarContainer = styled(Flex)`
  height: 65px;
  width: 100%;
  padding-left: 64px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const Card = ({ title, value }) => {
  return (
    <Flex width="100px" flexDirection="column">
      <Flex
        height="35px"
        borderRadius="8px"
        bg="#ECE8E8"
        alignItems="center"
        justifyContent="center"
        marginBottom="16px"
      >
        <Text fontSize="10px">{title}</Text>
      </Flex>
      <Flex justifyContent="center">
        <Text fontSize="12px">{value}</Text>
      </Flex>
    </Flex>
  );
};

export const InstalledText = styled(Text)`
  color: #47a7d6; // not on theme
  line-height: 23px;
`;
export const TitleText = styled(Text)`
  /* */
`;

export const GlobalStyle = createGlobalStyle`
.app-market path {
  fill: #47a7d6;
}
`;

//not on blend theme
export const TextButton = styled(Button)`
  background: transparent;
  color: black;
  border: 0;
  padding: 0;
  font-size: 14px;
  &:hover {
    border: 0 !important;
    background: white !important;
    color: grey !important;
  }
`;

//not on blend theme
export const OutlineButton = styled(Button)`
  background: white; // not on theme
  border: 1px solid #4295e1;
  color: #4295e1;
  line-height: 23px;
  &:hover {
    border: 1px solid #4295e1 !important;
    background: white !important;
    color: #4295e1 !important;
  }
`;

//not on blend theme
export const UnderlineButton = styled(Button)`
  background: white; // not on theme
  border-radius: 0;
  border: 0;
  border-bottom: 2px solid #4295e1;
  color: #4295e1;
  line-height: 23px;
  font-size: 14px;
  &:hover {
    border: 0 !important;
    border-bottom: 2px solid #4295e1 !important;
    background: white !important;
    color: #4295e1 !important;
  }
`;
