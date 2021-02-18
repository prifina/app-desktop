import React, { useState, useReducer, useEffect } from "react";
import {
  IconField,
  Button,
  Input,
  Box,
  Flex,
  Text,
  useTheme,
} from "@blend-ui/core";

import { useAppContext } from "../lib/contextLib";
import bxUser from "@iconify/icons-bx/bx-user";
import bxEnvelope from "@iconify/icons-bx/bx-envelope";
import ProgressContainer from "../components/ProgressContainer";
import PasswordField from "../components/PasswordField";
import PhoneNumberField from "../components/PhoneNumberField";
import { useHistory } from "react-router-dom";

//import { useFormFields } from "../lib/formFields";
import {
  checkPassword,
  validEmail,
  validUsername,
  isValidNumber,
  countryList,
} from "../lib/utils";
import { useFocus } from "../lib/componentUtils";
import config from "../config";
import { checkUsernameQuery } from "../graphql/api";
import Amplify, { API } from "aws-amplify";
//import strings from "../lib/locales/en";

//const { i18n } = require("../lib/i18n");
import i18n from "../lib/i18n";

i18n.init();

const CreateAccount = ({ onAction, ...props }) => {
  const history = useHistory();
  const { APIConfig } = useAppContext();
  Amplify.configure(APIConfig);
  //console.log("Account ", props);

  //console.log(i18n.__("Testing"));

  //console.log(i18n.__("testMessage"));
  const { colors } = useTheme();
  const selectOptions = countryList().map((cc) => {
    return {
      key: "+" + cc.countryCode,
      value: cc.regionName,
      component: (
        <React.Fragment>
          <Text as="span">{cc.regionName}</Text>
          <Text as="span" color={colors.textMuted} fontSize={"xs"} pl={4}>
            (+{cc.countryCode})
          </Text>
        </React.Fragment>
      ),
    };
  });

  //const [autofillStatus, setAutofillStatus] = useState(true);
  //const [checkLengthStatus, setCheckLengthStatus] = useState(false);
  //const [regionCode, setRegioncode] = useState("000");
  //const [regionStatus, setRegionstatus] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(true);
  //const [passwordConfirmEntered, setPasswordConfirmEntered] = useState(false);

  const [passwordVerification, setPasswordVerification] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      email: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      phone: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      password: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      username: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      lastName: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      firstName: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      passwordConfirm: {
        status: false,
        msg: "",
        valid: false,
        value: "",
      },
      regionCode: "000",
      checkLengthStatus: false,
    }
  );

  const [inputSelect, setSelectFocus] = useFocus();
  const [inputUsername, setInputUsernameFocus] = useFocus();
  const [inputEmail, setInputEmailFocus] = useFocus();
  const [inputPhone, setInputPhoneFocus] = useFocus();
  const [inputPassword, setInputPasswordFocus] = useFocus();
  const [inputFirstname, setInputFirstnameFocus] = useFocus();
  const [inputLastname, setInputLastnameFocus] = useFocus();

  const [addPopper, setAddPopper] = useState(false);
  const onPopper = (e, status) => {
    console.log("POPPER");
    e.preventDefault();
    setAddPopper(status);
  };

  const checkPhone = (region, phone) => {
    //console.log("FIELDS ", fields);
    console.log(phone, region);
    const checkResult = isValidNumber(region + phone);
    const phoneState = Object.keys(checkResult).length > 0;

    return !phoneState;
  };

  const checkEmail = (email) => {
    //console.log("FIELDS ", fields);
    const emailState = validEmail(email);
    //console.log("CHECKING ", emailState);

    return !emailState;
  };

  const checkUsername = async (username) => {
    //console.log("FIELDS2 ", fields);
    //console.log(await checkUsernameQuery(API, "tero-test"));
    const userState = validUsername(username, config.usernameLength);
    let userError = userState !== "";
    let userMsg = "";

    if (userState === "LENGTH") {
      userMsg = i18n.__("usernameError", { length: config.usernameLength });
    }
    if (userState === "SPACES") {
      userMsg = i18n.__("usernameError2");
    }
    console.log("USER ", username, userError);
    if (!userError) {
      const userExists = await checkUsernameQuery(API, username);
      console.log(userExists);
      //{"data":{"checkUsername":false}}

      if (
        typeof userExists.data !== "undefined" &&
        userExists.data.checkUsername
      ) {
        userError = true;
        userMsg = i18n.__("usernameExists");
      }
    }

    console.log(userMsg);

    return userMsg;
  };

  const checkInputPassword = (password) => {
    //console.log(password);
    const checkResult = checkPassword(password, config.passwordLength, [
      state.firstName.value,
      state.lastName.value,
      state.username.value,
      state.email.value,
    ]);
    console.log("PASS CHECK ", checkResult);
    setPasswordVerification(checkResult);
    return checkResult;
  };

  const checkPasswordQuality = (verifications) => {
    //checkInputPassword(password);
    console.log(
      "Checking password quality... ",
      passwordVerification,
      verifications
    );
    const verifyList = verifications || passwordVerification;
    const invalidPasswordStatus = verifyList.some((v, i) => {
      console.log("STEP ", v, i);
      return v === false;
    });
    return invalidPasswordStatus;
  };

  //  const checkFields = async () => {
  useEffect(() => {
    async function checkFields() {
      let states = { ...state };
      let statesUpdated = false;
      Object.keys(states).forEach((fld) => {
        if (document.getElementById(fld)) {
          const fieldValue = document.getElementById(fld).value;

          if (fieldValue !== states[fld].value) {
            statesUpdated = true;
            states[fld].value = fieldValue;

            console.log("KEYS ", fld);
          }
        }
      });

      let fieldStatuses = [];

      if (states["firstName"].value.length > 0 && !states["firstName"].valid) {
        statesUpdated = true;

        states["firstName"].status = false;
        states["firstName"].msg = "";
        states["firstName"].valid = true;
      } else if (
        states["firstName"].value.length === 0 &&
        states.checkLengthStatus
      ) {
        statesUpdated = true;
        states["firstName"].status = true;
        states["firstName"].msg = i18n.__("invalidEntry");
        states["firstName"].valid = false;

        fieldStatuses.push("firstName");
      }
      if (states["lastName"].value.length > 0 && !states["lastName"].valid) {
        statesUpdated = true;
        states["lastName"].status = false;
        states["lastName"].msg = "";
        states["lastName"].valid = true;
      } else if (
        states["lastName"].value.length === 0 &&
        states.checkLengthStatus
      ) {
        statesUpdated = true;
        states["lastName"].status = true;
        states["lastName"].msg = i18n.__("invalidEntry");
        states["lastName"].valid = false;

        fieldStatuses.push("lastName");
      }

      if (states["username"].value.length > 0 && !states["username"].valid) {
        const userError = await checkUsername(states["username"].value);
        statesUpdated = true;
        if (userError !== "") {
          states["username"].status = true;
          states["username"].msg = userError;
          states["username"].valid = false;

          fieldStatuses.push("username");
        } else {
          states["username"].status = false;
          states["username"].msg = "";
          states["username"].valid = true;
        }
      } else if (
        states["username"].value.length === 0 &&
        states.checkLengthStatus
      ) {
        statesUpdated = true;
        states["username"].status = true;
        states["username"].msg = i18n.__("invalidEntry");
        states["username"].valid = false;

        fieldStatuses.push("username");
      }

      if (states["email"].value.length > 0 && !states["email"].valid) {
        const emailError = checkEmail(states["email"].value);
        statesUpdated = true;
        if (emailError) {
          states["email"].status = true;
          states["email"].msg = i18n.__("invalidEmail");
          states["email"].valid = false;

          fieldStatuses.push("email");
        } else {
          states["email"].status = false;
          states["email"].msg = "";
          states["email"].valid = true;
        }
      } else if (
        states["email"].value.length === 0 &&
        states.checkLengthStatus
      ) {
        statesUpdated = true;
        states["email"].status = true;
        states["email"].msg = i18n.__("invalidEntry");
        states["email"].valid = false;

        fieldStatuses.push("email");
      }

      if (states["phone"].value.length > 0 && !states["phone"].valid) {
        statesUpdated = true;
        if (inputSelect.current.value === "") {
          states["phone"].status = true;
          states["phone"].msg = i18n.__("invalidRegion");
          states["phone"].valid = false;
          fieldStatuses.push("regionCode");
        } else {
          const phoneError = checkPhone(
            inputSelect.current.value,
            states["phone"].value
          );
          if (phoneError) {
            states["phone"].status = true;
            states["phone"].msg = i18n.__("invalidPhoneNumber");
            states["phone"].valid = false;

            fieldStatuses.push("phone");
          } else {
            states["phone"].status = false;
            states["phone"].msg = "";
            states["phone"].valid = true;
            states["regionCode"] = inputSelect.current.value;
          }
        }
      } else if (
        states["phone"].value.length === 0 &&
        states.checkLengthStatus
      ) {
        statesUpdated = true;
        states["phone"].status = true;
        states["phone"].msg = i18n.__("invalidEntry");
        states["phone"].valid = false;
        fieldStatuses.push("phone");
      }

      if (states["password"].value.length > 0 && !states["password"].valid) {
        const passwordCheckResult = checkInputPassword(
          states["password"].value
        );
        const passwordError = checkPasswordQuality(passwordCheckResult);
        statesUpdated = true;
        states["checkLengthStatus"] = true;

        if (passwordError) {
          states["password"].status = true;
          states["password"].msg = i18n.__("passwordQuality");
          states["password"].valid = false;
          fieldStatuses.push("password");
        } else {
          states["password"].status = false;
          states["password"].msg = "";
          states["password"].valid = true;
        }
      } else if (
        states["password"].value.length === 0 &&
        states.checkLengthStatus
      ) {
        statesUpdated = true;
        states["password"].status = true;
        states["password"].msg = i18n.__("invalidEntry");
        states["password"].valid = false;
        fieldStatuses.push("password");
      }

      if (
        states["passwordConfirm"].value.length > 0 &&
        !states["passwordConfirm"].valid
      ) {
        statesUpdated = true;
        states["checkLengthStatus"] = true;
        const confirmError =
          states["passwordConfirm"].value !== states["password"].value;

        if (confirmError) {
          states["password"].status = true;
          states["passwordConfirm"].status = true;
          states["password"].msg = i18n.__("invalidPassword");
          states["passwordConfirm"].msg = i18n.__("invalidPassword");
          states["password"].valid = false;
          states["passwordConfirm"].valid = false;
          fieldStatuses.push("password");
        } else {
          states["password"].status = false;
          states["password"].msg = "";
          states["passwordConfirm"].valid = true;
          states["passwordConfirm"].status = false;
          states["passwordConfirm"].msg = "";
        }
      } else if (
        states["passwordConfirm"].value.length === 0 &&
        states.checkLengthStatus
      ) {
        statesUpdated = true;
        states["passwordConfirm"].status = true;
        states["passwordConfirm"].msg = i18n.__("invalidEntry");
        states["passwordConfirm"].valid = false;
        fieldStatuses.push("password");
      }

      if (states.regionCode === "000" && inputSelect.current.value !== "") {
        statesUpdated = true;
        states.regionCode = inputSelect.current.value;
        console.log("REGION UPDATE ", states, inputSelect.current.value);
      }

      //search-input-fld
      if (fieldStatuses.length > 0) {
        let firstStatus = fieldStatuses[0];
        const selectSearchID = inputSelect.current.id;
        const activeID = document.activeElement.id;
        if (firstStatus === "regionCode") {
          firstStatus = selectSearchID;
        }
        console.log("FOCUS ", firstStatus);

        if (activeID !== firstStatus) {
          if (firstStatus === "firstName") {
            setInputFirstnameFocus();
          } else if (firstStatus === "lastName") {
            setInputLastnameFocus();
          } else if (firstStatus === "usermame") {
            setInputUsernameFocus();
          } else if (firstStatus === "email") {
            setInputEmailFocus();
          } else if (firstStatus === "phone") {
            setInputPhoneFocus();
          } else if (firstStatus === selectSearchID) {
            setSelectFocus();
          } else if (firstStatus === "password") {
            if (activeID !== "passwordConfirm") {
              setInputPasswordFocus();
            }
          } else {
            console.log("UNKNOWN FIELD ", firstStatus);
          }
        }

        setNextDisabled(true);
      } else {
        if (states.checkLengthStatus) {
          console.log("ALL GOOD, activate Next button");
          setNextDisabled(false);
        } else {
          console.log("PASSWORD NOT YET ENTERED....");
        }
      }

      //console.log("UPDATES ", checks);
      if (statesUpdated) {
        console.log("UPDATE STATES ");
        //setState(Object.assign({}, states));
        setState(states);
      }
      /*
    if (checkLengthStatus) {
      const checkEmpty = checkLengths();
    }
    */

      console.log("STATE FIELDS ", state, states);
      console.log("REGION CODE ", states.regionCode);
      console.log("SELECT ", inputSelect.current.value);
      /*
    if (regionCode === "000" && inputSelect.current.value !== "") {
      setRegioncode(inputSelect.current.value);
    }
    */
    }
    const activeField = document.activeElement.id;

    if (
      activeField !== "search-input-fld" &&
      activeField !== inputSelect.current.id
    ) {
      checkFields();
    }
  }, [seconds]);
  /*
  const hydrate = useCallback(( _state, _errors=false ) => {
    console.log('hydrate()');
    setState(prevState => ({...prevState,..._state}));
    if(_errors){
        setErrors(prevErros => ({...prevErrors,..._errors}));
    }
},[]);

useEffect(()=>{
  hydrate({
      name:'Garrett',
      email:'test@test.com',
      newsletter: 'yes'
  });
},[hydrate]);

useEffect(() => {
  function fetchBusinesses() {
    ...
  }
  fetchBusinesses()
}, [])
*/

  /*
  useEffect(() => {
    //console.log("INTERVAL STATE FIELDS ", state);
    const activeField = document.activeElement.id;

    if (
      activeField !== "search-input-fld" &&
      activeField !== inputSelect.current.id
    ) {
      checkFields();
    }
  }, [seconds]);
*/
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  /*
  useEffect(() => {
    let interval = setInterval(() => {
      console.log("INTERVAL STATE FIELDS ", state);
      checkFields();
     
      console.log("USER ", document.getElementById("firstName").value);
      console.log("USER REF", inputFirstname.current.value);
      console.log("USER FLD", fields["firstName"].length);
      console.log("FOCUS", document.activeElement.id);
     
      //clearInterval(interval);
      //console.log("STATE FIELDS ", state);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
*/

  const handleChange = (event) => {
    //console.log(event.target.id);
    if (event.target) {
      console.log("CHANGE ", event.target.id, event.target.value);
      let fld = Object.assign({}, state[event.target.id]);
      fld.value = event.target.value;
      fld.valid = false;
      setState({
        [event.target.id]: fld,
      });
      if (event.target.id === "password") {
        //setCheckLengthStatus(true);
        setState({ checkLengthStatus: true });
      }
    }
  };
  const loginLink = (e) => {
    history.replace("/login");
    e.preventDefault();
  };
  return (
    <ProgressContainer title={i18n.__("createAccountTitle")} progress={33}>
      <Box mt={40} display="inline-flex">
        <Flex width={"168px"}>
          <Input
            autoFocus={true}
            placeholder={i18n.__("firstNamePlaceholder")}
            id={"firstName"}
            name={"firstName"}
            //onChange={_handleChange}
            onChange={handleChange}
            //onBlur={(e) => checkInputField("firstName", e)}
            ref={inputFirstname}
            error={state.firstName.status}
          />
        </Flex>
        <Flex ml={25} width={"168px"}>
          <Input
            placeholder={i18n.__("lastNamePlaceholder")}
            id={"lastName"}
            name={"lastName"}
            onChange={handleChange}
            //onBlur={(e) => checkInputField("lastName", e)}
            ref={inputLastname}
            error={state.lastName.status}
          />
        </Flex>
      </Box>
      <Box mt={28}>
        <IconField>
          <IconField.LeftIcon
            iconify={bxUser}
            color={"componentPrimary"}
            size={"17"}
          />
          <IconField.InputField
            placeholder={i18n.__("usernamePlaceholder")}
            id={"username"}
            name={"username"}
            onChange={handleChange}
            //onBlur={(e) => checkInputField("username", e)}
            errorMsg={state.username.msg}
            error={state.username.status}
            ref={inputUsername}
          />
        </IconField>
      </Box>
      <Box mt={state.username.status ? 5 : 28}>
        <IconField>
          <IconField.LeftIcon
            iconify={bxEnvelope}
            color={"componentPrimary"}
            size={"17"}
          />
          <IconField.InputField
            placeholder={i18n.__("emailPlaceholder")}
            id={"email"}
            name={"email"}
            onChange={handleChange}
            promptMsg={state.email.valid ? i18n.__("emailPrompt") : ""}
            errorMsg={state.email.msg}
            error={state.email.status}
            ref={inputEmail}
            //onBlur={(e) => checkInputField("email", e)}
          />
        </IconField>
      </Box>

      <Box mt={state.email.valid || state.email.status ? 5 : 28}>
        <PhoneNumberField>
          <PhoneNumberField.RegionField
            defaultValue={state.regionCode}
            options={selectOptions}
            searchLength={1}
            showList={false}
            ref={inputSelect}
            /* id="select-search" */
            onChange={(e, code) => {
              //console.log("REGION", e);
              //console.log("REGION", code);
              console.log("REGION SELECT ", e, code);
              handleChange({
                target: {
                  id: "regionCode",
                  value: code,
                },
              });

              //setState({ regionCode: code });
              // this doesn't work????
              //setRegioncode(code);
              //setInputPhoneFocus();
            }}
          />
          <PhoneNumberField.InputField
            placeholder={i18n.__("phoneNumberPlaceholder")}
            id={"phone"}
            name={"phone"}
            onChange={handleChange}
            promptMsg={state.phone.valid ? i18n.__("phonePrompt") : ""}
            errorMsg={state.phone.msg}
            error={state.phone.status}
            ref={inputPhone}
            //onBlur={(e) => checkInputField("phone", e)}

            /* disabled={regionCode === "000"} */
          />
        </PhoneNumberField>
      </Box>
      <Box mt={state.phone.valid || state.phone.status ? 5 : 28}>
        <PasswordField
          placeholder={i18n.__("passwordPlaceholder")}
          onFocus={(e) => {
            if (!state.password.valid || state.password.value.length === 0) {
              onPopper(e, true);
            } else {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          addPopper={addPopper}
          verifications={passwordVerification}
          id={"password"}
          name={"password"}
          onChange={(e) => {
            handleChange(e);
            /* check password popup */
            checkInputPassword(e.target.value);
          }}
          ref={inputPassword}
          /* promptMsg={i18n.__("passwordPrompt")} */
          errorMsg={state.password.msg}
          error={state.password.status}
          onBlur={(e) => onPopper(e, false)}
          //onBlur={(e) => checkInputField("password", e)}
        />
      </Box>
      <Box mt={state.password.status ? 5 : 28}>
        <PasswordField
          placeholder={i18n.__("confirmPlaceholder")}
          id={"passwordConfirm"}
          name={"passwordConfirm"}
          onChange={handleChange}
          errorMsg={
            state.passwordConfirm.status
              ? state.passwordConfirm.msg
              : state.password.msg
          }
          error={state.password.status || state.passwordConfirm.status}
          //onBlur={(e) => checkInputField("passwordConfirm", e)}
          /* interestingly this removes autofill from all fields??? */
          autoComplete="new-password"
        />
      </Box>

      <Box
        mt={
          66 - (state.password.status || state.passwordConfirm.status ? 18 : 0)
        }
        textAlign={"center"}
      >
        <Button
          disabled={nextDisabled}
          onClick={() => {
            onAction("register", state);
          }}
        >
          {i18n.__("nextButton")}
        </Button>
        <Box mt={10}>
          <Box display={"inline-flex"}>
            <Flex alignItems={"center"}>
              <Text textStyle={"caption2"} mr={5}>
                {i18n.__("existingAccount")}
              </Text>
              <Button
                variation={"link"}
                fontSize={"10px"}
                lineHeight={"normal"}
                onClick={loginLink}
              >
                {i18n.__("loginLink")}
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </ProgressContainer>
  );
};

export default CreateAccount;
