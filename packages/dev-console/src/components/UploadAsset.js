import React, { useState, useEffect } from "react";

import { Storage as S3Storage } from "aws-amplify";

import { Box, Flex, Button, Text, Input, colors } from "@blend-ui/core";
import config from "../config";
import { useFormFields, useAppContext } from "@prifina-apps/utils";

import { useToast } from "@blend-ui/toast";

import styled from "styled-components";

import PropTypes from "prop-types";
// Load the required clients and commands.
import { CopyObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

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
  state,
  ...props
}) => {
  const { s3UploadClient } = useAppContext();

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
      const assetIndex = type === "icon" ? numId - 1 : numId;
      //add assets to path
      //for id unique id
      //edit extension
      //only save id + extension to object
      //exclude progress update info

      const userRegion = config.cognito.USER_IDENTITY_POOL_ID.split(":")[0];
      //console.log("USER REGION ", userRegion, config.cognito)
      console.log("Upload Size", file.size);
      const maxPartSize = 5 * 1024 * 1024;
      if (file.size > maxPartSize && Object.keys(s3UploadClient).length) {
        const createParams = {
          Bucket: `prifina-data-${config.prifinaAccountId}-${config.main_region}`,
          Key: "public/" + s3Key,
          Body: file,
        };

        const parallelUploads3 = new Upload({
          client: s3UploadClient,
          params: createParams,

          tags: [
            // doesn't work, something about bucket owner
            // { Key: "created", Value: new Date().toISOString() },
            // { Key: "alt-name", Value: file.name },
            /*...*/
          ], // optional tags
          queueSize: 4, // optional concurrency configuration
          partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
          leavePartsOnError: false, // optional manually handle dropped parts
          // didn't work...
          // metadata: {
          //   created: new Date().toISOString(),
          //   "alt-name": file.name,
          // },
        });

        parallelUploads3.on("httpUploadProgress", progress => {
          console.log(progress);
          //setUploaded(`Progress: ${progress.loaded}/${progress.total}`);
          setUploaded(
            `Progress: ${Math.floor(
              (progress.loaded / progress.total) * 100,
            )}%`,
          );
        });

        const uploadResult = await parallelUploads3.done();
        console.log("UPLOAD RESULT ", uploadResult);
        // update metadata as it was not included with multipartupload
        s3UploadClient.send(
          new CopyObjectCommand({
            Metadata: {
              created: new Date().toISOString(),
              "alt-name": file.name,
            },
            MetadataDirective: "REPLACE",
            Bucket: uploadResult.Bucket,
            CopySource: "/" + uploadResult.Bucket + "/" + uploadResult.Key,
            Key: uploadResult.Key,
          }),
        );

        toast.success(`Asset uploaded - Progress: ${uploaded}`, {});
        onFinish(true, assetIndex);
      } else {
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
            //console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
            //setUploaded(`Progress: ${progress.loaded}/${progress.total}`);
            setUploaded(
              `Progress: ${Math.floor(
                (progress.loaded / progress.total) * 100,
              )}%`,
            );
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
      }

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
          {state ? "Replace file" : "Upload file"}
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
  id: PropTypes.string,
  type: PropTypes.string,
  numId: PropTypes.string,
  variant: PropTypes.string,
  onFinish: PropTypes.func,
};

UploadAsset.displayName = "UploadAsset";
export default UploadAsset;
