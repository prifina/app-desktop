import React, { useRef } from "react";


import { Flex, Button, Text, colors } from "@blend-ui/core";
import config from "../config";

import { useToast } from "@blend-ui/toast";

import styled from "styled-components";

import PropTypes from "prop-types";

const StyledButton = styled(Button)`
  border: 1px solid;

  &:hover {
    color: ${props => props.theme.colors.baseHover}!important;
    background-color: transparent !important;
    // border: 0 !important;
  }
`;

const UploadAsset = ({
  id,
  type,
  numId,
  variant,
  onFinish,
  imageState,
  updateUploaded,
  S3Storage,
  ...props
}) => {

  console.log("PROPS ", props);

  const toast = useToast();

  const uploaded = useRef("");

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
      const assetIndex = type === "icon" ? numId - 1 : numId;
      //add assets to path
      //for id unique id
      //edit extension
      //only save id + extension to object
      //exclude progress update info

      const userRegion = config.cognito.USER_IDENTITY_POOL_ID.split(":")[0];
      //console.log("USER REGION ", userRegion, config.cognito)
      console.log("Upload Size", file.size);

      S3Storage.configure({
        bucket: `prifina-data-${config.prifinaAccountId}-${config.main_region}`,
        region: userRegion,
      });

      const s3Status = await S3Storage.put(s3Key, file, {
        level: "public", // private doesn't work

        metadata: {
          created: new Date().toISOString(),
          "alt-name": file.name,
        },

        progressCallback(progress) {
          const loaded = `${Math.floor(100 * progress.loaded / progress.total)}%`;
          updateUploaded(loaded);
          uploaded.current = loaded;

        },
        customPrefix: {
          //public: "uploads/",
          // private: "apps/",
        },
      });

      console.log("success ");
      toast.success(`Asset uploaded - Progress: ${uploaded}`, {});

      console.log(s3Status);
      onFinish(true, assetIndex);

      // props.close(true, file.name);
    } catch (e) {
      console.log("OOPS ", e);
      toast.error("Upload failed", {});
      onFinish(false, assetIndex);
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
          {imageState ? "Replace file" : "Upload file"}
        </StyledButton>
      )}

      <Text fontSize="xs" color={colors.baseSuccess} style={{ minWidth: "40px", textAlign: "end" }}>
        {uploaded.current}
      </Text>
    </Flex>
  );
};

UploadAsset.defaultProps = {
  variant: "",
};

UploadAsset.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  numId: PropTypes.string,
  variant: PropTypes.string,
  onFinish: PropTypes.func,
  S3Storage: PropTypes.object,
  updateUploaded: PropTypes.func,
  imageState: PropTypes.bool
};

UploadAsset.displayName = "UploadAsset";
export default UploadAsset;
