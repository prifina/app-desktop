/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */

import React from "react";
// import { List, ListItem, ListDivider } from "@blend-ui/list";
import { Box, Flex, Text, Button, Image } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import PropTypes from "prop-types";

import styled, { createGlobalStyle } from "styled-components";

export const SourceCardContainer = styled(Flex)`
  width: 346px;
  height: 134px;
  border-radius: 9px;
  box-shadow: 0px 3.29175px 6.5835px rgba(91, 92, 91, 0.35);
  align-items: center;
  padding: 8px;
`;

export const SourceCard = ({ items, ...props }) => (
  <>
    {items.map(
      ({
        id,
        image,
        title,
        category,
        description,
        buttonText,
        onClick,
        ...rest
      }) => (
        <SourceCardContainer ml={24}>
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
              >
                <Image src={image} width="56px" />
              </Flex>
              <Button size="xs" onClick={onClick}>
                {buttonText}
              </Button>
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
