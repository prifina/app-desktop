import React, { useState, useReducer } from "react";
import { IconField, Button, Input, Box, Flex } from "@blend-ui/core";

import bxPhone from "@iconify/icons-bx/bx-phone";
import bxUser from "@iconify/icons-bx/bx-user";
import bxEnvelope from "@iconify/icons-bx/bx-envelope";
import ProgressContainer from "../components/ProgressContainer";
import PasswordField from "../components/PasswordField";
import { useFormFields } from "../lib/formFields";
import {
  checkPassword,
  validEmail,
  validUsername,
  isValidNumber,
} from "../lib/utils";
import { UseFocus } from "../lib/componentUtils";
import config from "../config";

//import strings from "../lib/locales/en";

//const { i18n } = require("../lib/i18n");
import i18n from "../lib/i18n";

i18n.init();

const CreateAccount = ({ onAction, ...props }) => {
  //console.log("Account ", props);

  //console.log(i18n.__("Testing"));

  //console.log(i18n.__("testMessage"));

  const [fields, _handleChange] = useFormFields({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

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
        valid: true,
      },
      firstName: {
        status: false,
        msg: "",
        valid: true,
      },
    }
  );

  const [inputUsername, setInputUsernameFocus] = UseFocus();
  const [inputEmail, setInputEmailFocus] = UseFocus();
  const [inputPhone, setInputPhoneFocus] = UseFocus();
  const [inputPassword, setInputPasswordFocus] = UseFocus();
  const [inputFirstname, setInputFirstnameFocus] = UseFocus();
  const [inputLastname, setInputLastnameFocus] = UseFocus();

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
      //console.log("PASSWORD focus...", passwordStatus);
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

  const checkLengths = () => {
    let lengthStatus = {};
    let states = { ...state };
    Object.keys(state).forEach((fld) => {
      lengthStatus[fld] = true;
      if (fields[fld].length === 0) {
        lengthStatus[fld] = false;
        states[fld].status = true;
        states[fld].msg = i18n.__("invalidEntry");
      }
    });
    setState(states);
    if (fields.firstName.length === 0) {
      setInputFirstnameFocus();
    } else if (fields.lastName.length === 0) {
      setInputLastnameFocus();
    } else if (fields.username.length === 0) {
      setInputUsernameFocus();
    } else if (fields.email.length === 0) {
      setInputEmailFocus();
    } else if (fields.phone.length === 0) {
      setInputPhoneFocus();
    } else if (fields.password.length === 0) {
      setInputPasswordFocus();
    }
    return lengthStatus;
  };

  const checkPhone = (phone) => {
    //console.log("FIELDS ", fields);
    const checkResult = isValidNumber(phone);
    const phoneState = Object.keys(checkResult).length > 0;
    setState({
      phone: {
        status: !phoneState,
        msg: !phoneState ? i18n.__("invalidPhoneNumber") : "",
        valid: phoneState,
      },
    });
    if (!phoneState) {
      setInputPhoneFocus();
    } else {
      checkDisabled("phone");
    }
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
    if (!emailState) {
      setInputEmailFocus();
    } else {
      checkDisabled("email");
    }
  };

  const checkUsername = (username) => {
    //console.log("FIELDS2 ", fields);

    const userState = validUsername(username, config.usernameLength);
    let userError = userState !== "";
    let userMsg = "";
    if (userState === "EXISTS") {
      userMsg = i18n.__("usernameExists");
    }
    if (userState === "LENGTH") {
      userMsg = i18n.__("usernameError", { length: config.usernameLength });
    }
    if (userState === "SPACES") {
      userMsg = i18n.__("usernameError2");
    }

    setState({
      username: {
        status: userError,
        msg: userError ? userMsg : "",
        valid: !userError,
      },
    });
    if (userError) {
      setInputUsernameFocus();
    } else {
      checkDisabled("username");
    }
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
      console.log("PASSWORD ERROR MSG");
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
  return (
    <ProgressContainer title={i18n.__("createAccountTitle")} progress={33}>
      <Box mt={40} display="inline-flex">
        <Flex width={"168px"}>
          <Input
            placeholder={i18n.__("firstNamePlaceholder")}
            id={"firstName"}
            name={"firstName"}
            onChange={_handleChange}
            ref={inputFirstname}
            error={state.firstName.status}
            onBlur={(e) => checkName("firstName", e.target.value)}
          />
        </Flex>
        <Flex ml={25} width={"168px"}>
          <Input
            placeholder={i18n.__("lastNamePlaceholder")}
            id={"lastName"}
            name={"lastName"}
            onChange={_handleChange}
            ref={inputLastname}
            error={state.lastName.status}
            onBlur={(e) => checkName("lastName", e.target.value)}
          />
        </Flex>
      </Box>
      <Box mt={20}>
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
            onBlur={(e) => checkUsername(e.target.value)}
            promptMsg={i18n.__("usernamePrompt", {
              length: config.usernameLength,
            })}
            errorMsg={state.username.msg}
            error={state.username.status}
            ref={inputUsername}
          />
        </IconField>
      </Box>
      <Box mt={10}>
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
            onBlur={(e) => checkEmail(e.target.value)}
            promptMsg={i18n.__("emailPrompt")}
            errorMsg={state.email.msg}
            error={state.email.status}
            ref={inputEmail}
          />
        </IconField>
      </Box>
      <Box mt={10}>
        <IconField>
          <IconField.LeftIcon
            iconify={bxPhone}
            color={"componentPrimary"}
            size={"17"}
          />
          <IconField.InputField
            placeholder={i18n.__("phoneNumberPlaceholder")}
            id={"phone"}
            name={"phone"}
            onChange={_handleChange}
            onBlur={(e) => checkPhone(e.target.value)}
            promptMsg={i18n.__("phonePrompt")}
            errorMsg={state.phone.msg}
            error={state.phone.status}
            ref={inputPhone}
          />
        </IconField>
      </Box>
      <Box mt={10}>
        <PasswordField
          placeholder={i18n.__("passwordPlaceholder")}
          onFocus={(e) => {
            const checkResult = checkLengths();

            const validFields = Object.keys(checkResult).filter((fld) => {
              return checkResult[fld] === true;
            });
            console.log("FOCUS ", validFields);
            if (
              (validFields.length > 4 && !validFields.password) ||
              validFields.password
            ) {
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
            } else {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onBlur={(e) => {
            if (e.target.value.length !== 0) {
              console.log("BLUR CHECK");
              const inValidFields = Object.keys(fields).filter((fld) => {
                console.log("BLUR CHECK ", fld, fields[fld].status);
                return fields[fld].status === true;
              });
              console.log("BLUR CHECK ", inValidFields);
              if (inValidFields.length === 0) {
                const res = checkPasswordQuality(e.target.value);
                if (res) {
                  onPopper(e, false);
                }
              } else {
                e.preventDefault();
                e.stopPropagation();
              }
            } else {
              onPopper(e, false);
            }
          }}
          addPopper={addPopper}
          verifications={passwordVerification}
          id={"password"}
          name={"password"}
          onChange={(e) => {
            _handleChange(e);
            checkInputPassword(e.target.value);
          }}
          ref={inputPassword}
          promptMsg={i18n.__("passwordPrompt")}
          errorMsg={state.password.msg}
          error={state.password.status}
        />
      </Box>
      <Box mt={10}>
        <PasswordField
          placeholder={i18n.__("confirmPlaceholder")}
          id={"passwordConfirm"}
          name={"passwordConfirm"}
          onBlur={(e) => {
            checkConfirmPassword(e.target.value, true);
          }}
          onChange={(e) => {
            _handleChange(e);
            checkConfirmPassword(e.target.value);
          }}
          errorMsg={state.password.msg}
          error={state.password.status}
        />
      </Box>

      <Box mt={66 - (state.password.status ? 13 : 0)} display={"inline-flex"}>
        <Flex>
          <Button
            variation={"outline"}
            onClick={() => {
              onAction("signin");
            }}
          >
            {i18n.__("signInButton")}
          </Button>
        </Flex>
        <Flex ml={99}>
          <Button
            disabled={nextDisabled}
            onClick={() => {
              onAction("register");
            }}
          >
            {i18n.__("nextButton")}
          </Button>
        </Flex>
      </Box>
    </ProgressContainer>
  );
};

export default CreateAccount;
