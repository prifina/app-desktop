import {
  checkUsername,
  getVerification,
  getCountryCode,
  checkCognitoAttribute,
  getInstalledApps,
  getPrifinaApps,
  getPrifinaWidgets,
  getPrifinaUser,
  getPrifinaSession,
  listApps,
} from "./queries";
import {
  verifyCode,
  sendVerification,
  addSearchResult,
  addSearchKey,
  createNotification,
  updateActivity,
  installWidget,
  addPrifinaSession,
  updateUserProfile,
  newAppVersion,
  addAppVersion,
} from "./mutations";

//import Amplify, { Auth, API } from "aws-amplify";

/*
input SearchKeyInput {
	owner: String!
	searchKey: String
	role: String
}

input SearchResultInput {
	owner: String!
	searchKey: String!
	selectedResult: AWSJSON
}
*/

export const installWidgetMutation = (API, id, widget) => {
  return API.graphql({
    query: installWidget,
    variables: { id: id, widget: widget },
    authMode: "AWS_IAM",
  });
};
export const updateActivityMutation = (API, id, app) => {
  return API.graphql({
    query: updateActivity,
    variables: { id: id, activeApp: app },
    authMode: "AWS_IAM",
  });
};
export const createNotificationMutation = (API, input) => {
  return API.graphql({
    query: createNotification,
    variables: { input: input },
    authMode: "AWS_IAM",
  });
};
export const addSearchResultMutation = (API, input) => {
  return API.graphql({
    query: addSearchResult,
    variables: { input: input },
    authMode: "AWS_IAM",
  });
};
export const addSearchKeyMutation = (API, input) => {
  return API.graphql({
    query: addSearchKey,
    variables: { input: input },
    authMode: "AWS_IAM",
  });
};
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

export const checkUsernameQuery = (API, userName, poolID) => {
  return API.graphql({
    query: checkCognitoAttribute,
    variables: { attrName: "username", attrValue: userName, poolID: poolID },
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
  console.log("API ", id);
  return API.graphql({
    query: getPrifinaUser,
    variables: { id: id },
    authMode: "AWS_IAM",
  });
};

export const addPrifinaSessionMutation = (API, input) => {
  return API.graphql({
    query: addPrifinaSession,
    variables: { input: input },
    authMode: "AWS_IAM",
  });
};

export const getPrifinaSessionQuery = (API, tracker) => {
  return API.graphql({
    query: getPrifinaSession,
    variables: { tracker: tracker },
    authMode: "AWS_IAM",
  });
};

export const updateUserProfileMutation = (API, id, profile = null) => {
  return API.graphql({
    query: updateUserProfile,
    variables: { id: id, profile: profile },
    authMode: "AWS_IAM",
  });
};

export const listAppsQuery = (API, opts) => {
  // AMAZON_COGNITO_USER_POOLS
  return API.graphql({
    query: listApps,
    variables: {
      filter: opts.filter || {},
      limit: opts.limit || 100,
      sortDirection: opts.sortDirection || "DESC",
      nextToken: opts.nextToken || null,
    },
    authMode: "AWS_IAM",
  });
};

export const newAppVersionMutation = (API, id, prifinaId, opts) => {
  return API.graphql({
    query: newAppVersion,
    variables: {
      id: id,
      prifinaId: prifinaId,
      name: opts.name || null,
      title: opts.title || null,
      version: opts.version || null,
      appType: opts.appType || 1,
    },
    authMode: "AWS_IAM",
  });
};

export const addAppVersionMutation = (API, input) => {
  return API.graphql({
    query: addAppVersion,
    variables: { input: input },
    authMode: "AWS_IAM",
  });
};
