import React, { useEffect, useReducer, useRef, useState } from "react";

import {
  Box, Button, Flex, Input, Text, useTheme
} from "@blend-ui/core";

import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

//import { Routes, Route, Outlet, useNavigate, useLocation, useParams, } from "react-router-dom";

import { useTranslate, useStore } from "@prifina-apps/utils";

import shallow from 'zustand/shallow';

import { ToastContextProvider, useToast } from "@blend-ui/toast";

import {
  SimpleProgress, EmailVerification, PhoneVerification, TermsOfUse,
  FinalizingAccount, UsernameField, PasswordField, EmailField, PhoneNumberField, Landing, useComponentFlagList
} from "@prifina-apps/ui-lib";


import styled from "styled-components";
import config from "../config";

import PrifinaIcon from "../assets/PrifinaIcon";

import { v4 as uuidv4 } from "uuid";

//import RegisterRole from "./RegisterRole";
import PropTypes from "prop-types";



const UUID = uuidv4();

export const RegisterContainer = styled(Box)`
//border-radius:20px;
//width:421px;
width:100%;
min-height:437px;
background-color:${props => props.theme.colors.baseTertiary};
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

  const { pathname, search } = useLocation();
  const { __ } = useTranslate();
  const { colors } = useTheme();

  console.log("REGISTER PATH", pathname);
  let activeIndex = 0
  switch (pathname) {
    case "/register/terms-of-use":
      activeIndex = 1;
      break;
    case "/register/email-and-phone":
      activeIndex = 2;
      break;
    case "/register/email-verification":
      activeIndex = 3;
      break;
    case "/register/phone-verification":
      activeIndex = 4;
      break;
    case "/register/role":
      activeIndex = 0;
      break;
    case "/register/role/terms-of-use":
      activeIndex = 1;
      break;
    case "/register/final":
      activeIndex = 2;
      break;
    default:
      activeIndex = 0;
  }

  //colors.landingGradient,
  //colors.baseWhite
  //colors.baseTertiary,

  let subtitles = [];
  if (pathname.indexOf('role') === -1) {
    subtitles = [
      "1. Account information",
      "2. Prifina terms of use",
      "3. Set up two-factor authentication",
      "4. Verify your email address",
      "5. Verify your phone number",
      "6. Finalizing",
    ];
  } else {
    subtitles = [
      "1. " + __("accountDetails"),
      "2. " + __("developerAgreement"),
      "3. Finalizing", // not called.... 
    ]
  }


  return <Landing style={{ height: "100vh" }} leftBackgroundColor={colors.landingGradient} rightBackgroundColor={colors.baseTertiary}>

    <Flex height={40} mb={57} alignItems="center" >
      <PrifinaIcon />
      <Text ml={"10px"} fontWeight="600">
        Prifina
      </Text>
    </Flex>


    <Box >
      <Text textStyle={"h3"} bold>
        {__("createAccountTitle")}
      </Text>
    </Box>
    <Box mt={5}>
      <StyledSimpleProgress variation="tracker" steps={subtitles.length} w={"62px"} active={activeIndex} />
    </Box>
    <Box mt={38}>
      <Text fontWeight="600" fontSize="lgx">
        {subtitles[activeIndex]}
      </Text>
    </Box>
    <Outlet />

  </Landing>
}

const Register = ({ backGroundColor, nextLink, loginLink, inputRefs, inputVals }) => {

  console.log(inputVals);
  const { __ } = useTranslate();

  const [nextDisabled, setNextDisabled] = useState(false);
  const { state, setState } = inputVals;
  //const inputRefs = {};


  const [stateCheck, setStateCheck] = useReducer(
    (check, newCheck) => ({ ...check, ...newCheck }),
    {
      username: true,
      password: true,
      passwordConfirm: true,
    }
  );


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
          setStateCheck({ username: (input.dataset['isvalid'] === "true") })

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
    backGroundColor: backGroundColor,
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




    //console.log("VALIDATION RESULT ", validationResult);
    if (validationResult) {
      nextLink(e, inputRefs);
    } else {
      //setNextDisabled(true);
    }
    e.preventDefault();

  }

  //  console.log("STATE CHECK ", stateCheck);

  return <>

    <RegisterContainer>

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

  </>
}

Register.displayName = "Register";

Register.propTypes = {

  backGroundColor: PropTypes.string,
  loginLink: PropTypes.func.isRequired,
  nextLink: PropTypes.func.isRequired,
  inputVals: PropTypes.object.isRequired,
  inputRefs: PropTypes.object.isRequired

};


const RegisterEmailPhone = ({ appDebug, nextLink, loginLink, inputRefs, inputVals }) => {

  console.log(inputVals);
  const { __ } = useTranslate();

  const [nextDisabled, setNextDisabled] = useState(false);
  const { state, setState } = inputVals;
  //const inputRefs = {};


  const [stateCheck, setStateCheck] = useReducer(
    (check, newCheck) => ({ ...check, ...newCheck }),
    {
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
          setStateCheck({ email: (input.dataset['isvalid'] === "true") })
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
      checkExists: appDebug ? false : true,
      toast: false,
      txt: { "invalidTxt": __("invalidPhoneNumber"), "placeholderTxt": __("phoneNumberPlaceholder"), "promptTxt": __("phonePrompt") }

    },
    inputState: (input, validation = false) => {
      console.log("PHONE STATE UPDATE ", input);
      console.log(input?.nationalNumber);
      // console.log(input?.dataset);
      console.log(inputRefs, inputRefs?.phoneNumber);
      if (typeof input !== 'undefined' && input?.nationalNumber) {

        if (inputRefs?.phoneNumber === undefined || inputRefs.phoneNumber.number !== input.number) {
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


      <Box mt={28}>
        <Box style={{ width: "96%" }}>
          <PhoneNumberField initState={stateCheck.phoneNumber} {...phoneArgs} />
        </Box>
      </Box>


      <Box mt={28}>
        <EmailField initState={stateCheck.email} {...emailArgs} />
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

RegisterEmailPhone.displayName = "RegisterEmailPhone";

RegisterEmailPhone.propTypes = {
  appDebug: PropTypes.bool,
  loginLink: PropTypes.func.isRequired,
  nextLink: PropTypes.func.isRequired,
  inputVals: PropTypes.object.isRequired,
  inputRefs: PropTypes.object.isRequired

};

const CreateAccount = () => {


  const { pathname, search } = useLocation();


  const searchKeys = new URLSearchParams(search);

  //console.log("START ", search);

  const appDebug = useRef(process.env.REACT_APP_DEBUG === "true" && searchKeys.get("debug") === "true");
  //history.location.search === "?debug=true";

  console.log("APP DEBUG ", appDebug);


  const alerts = useToast();
  const navigate = useNavigate();
  const { colors, borders } = useTheme();

  console.log("THEME ", colors, borders);
  const { __ } = useTranslate();
  const { isLoggedIn, getCountryCodeQuery, resendCode, getVerificationQuery, addUserToCognitoGroupMutation, getActiveUser } = useStore((state) => ({ isLoggedIn: state.isLoggedIn, getCountryCodeQuery: state.getCountryCodeQuery, getVerificationQuery: state.getVerificationQuery, resendCode: state.resendCode, addUserToCognitoGroupMutation: state.addUserToCognitoGroupMutation, getActiveUser: state.getActiveUser }),
    shallow
  );

  const termsLastUpdated = __("devTermsLastUpdated");
  const texts = [
    {
      title: __("relationshipTitle"),
      text: __("relationshipText"),
    },

    {
      title: __("developerBenefitsTitle"),
      text: __("developerBenefitsText"),
    },
    {
      title: __("restrictionsTitle"),
      text: __("restrictionsText"),
    },
    {
      title: __("confidentialityTitle"),
      text: __("confidentialityText"),
    },
    {
      title: __("nondisclosureTitle"),
      text: __("nondisclosureText"),
    },
    {
      title: __("confidentialTitle"),
      text: __("confidentialText"),
    },
    {
      title: __("developerContentLicenseTitle"),
      text: __("developerContentLicenseText"),
    },
    {
      title: __("developerTechnicalSupportTitle"),
      text: __("developerTechnicalSupportText"),
    },
    { text: __("developerTechnicalSupportText2") },
    { text: __("developerTechnicalSupportText3") },
    {
      title: __("amendmentsTitle"),
      text: __("amendmentsText"),
    },
    {
      title: __("devTerminationTitle"),
      text: __("devTerminationText"),
    },
    {
      title: __("independentDevelopmentTitle"),
      text: __("independentDevelopmentText"),
    },
    {
      title: __("useOfTrademarksTitle"),
      text: __("useOfTrademarksText"),
    },
    {
      title: __("devNoWarrantyTitle"),
      text: __("devNoWarrantyText"),
    },
    { text: __("devNoWarrantyText2") },

    {
      title: __("devDisclaimerOfLiabilityTitle"),
      text: __("devDisclaimerOfLiabilityText"),
    },
    {
      title: __("devThirdPartyTitle"),
      text: __("devThirdPartyText"),
    },
    {
      title: __("exportControlTitle"),
      text: __("exportControlText"),
    },
    {
      title: __("devGoverningLawTitle"),
      text: __("devGoverningLawText"),
    },
    {
      title: __("devMiscellaneousTitle"),
      text: __("devMiscellaneousText"),
    },
  ];

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
  const currentUser = useRef({});
  const activeUser = useRef({});

  const effectCalled = useRef(false);


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

  const [ready, setReady] = useState(false);
  useEffect(() => {
    //getActiveUser
    async function getCountryCode() {
      effectCalled.current = true;
      await isLoggedIn();
      activeUser.current = getActiveUser();
      //console.log("ACTIVE USER3 ", activeUser);

      const countryCode = await getCountryCodeQuery();
      if (countryCode.data.getCountryCode !== null && countryCode.data?.getCountryCode) {
        setState({ countryCode: countryCode.data.getCountryCode });
      }
      setReady(true);
    }
    if (!effectCalled.current) {
      getCountryCode();
    }
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
    navigate("/register/email-and-phone", { replace: true });
    // navigate("/register/email-verification", { replace: true });
    e.preventDefault();
  }

  const declineRoleTerms = (e) => {
    navigate("/register/role", { replace: true });
    e.preventDefault();
  }

  const approveRoleTerms = (e) => {
    // add user to group....

    //addUserToCognitoGroupMutation(GRAPHQL, prifinaID, newGroup)
    //console.log("ACTIVE USER2 ", activeUser);
    addUserToCognitoGroupMutation(activeUser.current.uuid, "DEV").then(() => {
      navigate("/projects", { replace: true });
    });

    // navigate("/register/email-verification", { replace: true });
    e.preventDefault();
  }

  const verifyEmailClick = (code) => {
    console.log("VERIFY ", appDebug.current, code)
    if (appDebug.current && code === "123456") {
      navigate("/register/phone-verification", { replace: true });
    } else {
      getVerificationQuery(UUID, "email", code).then(verified => {
        if (verified) {
          navigate("/register/phone-verification", { replace: true });
        }
      });
    }
  }
  const verifyPhoneClick = (code) => {
    if (appDebug.current && code === "123456") {
      navigate("/register/final", { replace: true });
    } else {
      getVerificationQuery(UUID, "phone", code).then(verified => {
        if (verified) {
          navigate("/register/final", { replace: true });
        }
      });
    }
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
        email: "",
        phone_number: "",
        family_name: inputs.lastName.value,
        given_name: inputs.firstName.value,
        name: UUID
      },
    };
    navigate("/register/terms-of-use", { replace: true });
    e.preventDefault();
  }

  const nextVerificationsClick = (e, inputs) => {
    console.log("NEXT VERIFICATIONS USER", currentUser.current);
    console.log("NEXT VERIFICATIONS INPUTS ", inputs);
    console.log("NEXT VERIFICATIONS EMAIL ", inputs.email.value);
    console.log("NEXT VERIFICATIONS PHONE ", inputs.phoneNumber);
    currentUser.current.attributes.email = inputs.email.value;
    currentUser.current.attributes.phone_number = '+' + inputs.phoneNumber.number.replace(/\D/g, ''),  // cognito doesn't accept formatted phone numbers

      navigate("/register/email-verification", { replace: true });

    e.preventDefault();
  }


  //const backGroundColor = colors.baseWhite;
  const backGroundColor = colors.baseTertiary;
  return <>
    {ready &&
      <ToastContextProvider>
        <Routes>
          <Route element={<Layout />}>
            {pathname.indexOf("role") === -1 && <>
              <Route index element={<Register backGroundColor={backGroundColor} inputRefs={inputRefs} nextLink={nextClick} loginLink={loginLink} inputVals={{ state, setState }} />} />

              <Route path="terms-of-use" element={<TermsOfUse texts={texts} backGroundColor={backGroundColor} termsLastUpdated={termsLastUpdated} declineTerms={declineTerms} approveTerms={approveTerms} />} />

              <Route path="email-and-phone" element={<RegisterEmailPhone appDebug={appDebug.current} inputRefs={inputRefs} nextLink={nextVerificationsClick} loginLink={loginLink} inputVals={{ state, setState }} />} />
              <Route path="email-verification" element={<EmailVerification resendClick={resendEmailClick} verifyClick={verifyEmailClick} backClick={backClick} invalidLink={config.invalidVerificationLink} />} />
              <Route path="phone-verification" element={<PhoneVerification resendClick={resendPhoneClick} verifyClick={verifyPhoneClick} backClick={backClick} invalidLink={config.invalidVerificationLink} />} />
              <Route path="final" element={<FinalizingAccount currentUser={currentUser.current} />} />

            </>}

            {pathname.indexOf("role") > -1 && <>
              <Route index element={<RegisterRole activeUser={activeUser.current} />} />
              <Route path="terms-of-use" element={<TermsOfUse texts={texts} backGroundColor={backGroundColor} termsLastUpdated={termsLastUpdated} declineTerms={declineRoleTerms} approveTerms={approveRoleTerms} />} />
            </>}


          </Route>

        </Routes>
      </ToastContextProvider>
    }
  </>
}

CreateAccount.displayName = "CreateAccount";

// so that this Component can use "toasts..."
export default withToast()(CreateAccount);
//export default CreateAccount;