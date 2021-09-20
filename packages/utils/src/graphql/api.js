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
  listAppMarket,
  listDataSources,
  getLoginUserIdentityPool,
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
  deletePrifinaSession,
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
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};
export const updateActivityMutation = (API, id, app) => {
  return API.graphql({
    query: updateActivity,
    variables: { id: id, activeApp: app },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};
export const createNotificationMutation = (API, input) => {
  return API.graphql({
    query: createNotification,
    variables: { input: input },
    authMode: "AMAZON_COGNITO_USER_POOLS",
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
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const getPrifinaAppsQuery = (API, id) => {
  return API.graphql({
    query: getPrifinaApps,
    variables: { id: id },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const getPrifinaWidgetsQuery = (API, id) => {
  return API.graphql({
    query: getPrifinaWidgets,
    variables: { id: id },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const getPrifinaUserQuery = (API, id) => {
  //console.log("API ", id);
  return API.graphql({
    query: getPrifinaUser,
    variables: { id: id },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const addPrifinaSessionMutation = (API, input) => {
  return API.graphql({
    query: addPrifinaSession,
    variables: { input: input },
    authMode: "AMAZON_COGNITO_USER_POOLS",
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
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const listAppMarketQuery = (API, opts) => {
  // AMAZON_COGNITO_USER_POOLS
  return API.graphql({
    query: listAppMarket,
    variables: {
      filter: opts.filter || {},
      limit: opts.limit || 100,
      sortDirection: opts.sortDirection || "DESC",
      nextToken: opts.nextToken || null,
    },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const deletePrifinaSessionMutation = (API, tracker) => {
  return API.graphql({
    query: deletePrifinaSession,
    variables: { tracker: tracker },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const listDataSourcesQuery = (API, opts) => {
  // AMAZON_COGNITO_USER_POOLS
  return API.graphql({
    query: listDataSources,
    variables: {
      filter: opts.filter || {},
      limit: opts.limit || 100,
      sortDirection: opts.sortDirection || "DESC",
      nextToken: opts.nextToken || null,
    },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const getLoginUserIdentityPoolQuery = (API, username, poolID) => {
  return API.graphql({
    query: getLoginUserIdentityPool,
    variables: { username: username, poolID: poolID },
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
    authMode: "AMAZON_COGNITO_USER_POOLS",
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
      identity: opts.identity || null,
      identityPool: opts.identityPool || null,
    },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const addAppVersionMutation = (API, input) => {
  return API.graphql({
    query: addAppVersion,
    variables: { input: input },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};
