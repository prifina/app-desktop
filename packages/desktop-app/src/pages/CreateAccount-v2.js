import React, { useEffect, useReducer, useRef, useState } from "react";

import {
  Box, Button, Flex, Input, Text
} from "@blend-ui/core";

import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

//import { Routes, Route, Outlet, useNavigate, useLocation, useParams, } from "react-router-dom";

import {
  SimpleProgress, EmailVerification, PhoneVerification, TermsOfUse, FinalizingAccount,
  UsernameField, PasswordField, EmailField, PhoneNumberField, useComponentFlagList
} from "@prifina-apps/ui-lib";

import { useStore, useTranslate } from "@prifina-apps/utils";

//import { useStore } from "../utils-v2/stores/PrifinaStore";

//import { useStore } from "../stores/PrifinaStore";
import shallow from 'zustand/shallow';

import { ToastContextProvider, useToast } from "@blend-ui/toast";

/*
import EmailVerification from "./EmailVerification-v2";
import PhoneVerification from "./PhoneVerification-v2";
import TermsOfUse from "./TermsOfUse-v2";
import FinalizingAccount from "./FinalizingAccount-v2";
import UsernameField from "../components/UsernameField";
import PasswordField from "../components/PasswordField-v2";
import EmailField from "../components/EmailField";
import PhoneNumberField from "../components/PhoneNumberField-v2";
*/

import styled from "styled-components";
import config from "../config";

//import useComponentFlagList from "../hooks/UseComponentFlagList";

import Landing from "../components/Landing";


import { v4 as uuidv4 } from "uuid";

import PropTypes from "prop-types";



const UUID = uuidv4();

const RegisterContainer = styled(Box)`
//border-radius:20px;
//width:421px;
width:100%;
min-height:437px;
background-color:${props => props.theme.colors.baseWhite};
padding-left:29px;
padding-right:28px;
padding-bottom:15px;
//margin-top:20px;
padding-top:20px;
`;

const StyledSimpleProgress = styled(SimpleProgress)`
  .tracker li {
    background: #eaebeb;
    border-radius: 20px;
    border: 0;
    padding: 2px;
  }

  .tracker li.is-active {
    background: #1fb2a6;
  }

  .tracker li.is-ready {
    background: #0d776e;
    height: 1px;
  }
`;



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


const Layout = () => {
  //const activeIndex = useStore(state => state.activeIndex);
  /*
  args: {
    steps: 3,
    active: 0,
    variation: "tracker",
    w: "700px"
  }
*/
  const { pathname, search } = useLocation();
  const { __ } = useTranslate();

  console.log("REGISTER PATH", pathname);
  let activeIndex = 0
  switch (pathname) {
    case "/register/terms-of-use":
      activeIndex = 1;
      break;
    case "/register/email-verification":
      activeIndex = 2;
      break;
    case "/register/phone-verification":
      activeIndex = 3;
      break;
    case "/register/final":
      activeIndex = 4;
      break;
    default:
      activeIndex = 0;
  }

  return <Landing style={{ height: "100vh" }}>
    <Box textAlign="center">
      <Text textStyle={"h3"} bold>
        {__("createAccountTitle")}
      </Text>
    </Box>
    <Box mt={5}>
      <StyledSimpleProgress variation="tracker" steps={5} w={"62px"} active={activeIndex} />
    </Box>

    <Outlet />

  </Landing>
}

const Register = ({ nextLink, loginLink, inputRefs, inputVals }) => {

  console.log(inputVals);
  const { __ } = useTranslate();

  const [nextDisabled, setNextDisabled] = useState(false);
  const { state, setState } = inputVals;
  //const inputRefs = {};


  const [stateCheck, setStateCheck] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      username: true,
      password: true,
      passwordConfirm: true,
      email: true,
      phoneNumber: true
    }
  );
  const { selectOptions, flagsLoading } = useComponentFlagList();

  const [defaultRegion, setDefaultRegion] = useState("");

  const [dataReady, setDataReady] = useState(false);

  // if more async data needs to be fetched, then this is the place for it.... 
  useEffect(() => {
    if (!flagsLoading) {
      console.log("FLAGS ", state.countryCode, selectOptions);

      const cIndex = selectOptions.findIndex(
        c => c.regionCode === state.countryCode,
      );
      if (cIndex > -1) {
        // console.log("FOUND COUNTRY ", cIndex);
        const defaultOption = selectOptions[cIndex].key;
        // console.log("FOUND COUNTRY ", cIndex, defaultOption);
        setDefaultRegion(defaultOption);
      }

      setDataReady(true);
    }
  }, [flagsLoading])

  const usernameArgs = {
    id: "username",
    name: "username",
    ref: useRef(),
    options: {
      checkExists: true,
      toast: false,
      value: "",
      txt: {
        "invalidTxt": '\u00a0', "usernameError": __("usernameError", { length: config.usernameLength }),
        "usernameError2": __("usernameError2"), "usernameExists": __("usernameExists"),
        "placeholderTxt": __("usernamePlaceholder"), "promptTxt": '\u00a0'  // otherwise text height is 0
      },
    },
    inputState: (input, validation = false) => {
      console.log("USERNAME STATE UPDATE", input);
      console.log("USERNAME STATE UPDATE", input?.dataset);
      console.log("USER", inputRefs?.username);
      if (typeof input !== 'undefined') {
        if (inputRefs?.username === undefined) {
          //console.log("SET INPUT REF ", input.id)
          inputRefs[input.id] = input
        }

        if (validation) {
          // console.log("USER2 ", inputRefs?.username.value);
          if (inputRefs['username'].value.length < config.usernameLength) {
            // console.log("USER3 ", inputRefs?.username.value.length);
            setStateCheck({ username: false })
            return false;
          } else {
            setStateCheck({ username: true })
            return true;
          }
        } else {
          setStateCheck({ username: input.dataset['isvalid'] })

        }
        console.log("INPUT REF ", inputRefs)
      } else {
        setStateCheck({ username: false })
      }
    }
  }

  const getPasswordCheckList = () => {
    //[inputRefs?.['firstName']?.value, inputRefs?.['lastName']?.value, usernameArgs.ref?.current?.value],
    console.log("CHECK LIST ", inputRefs, usernameArgs.ref);
    const passwordChecklist = [];
    if (usernameArgs.ref?.current) {
      if (inputRefs['firstName'].value.length > 0) {
        passwordChecklist.push(inputRefs['firstName'].value);
      }
      if (inputRefs['lastName'].value.length > 0) {
        passwordChecklist.push(inputRefs['lastName'].value);
      }
      passwordChecklist.push(usernameArgs.ref.current.value)
    }
    return passwordChecklist;
  }

  const passwordArgs = {
    id: "password",
    name: "password",
    ref: useRef(),
    options: {
      addPopup: true,
      checkList: getPasswordCheckList,
      toast: false,
      txt: {
        "invalidTxt": __("invalidPassword"), "invalidEntry": __("invalidEntry"),
        "passwordQuality": __("passwordQuality"), "placeholderTxt": __("passwordPlaceholder"),
        "promptTxt": '\u00a0'  // otherwise text height is 0
      }
    },
    inputState: (input, validation = false) => {
      console.log("PASSWD STATE UPDATE ", input);
      console.log(input?.value);
      console.log(input?.dataset);
      console.log(inputRefs, inputRefs?.password);
      if (typeof input !== 'undefined') {

        if (inputRefs?.password === undefined) {
          inputRefs[input.id] = input
        }
        if (validation) {
          let checks = { password: true, passwordConfirm: true };
          if (typeof input === 'undefined') {
            checks["password"] = false;
            return false;
          } else if (inputRefs?.passwordConfirm === undefined) {
            checks["password"] = false
            checks["passwordConfirm"] = false;
            return false;
          }

          setStateCheck(checks)
          return checks.password && checks.passwordConfirm;
        }
      } else {
        setStateCheck({ password: false })
      }

    }
  }

  const getAccountPassword = () => {
    //passwordArgs.ref, // note, this is useRef() variable... 
    if (passwordArgs.ref?.current) {

      return passwordArgs.ref.current.value;
    } else {
      return "";
    }
  }
  const configpasswordArgs = {
    id: "passwordConfirm",
    name: "passwordConfirm",
    ref: useRef(),
    options: {
      addPopup: false,
      checkList: () => [],
      accountPassword: getAccountPassword,
      toast: false,
      txt: {
        "invalidTxt": '\u00a0', "invalidEntry": __("invalidPassword"),
        "placeholderTxt": __("confirmPlaceholder"),
        "promptTxt": '\u00a0'  // otherwise text height is 0
      }
    },
    inputState: (input) => {
      console.log("STATE UPDATE", input, input.dataset);
      if (inputRefs?.passwordConfirm === undefined) {
        //console.log("UNDEF ");
        inputRefs[input.id] = input
      }
    }
  }

  const emailArgs = {
    id: "email",
    name: "email",
    ref: useRef(),
    options: {
      checkExists: true,
      toast: false,
      value: "",
      txt: { "invalidTxt": __("invalidEmail"), "placeholderTxt": __("emailPlaceholder"), "promptTxt": __("emailPrompt") }
    },
    inputState: (input, validation = false) => {
      // console.log("STATE UPDATE", input, input.dataset);
      console.log("EMAIL STATE UPDATE ", input);
      console.log(input?.value);
      console.log(input?.dataset);
      console.log(inputRefs, inputRefs?.email);
      if (typeof input !== 'undefined') {

        if (inputRefs?.email === undefined) {
          inputRefs[input.id] = input
        }
        if (validation) {
          setStateCheck({ email: input.dataset['isvalid'] })
          return input.dataset['isvalid']
        }
      } else {
        setStateCheck({ email: false })
      }
    }
  }

  const phoneArgs = {
    id: "phoneNumber",
    name: "phoneNumber",
    ref: useRef(),
    selectOptions: selectOptions,
    options: {
      defaultRegion: defaultRegion,
      searchLength: 3,
      showList: true,
      selectOption: "key",
      value: defaultRegion,
      checkExists: true,
      toast: false,
      txt: { "invalidTxt": __("invalidPhoneNumber"), "placeholderTxt": __("phoneNumberPlaceholder"), "promptTxt": __("phonePrompt") }

    },
    inputState: (input, validation = false) => {
      console.log("PHONE STATE UPDATE ", input);
      console.log(input?.nationalNumber);
      // console.log(input?.dataset);
      console.log(inputRefs, inputRefs?.phoneNumber);
      if (typeof input !== 'undefined' && input?.nationalNumber) {

        if (inputRefs?.phoneNumber === undefined) {
          //console.log("HAVE NUMBER ", input?.nationalNumber)
          inputRefs['phoneNumber'] = input
        }
        if (validation) {
          //console.log("VALIDATION ", input['nationalNumber'] !== null && input?.['nationalNumber'] && input['nationalNumber'] !== "")
          setStateCheck({ phoneNumber: input['nationalNumber'] !== null && input?.['nationalNumber'] && input['nationalNumber'] !== "" })
          return input['nationalNumber'] !== null && input?.['nationalNumber'] && input['nationalNumber'] !== ""
        }
      } else {
        setStateCheck({ phoneNumber: false })
      }
    }
  }

  const nextClick = (e) => {

    console.log("NEXT ", e);
    console.log("INPUTS ", inputRefs);
    let validationResult = true;


    if (inputRefs?.['username']?.value === undefined || inputRefs['username'].value.length < config.usernameLength) {
      //console.log("USERNAME FAILED ");
      validationResult = usernameArgs.inputState(inputRefs['username'], true);
    }

    if ((inputRefs?.['password']?.value === undefined || inputRefs?.['passwordConfirm']?.value === undefined) || (inputRefs['password'].value !== inputRefs['passwordConfirm'].value)) {
      //console.log("PASSWORD CONFIRM FAILED ");
      validationResult = passwordArgs.inputState(inputRefs['password'], true) ? true : validationResult;
    }


    validationResult = emailArgs.inputState(inputRefs['email'], true) ? true : validationResult;
    validationResult = phoneArgs.inputState(inputRefs['phoneNumber'], true) ? true : validationResult;


    //console.log("VALIDATION RESULT ", validationResult);
    if (validationResult) {
      nextLink(e, inputRefs);
    } else {
      //setNextDisabled(true);
    }
    e.preventDefault();

  }
  return <>
    {!dataReady && <div />}
    {dataReady && <RegisterContainer>
      {/* 
      <Box textAlign="center">
        <Text textStyle={"h3"} bold>
          {__("createAccountTitle")}
        </Text>
      </Box>
*/}
      <Box mt={40} display="inline-flex">
        <Flex width={"168px"}>
          <Input
            autoFocus={true}
            placeholder={__("firstNamePlaceholder")}
            id={"firstName"}
            name={"firstName"}
            ref={(ref) => {
              if (ref) {
                inputRefs[ref.id] = ref;
              }
            }}

            defaultValue={state.firstName}
            tabIndex="0"
          />
        </Flex>
        <Flex ml={25} width={"168px"}>
          <Input
            placeholder={__("lastNamePlaceholder")}
            id={"lastName"}
            name={"lastName"}
            ref={(ref) => {
              if (ref) {
                inputRefs[ref.id] = ref;
              }
            }}

            defaultValue={state.lastName}
            tabIndex="1"
          />
        </Flex>
      </Box>

      <Box mt={28}>
        <UsernameField initState={stateCheck.username} {...usernameArgs} />
      </Box>

      <Box mt={28}>
        <PasswordField initState={stateCheck.password} {...passwordArgs} />
      </Box>
      <Box mt={28}>
        <PasswordField initState={stateCheck.comparePassword} {...configpasswordArgs} />
      </Box>

      <Box mt={28}>
        <EmailField initState={stateCheck.email} {...emailArgs} />
      </Box>


      <Box mt={28}>
        <Box style={{ width: "96%" }}>
          <PhoneNumberField initState={stateCheck.phoneNumber} {...phoneArgs} />
        </Box>
      </Box>


      <Box mt={66} textAlign={"center"}>
        <Button
          id="nextButton"
          disabled={nextDisabled}
          onClick={nextClick}
        >
          {__("nextButton")}
        </Button>
        <Box mt={10}>
          <Box display={"inline-flex"}>
            <Flex alignItems={"center"}>
              <Text textStyle={"caption2"} mr={5}>
                {__("existingAccount")}
              </Text>
              <Button
                className="loginLinkButton"
                id="loginLinkButton"
                variation={"link"}
                fontSize={"10px"}
                lineHeight={"normal"}
                onClick={loginLink}
              >
                {__("loginLink")}
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </RegisterContainer>
    }
  </>
}

Register.displayName = "Register";

Register.propTypes = {
  loginLink: PropTypes.func.isRequired,
  nextLink: PropTypes.func.isRequired,
  inputVals: PropTypes.object.isRequired,
  inputRefs: PropTypes.object.isRequired

};

const CreateAccount = () => {

  const alerts = useToast();
  const navigate = useNavigate();

  const { __ } = useTranslate();
  const { getCountryCodeQuery, resendCode, getVerificationQuery } = useStore((state) => ({ getCountryCodeQuery: state.getCountryCodeQuery, getVerificationQuery: state.getVerificationQuery, resendCode: state.resendCode }),
    shallow
  );

  /*
  {
    username: currentUser.uuid,
    password: currentUser.accountPassword.value,
    attributes: {
      email: currentUser.emailVerified,
      phone_number: '+' + currentUser.phoneVerified.replace(/\D/g, ''),  // cognito doesn't accept formatted phone numbers
      family_name: currentUser.lastName.value,
      given_name: currentUser.firstName.value,
      name: currentUser.username.value,
    },
  };
  */

  /*
    const userCountry = await getCountryCodeQuery(API);
    console.log("COUNTRY ", userCountry.data.getCountryCode);
    if (userCountry.data) {
      const cIndex = selectOptions.current.findIndex(
        c => c.regionCode === userCountry.data.getCountryCode,
      );
      if (cIndex > -1) {
        setState({ regionCode: selectOptions.current[cIndex].key });
      }
    }
  */

  const inputRefs = {};
  const currentUser = useRef();

  //const effectCalled = useRef(false);
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      username: "",
      password: "",
      emailVerified: "",
      phoneVerified: "",
      lastName: "",
      firstName: "",
      preferred_username: "",
      countryCode: ""
    }
  );

  useEffect(() => {
    async function getCountryCode() {
      const countryCode = await getCountryCodeQuery();
      if (countryCode.data.getCountryCode !== null && countryCode.data?.getCountryCode) {
        setState({ countryCode: countryCode.data.getCountryCode });
      }
    }
    getCountryCode();
  }, []);
  const loginLink = (e) => {
    console.log("LOGIN ", e);
    navigate("/login", { replace: true })
    e.preventDefault();
  }

  const declineTerms = (e) => {
    navigate("/register", { replace: true });
    e.preventDefault();
  }

  const approveTerms = (e) => {
    navigate("/register/email-verification", { replace: true });
    e.preventDefault();
  }
  const verifyEmailClick = (code) => {
    getVerificationQuery(UUID, "email", code).then(verified => {
      if (verified) {
        navigate("/register/phone-verification", { replace: true });
      }
    });
  }
  const verifyPhoneClick = (code) => {
    getVerificationQuery(UUID, "phone", code).then(verified => {
      if (verified) {
        navigate("/register/final", { replace: true });
      }
    });
  }
  const resendEmailClick = (e) => {
    resendCode("email").then(res => {
      alerts.info(__("emailVerificatioSent"), {});
    });
    e.preventDefault();
  }

  const resendPhoneClick = (e) => {
    resendCode("phone").then(res => {
      alerts.info(__("phoneVerificatioSent"), {});
    });
    e.preventDefault();
  }
  const backClick = (e) => {
    navigate("/register", { replace: true });
    e.preventDefault();
  }
  const nextClick = (e, inputs) => {
    console.log("NEXT OK ", inputs);
    currentUser.current = {
      username: inputs.username.value,
      password: inputs.password.value,
      attributes: {
        email: inputs.email.value,
        phone_number: '+' + inputs.phoneNumber.number.replace(/\D/g, ''),  // cognito doesn't accept formatted phone numbers
        family_name: inputs.lastName.value,
        given_name: inputs.firstName.value,
        name: UUID
      },
    };
    navigate("/register/terms-of-use", { replace: true });
    e.preventDefault();
  }

  return <>
    <ToastContextProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Register inputRefs={inputRefs} nextLink={nextClick} loginLink={loginLink} inputVals={{ state, setState }} />} />
          <Route path="terms-of-use" element={<TermsOfUse declineTerms={declineTerms} approveTerms={approveTerms} />} />
          <Route path="email-verification" element={<EmailVerification resendClick={resendEmailClick} verifyClick={verifyEmailClick} backClick={backClick} invalidLink={config.invalidVerificationLink} />} />
          <Route path="phone-verification" element={<PhoneVerification resendClick={resendPhoneClick} verifyClick={verifyPhoneClick} backClick={backClick} invalidLink={config.invalidVerificationLink} />} />
          <Route path="final" element={<FinalizingAccount currentUser={currentUser.current} />} />

        </Route>

      </Routes>
    </ToastContextProvider>
  </>
}

CreateAccount.displayName = "CreateAccount";

// so that this Component can use "toasts..."
export default withToast()(CreateAccount);
//export default CreateAccount;