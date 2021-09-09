import React from "react";

import { Select, Box, Flex, Label, Text, Button } from "@blend-ui/core";

import styled, { css } from "styled-components";

import { ReactComponent as DisplayAppIcon } from "../assets/display-app.svg";

import bxChevronRightCircle from "@iconify/icons-bx/bx-chevron-right-circle";
import { BlendIcon } from "@blend-ui/icons";

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
  color: #1e1d1d;
`;
const StyledSelect = styled(Select)`
  font-size: 0.75rem;
  line-height: 1.875rem;
  height: 30px;
  color: #00847a;
  border-color: #00847a;
`;

export default { title: "Notification" };

export const notification2 = () => (
  <div>
    <Flex flexDirection={"column"} width={"300px"}>
      <Flex flexDirection={"row"}>
        <Flex width={1 / 2} alignItems={"center"}>
          <StyledNotificationHeader>Notifications</StyledNotificationHeader>
        </Flex>
        <Flex width={1 / 2} justifyContent={"flex-end"} alignItems={"center"}>
          <BlendIcon
            iconify={bxChevronRightCircle}
            color={"#00847A"}
            height={"14px"}
            width={"14px"}
          />
        </Flex>
      </Flex>
      <Flex flexDirection={"row"} mt={"25px"}>
        <Flex width={1 / 2} alignItems={"center"}>
          <StyledSelect variation={"outline"} size={"sm"}>
            <option>All</option>
            <option>DisplayApp</option>
          </StyledSelect>
        </Flex>
        <Flex width={1 / 2} justifyContent={"flex-end"} alignItems={"center"}>
          <Button width={"100px"}>Clear all</Button>
        </Flex>
      </Flex>
    </Flex>
  </div>
);
notification2.story = {
  name: "Notification Top",
};
export const notification = () => (
  <div>
    <StyledNotification>
      <Flex flexDirection={"row"}>
        <StyledBar />
        <Flex p={10} width={1}>
          <Flex width={"32px"}>
            <DisplayAppIcon width={"20px"} height={"20px"} />
          </Flex>
          <Flex width={"233px"} height={"92px"} flexDirection={"column"}>
            <Flex flexDirection={"row"}>
              <Flex width={1 / 2} alignItems={"center"}>
                <StyledTitleText>Title</StyledTitleText>
              </Flex>
              <Flex
                width={1 / 2}
                justifyContent={"flex-end"}
                alignItems={"center"}
              >
                <StyledDateText>{new Date().toDateString()}</StyledDateText>
              </Flex>
            </Flex>
            <Flex height={"45px"} mt={10}>
              <StyledNotificationText as={"p"}>
                Aliqua excepteur aute quis excepteur sit excepteur nulla elit.
                Ipsum magna et adipisicing veniam sunt do...
              </StyledNotificationText>
            </Flex>
            <Flex mt={10}>
              <StyledNotificationFooterText>
                And another 4 messages
              </StyledNotificationFooterText>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </StyledNotification>
  </div>
);
notification.story = {
  name: "Notification",
};

/*
const LeftIcon = styled(props => {
    const { disabled, inputError } = useInputContext();
    const theme = useTheme();
    //const { color, ...rest } = props;
    //color={disabled ? theme.colors.baseMuted : color}
  
    return (
      <BlendIcon
        {...props}
        fill={disabled ? theme.colors.baseMuted : "transparent"}
        color={
          inputError
            ? theme.colors.baseError
            : props.color || theme.colors.baseSecondary
        }
        theme={theme}
        style={{
          marginLeft: theme.sizeOptions[10],
          marginRight: theme.sizeOptions[10],
        }}
      />
    );
  })`
    flex: none;
    align-self: center;
    pointer-events: none;
    position: relative;
  `;
  */
