import React, { useState, useReducer, useEffect, useRef } from "react";

import {
  Button,
  Input,
  Box,
  Flex,
  Text,
  useTheme,
  Divider,
} from "@blend-ui/core";

import { Routes, Route, Outlet, useNavigate, useLocation, useParams, } from "react-router-dom";

//import { Routes, Route, Outlet, useNavigate, useLocation, useParams, } from "react-router-dom";

import { useTranslate, SimpleProgress } from "@prifina-apps/utils";
import { useStore } from "../stores/PrifinaStore";
import shallow from 'zustand/shallow'

import { useToast } from "@blend-ui/toast";

import TermsOfUse from "./TermsOfUse-v2";
import EmailVerification from "./EmailVerification-v2";
import PhoneVerification from "./PhoneVerification-v2";

import UsernameField from "../components/UsernameField";

import PasswordField from "../components/PasswordField-v2";

import EmailField from "../components/EmailField";

import PhoneNumberField from "../components/PhoneNumberField-v2";

import styled from "styled-components";
import config from "../config";

import useComponentFlagList from "../hooks/UseComponentFlagList";

import PropTypes from "prop-types";

const RegisterContainer = styled(Box)`
border-radius:20px;
width:421px;
min-height:437px;
background-color:${props => props.theme.colors.baseWhite};
padding-left:29px;
padding-right:28px;
padding-bottom:15px;
margin-top:20px;
`;

const Layout = () => {
  const activeIndex = useStore(state => state.activeIndex);
  /*
  args: {
    steps: 3,
    active: 0,
    variation: "tracker",
    w: "700px"
  }
*/
  const trackerWidth = 421 - 29 - 28;
  return <Flex>
    <Box w={"40%"}>{" "}</Box>
    <Box w={"60%"}>
      <Outlet />
      <Box mt={5}>
        <SimpleProgress variation="tracker" steps={5} w={trackerWidth + "px"} active={activeIndex} />
      </Box>
    </Box>
  </Flex>
}

const PageAI = () => "Page AI";
const PageB = () => "Page B";
const PageC = () => "Page C";


const Register = ({ loginLink, inputVals }) => {

  // console.log(inputVals);
  const { __ } = useTranslate();
  const setActiveIndex = useStore(state => state.setActiveIndex);

  const [nextDisabled, setNextDisabled] = useState(false);
  const { state, setState } = inputVals;
  const inputRefs = {};

  const { selectOptions, flagsLoading } = useComponentFlagList();

  const [defaultRegion, setDefaultRegion] = useState("");

  const [dataReady, setDataReady] = useState(false);

  // if more async data needs to be fetched, then this is the place for it.... 
  useEffect(() => {
    if (!flagsLoading) {
      //console.log("FLAGS ", state.countryCode, selectOptions);
      const cIndex = selectOptions.findIndex(
        c => c.regionCode === state.countryCode,
      );
      if (cIndex > -1) {
        // console.log("FOUND COUNTRY ", cIndex);
        const defaultOption = selectOptions[cIndex].key;
        setDefaultRegion(defaultOption);
      }
      setActiveIndex(0);
      setDataReady(true);
    }
  }, [flagsLoading])

  const usernameArgs = {
    id: "username",
    name: "username",
    ref: useRef(),
    options: {
      checkExists: true,
      toast: true,
      value: "",
      txt: {
        "invalidTxt": "", "usernameError": __("usernameError", { length: config.usernameLength }),
        "usernameError2": __("usernameError2"), "usernameExists": __("usernameExists"),
        "placeholderTxt": __("usernamePlaceholder"), "promptTxt": ""
      },
    },
    inputState: (input) => {
      console.log("STATE UPDATE", input, input.dataset);
    }
  }

  const getPasswordCheckList = () => {
    //[inputRefs?.['firstName']?.value, inputRefs?.['lastName']?.value, usernameArgs.ref?.current?.value],
    //console.log("CHECK LIST ", inputRefs, usernameArgs.ref);
    const passwordChecklist = [];
    if (usernameArgs.ref?.current) {
      passwordChecklist.push(inputRefs['firstName'].value);
      passwordChecklist.push(inputRefs['lastName'].value);
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
      toast: true,
      txt: {
        "invalidTxt": "", "invalidEntry": __("invalidEntry"),
        "passwordQuality": __("passwordQuality"), "placeholderTxt": __("passwordPlaceholder"),
        "promptTxt": ""
      }
    },
    inputState: (input) => {
      console.log("STATE UPDATE", input, input.dataset);
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
      toast: true,
      txt: {
        "invalidTxt": "", "invalidEntry": __("invalidPassword"),
        "placeholderTxt": __("confirmPlaceholder"),
        "promptTxt": ""
      }
    },
    inputState: (input) => {
      console.log("STATE UPDATE", input, input.dataset);
    }
  }

  const emailArgs = {
    id: "email",
    name: "email",
    ref: useRef(),
    options: {
      checkExists: true,
      toast: true,
      value: "",
      txt: { "invalidTxt": __("invalidEmail"), "placeholderTxt": __("emailPlaceholder"), "promptTxt": __("emailPrompt") }
    },
    inputState: (input) => {
      console.log("STATE UPDATE", input, input.dataset);
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
      toast: true,
      txt: { "invalidTxt": __("invalidPhoneNumber"), "placeholderTxt": __("phoneNumberPlaceholder"), "promptTxt": __("phonePrompt") }

    },
    inputState: (input) => {
      console.log("STATE UPDATE", input, input.dataset);
    }
  }

  return <>
    {!dataReady && <div />}
    {dataReady && <RegisterContainer>
      <Box textAlign="center">
        <Text textStyle={"h3"} bold>
          {__("createAccountTitle")}
        </Text>
      </Box>

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
        <UsernameField {...usernameArgs} />
      </Box>
      <Box mt={28}>
        <PasswordField {...passwordArgs} />
      </Box>
      <Box mt={28}>
        <PasswordField {...configpasswordArgs} />
      </Box>
      <Box mt={28}>
        <EmailField {...emailArgs} />
      </Box>
      <Box mt={28}>
        <PhoneNumberField {...phoneArgs} />
      </Box>
      <Box mt={66} textAlign={"center"}>
        <Button
          id="nextButton"
          disabled={nextDisabled}
          onClick={e => {
            console.log("NEXT ", e);
            console.log("INPUTS ", inputRefs);
          }}
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
  inputVals: PropTypes.object.isRequired
};

const CreateAccount = () => {

  const alerts = useToast();
  const navigate = useNavigate();

  const { __ } = useTranslate();
  const { getCountryCodeQuery, resendCode, verifyCode } = useStore((state) => ({ getCountryCodeQuery: state.getCountryCodeQuery, verifyCode: state.verifyCode, resendCode: state.resendCode }),
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

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      username: "",
      password: "",
      emailVerified: "",
      phoneVerified: "",
      lastName: "",
      firstName: "",
      preferred_username: ""
    }
  );

  useEffect(() => {
    async function getCountryCode() {
      const countryCode = await getCountryCodeQuery();
      setState({ countryCode: countryCode });
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
    verifyCode(code).then(res => {
      navigate("/register/phone-verification", { replace: true });
    });
  }
  const verifyPhoneClick = (code) => {
    verifyCode(code).then(res => {
      navigate("/register/success", { replace: true });
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

  return <>

    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Register loginLink={loginLink} inputVals={{ state, setState }} />} />
        <Route path="terms-of-use" element={<TermsOfUse declineTerms={declineTerms} approveTerms={approveTerms} />} />
        <Route path="email-verification" element={<EmailVerification resendClick={resendEmailClick} verifyClick={verifyEmailClick} backClick={backClick} invalidLink={config.invalidVerificationLink} />} />
        <Route path="phone-verification" element={<PhoneVerification resendClick={resendPhoneClick} verifyClick={verifyPhoneClick} backClick={backClick} invalidLink={config.invalidVerificationLink} />} />
      </Route>

    </Routes>

  </>
}

CreateAccount.displayName = "CreateAccount";

export default CreateAccount;