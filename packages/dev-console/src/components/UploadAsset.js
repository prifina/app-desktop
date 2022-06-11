import React, { useState } from "react";

import { Storage as S3Storage } from "aws-amplify";

import { Box, Flex, Button, Text, Input, colors } from "@blend-ui/core";
import config from "../config";
import { useFormFields } from "@prifina-apps/utils";

import { useToast } from "@blend-ui/toast";

import styled from "styled-components";

import PropTypes from "prop-types";

const StyledButton = styled(Button)`
  &:hover {
    color: ${props => props.theme.colors.baseHover}!important;
    background-color: transparent !important;
    border: 0 !important;
  }
`;

const UploadAsset = ({ id, type, numId, variant, ...props }) => {
  const [uploaded, setUploaded] = useState("");
  console.log("PROPS ", props);

  const toast = useToast();

  const [appFields, handleChange] = useFormFields({
    version: "",
  });
  window.LOG_LEVEL = "DEBUG";

  const uploadFile = async e => {
    try {
      //check file info
      const file = e.target.files[0];
      // props.passAssetInfo(file.name);

      console.log("Upload ", file);
      // check project appId is same as selected file
      // remove apps when private upload works
      // const s3Key = "apps/uploaded/assets/" + "name";
      // const s3Key =

      const regularPath = id + "/assets/" + type + "-" + numId + ".png";
      const nativePath = id + "/native-assets/" + file.name;

      const s3Key = variant === "native" ? nativePath : regularPath;

      //add assets to path
      //for id unique id
      //edit extension
      //only save id + extension to object
      //exclude progress update info

      const userRegion = config.cognito.USER_IDENTITY_POOL_ID.split(":")[0];

      const currentCredentials = JSON.parse(
        localStorage.getItem("PrifinaClientCredentials"),
      );

      console.log("CREDS ", currentCredentials);
      S3Storage.configure({
        bucket: `prifina-data-${config.prifinaAccountId}-${config.main_region}`,
        region: userRegion,
      });

      const s3Status = await S3Storage.put(s3Key, file, {
        level: "public", // private doesn't work

        metadata: { created: new Date().toISOString(), "alt-name": file.name },

        progressCallback(progress) {
          //console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setUploaded(`Progress: ${progress.loaded}/${progress.total}`);
        },
        customPrefix: {
          public: "uploads/",
          // private: "apps/",
        },
      });
      // props.close(true, file.name);
      console.log("success ");
      toast.success(`Asset uploaded - Progress: ${uploaded}`, {});

      console.log(s3Status);
    } catch (e) {
      console.log("OOPS ", e);
      toast.error("Upload failed", {});
    }
  };

  return (
    <Flex alignItems="center">
      {variant === "native" ? (
        <StyledButton onChange={uploadFile} variation={"file"}>
          Upload file
        </StyledButton>
      ) : (
        <StyledButton accept={".png"} onChange={uploadFile} variation={"file"}>
          Upload file
        </StyledButton>
      )}

      <Text ml={20} fontSize="xs" color={colors.baseSuccess}>
        {uploaded}
      </Text>
    </Flex>
  );
};

UploadAsset.defaultProps = {
  variant: "",
};

UploadAsset.propTypes = {
  row: PropTypes.instanceOf(Array),
  close: PropTypes.func,
};

UploadAsset.displayName = "UploadAsset";
export default UploadAsset;
