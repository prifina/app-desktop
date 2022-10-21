import React from "react";

import {
  Box,
  Flex,
  Text,
  Image,
  Input,
  Button,
  Divider,
  useTheme,
} from "@blend-ui/core";

import PropTypes from "prop-types";

import { BlendIcon } from "@blend-ui/icons";

import lock from "@iconify/icons-fe/lock";

import styled from "styled-components";

import { i18n } from "@prifina-apps/utils";

import UploadAsset from "./UploadAsset";
import placeholderImage from "../assets/placeholder-image.svg";

const SidebarContainer = styled(Flex)`
  width: 270px;
  height: 100%;
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

export const ListMenuItem = styled.li`
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

export const ListMenu = styled.ul`
  margin: 0;
  width: 209px;
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
  height: 26px;
  display: flex;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  padding-right: 16px;
  padding-left: 16px;
  border: 1px solid #f6ad55;
`;
export const PublisherCard = styled(Flex)`
  width: 198px;
  height: 123px;
  border-radius: 5px;
  border-left: 4px solid ${props => props.theme.colors.brandAccent};
  justify-content: center;
  padding-left: 16px;
  flex-direction: column;
  position: relative;
`;

export const StyledInput = styled(Input)`
  border: 1px solid #4b4b4b;
  width: ${props => props.width || "361px"};
  height: 35px;
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

export const DevConsoleSidebar = ({
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
        {i18n.__("createPubAccCTATitle")}
      </Text>
      <PublisherCard bg="baseMuted">
        <Flex position="absolute" right="6px" top="6px" color="brandAccent">
          <BlendIcon size="18px" iconify={lock} />
        </Flex>
        <Text fontSize="sm" fontWeight="semiBold">
          Publisher Accounts
        </Text>
        <Text fontSize="xs">{i18n.__("createPubAccCTAText")}</Text>
      </PublisherCard>
    </SidebarContainer>
  );
};

DevConsoleSidebar.propTypes = {
  items: PropTypes.instanceOf(Array),
  pointerBackground: PropTypes.string,
  pointerIconColor: PropTypes.string,
  pointerTextColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export const NavbarContainer = styled(Flex)`
  height: 65px;
  width: 100%;
  padding-left: 64px;
  position: fixed;
  top: 0;
  z-index: 1;
`;

export const ResourceCard = ({ title, description, src }) => {
  return (
    <Flex
      width="221px"
      height="117px"
      bg="baseTertiary"
      borderRadius="5px"
      alignItems="center"
      paddingTop="23px"
      paddingBottom="23px"
    >
      <Box position="relative" left={-18} marginRight={0} width="60%">
        <Image src={src} size={30} />
      </Box>
      <Box alignItems="center">
        <Text fontSize="sm" paddingBottom="5px">
          {title}
        </Text>
        <Text color="#ADADAD" fontSize="xxs">
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

ResourceCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  src: PropTypes.node,
};

///================================================================================================================

export const MenuButton = styled(Button)`
  height: 57px;
  width: 100%;
  border-radius: 0;
  background: transparent;
  border: 0 !important;
  color: ${props => props.color};

  &:hover {
    color: transparent;
    background-color: transparent !important;
    text-decoration: 0;
    border-bottom: 2px solid ${props => props.borderColor} !important;
  }
  &:focus {
    border-bottom: 2px solid ${props => props.borderColor} !important;
  }
  &:active {
    border-bottom: 2px solid ${props => props.borderColor} !important;
  }
  font-size: 16px;
  text-align: left;
  padding-left: 14px;
`;

export const StyledButton = styled(Button)`
  width: 361px;
  border: 0;
`;

export const Card = styled(Box)`
  width: 361px;
  height: 107px;
  border-radius: 5px;
  border-left: 4px solid ${props => props.leftbordercolor};
`;

export const DevCard = styled(Flex)`
  width: 361px;
  height: 107px;
  border-radius: 5px;
  align-items: center;
  padding-left: 26px;
`;

export const DeveloperCard = ({ currentUser, avatar, text }) => {
  return (
    <DevCard bg="basePrimary">
      <Image src={avatar} width="58px" height="58px" />
      <Box ml="26px">
        <Text>{currentUser}</Text>
        <Text fontSize="xs">
          {text} {currentUser}
        </Text>
      </Box>
    </DevCard>
  );
};

DeveloperCard.propTypes = {
  currentUser: PropTypes.string,
  avatar: PropTypes.node,
  text: PropTypes.string,
};

export const ActionContainer = styled(Flex)`
  width: 1008px;
  min-height: 90px;
  border-radius: 15px;
  background: ${props => props.theme.colors.baseMuted};
  // position: sticky;
  // top: 65px;
  // z-index: 1;
  align-items: center;
  padding-right: 25px;
  padding-left: 25px;
  justify-content: space-between;
`;

export const ProjectContainer = styled(Box)`
  width: 1008px;
  // min-height: 491px;

  border-radius: 15px;
  background: ${props => props.theme.colors.baseMuted};

  padding: 24px 40px 24px 40px;
`;

export const CustomShape = styled(Box)`
  width: 5px;
  height: 60px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background: ${props => props.bg};
  position: absolute;
  left: 0;
`;

export const ContentContainer = styled(Flex)`
  width: 100vw;
  min-height: 100vh;
  padding-left: 348px;
  padding-right: 100px;
  background: ${props => props.theme.colors.basePrimary};
  flex-direction: column;
  align-items: center;
`;

export const OutlineButton = styled(Button)`
  &:not([disabled]):hover {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;

    background-color: transparent;
  }
`;

const ImageZoomContainer = styled(Image)`
  transition: transform 0.2s;

  height: 114px;
  width: 151px;
  &:hover {
    transform: scale(1.5, 1.5);
  }
  cursor: pointer;
`;

export const ImageZoom = ({ src }) => {
  console.log("ZOOM IMAGE ", src);
  return (
    <ImageZoomContainer
      src={src}
      height="150px"
      onError={e => (e.target.style.display = "none")}
      onClick={() => {
        window.open(src);
      }}
    />
  );
};

ImageZoom.propTypes = {
  src: PropTypes.string,
};

export const AssetContainer = ({
  state,
  src,
  id,
  type,
  numId,
  onFinish,
  colors,
}) => {
  return (
    <>
      <Flex
        mb={5}
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 0px 24px 0px",
          // width: "700px",
        }}
      >
        <Flex style={{ alignItems: "center" }}>
          <Box width="185px">
            {state ? (
              <ImageZoom
                src={src}
                onError={e => (e.target.style.display = "none")}
              />
            ) : (
              <Image width="151px" src={placeholderImage} />
            )}
          </Box>

          <Box ml={16} mr={16}>
            <Text
              fontSize="sm"
              mb={5}
              style={{ textTransform: "uppercase" }}
              color={colors.textSecondary}
            >
              Product Image {numId}
            </Text>
            <Text fontSize="sm" mb={5} color={colors.textSecondary}>
              Add images which represent key elements of your product
              experience.
            </Text>
            <Text fontSize="sm" mb={5}>
              Images should be .jpg or .PNG and high enough resolution to
              display @ 284x213px on retina displays.
            </Text>
          </Box>
        </Flex>
        <UploadAsset
          id={id}
          type={type}
          numId={numId}
          onFinish={onFinish}
          state={state}
          // passAssetInfo={passAssetInfo}
        />
      </Flex>
    </>
  );
};

AssetContainer.propTypes = {
  src: PropTypes.string,
};

export const CustomSelect = styled.select`
  border-radius: 8px;
  border: 1px solid: #6B6669;
  color: #F5F8F7DE;
  padding: 5px;
  font-size: 12px;
  background: transparent;
  height: 32px;
  width: 450px;
  outline: none;
  cursor:pointer;

`;

export const FieldContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 40px;
`;

export const InnerContainer = styled(Box)`
  width: 100%;
  border: 1px solid #393838;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
`;
