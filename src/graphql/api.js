import {
  checkUsername,
  getVerification,
  getCountryCode,
  checkCognitoAttribute,
  getInstalledApps,
  getPrifinaApps,
  getPrifinaWidgets,
  getPrifinaUser,
} from "./queries";
import { verifyCode, sendVerification } from "./mutations";

//import Amplify, { Auth, API } from "aws-amplify";

export const sendVerificationMutation = (API, subject, message) => {
  return API.graphql({
    query: sendVerification,
    variables: { subject: subject, message: message },
    authMode: "AWS_IAM",
  });
};

export const verifyCodeMutation = (API, userCode) => {
  return API.graphql({
    query: verifyCode,
    variables: { user_code: userCode },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const getVerificationQuery = (API, userCode) => {
  return API.graphql({
    query: getVerification,
    variables: { user_code: userCode },
    authMode: "AWS_IAM",
  });
};

export const getCountryCodeQuery = API => {
  return API.graphql({
    query: getCountryCode,
    authMode: "AWS_IAM",
  });
};
export const getHeaderQuery = API => {
  return API.graphql({
    query: getHeader,
    authMode: "AWS_IAM",
  });
};
export const checkUsernameQuery = (API, userName) => {
  return API.graphql({
    query: checkUsername,
    variables: { userName: userName },
    authMode: "AWS_IAM",
  });
};

export const checkCognitoAttributeQuery = (
  API,
  attrName,
  attrValue,
  poolID,
) => {
  return API.graphql({
    query: checkCognitoAttribute,
    variables: { attrName: attrName, attrValue: attrValue, poolID: poolID },
    authMode: "AWS_IAM",
  });
};

export const getInstalledAppsQuery = (API, userName) => {
  return API.graphql({
    query: getInstalledApps,
    variables: { id: userName },
    authMode: "AWS_IAM",
  });
};

export const getPrifinaAppsQuery = (API, id) => {
  return API.graphql({
    query: getPrifinaApps,
    variables: { id: id },
    authMode: "AWS_IAM",
  });
};

export const getPrifinaWidgetsQuery = (API, id) => {
  return API.graphql({
    query: getPrifinaWidgets,
    variables: { id: id },
    authMode: "AWS_IAM",
  });
};

export const getPrifinaUserQuery = (API, id) => {
  return API.graphql({
    query: getPrifinaUser,
    variables: { id: id },
    authMode: "AWS_IAM",
  });
};
