import React from "react";

import {
  Box,
  Flex,
  Text,
  Input,
  useTheme,
} from "@blend-ui/core";

import { InnerContainer } from "../pages/ProjectDetails-v2";

const PublisherDetails = ({ inputRefs, inputState, fields, options, ...props }) => {

  const { colors } = useTheme();

  const checkEntry = (e) => {
    //console.log("TARGET ", e.target.id)
    const newValue = inputRefs[e.target.id].value;
    console.log("Checking value ", newValue);
    inputState(inputRefs[e.target.id]);
    e.preventDefault();

  }


  return <InnerContainer>
    <Box>
      <Text style={{ textTransform: "uppercase" }}>
        1. Publisher Details
      </Text>
      <Text mt={5} mb={32} color={colors.textSecondary}>
        The name users will see associated with all your applications
        in the App Marketplace.
      </Text>
      <Flex alignItems="flex-end" mb={16}>
        <Box>
          <Text fontSize="sm" mb={5} color={colors.textSecondary}>
            Publisher Name
          </Text>
          <Input
            width="451px"
            label="text"
            name={fields["publisher"]}
            id={fields["publisher"]}
            defaultValue={options.defaults.publisher() || ""}
            color={colors.textPrimary}
            ref={(ref) => {
              if (ref) {
                inputRefs[ref.id] = ref;
              }
            }}
            onBlur={checkEntry}
            onKeyDown={e => {
              if (e.key === "Enter") {
                checkEntry(e);
              }
            }}
          />
        </Box>
      </Flex>
    </Box>
  </InnerContainer>

}
export default PublisherDetails;