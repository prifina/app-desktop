import React, { forwardRef } from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  useTheme,
} from "@blend-ui/core";

import { ProjectContainer } from "../pages/ProjectDetails-v2";

const SandboxDetails = forwardRef(({ options, inputState, ...props }, ref) => {

  console.log("SANDBOX DETAILS ", ref, options);

  const { colors } = useTheme();
  const checkRemoteUrl = (e) => {
    const url = ref.current.value;
    console.log("Checking remote ", url);
    inputState(ref.current);
    e.preventDefault();

  }

  return <Box>
    <ProjectContainer mb={24}>
      <Box
        style={{
          padding: "4px 224px 16px 24px",
          marginBottom: 16,
        }}
      >
        <Text style={{ textTransform: "uppercase" }} mb={8}>
          Remote Link Testing
        </Text>

        <Text color={colors.textSecondary}>
          Link your local build to Prifina’s testing environment and
          dynamic data connectors by adding a remote link below.
        </Text>
      </Box>

      <Flex
        width="584px"
        style={{
          border: "1px solid #393838",
          padding: 24,
          width: "100%",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Text fontSize="sm" mb={5} color={colors.textSecondary}>
            Remote Link
          </Text>
          <Input
            width="451px"
            label="text"
            {...props}
            defaultValue={options.value()}
            color={colors.textSecondary}
            ref={ref}
            onBlur={checkRemoteUrl}
            onKeyDown={e => {
              if (e.key === "Enter") {
                checkRemoteUrl(e);
              }
            }}
          />
          <Text fontSize="xxs" mt={5} color={colors.textSecondary}>
            Links your local build to the App Studio
          </Text>
        </Box>

        <Button
          onClick={() => {
            //navigate("/sandbox", { state: { allValues: appData } });
          }}
        >
          Launch Sandbox
        </Button>
      </Flex>
    </ProjectContainer>
  </Box>

});

export default SandboxDetails;