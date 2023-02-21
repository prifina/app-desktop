
import React from "react";

import { Box, Flex, Text, useTheme, Divider } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import lock from "@iconify/icons-fe/lock";
import styled from "styled-components";

import { useTranslate } from "@prifina-apps/utils";
import PropTypes from "prop-types";

const SidebarContainer = styled(Flex)`
  width: 270px;
  /* height: 100%; */
  z-index: 1;
  padding-left: 44px;
  padding-right: 24px;
  /* padding-top: 80px; */
  position: fixed;
  /* border-radius: 0 40px -40px 0; */
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  border-right: 1px solid #343233;

  /*
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
    box-shadow: -6px 5px 0 ${props => props.theme.colors.basePrimary};
  }
  */
`;
const ListItemIconLink = ({
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
      color="##8C80A0"
      ml="16px"
      fontSize="14px"
      textStyle="h7"
      {...props}
    >
      {label}
    </Text>
    <Flex ml="10px">{children}</Flex>
  </Flex>
);

ListItemIconLink.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.instanceOf(Object),
  onClick: PropTypes.func,
  label: PropTypes.string,
  color: PropTypes.string,
};

const ListMenuItem = styled.li`
  /* */
  list-style: none;
  width: 100%;
  color: ${props => props.theme.colors.textPrimary};
  &:hover {
    background: ${props => props.theme.colors.baseMuted};
    .icon {
      color: ${props => props.theme.colors.brandAccent};
    }
    .text {
      color: white;
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
  cursor: pointer;
`;

const ListMenu = styled.ul`
  margin: 0;
  width: 209px;
  list-style-position: outside;
  align-items: center;
  margin-block-start: 0px;
  padding: 0;
`;

const MenuBadge = styled.span`
  height: 26px;
  display: flex;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  padding-right: 16px;
  padding-left: 16px;
  border: 1px solid #f6ad55;
`;
const PublisherCard = styled(Flex)`
  width: 198px;
  height: 123px;
  border-radius: 5px;
  border-left: 4px solid ${props => props.theme.colors.brandAccent};
  justify-content: center;
  padding-left: 16px;
  flex-direction: column;
  position: relative;
`;

const AppStudioSidebar = ({
  // theme,

  items,
  pointerBackground,
  pointerIconColor,
  pointerTextColor,
  backgroundColor,
  ...props
}) => {
  console.log("SIDEBAR ", props);

  const { colors } = useTheme();
  const { __ } = useTranslate();

  return (
    <SidebarContainer bg="basePrimary">
      <Divider mb={41} color="#343233" />

      <Text fontSize="xs" ml="16px" mb="16px">
        Developer Account
      </Text>
      <ListMenu {...props}>
        {items.map(
          ({ id, label, onClick, icon, badgeText, disabled, ...rest }) => (
            <ListMenuItem
              key={label}
              onClick={onClick}
              backgroundColor={backgroundColor}
              style={
                disabled
                  ? {
                    pointerEvents: "none",
                    opacity: 0.5,
                  }
                  : null
              }
              pointerBackground={pointerBackground}
              pointerIconColor={pointerIconColor}
              pointerTextColor={pointerTextColor}
              {...rest}
            >
              <ListItemIconLink icon={icon} label={label}>
                {badgeText ? (
                  <MenuBadge ml={0}>
                    <Text fontSize="xs" style={{ color: "#f6ad55" }}>
                      {badgeText}
                    </Text>
                  </MenuBadge>
                ) : null}
              </ListItemIconLink>
            </ListMenuItem>
          ),
        )}
      </ListMenu>
      <Divider mt={106} color="#343233" />

      <Text fontSize="xs" ml="16px" mt="41px" mb="16px">
        {__("createPubAccCTATitle")}
      </Text>
      <PublisherCard bg="baseMuted">
        <Flex position="absolute" right="6px" top="6px" color="brandAccent">
          <BlendIcon size="18px" iconify={lock} />
        </Flex>
        <Text fontSize="sm" fontWeight="semiBold">
          Publisher Accounts
        </Text>
        <Text fontSize="xs">{__("createPubAccCTAText")}</Text>
      </PublisherCard>
    </SidebarContainer>
  );
};

AppStudioSidebar.propTypes = {
  items: PropTypes.array,
  pointerBackground: PropTypes.string,
  pointerIconColor: PropTypes.string,
  pointerTextColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default AppStudioSidebar;