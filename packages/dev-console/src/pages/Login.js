import React from "react";
import { Box, Button } from "@blend-ui/core";

import ProgressContainer from "../components/ProgressContainer";

import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

import { useAppContext, i18n } from "@prifina-apps/utils";
i18n.init();

const Login = props => {
  const history = useHistory();

  const { userAuth, currentUser, isAuthenticated, mobileApp } = useAppContext();

  return (
    <Box mt={50}>
      <div>Login {isAuthenticated ? "Authenticated" : "Unauthenticated"} </div>
    </Box>
  );
};

export default Login;
