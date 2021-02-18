import React, { useState, useReducer } from "react";
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

import { useFormFields } from "../lib/formFields";
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

  const [fields, _handleChange] = useFormFields({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  const [autofillStatus, setAutofillStatus] = useState(true);
  const [checkLengthStatus, setCheckLengthStatus] = useState(false);
  const [regionCode, setRegioncode] = useState("000");
  //const [regionStatus, setRegionstatus] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [passwordConfirmEntered, setPasswordConfirmEntered] = useState(false);

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
      },
      phone: {
        status: false,
        msg: "",
        valid: false,
      },
      password: {
        status: false,
        msg: "",
        valid: false,
      },
      username: {
        status: false,
        msg: "",
        valid: false,
      },
      lastName: {
        status: false,
        msg: "",
        valid: false,
      },
      firstName: {
        status: false,
        msg: "",
        valid: false,
      },
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

  const checkDisabled = (fieldCheck, passwordConfirm) => {
    //console.log(Object.keys(state));
    let validationState = false;
    validationState = Object.keys(state).some((fld) => {
      console.log(fld, state[fld].valid);
      return state[fld].valid === false;
    });

    console.log(
      fieldCheck,
      validationState,
      passwordConfirm,
      passwordConfirmEntered
    );

    if (typeof passwordConfirm !== "undefined") {
      validationState = !passwordConfirm;
    }

    //firstName
    //lastName
    if (
      (fieldCheck === "username" || fieldCheck === "password") &&
      (!validationState || fields.password.length === 0)
    ) {
      if (fields.firstName.length === 0) {
        setState({
          firstName: {
            status: true,
          },
        });
        setInputFirstnameFocus();
        validationState = true;
      } else if (fields.lastName.length === 0) {
        setState({
          lastName: {
            status: true,
          },
        });
        setInputLastnameFocus();
        validationState = true;
      }
    }

    //passwordVerification
    if (fieldCheck === "password" && passwordConfirmEntered) {
      console.log("Checking password strength...");
      const invalidPasswordStatus = passwordVerification.some((v, i) => {
        //console.log("STEP ", v, i);
        return v === false;
      });
      setState({
        password: {
          status: invalidPasswordStatus,
          msg: invalidPasswordStatus ? i18n.__("invalidPassword") : "",
          valid: !invalidPasswordStatus,
        },
      });
      console.log("PASSWORD focus...", invalidPasswordStatus);
      if (invalidPasswordStatus) {
        validationState = true;
        setInputPasswordFocus();
      }
    }

    if (passwordConfirmEntered && state.password.valid) {
      const checkResult = checkLengths();
      validationState = Object.keys(checkResult).some((fld) => {
        return fld === false;
      });
    }

    setNextDisabled(validationState);
  };

  const checkLengths = (inputFld, inputLength) => {
    console.log("CHECK LENGTH", inputFld, inputLength);
    let lengthStatus = {};
    let states = { ...state };
    Object.keys(state).forEach((fld) => {
      if (fld !== inputFld) {
        lengthStatus[fld] = true;
        if (fields[fld].length === 0) {
          lengthStatus[fld] = false;
          states[fld].status = true;
          states[fld].msg = i18n.__("invalidEntry");
        }
      } else if (inputLength > 0) {
        lengthStatus[fld] = true;
        states[fld].status = false;
        states[fld].msg = "";
      } else if (inputLength === -1) {
        lengthStatus[fld] = states[fld].status;
        console.log("-1 CHECK ", states[fld], fields[fld]);
        if (fields[fld].length > 0) {
          lengthStatus[fld] = true;
          states[fld].status = false;
          states[fld].msg = "";
        }
      }
    });
    if (Object.keys(lengthStatus).length > 0) {
      setState(states);
    }

    return lengthStatus;
  };

  const checkPhone = (phone) => {
    //console.log("FIELDS ", fields);
    console.log(phone, regionCode);
    const checkResult = isValidNumber(regionCode + phone);
    const phoneState = Object.keys(checkResult).length > 0;
    setState({
      phone: {
        status: !phoneState,
        msg: !phoneState ? i18n.__("invalidPhoneNumber") : "",
        valid: phoneState,
      },
    });

    return !phoneState;
  };

  const checkEmail = (email) => {
    //console.log("FIELDS ", fields);
    const emailState = validEmail(email);
    //console.log("CHECKING ", emailState);
    setState({
      email: {
        status: !emailState,
        msg: !emailState ? i18n.__("invalidEmail") : "",
        valid: emailState,
      },
    });

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
    setState({
      username: {
        status: userError,
        msg: userError ? userMsg : "",
        valid: !userError,
      },
    });
    return userError;
  };

  const checkInputPassword = (password) => {
    //console.log(password);
    const checkResult = checkPassword(password, config.passwordLength, [
      fields.firstName,
      fields.lastName,
      fields.username,
      fields.email,
    ]);
    //console.log(checkResult);
    if (state.password.status && fields.password.length === 0) {
      //console.log("PASSWORD ERROR MSG");
      setState({
        password: {
          status: false,
          msg: "",
        },
      });
    }
    setPasswordVerification(checkResult);
  };

  const checkConfirmPassword = (password, onBlur = false) => {
    console.log("Confirm ", password);
    const confirmStatus =
      fields.password === password && fields.password.length > 0;
    console.log(confirmStatus);

    if (checkConfirmPassword && !confirmStatus) {
      setState({
        password: {
          status: !confirmStatus,
          msg: !confirmStatus ? i18n.__("invalidPassword") : "",
          valid: confirmStatus,
        },
      });
      setNextDisabled(true);
    } else {
      setState({
        password: {
          valid: confirmStatus,
        },
      });
    }

    setPasswordConfirmEntered(confirmStatus ? true : passwordConfirmEntered);
    if (!confirmStatus && onBlur) {
      setState({
        password: {
          status: !confirmStatus,
          msg: !confirmStatus ? i18n.__("invalidPassword") : "",
          valid: confirmStatus,
        },
      });
      console.log("CONFIRM PASSWORD focus...");
      setNextDisabled(true);
      setInputPasswordFocus();
    } else {
      //checkDisabled("password", confirmStatus);
    }
    if (confirmStatus) {
      checkDisabled("password", confirmStatus);
    }
  };
  /*
  const checkName = (fieldName, value) => {
    if (
      fieldName === "firstName" &&
      value.length > 0 &&
      state.firstName.status
    ) {
      setState({
        firstName: {
          status: false,
        },
      });
    }
    if (fieldName === "lastName" && value.length > 0 && state.lastName.status) {
      setState({
        lastName: {
          status: false,
        },
      });
    }
  };
  */
  const checkPasswordQuality = (password) => {
    checkInputPassword(password);
    console.log("Checking password quality...");
    const invalidPasswordStatus = passwordVerification.some((v, i) => {
      //console.log("STEP ", v, i);
      return v === false;
    });
    setState({
      password: {
        status: invalidPasswordStatus,
        msg: invalidPasswordStatus ? i18n.__("invalidPassword") : "",
        valid: !invalidPasswordStatus,
      },
    });
    console.log("PASSWORD quality Status...", invalidPasswordStatus);
    if (invalidPasswordStatus) {
      setInputPasswordFocus();
      return false;
    } else {
      return true;
    }
  };
  /*
  const [renderStatus, setRederstatus] = useState(false);
  useEffect(() => {
    // code to run after render goes here
    setRederstatus(true);
  });
  */
  //ref={mergeRefs(setReferenceElement, ref)}

  const checkInputField = async (fld, e) => {
    console.log("CHECK ", fld, e.target.value.length, state[fld]);
    if (autofillStatus) {
      /*
      console.log("USER ", document.getElementById("username").value);
      console.log(
        "USER REF",
        inputUsername.current.value,
        inputUsername.current
      );
      */

      if (inputLastname.current && inputLastname.current.value.length > 0) {
        _handleChange({
          target: {
            id: "lastName",
            value: inputLastname.current.value,
          },
        });
      }
      if (inputUsername.current && inputUsername.current.value.length > 0) {
        _handleChange({
          target: {
            id: "username",
            value: inputUsername.current.value,
          },
        });
      }

      if (inputEmail.current && inputEmail.current.value.length > 0) {
        _handleChange({
          target: {
            id: "email",
            value: inputEmail.current.value,
          },
        });
      }
      if (inputPhone.current && inputPhone.current.value.length > 0) {
        _handleChange({
          target: {
            id: "phone",
            value: inputPhone.current.value,
          },
        });
      }
      if (inputPassword.current && inputPassword.current.value.length > 0) {
        _handleChange({
          target: {
            id: "password",
            value: inputPassword.current.value,
          },
        });
      }

      setAutofillStatus(false);
    }
    if (
      (fld === "password" || fld === "passwordConfirm") &&
      !checkLengthStatus
    ) {
      setCheckLengthStatus(true);
    }
    /*
    if (fld === "firstName") {
      if (e.target.value.length > 0) {
        setState({
          firstName: {
            status: false,
            msg: "",
            valid: true,
          },
        });
      } else {
        e.preventDefault();
        return;
      }
    }
    if (fld === "lastName") {
      if (e.target.value.length > 0) {
        setState({
          lastName: {
            status: false,
            msg: "",
            valid: true,
          },
        });
      } else {
        e.preventDefault();
        return;
      }
    }
    */
    if (fld === "username") {
      const userError = await checkUsername(e.target.value);
      console.log("USERNAME ", userError);
      if (userError) {
        setInputUsernameFocus();
        e.preventDefault();
        return;
      }
    }
    if (fld === "email") {
      const emailError = await checkEmail(e.target.value);

      if (emailError) {
        setInputEmailFocus();
        e.preventDefault();
        return;
      }
    }

    if (fld === "phone") {
      if (regionCode === "000") {
        setState({
          phone: {
            status: true,
            msg: i18n.__("invalidRegion"),
            valid: false,
          },
        });
        setSelectFocus();
      } else {
        const phoneError = checkPhone(e.target.value);

        if (phoneError) {
          //setInputPhoneFocus();
          setSelectFocus();
        }
      }
    }

    if (fld === "password") {
      if (e.target.value.length !== 0) {
        const res = checkPasswordQuality(e.target.value);
        if (res) {
          onPopper(e, false);
        } else {
          e.preventDefault();
        }
      } else {
        onPopper(e, false);
      }
    }
    if (checkLengthStatus) {
      const checkEmpty = checkLengths(
        fld,
        e.target ? e.target.value.length : -1
      );
      if (Object.keys(checkEmpty).length > 0 || e.target.value.length === 0) {
        console.log("LENGTHS ", checkEmpty);

        console.log("AFTER CHECK ", fld, e.target, fields);
        /*
          setState({
            username: {
              status: false,
              msg: "",
              valid: true,
            },
          });
        */

        if (fields.firstName.length === 0) {
          console.log("FIRST HERE....");
          setInputFirstnameFocus();
        } else if (fields.lastName.length === 0) {
          console.log("LAST HERE....");
          setInputLastnameFocus();
        } else if (fields.username.length === 0) {
          console.log("USER HERE....");
          setInputUsernameFocus();
        } else if (fields.email.length === 0) {
          console.log("EMAIL HERE....");
          setInputEmailFocus();
        } else if (fields.phone.length === 0) {
          if (regionCode === "000") {
            console.log("REGION HERE....");
            setSelectFocus();
          } else {
            console.log("PHONE HERE....");
            setInputPhoneFocus();
          }
        } else if (fields.password.length === 0) {
          if (regionCode === "000") {
            console.log("REGION2 HERE....");
            setSelectFocus();
          } else {
            console.log("PASSWORD HERE....");
            setInputPasswordFocus();
          }
        } else if (e.target.value.length === 0) {
          console.log("HERE....");
          e.preventDefault();
          return;
        }
      } else {
        /*
      let states = { ...state };
      console.log(states);
      let statusChanged = false;
      Object.keys(state).forEach((fld) => {
        if (states[fld].status) {
          states[fld].status = false;
          states[fld].msg = "";
          statusChanged = true;
        }
      });
      if (statusChanged) {
        setState(states);
      }
      */
      }
    }
  };
  /*
  useEffect(() => {
    console.log("DOM HERE ");
    console.log("USER ", document.getElementById("username").value);
    console.log("USER REF", inputUsername.current.value);
    let interval = setInterval(() => {
      console.log("USER2 ", document.getElementById("username").value);
      console.log("USER2 REF", inputUsername.current.value);
      if (inputUsername.current) {
        if (inputUsername.current.value.length > 0) {
          console.log("AUTOFILL ???? ");
          //setEmail(emailField.current.value);
          //do the same for all autofilled fields
          clearInterval(interval);
        }
      }
    }, 5000);
  }, []);
  */
  return (
    <ProgressContainer title={i18n.__("createAccountTitle")} progress={33}>
      <Box mt={40} display="inline-flex">
        <Flex width={"168px"}>
          <Input
            autoFocus={true}
            placeholder={i18n.__("firstNamePlaceholder")}
            id={"firstName"}
            name={"firstName"}
            onChange={_handleChange}
            onBlur={(e) => checkInputField("firstName", e)}
            ref={inputFirstname}
            error={state.firstName.status}
          />
        </Flex>
        <Flex ml={25} width={"168px"}>
          <Input
            placeholder={i18n.__("lastNamePlaceholder")}
            id={"lastName"}
            name={"lastName"}
            onChange={_handleChange}
            onBlur={(e) => checkInputField("lastName", e)}
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
            onChange={_handleChange}
            onBlur={(e) => checkInputField("username", e)}
            errorMsg={state.username.msg}
            error={state.username.status}
            ref={inputUsername}
            autoComplete="new-password-3"
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
            onChange={_handleChange}
            promptMsg={
              !state.email.status && fields.email.length > 0
                ? i18n.__("emailPrompt")
                : ""
            }
            errorMsg={state.email.msg}
            error={state.email.status}
            ref={inputEmail}
            onBlur={(e) => checkInputField("email", e)}
            autoComplete="new-password-2"
          />
        </IconField>
      </Box>

      <Box mt={state.email.status || fields.email.length > 0 ? 5 : 28}>
        <PhoneNumberField>
          <PhoneNumberField.RegionField
            defaultValue={regionCode}
            options={selectOptions}
            searchLength={1}
            showList={false}
            ref={inputSelect}
            onChange={(e, code) => {
              //console.log("REGION", e);
              //console.log("REGION", code);
              setState({
                phone: {
                  status: false,
                  msg: "",
                  valid: true,
                },
              });
              setRegioncode(code);
              setInputPhoneFocus();
            }}
          />
          <PhoneNumberField.InputField
            placeholder={i18n.__("phoneNumberPlaceholder")}
            id={"phone"}
            name={"phone"}
            onChange={_handleChange}
            promptMsg={
              !state.phone.status && fields.phone.length > 0
                ? i18n.__("phonePrompt")
                : ""
            }
            errorMsg={state.phone.msg}
            error={state.phone.status}
            ref={inputPhone}
            onBlur={(e) => checkInputField("phone", e)}

            /* disabled={regionCode === "000"} */
          />
        </PhoneNumberField>
      </Box>
      <Box mt={state.phone.status || fields.phone.length > 0 ? 5 : 28}>
        <PasswordField
          placeholder={i18n.__("passwordPlaceholder")}
          onFocus={(e) => {
            console.log("PASSWORD FOCUS", e.target.value.length);

            const checkResult = checkLengths("password", e.target.value.length);

            const validFields = Object.keys(checkResult).filter((fld) => {
              return checkResult[fld] === true;
            });
            console.log("FOCUS ", validFields);
            if (
              (validFields.length > 4 && !validFields.password) ||
              validFields.password
            ) {
              if (regionCode === "000") {
                setSelectFocus();
                e.preventDefault();
                e.stopPropagation();
              } else {
                onPopper(e, true);
                if (fields.password !== fields.passwordConfirm) {
                  setState({
                    password: {
                      status: true,
                      msg: i18n.__("invalidPassword"),
                      valid: false,
                    },
                  });
                }
              }
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
            _handleChange(e);
            /* check password popup */
            checkInputPassword(e.target.value);
          }}
          ref={inputPassword}
          /* promptMsg={i18n.__("passwordPrompt")} */
          errorMsg={state.password.msg}
          error={state.password.status}
          onBlur={(e) => checkInputField("password", e)}
        />
      </Box>
      <Box mt={state.password.status ? 5 : 28}>
        <PasswordField
          placeholder={i18n.__("confirmPlaceholder")}
          id={"passwordConfirm"}
          name={"passwordConfirm"}
          onChange={_handleChange}
          errorMsg={state.password.msg}
          error={state.password.status}
          onBlur={(e) => checkInputField("passwordConfirm", e)}
          /* interestingly this removes autofill from all fields??? */
          autoComplete="new-password"
        />
      </Box>

      <Box mt={66 - (state.password.status ? 18 : 0)} textAlign={"center"}>
        <Button
          disabled={nextDisabled}
          onClick={() => {
            onAction("register", fields);
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
