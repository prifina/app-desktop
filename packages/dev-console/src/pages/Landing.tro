import React, { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

import { Box, Flex, Text, Image, useTheme } from "@blend-ui/core";

import { ToastContextProvider } from "@blend-ui/toast";

import Login from "./Login";

import Home from "./Home";

import CreateAccount from "./CreateAccount";

import FinalizingAccount from "../components/FinalizingAccount";

import { useAppContext, i18n } from "@prifina-apps/utils";

import styled from "styled-components";

import appStudioIcon from "../assets/app-studio-icon.svg";

i18n.init();

const SectionContainer = styled(Box)`
  width: 534px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 69px 0px 64px 0px;
  background: ${props => props.background || null};

  // padding-top: 105px;
`;

const Landing = props => {
  console.log("LANDING ", props);

  const { isAuthenticated, mobileApp } = useAppContext();
  const { pathname, search } = useLocation();

  const { colors } = useTheme();

  let initStep = 5;
  // if (pathname === "/login") {
  //   initStep = 5;
  // }
  if (pathname === "/register") {
    initStep = 1;
  } else if (pathname === "/home" && isAuthenticated) {
    initStep = 6;
  }
  const [stepCounter, setStepCounter] = useState(initStep);

  const [accountFields, setAccountFields] = useState({});

  useEffect(() => {
    if (stepCounter !== initStep) {
      setStepCounter(initStep);
    }
    // stepCounter is missing dependency... fix this logic later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initStep]);

  const finalStep = currentUser => {
    setAccountFields(currentUser);
    setStepCounter(7);
  };

  return (
    <React.Fragment>
      <ToastContextProvider>
        {mobileApp && <div>Mobile browser APP</div>}
        {!mobileApp && stepCounter === 6 && isAuthenticated && <Home />}
        {!mobileApp && stepCounter !== 6 && (
          <>
            {stepCounter === 7 && (
              <FinalizingAccount currentUser={accountFields} />
            )}

            {stepCounter !== 7 && (
              <>
                {stepCounter === 0 && <NotFoundPage />}
                {stepCounter === 1 && !isAuthenticated && (
                  <Flex width="100vw" height="100vh">
                    <Flex
                      flexGrow={1}
                      style={{
                        background: colors.landingGradient,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />

                    <SectionContainer background={colors.baseTertiary}>
                      <Box textAlign="start" width="354px">
                        {stepCounter !== 7 && (
                          <Flex mb={48} alignSelf="flex-start">
                            <Image src={appStudioIcon} width="25px" />
                            <Text ml={3} fontWeight="600">
                              Prifina
                            </Text>
                          </Flex>
                        )}
                        <CreateAccount finalStep={finalStep} />
                      </Box>
                    </SectionContainer>
                  </Flex>
                )}
                {/* {stepCounter === 5 && <Login />} */}
              </>
            )}
          </>
        )}
      </ToastContextProvider>
    </React.Fragment>
  );
};

export default Landing;
