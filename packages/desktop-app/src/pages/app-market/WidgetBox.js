//global localStorage

import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Divider,
  useTheme,
} from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import { i18n } from "@prifina-apps/utils";

import PropTypes from "prop-types";

import styled, { css } from "styled-components";

import bxsWidget from "@iconify/icons-bx/bxs-widget";
import bxsGrid from "@iconify/icons-bx/bxs-grid";

import undefinedIcon from "../../assets/app-market/undefined-icon.png";

import prifinaLogo from "../../assets/prifina.svg";

import { PrifinaIcon } from "../app-market/icons";

i18n.init();

const ProductBase = styled(Box)`
  display: inline-block;
  flex-direction: column;
  position: relative;
  width: 324px;
  height: ${props => (props.height === 3 ? "144px" : "204px")};
  padding: 16px;
  border: 1px solid #bec1c0;

  box-shadow: 0px 2px 8px rgba(91, 92, 91, 0.05);
  border-radius: 8px;
  margin-right: 24px;
  margin-bottom: 24px;
  cursor: pointer;
`;

const ProductBadge = styled.span`
  height: 28px;
  position: absolute;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px 4px 12px;
  right: 16px;
  top: 16px;
  background: red;
  background: ${props => props.background};
`;

const CategoryBadge = styled.span`
  flex-direction: row;
  align-items: center;
  padding: 0px 8px 0px 4px;
  color: #175cd3;
  background: #eff8ff;
  font-size: 12px;
  border-radius: 2px;
  bottom: 16px;
  position: absolute;
  height: 22px;
`;

const SystemAppBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px 2px 4px;
  color: #c11574;
  font-size: 12px;
  position: absolute;
  height: 22px;
  background: #fef6fb;
  border: 1px solid #fce7f6;
  border-radius: 16px;

  svg {
    margin-right: 4px;
    margin-left: 6px;
  }
`;

const WidgetBox = ({
  installWidget,
  installedWidget,
  onClick,
  keyName,
  ...props
}) => {
  console.log("PROPS ", props);

  const IconBox = ({ iconify, value }) => {
    console.log("CARD VALUE ", value, title);
    return (
      <Flex width="100px" flexDirection="column">
        <BlendIcon iconify={iconify} />
      </Flex>
    );
  };

  IconBox.propTypes = {
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  const handleBadge = () => {
    if (props.appType === 1) {
      return (
        <ProductBadge background="#DBF0EE">
          <BlendIcon id="icon" iconify={bxsGrid} size="10px" color="#0D776E" />
          <Text fontSize="sm" color="#0D776E">
            Application
          </Text>
        </ProductBadge>
      );
    } else if (props.appType === 2) {
      return (
        <ProductBadge background="#EADBF0">
          <BlendIcon iconify={bxsWidget} size="10px" color="#480863" />
          <Text fontSize="sm" ml={4} color="#480863">
            Widget
          </Text>
        </ProductBadge>
      );
    }
  };

  return (
    <>
      <ProductBase
        onClick={onClick}
        id="appMarket-productBase"
        height={props.appType}
      >
        {props.appType !== 3 ? (
          <>
            <Flex justifyContent="space-between">
              <Image
                src={props.icon !== null ? props.icon : undefinedIcon}
                width="48p"
                height="48px"
              />
              {handleBadge()}
            </Flex>
            <Box mt={8} height="76px">
              <Text
                className="title"
                textStyle="h5"
                fontWeight={"semiBold"}
                mb="5px"
              >
                {props.title !== null ? props.title : keyName}
              </Text>
              <Text fontSize="xs">
                {props.shortDescription !== undefined
                  ? props.shortDescription.length > 95
                    ? `${props.shortDescription.substring(0, 95)}...`
                    : props.shortDescription
                  : null}
              </Text>
            </Box>
          </>
        ) : (
          <>
            <Flex alignItems="center">
              <Image src={undefinedIcon} />
              <Box ml={16} height="75px" paddingTop="8px">
                <Text className="title" textStyle="h5" fontWeight={"semiBold"}>
                  {props.title !== null ? props.title : keyName}
                </Text>
                <Text fontSize="xs">
                  {props.shortDescription !== undefined
                    ? props.shortDescription.length > 95
                      ? `${props.shortDescription.substring(0, 95)}...`
                      : props.shortDescription
                    : null}
                </Text>
              </Box>
            </Flex>
          </>
        )}

        <Divider width="100%" color="#EAECF0" />
        {props.appType === 3 ? (
          <SystemAppBadge>
            <PrifinaIcon fill="#C11574" />
            System App
          </SystemAppBadge>
        ) : (
          <CategoryBadge className="categoryBadge">
            {props.category !== undefined ? props.category : "Undefined"}
          </CategoryBadge>
        )}
      </ProductBase>
    </>
  );
};

WidgetBox.propTypes = {
  installed: PropTypes.bool,
  installWidget: PropTypes.func,
  installedWidget: PropTypes.number,
  onClick: PropTypes.func,
};

export default WidgetBox;
