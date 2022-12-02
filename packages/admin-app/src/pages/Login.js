/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { useRef, useState } from "react";

import {
  Input, Box, Flex, Button, Text, useTheme,
} from "@blend-ui/core";

import styled from "styled-components";

import { useNavigate } from "react-router";
import { useGraphQLContext } from "../lib/GraphQLContext";

import config from "../config";

const StyledBox = styled(Box)`
position: absolute;
top: 0;
bottom: 0;
left: 0;
right: 0;
width:350px;
height:100px;
margin:auto;
`;

const StyledInput = styled(Input)`
height:25px;
margin-right:10px;
width:250px;
`;

const AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.auth_region,
  identityPoolRegion: config.main_region,
  // region: config.main_region,
  authenticationFlowType: "CUSTOM_AUTH",
};

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/*
export default function UnauthenticatedRoute({ children, ...rest }) {
  const { isAuthenticated } = useAppContext();
  const redirect = querystring("redirect");
*/
const Login = () => {
  const { client } = useGraphQLContext();

  const theme = useTheme();
  const navigate = useNavigate();
  // console.log("THEME ", theme);
  // authenticationFlowType
  // console.log("CLIENT ", client);
  const inputs = useRef({});
  const currentUser = useRef({});
  const [step, setStep] = useState(1);
  const [verifyStatus, setVerifyStatus] = useState(true);
  /*
  text: {
    error: {
      color:
*/
  return (
    <StyledBox>
      <Flex justifyItems="center" h="100%">
        <Flex>
          {step === 1
            && (
              <StyledInput
                placeholder="Username"
                ref={ref => {
                  if (ref) {
                    inputs.current.username = ref;
                  }
                }}
              />
            )}
          {step === 2
            && (
              <StyledInput
                placeholder="TOTP Code"
                ref={ref => {
                  if (ref) {
                    inputs.current.answer = ref;
                  }
                }}
              />
            )}
        </Flex>
        <Flex>
          <Button
            size="xs"
            onClick={async () => {
              if (step === 1) {
                // default USER_SRP_AUTH
                client.AUTHconfigure(AUTHConfig);
                currentUser.current = await client.signIn(inputs.current.username.value, null);
                // console.log("LOGIN ", currentUser, newConfig);
                setStep(2);
              }
              if (step === 2) {
                const result = await client.sendCustomChallengeAnswer(currentUser.current, inputs.current.answer.value);
                // console.log("VERIFY ", typeof result.signInUserSession);
                // console.log("VERIFY ", result.signInUserSession === null);
                // signInUserSession!==null verify OK
                if (result.signInUserSession === null) {
                  setVerifyStatus(false);
                } else {
                  // authenticationFlowType is set back to default...
                  const redirect = querystring("redirect");
                  // console.log("REDIRECT ", redirect);
                  navigate(redirect, { replace: true });
                }
              }
            }}
          >
            <>
              {step === 1 && "Login"}
              {step === 2 && "Verify"}
            </>
          </Button>
          {!verifyStatus && <Text pl="20px" m="auto" color={theme.colorStyles.text.error.color}>Invalid TOTP</Text>}
        </Flex>
      </Flex>
    </StyledBox>
  );
};
// color={theme.colorStyles.text.error.color}
export default Login;
