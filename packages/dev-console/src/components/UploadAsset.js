import React, { useState } from "react";

import { Storage as S3Storage } from "aws-amplify";

import { Box, Flex, Button, Text, Input } from "@blend-ui/core";
import config from "../config";
import { useFormFields } from "@prifina-apps/utils";

import PropTypes from "prop-types";

const UploadAsset = ({ id, type, numId, ...props }) => {
  const [uploaded, setUploaded] = useState("");
  console.log("PROPS ", props);

  const [appFields, handleChange] = useFormFields({
    version: "",
  });
  window.LOG_LEVEL = "DEBUG";

  const uploadFile = async e => {
    try {
      //check file info
      const file = e.target.files[0];
      props.passAssetInfo(file.name);

      console.log("Upload ", file);
      // check project appId is same as selected file
      // remove apps when private upload works
      // const s3Key = "apps/uploaded/assets/" + "name";
      // const s3Key =
      //   "apps/uploaded/assets/" + id + "-" + type + "-" + numId + ".png";

      const s3Key = id + "/assets/" + type + "-" + numId + ".png";

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
          setUploaded(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
        customPrefix: {
          // private: "apps/",
        },
      });
      // props.close(true, file.name);
      console.log("success ");

      console.log(s3Status);
    } catch (e) {
      console.log("OOPS ", e);
    }
  };

  return (
    <Flex>
      {/* <Input
        placeholder={"Version"}
        id={"version"}
        name={"version"}
        onChange={handleChange}
      /> */}
      <Button
        id={"file_upload"}
        name={"file_upload"}
        accept={".png"}
        onChange={uploadFile}
        variation={"file"}
      >
        Upload file
      </Button>

      <Text ml={20}>{uploaded}</Text>
    </Flex>
  );
};

UploadAsset.propTypes = {
  row: PropTypes.instanceOf(Array),
  close: PropTypes.func,
};

UploadAsset.displayName = "UploadAsset";
export default UploadAsset;
