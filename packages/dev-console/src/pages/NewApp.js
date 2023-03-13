import React from "react";

import { Box, Button, Input } from "@blend-ui/core";

import { API } from "aws-amplify";

import {
  useAppContext,
  useFormFields,
  newAppVersionMutation,
} from "@prifina-apps/utils";


import { useNavigate } from "react-router-dom";

const short = require("short-uuid");

export function randomAppId() {
  const idPart = short.generate();
  const chars = "abcdefghijklmnopqrzxvwABCDEFGHIJKLMNOPQRZXVW";
  let randomChar = "A";

  const rnum = Math.floor(Math.random() * chars.length);
  randomChar = chars.substring(rnum, rnum + 1);

  // to make sure appID doesn't begin with number... valid module name requirement. 
  return randomChar + idPart;
}

const NewApp = () => {
  const { currentUser } = useAppContext();
  //const history = useHistory();

  const navigate = useNavigate();
  console.log("NEW APP ", currentUser);

  const [appFields, handleChange] = useFormFields({
    appId: randomAppId(),
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
        identity: currentUser.identity,
        identityPool: currentUser.identityPool,
        //version: appFields.version,
      });
      //history.push("/");
      navigate("/", { replace: true })
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
        <Box mt={20}>
          <Button
            mr={5}
            onClick={() => {
              //history.push("/");
              navigate("/", { replace: true })
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
