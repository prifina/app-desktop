import React, { useEffect, useRef } from "react";

import styled from "styled-components";

import { Box, Text, Flex } from "@blend-ui/core";

import { useNavigate } from "react-router";
import { useToast } from "@blend-ui/toast";
import { DotLoader } from "@blend-ui/progress";

import { useTranslate, } from "@prifina-apps/utils";
//import { useStore } from "../stores/PrifinaStore";

import shallow from 'zustand/shallow';
import { useStore } from "../utils-v2/stores/PrifinaStore";
import PropTypes from "prop-types";


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

  const navigate = useNavigate();

  const alerts = useToast();
  const { __ } = useTranslate();

  const { signUp } = useStore((state) => ({ signUp: state.signUp }),
    shallow
  );

  const effectCalled = useRef(false);
  console.log("FIN ", currentUser);

  useEffect(() => {
    async function onLoad() {
      const abortController = new AbortController();
      effectCalled.current = true;
      try {

        console.log("Creating... ", currentUser);
        const user = await signUp(currentUser);
        console.log("CREATED ", user);
        // true,... if all goes ok... 
        navigate("/login", { replace: true })
      } catch (e) {
        console.log("ERR ", e);
        if (e.code === "AuthError" || e.code === "UsernameExistsException") {
          alerts.error(__("usernameExists"), {});
        }
      }
      return () => {
        abortController.abort();
      };
    }
    if (!effectCalled.current) {
      onLoad();
    }
  }, []);

  return (
    <StyledBox>
      <LoaderBox>
        <Text as={"h1"} textAlign={"center"}>
          {__("finalizeText")}
        </Text>
        <Flex justifyContent={"center"} mt={131}>
          <DotLoader />
        </Flex>
      </LoaderBox>
    </StyledBox>
  );
};

FinalizingAccount.propTypes = {
  currentUser: PropTypes.instanceOf(Object).isRequired,
};
export default FinalizingAccount;
