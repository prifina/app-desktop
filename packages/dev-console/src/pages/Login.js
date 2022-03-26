import React from "react";
import { Box } from "@blend-ui/core";

import { useHistory } from "react-router-dom";

import { useAppContext, i18n } from "@prifina-apps/utils";

i18n.init();

const Login = props => {
  const history = useHistory();

  const { userAuth, currentUser, isAuthenticated, mobileApp } = useAppContext();

  return (
    <>
      <Box mt={50}>
        <div>
          Login {isAuthenticated ? "Authenticated" : "Unauthenticated"}{" "}
        </div>
      </Box>
    </>
  );
};

export default Login;
