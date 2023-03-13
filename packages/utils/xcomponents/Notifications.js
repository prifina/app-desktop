import React from "react";

import { Select, Box, Flex, Text, Button } from "@blend-ui/core";

import styled, { css } from "styled-components";

import bxChevronRightCircle from "@iconify/icons-bx/bx-chevron-right-circle";
import { BlendIcon } from "@blend-ui/icons";
import PropTypes from "prop-types";

import i18n from "../lib/i18n";

i18n.init();

const StyledNotification = styled(Box)`
  width: 300px;
  height: 112px;
  background: #ffffff;
  border: 1px solid #e5f3f2;
  box-sizing: border-box;
  border-radius: 10px;
`;

const StyledBar = styled(Flex)`
  width: 8px;
  height: 112px;
  background: #99ceca;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const StyledTitleText = styled(Text)`
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 0.938rem;
  text-transform: capitalize;
`;

const StyledDateText = styled(Text)`
  font-weight: 300;
  font-size: 0.625rem;
  line-height: 0.75rem;
`;

const StyledNotificationText = styled(Text)`
  font-weight: normal;
  font-size: 0.75rem;
  line-height: 0.938rem;
  color: #1e1d1d;
`;

const StyledNotificationFooterText = styled(Text)`
  font-weight: 600;
  font-size: 0.625rem;
  line-height: 0.75rem;
  color: #5a5757;
`;
const StyledNotificationHeader = styled(Text)`
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.25rem;
  color: ${props => props.theme.colors.textPrimary};
`;
const StyledSelect = styled(Select)`
  font-size: 0.75rem;
  line-height: 1.875rem;
  height: 30px;
  color: ${props => props.theme.colors.brandAccent};
  border-color: ${props => props.theme.colors.brandAccent};
`;

const StyledBlendIcon = styled(BlendIcon)`
  color: ${props => props.theme.colors.brandAccent};
`;

export const NotificationHeader = ({
  title,
  selectOnChange,
  buttonOnClick,
  closeClick,
  options,
  ...props
}) => (
  <>
    <Flex flexDirection={"column"} width={"300px"} {...props}>
      <Flex flexDirection={"row"}>
        <Flex width={1 / 2} alignItems={"center"}>
          <StyledNotificationHeader>{title}</StyledNotificationHeader>
        </Flex>
        <Flex
          width={1 / 2}
          justifyContent={"flex-end"}
          alignItems={"center"}
          style={{ cursor: "pointer" }}
        >
          <StyledBlendIcon
            iconify={bxChevronRightCircle}
            height={"14px"}
            width={"14px"}
            onClick={closeClick}
          />
        </Flex>
      </Flex>
      <Flex flexDirection={"row"} mt={"25px"}>
        <Flex width={1 / 2} alignItems={"center"}>
          <StyledSelect
            variation={"outline"}
            size={"sm"}
            onChange={selectOnChange}
          >
            {options}
          </StyledSelect>
        </Flex>
        <Flex width={1 / 2} justifyContent={"flex-end"} alignItems={"center"}>
          <Button width={"100px"} onClick={buttonOnClick}>
            {i18n.__("Clear all")}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  </>
);

NotificationHeader.propTypes = {
  title: PropTypes.string,
  options: PropTypes.instanceOf(Array),
  selectOnChange: PropTypes.func,
  buttonOnClick: PropTypes.func,
  closeClick: PropTypes.func,
};

export const NotificationCard = ({
  AppIcon,
  title,
  date,
  msg,
  footer,
  ...props
}) => (
  <>
    <StyledNotification {...props}>
      <Flex flexDirection={"row"}>
        <StyledBar />
        <Flex p={10} width={1}>
          {/* 
          <Flex width={"32px"}>
            <AppIcon width={"20px"} height={"20px"} />
          </Flex>
          */}
          <Flex width={"233px"} height={"92px"} flexDirection={"column"}>
            <Flex flexDirection={"row"}>
              <Flex width={1 / 2} alignItems={"center"}>
                <StyledTitleText>{title}</StyledTitleText>
              </Flex>
              <Flex
                width={1 / 2}
                justifyContent={"flex-end"}
                alignItems={"center"}
              >
                <StyledDateText>{date}</StyledDateText>
              </Flex>
            </Flex>
            <Flex height={"45px"} mt={10}>
              <StyledNotificationText as={"p"}>{msg}</StyledNotificationText>
            </Flex>
            <Flex mt={10}>
              <StyledNotificationFooterText>
                {footer}
              </StyledNotificationFooterText>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </StyledNotification>
  </>
);
//new Date().toDateString()

NotificationCard.propTypes = {
  AppIcon: PropTypes.elementType,
  title: PropTypes.string,
  date: PropTypes.string,
  msg: PropTypes.string,
  footer: PropTypes.string,
};
