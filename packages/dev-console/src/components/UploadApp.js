import React, { useState } from "react";

import { Storage as S3Storage } from "aws-amplify";

import { Box, Button, Text, Input } from "@blend-ui/core";
import config from "../config";
import { i18n, useFormFields } from "@prifina-apps/utils";

import PropTypes from "prop-types";

//import { useFormFields } from "../lib/formFields";
/*
const userRegion = config.cognito.IDENTITY_POOL_ID.split(":")[0];

S3Storage.configure({
  AWSS3: {
    bucket: config.S3.bucket + "-" + userRegion,
    region: userRegion,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    //identityPoolId: config.cognito.USER_IDENTITY_POOL_ID,
  },
});
console.log(S3Storage);
*/
const UploadApp = props => {
  const [uploaded, setUploaded] = useState("");
  console.log("PROPS ", props);

  const [appFields, handleChange] = useFormFields({
    version: "",
  });
  window.LOG_LEVEL = "DEBUG";

  const uploadFile = async e => {
    try {
      const file = e.target.files[0];

      console.log("Upload ", file);
      // check project appId is same as selected file
      // remove apps when private upload works
      const s3Key = "apps/uploaded/" + props.row.id + ".zip";

      //window.LOG_LEVEL = "DEBUG";
      //let metaData={ "alt-name": file.name };
      // amplify fails with multipart uploads... limit <5M
      //identityId?: string, // id of another user, if `level: protected`
      //const currentCredentials = await Auth.currentCredentials();
      //console.log("CREDS ", currentCredentials);
      const userRegion = config.cognito.USER_IDENTITY_POOL_ID.split(":")[0];

      //const _currentSession = await Auth.currentSession();
      //const currentCredentials = await cognitoCredentials(_currentSession);
      const currentCredentials = JSON.parse(
        localStorage.getItem("PrifinaClientCredentials"),
      );

      // const s3path = `https://prifina-apps-${config.prifinaAccountId}.s3.amazonaws.com`;

      console.log("CREDS ", currentCredentials);
      S3Storage.configure({
        bucket: `prifina-data-${config.prifinaAccountId}-${config.main_region}`,
        region: userRegion,
        /*
        identityId: currentCredentials.identityId,
        credentials: () => {
          return Promise.resolve(currentCredentials);
        },
        */
      });

      const s3Status = await S3Storage.put(s3Key, file, {
        //bucket: `prifina-user-${config.prifinaAccountId}-${config.main_region}`,
        //region: userRegion,
        /*
        bucket: "prifina-user-352681697435-eu-west-1",
        region: "eu-west-1",
        credentials: () => {
          return Promise.resolve(currentCredentials);
        }, */
        level: "public", // private doesn't work

        metadata: { created: new Date().toISOString(), "alt-name": file.name },
        progressCallback(progress) {
          //console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setUploaded(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
        customPrefix: {
          public: "uploads/",
          // private: "apps/",
        },
      });
      props.close(true, appFields.version);

      console.log(s3Status);
    } catch (e) {
      console.log("OOPS ", e);
    }
  };

  return (
    <>
      <Box mt={20} mb={10}>
        <Text>{i18n.__("devComponentUploadAppText")} {props.row.id}.zip</Text>
      </Box>
      <Box width={"150px"} m={10}>
        <Input
          placeholder={"Version"}
          id={"version"}
          name={"version"}
          onChange={handleChange}
        />
      </Box>
      <Button
        id={"file_upload"}
        name={"file_upload"}
        accept={".zip"}
        onChange={uploadFile}
        variation={"file"}
      >
        Upload file
      </Button>
      <Text ml={20}>{uploaded}</Text>
      <Box mt={20} mb={10}>
        <Button onClick={props.close}>Back</Button>
      </Box>
    </>
  );
};

UploadApp.propTypes = {
  row: PropTypes.instanceOf(Array),
  close: PropTypes.func,
};

UploadApp.displayName = "UploadApp";
export default UploadApp;

/*
const s3Status = await S3Storage.put(s3Key, JSON.stringify(_schema), {
    level: "public",
    contentType: "application/json",
    cacheControl: "",
    expires: parseInt(Date.now() / 1000),
    metadata: { created: new Date().toISOString() },
  });
  console.log(s3Status);

<input
                disabled={importDisabled}
                style={{ display: "none" }}
                type="file"
                accept=".json, .graphql"
                id="file_upload"
                name="file_upload"
                onChange={(e) => _importFile(e)}
              />
              <Button
                disabled={importDisabled}
                variation={"file"}
                input="file_upload"
              >
                {I18n.get("Import Data Model")}
              </Button>


const result = await Storage.put('test.txt', 'Private Content', {
    level: 'private',
    contentType: 'text/plain'
});

Storage.put('test.txt', 'File content', {
    progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
  },
});

*/
