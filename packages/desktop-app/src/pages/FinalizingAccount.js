/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { Box, Text, Flex } from "@blend-ui/core";

import { Auth } from "aws-amplify";
//import { useAppContext, useAccountContext } from "../lib/contextLib";

import { useHistory } from "react-router-dom";
import { i18n, useAppContext } from "@prifina-apps/utils";
//import i18n from "../lib/i18n";
import { useToast } from "@blend-ui/toast";
import { DotLoader } from "@blend-ui/progress";

import PropTypes from "prop-types";

i18n.init();

const StyledBox = styled(Box)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 192px;
  z-index: 3;
`;
const LoaderBox = styled(Box)`
  width: 850px;
  z-index: 3;
`;

const FinalizingAccount = ({ currentUser, ...props }) => {
  //console.log("Phone ", props);
  const history = useHistory();
  const { AUTHConfig, userAuth } = useAppContext();
  Auth.configure(AUTHConfig);
  //const { currentUser, state } = useAccountContext();

  const alerts = useToast();

  console.log("FIN ", currentUser);

  //console.log("USE ", useToast);

  //const [confirmCode, setConfirmCode] = useState(false);

  useEffect(() => {
    async function onLoad() {
      const abortController = new AbortController();
      //console.log("SIGNUP ", state);
      try {
        const _newUser = {
          username: currentUser.uuid,
          password: currentUser.accountPassword.value,
          attributes: {
            email: currentUser.emailVerified,
            phone_number: currentUser.phoneVerified,
            family_name: currentUser.lastName.value,
            given_name: currentUser.firstName.value,
            name: currentUser.username.value,
          },
        };
        console.log("Creating... ", _newUser);
        const { user } = await Auth.signUp(_newUser);
        console.log(user);
        history.replace("/login");
        /*
        alerts.success("Account created", {
          duration: 10000,
          onClose: () => {
            console.log("ON CLOSE...");
            //history.replace("/");
          },
        });
        */
      } catch (e) {
        console.log("ERR ", e);
        if (e.code === "AuthError" || e.code === "UsernameExistsException") {
          alerts.error(i18n.__("usernameExists"), {});
        }
      }
      return () => {
        abortController.abort();
      };
    }
    onLoad();
    //});
  }, []);

  return (
    <StyledBox>
      <LoaderBox>
        <Text as={"h1"} textAlign={"center"}>
          {i18n.__("finalizeText")}
        </Text>
        <Flex justifyContent={"center"} mt={131}>
          <DotLoader />
        </Flex>
      </LoaderBox>
    </StyledBox>
  );
};

FinalizingAccount.propTypes = {
  currentUser: PropTypes.object.isRequired,
};
export default FinalizingAccount;
