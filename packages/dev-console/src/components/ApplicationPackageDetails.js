import React, { useState } from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  useTheme,
} from "@blend-ui/core";

import { ProjectContainer, InnerContainer } from "../pages/ProjectDetails-v2";
import UploadFile from "./UploadFile-v2";

const ApplicationPackageDetails = ({ inputRefs, inputState, fields, options, S3Storage, ...props }) => {

  console.log("APP PACKAGE DETAILS ", inputRefs, fields, options);

  const { colors } = useTheme();

  const [uploaded, setUploaded] = useState("");

  const checkEntry = (e) => {
    //console.log("TARGET ", e.target.id)
    const newValue = inputRefs[e.target.id].value;
    console.log("Checking value ", newValue);
    inputState(inputRefs[e.target.id]);
    e.preventDefault();

  }


  return <>
    <ProjectContainer mb={24}>
      <Box
        style={{
          padding: "4px 224px 16px 24px",
          marginBottom: 40,
        }}
      >
        <Text
          style={{ textTransform: "uppercase" }}
          mb={12}
          fontSize="lgx"
        >
          Application package
        </Text>

        <Text mb={20} color={colors.textSecondary}>
          To get your application published in our App Market, you will
          need to supply the Prifina team a .Zip build deployment package,
          manifest file, UI inputs and settings as-well-as any native
          assets. For more information visit our documentation
        </Text>
        <Text color={colors.textSecondary}>
          After you submit everything your application will be reviewed by
          our App Market team.
        </Text>
      </Box>

      <InnerContainer>
        <Box>
          <Text style={{ textTransform: "uppercase" }}>
            1.Build deployment
          </Text>
          <Text mt={5} mb={32} color={colors.textSecondary}>
            Upload a packaged version of your application.
          </Text>
          <Box mb={16}>
            <Text fontSize="sm" color={colors.textSecondary}>
              Version number
            </Text>
            <Flex alignItems="center">
              <Input
                label="text"
                name={fields["nextVersion"]}
                id={fields["nextVersion"]}
                defaultValue={options.defaults.nextVersion() || ""}
                color={colors.textPrimary}
                style={{
                  background: "transparent",
                  minWidth: "451px",
                  width: 451,
                }}
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
              <Box>
                <Text fontSize="xs" ml={25} color={colors.textMuted}>
                  This version number is for your internal use.
                </Text>
                <Text fontSize="xs" ml={25} color={colors.textMuted}>
                  Formatting must follow semantic versioning format
                </Text>
              </Box>
            </Flex>
          </Box>
          <Text fontSize="sm" color={colors.textSecondary}>
            App ID
          </Text>
          <Flex mb={53} alignItems="center">
            <Input
              disabled
              width="451px"
              label="text"
              value={options.defaults.id()}
              color={colors.textSecondary}
              style={{ background: "transparent" }}

            />
            <Box>
              <Text fontSize="xs" ml={25} color={colors.textMuted} mb={8}>
                Unique project identifier. Add this to your build
                deployment package.
              </Text>
              <Text fontSize="xs" ml={25} color={colors.textMuted}>
                Visit our docs for more information
              </Text>
            </Box>
          </Flex>
          <Text fontSize="sm" mb={5} color={colors.textSecondary}>
            Build deployment package
          </Text>
          <Flex alignItems="center" justifyContent="center" mb={16}>
            <Box ml="5px">
              <UploadFile widgetId={options.defaults.id()} S3Storage={S3Storage} updateUploaded={setUploaded} />
            </Box>
            <Box ml={25}>
              <Text fontSize="xs" color={colors.textMuted} mb={10}>
                The build deployment package is a package version of your
                local build. It must include:
              </Text>
              <Text fontSize="xs" color={colors.textMuted}>
                Your Prifina App ID (as the filename)
              </Text>
              <Text fontSize="xs" color={colors.textMuted} mb={10}>
                Your Prifina App ID (in the codebase)
              </Text>
              <Text fontSize="xs" color={colors.textMuted}>
                Visit our docs for more information
              </Text>
            </Box>
          </Flex>
          <Text>Status
            {uploaded !== "" &&
              <Text pl={5} as={"span"} fontSize="xs" color={colors.baseSuccess}>
                Progress: {uploaded}
              </Text>
            }
          </Text>
        </Box>
      </InnerContainer>
    </ProjectContainer>

  </>
}


export default ApplicationPackageDetails;