
import React from "react";


import { Box, Flex, Text, Image, } from "@blend-ui/core";


import PropTypes from "prop-types";


const ResourceCard = ({ title, description, src }) => {
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

export default ResourceCard