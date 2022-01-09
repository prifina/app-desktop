/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */

import React from "react";
// import { List, ListItem, ListDivider } from "@blend-ui/list";
import { Flex, Text, Button, Image } from "@blend-ui/core";


import PropTypes from "prop-types";

import styled from "styled-components";

export const SourceCardContainer = styled(Flex)`
  width: 300px;
  height: 134px;
  border-radius: 9px;
  box-shadow: 0px 3.29175px 6.5835px rgba(91, 92, 91, 0.35);
  align-items: center;
  padding: 8px;
  margin-right: 24px;
`;

const Badge = styled.span`
  position: absolute;
  border: 2px solid white;
  top: 7px;
  right: 7px;
  padding: 3.5px 5.5px;
  border-radius: 50%;
  background: blue;
  font-size: 14px;
  line-height: 14px;
  color: white;
  font-weight: 700;
`;

export const SourceCard = ({ items, ...props }) => (
  <>
    {items.map(
      ({ id, image, title, category, description, children, ...rest }) => (
        <SourceCardContainer>
          <Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Flex
                justifyContent="center"
                alignItems="center"
                width="81px"
                height="83px"
                borderRadius="4px"
                bg="baseLinkHover"
                mb={4}
                position="relative"
              >
                <Image src={image} width="56px" />
                <Badge>+</Badge>
              </Flex>

              {children}
            </Flex>
            <Flex flexDirection="column" ml={14}>
              <Text>{title}</Text>
              <Text fontSize="xxs" color="#BC31EA">
                {category}
              </Text>
              <Text>{description}</Text>
            </Flex>
          </Flex>
        </SourceCardContainer>
      ),
    )}
  </>
);
SourceCard.propTypes = {
  items: PropTypes.array,
};

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
