import React, { useState, useReducer, useRef } from "react";
import { Box, Flex, Button, Image, Text, useTheme } from "@blend-ui/core";
import { Routes, Route, Outlet, useNavigate, useLocation, } from "react-router-dom";

import {
  //ConfirmAuth,
  useTranslate,
  useStore
} from "@prifina-apps/utils";

import config from "../config";
import { useToast, ToastContextProvider } from "@blend-ui/toast";


import AppStudioIcon from "../assets/AppStudioIcon";
import InfinityIcon from "../assets/InfinityIcon";
import PrifinaIcon from "../assets/PrifinaIcon";

import styled from "styled-components";

import shallow from "zustand/shallow";

import { ConfirmAuth, PasswordField, UsernameField } from "@prifina-apps/ui-lib";

const InnerBox = styled(Box)`
  width: 354px;
  height: 118px;
  border: 1px solid #6b6669;
  background: #373436;
  border-radius: 4px;
  padding: 16px;
`;

const LoginContainer = styled(Box)`
  min-width: 534px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 105px;
`;


const ImageFlex = styled(Flex)`
  width: 120px;
  height: 26px;
  align-items: center;
  justify-content: space-between;
`;
/*
<Box
flexGrow={1}
style={{
  background: colors.landingGradient,
  paddingTop: 63,
}}
*/

const Layout = () => {

  const { colors } = useTheme();
  return <>

    <Flex height={"100%"}>
      <Box width={"60%"} style={{
        background: colors.landingGradient,
      }} />
      <Box width={"40%"} style={{
        background: colors.baseTertiary,
      }} >

        <Outlet />
      </Box>
    </Flex>
  </>
}

const SignIn = ({ loginClick, createAccountClick, inputRefs }) => {


  const { colors } = useTheme();
  const { __ } = useTranslate();

  //const { state, setState } = inputVals;
  //const inputRefs = {};
  const [loginDisabled, setLoginDisabled] = useState(true);
  /*
    passwordError.status ||
    usernameError.status ||
    loginFields.username.length < config.usernameLength ||
    loginFields.password.length < config.passwordLength
  */
  const usernameArgs = {
    id: "username",
    name: "username",
    ref: useRef(),
    options: {
      checkExists: false,  // not checking exists here,possible "fishing problem"... sigup will throw error, if exists... 
      toast: false,
      value: "",
      txt: {
        "invalidTxt": "", "usernameError": __("usernameError", { length: config.usernameLength }),
        "usernameError2": __("usernameError2"), "usernameExists": __("usernameExists"),
        "placeholderTxt": __("usernamePlaceholder"), "promptTxt": '\u00a0'  // otherwise text height is 0
      },
    },
    inputState: (input) => {
      console.log("STATE UPDATE USERNAME ", input, input.dataset, inputRefs);
      inputRefs.current = { ...inputRefs.current, [input.id]: input };
      if (loginDisabled && inputRefs.current?.['username']?.dataset['isvalid'] && inputRefs.current?.['password']?.dataset['isvalid']) {
        setLoginDisabled(false);
      }
      //setState({ [input.id]: input.value })
    }
  }

  const passwordArgs = {
    id: "password",
    name: "password",
    ref: useRef(),
    options: {
      addPopup: false,
      checkList: () => [],
      toast: false,
      txt: {
        "invalidTxt": "", "invalidEntry": __("invalidEntry"),
        "passwordQuality": __("passwordQuality"), "placeholderTxt": __("passwordPlaceholder"),
        "promptTxt": '\u00a0'  // otherwise text height is 0
      }
    },
    inputState: (input) => {
      console.log("STATE UPDATE PASSWD", input, input.dataset, inputRefs);
      inputRefs.current = { ...inputRefs.current, [input.id]: input };

      if (loginDisabled && inputRefs.current?.['username']?.dataset['isvalid'] && inputRefs.current?.['password']?.dataset['isvalid']) {
        setLoginDisabled(false);
      }
      //setState({ [input.id]: input.value })
      //style={{ transform: "scale(0.35)" }}
    }
  }

  return <LoginContainer>

    <Box textAlign="start" width="354px">
      <Flex height={40} mb={57} alignItems="center" >
        <AppStudioIcon />
        <Text ml={"10px"} fontWeight="600">
          App Studio
        </Text>
      </Flex>

      <Text mb={4} textStyle="h3">
        Log in to your account
      </Text>
      <Text mb={32}>Welcome back! Please enter your details.</Text>
      <InnerBox mb={32}>
        <ImageFlex mb={16}>
          <PrifinaIcon />
          <InfinityIcon style={{ transform: "scale(0.71)" }} />
          <AppStudioIcon />
        </ImageFlex>
        <Text mb={4}>Already have a Prifina account?</Text>
        <Text fontSize="sm" color={colors.textMuted}>
          Use the same credentials to log in here.
        </Text>
      </InnerBox>

      <Box>
        <Text fontWeight="600" fontSize="sm">
          Username
        </Text>
        <UsernameField autoFocus={true} {...usernameArgs} />
        <Box mt={15}>
          <Text fontWeight="600" fontSize="sm">
            Password
          </Text>
          <PasswordField {...passwordArgs} />
        </Box>
      </Box>
      <Flex mt={77} flexDirection="column" alignItems="center">
        <Button
          width="100%"
          className="LoginButton"
          disabled={loginDisabled}
          onClick={loginClick}
        >
          {__("loginButton")}
        </Button>

        <Flex alignItems="baseline" mt={10}>
          <Text mr={3} fontSize="xs" textAlign="center">
            Don’t have an account?
          </Text>
          <Button
            className="createAccountButton"
            id="createAccountButton"
            color={colors.textLink}
            variation="link"
            onClick={createAccountClick}
          >
            {__("createAccount")}
          </Button>
        </Flex>
      </Flex>

    </Box>

  </LoginContainer>
}

const withToast = () => WrappedComponent => {
  const WithToast = props => {
    return (
      <ToastContextProvider>
        <WrappedComponent {...props} />
      </ToastContextProvider>
    );
  };

  WithToast.displayName = `WithToast(${WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

  return WithToast;
};


const Login = () => {
  const { pathname, search } = useLocation();

  const { __ } = useTranslate();
  const navigate = useNavigate();

  const alerts = useToast();

  //const history = useHistory();

  //search.startsWith("?debug")
  const searchKeys = new URLSearchParams(search);

  const appDebug =
    process.env.REACT_APP_DEBUG === "true" &&
    searchKeys.get("debug") === "true";
  //history.location.search === "?debug=true";
  console.log("APP DEBUG ", appDebug);


  const { getLoginUserIdentityPoolQuery, setAuthConfig, signIn,
    setAuthStatus, setPreferredMFA, confirmSignIn } = useStore(
      state => ({
        getLoginUserIdentityPoolQuery: state.getLoginUserIdentityPoolQuery,
        setAuthConfig: state.setAuthConfig,
        signIn: state.signIn,
        setAuthStatus: state.setAuthStatus,
        setPreferredMFA: state.setPreferredMFA,
        confirmSignIn: state.confirmSignIn
      }),
      shallow,
    );


  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      username: "",
      password: ""
    }
  );

  const inputRefs = {};

  const loginClick = async (e) => {
    console.log("LOGIN ", e);
    console.log("LOGIN ", inputRefs);


    try {
      const username = inputRefs.current.username.value;
      const password = inputRefs.current.password.value;
      setState({ username, password });

      const prifinaUserIdPool = await getLoginUserIdentityPoolQuery(
        username,
        config.cognito.USER_POOL_ID,
      );
      // console.log("ID POOL ", prifinaUserIdPool);

      let userIdPool = config.cognito.USER_IDENTITY_POOL_ID;

      if (prifinaUserIdPool.data.getLoginUserIdentityPool !== "") {
        userIdPool = prifinaUserIdPool.data.getLoginUserIdentityPool;
      }
      const idPoolRegion = userIdPool.split(":")[0];
      setAuthConfig({ identityPoolId: userIdPool, identityPoolRegion: idPoolRegion });

      let user = await signIn(username, password);
      console.log("LOGIN", user);

      localStorage.setItem(
        "LastSessionIdentityPool",
        userIdPool
      );

      if (
        (appDebug && user.preferredMFA === "NOMFA") ||
        (process.env.REACT_APP_STAGE === "dev" &&
          username === "test-user")
      ) {
        setAuthStatus(true);
        //history.replace("/home");
        navigate("/projects", { replace: true });
        //console.log("NAV HOME");
      } else {
        if (user.preferredMFA === "NOMFA") {
          const mfa = await setPreferredMFA("SMS");
          console.log("MFA ", mfa);
          user = await signIn(username, password);
          console.log("LOGIN2", user);
        } else if (user.challengeName === "SMS_MFA") {
        }
        //alerts.info(i18n.__("confirmationCodeSent"), {});
        //setAuthOptions({ user: user, Auth: Auth, setAuth: userAuth });
        //setConfirmCode(true);
        //console.log("NAV CONFIRM...");
        // throw new Error("TESTING");
        alerts.info(__("confirmationCodeSent"), {});
        // check routes below... 
        navigate("/login/confirm-auth")
      }

    } catch (e) {
      console.log("ERR", e);

      if (
        e.code === "NotAuthorizedException" ||
        e.code === "UserNotFoundException"
      ) {
        alerts.error(i18n.__("invalidLogin"), {});
        inputRefs.current.username.focus();
      }

    }

    //navigate("/login", { replace: true })
    e.preventDefault();
  }
  const createAccountClick = (e) => {
    navigate("/register", { replace: true });
    e.preventDefault();
  }
  const backClick = (e) => {
    navigate("/login", { replace: true })
    e.preventDefault();
  }
  const verifyClick = async (code) => {
    console.log("VERIFY ", code);
    try {
      const loggedUser = await confirmSignIn(code);

      console.log("CONFIRM ", loggedUser);
      if (appDebug) {
        const mfa = await setPreferredMFA("NOMFA");
        console.log("MFA ", mfa);
      }
      setAuthStatus(true);
      navigate("/projects", { replace: true });
      return true;
    } catch (e) {
      console.log("ERR", e);
      if (e.code === "CodeMismatchException") {
        // setInputError({ status: true, msg: __("invalidCode") });
        //alerts.error(i18n.__("invalidCode"), {});
        const errorMsg = __("invalidCode");
        if (!alerts.check().some(alert => alert.message === errorMsg))
          alerts.error(errorMsg, {});

      }
      return false
    }
  };

  return <Box width="100vw" height="100vh">
    <ToastContextProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<SignIn inputRefs={inputRefs} createAccountClick={createAccountClick} loginClick={loginClick} />} />
          <Route path="confirm-auth" element={<ConfirmAuth backClick={backClick} verifyClick={verifyClick} />} />

        </Route>

      </Routes>
    </ToastContextProvider>
  </Box>
};

export default withToast()(Login);
//export default Login;

