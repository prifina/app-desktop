import React from "react";
import { Box, Button } from "@blend-ui/core";

import ProgressContainer from "../components/ProgressContainer";

import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";

import i18n from "../lib/i18n";
i18n.init();

const Logout = (props) => {
  const history = useHistory();
  const { userAuth } = useAppContext();

  const buttonClick = async (e) => {
    try {
      //{ global: true });

      await Auth.signOut();
      userAuth(false);
      history.replace("/");
      // otherwise page is not reloaded....
      // window.location.reload();
    } catch (e) {
      console.log("error signing out: ", e);
    }
  };
  return (
    <ProgressContainer title={i18n.__("Logout")} progress={100} pr={19}>
      <Box mt={50}>
        <Button onClick={buttonClick}>Logout</Button>
      </Box>
    </ProgressContainer>
  );
};

export default Logout;
