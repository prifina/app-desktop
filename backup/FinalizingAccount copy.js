import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { Box } from "@blend-ui/core";

import { Auth } from "aws-amplify";
import { useAppContext, useAccountContext } from "../lib/contextLib";

import { useHistory } from "react-router-dom";
import { Background } from "../assets/background-image";
import i18n from "../lib/i18n";
import { useToast } from "@blend-ui/toast";

i18n.init();

const StyledBox = styled(Box)`
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.3;
  height: 100vh;
  width: 100vw;
  top: 0px;
  z-index: 5;
  position: fixed;
  left: 0px;
  background-color: ${(props) =>
    props.colors ? props.colors.baseWhite : "#F5F8F7"};
`;

const FinalizingAccount = (props) => {
  //console.log("Phone ", props);
  const history = useHistory();
  const { AUTHConfig, userAuth } = useAppContext();
  Auth.configure(AUTHConfig);
  const { currentUser, state } = useAccountContext();
  const alerts = useToast();

  console.log("FIN ", currentUser);
  //console.log("USE ", useToast);

  //const [confirmCode, setConfirmCode] = useState(false);

  useEffect(() => {
    async function onLoad() {
      const abortController = new AbortController();
      console.log("SIGNUP ", state);
      try {
        /*
        const _currentUser = {
          username: uuid,
          given_name: state.firstName.value,
          client: AUTHConfig.userPoolWebClientId,
          email: state.email.value,
          phone_number: state.regionCode + phoneNumber,
        };
        */
        /*
        const { user } = await Auth.signUp({
          username: currentUser.username,
          password: state.accountPassword.value,
          attributes: {
            email: currentUser.email,
            phone_number: currentUser.phone_number,
            family_name: state.lastName.value,
            given_name: state.firstName.value,
            name: state.username.value,
          },
        });
        console.log(user);
        */
        console.log({
          username: currentUser.username,
          password: state.accountPassword.value,
          attributes: {
            email: currentUser.email,
            phone_number: currentUser.phone_number,
            family_name: state.lastName.value,
            given_name: state.firstName.value,
            name: state.username.value,
          },
        });

        alerts.success("Account created", {
          onClose: () => {
            //console.log("ON CLOSE...");
            //history.replace("/");
          },
        });
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
      <div>Creating account</div>
    </StyledBox>
  );
};

export default FinalizingAccount;
