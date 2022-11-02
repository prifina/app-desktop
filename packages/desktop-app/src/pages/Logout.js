import React from "react";
import { Box, Button } from "@blend-ui/core";

import ProgressContainer from "../components/ProgressContainer";

import { Auth } from "aws-amplify";

import { i18n, useAppContext } from "@prifina-apps/utils";

i18n.init();

const Logout = props => {
  const { userAuth } = useAppContext();

  const buttonClick = async e => {
    try {
      /*
      await Auth.signOut();
      const localStorageKeys = Object.keys(window.localStorage);

      localStorageKeys.forEach(key => {
        if (key.startsWith("CognitoIdentityServiceProvider.")) {
          localStorage.removeItem(key);
        }
        if (key.startsWith("CognitoIdentityId")) {
          localStorage.removeItem(key);
        }
      });

      userAuth(false);
      */
      //history.replace("/");
      window.location.replace("/");
    } catch (e) {
      console.log("error signing out: ", e);
    }
  };
  return (
    <ProgressContainer title={i18n.__("Logout")} progress={100} pr={19}>
      <Box mt={50}>
        <Button onClick={buttonClick}>{i18n.__("logoutButton")}</Button>
      </Box>
    </ProgressContainer>
  );
};

export default Logout;
