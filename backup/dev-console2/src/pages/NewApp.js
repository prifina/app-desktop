import React, { useState } from "react";

import { Box, Button, Input } from "@blend-ui/core";

import { API } from "aws-amplify";

import { newAppVersionMutation } from "../graphql/api";
import { useAppContext } from "../lib/contextLib";

import { useFormFields } from "../lib/formFields";
import { useHistory } from "react-router-dom";

const short = require("short-uuid");
const appId = short.generate();

const NewApp = () => {
  const { currentUser } = useAppContext();
  const history = useHistory();
  console.log("NEW APP ", currentUser);

  const [appFields, handleChange] = useFormFields({
    appId: appId,
    name: "",
    title: "",
    //version: "",
  });

  const createApp = async e => {
    try {
      console.log("CLICK ", appFields);

      await newAppVersionMutation(API, appFields.appId, currentUser.prifinaID, {
        name: appFields.name,
        title: appFields.title,
        //version: appFields.version,
      });
      history.push("/");
    } catch (e) {
      console.log("error ", e);
    }
  };
  return (
    <>
      <Box p={20}>
        <Box mt={20}>
          <Input
            placeholder={"APP Id"}
            id={"appId"}
            name={"appId"}
            defaultValue={appFields.appId}
            disabled
          />
        </Box>
        <Box mt={10}>
          <Input
            autoFocus={true}
            placeholder={"Name"}
            id={"name"}
            name={"name"}
            onChange={handleChange}
          />
        </Box>
        <Box mt={10}>
          <Input
            placeholder={"Title"}
            id={"title"}
            name={"title"}
            onChange={handleChange}
          />
        </Box>
        {/* 
        <Box mt={10}>
          <Input
            placeholder={"Version"}
            id={"version"}
            name={"version"}
            onChange={handleChange}
          />
        </Box>
        */}
        <Box mt={20}>
          <Button
            mr={5}
            onClick={() => {
              history.push("/");
            }}
          >
            Back
          </Button>
          <Button onClick={createApp}>Create</Button>
        </Box>
      </Box>
    </>
  );
};

export default NewApp;
