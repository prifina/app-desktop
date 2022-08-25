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
  listSystemNotifications,
  listSystemNotificationsByDate,
  getSystemNotificationCount,
  getRequestToken,
  getAppVersion,
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
  updateAppVersion,
  addSystemNotification,
  createSystemNotification,
  updatePrifinaUser,
  addUserToCognitoGroup,
  deleteAppVersion,
  changeUserPassword,
  updateCognitoUser,
} from "./mutations";

// until the amplify identitypoolregion bug is fixed...
import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";

import AWSAppSyncClient, { AUTH_TYPE, createAppSyncLink } from "aws-appsync";
//import { AppSyncClient } from "@aws-sdk/client-appsync";

import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
const { setContext } = require("apollo-link-context");

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

export const cognitoCredentials = async currentSession => {
  const token = currentSession.getIdToken().payload;
  const userIdPool = localStorage.getItem("LastSessionIdentityPool");
  //const provider='cognito-idp.'+userPoolRegion+'.amazonaws.com/'+userPoolId;
  const provider = token["iss"].replace("https://", "");
  let identityParams = {
    IdentityPoolId: userIdPool,
    Logins: {},
  };
  const idToken = currentSession.getIdToken().getJwtToken();
  identityParams.Logins[provider] = idToken;
  const cognitoClient = new CognitoIdentityClient({
    region: userIdPool.split(":")[0],
  });
  //console.log(identityParams);
  const cognitoIdentity = await cognitoClient.send(
    new GetIdCommand(identityParams),
  );
  //console.log("COGNITO IDENTITY ", cognitoIdentity);

  let credentialParams = {
    IdentityId: cognitoIdentity.IdentityId,
    Logins: {},
  };

  credentialParams.Logins[provider] = idToken;
  //console.log(credentialParams);
  const cognitoIdentityCredentials = await cognitoClient.send(
    new GetCredentialsForIdentityCommand(credentialParams),
  );
  console.log("COGNITO IDENTITY CREDS ", cognitoIdentityCredentials);
  const clientCredentials = {
    identityId: cognitoIdentity.IdentityId,
    accessKeyId: cognitoIdentityCredentials.Credentials.AccessKeyId,
    secretAccessKey: cognitoIdentityCredentials.Credentials.SecretKey,
    sessionToken: cognitoIdentityCredentials.Credentials.SessionToken,
    expiration: cognitoIdentityCredentials.Credentials.Expiration,
    authenticated: true,
  };
  return clientCredentials;
};
export const createClient = async (endpoint, region, currentSession) => {
  /*
    // this is not authenticated credentials, because of amplify bug...
    Auth.currentCredentials().then(c => {
      console.log("HOME USER CLIENT ", c);
    });
    */

  console.log("CLIENT ", endpoint, region, currentSession);

  const token = currentSession.getIdToken().payload;
  const userIdPool = localStorage.getItem("LastSessionIdentityPool");
  //const provider='cognito-idp.'+userPoolRegion+'.amazonaws.com/'+userPoolId;
  const provider = token["iss"].replace("https://", "");
  let identityParams = {
    IdentityPoolId: userIdPool,
    Logins: {},
  };
  const idToken = currentSession.getIdToken().getJwtToken();
  identityParams.Logins[provider] = idToken;
  const cognitoClient = new CognitoIdentityClient({
    region: userIdPool.split(":")[0],
  });
  //console.log(identityParams);
  const cognitoIdentity = await cognitoClient.send(
    new GetIdCommand(identityParams),
  );
  //console.log("COGNITO IDENTITY ", cognitoIdentity);

  let credentialParams = {
    IdentityId: cognitoIdentity.IdentityId,
    Logins: {},
  };

  credentialParams.Logins[provider] = idToken;
  //console.log(credentialParams);
  const cognitoIdentityCredentials = await cognitoClient.send(
    new GetCredentialsForIdentityCommand(credentialParams),
  );
  console.log("COGNITO IDENTITY CREDS ", cognitoIdentityCredentials);
  const clientCredentials = {
    identityId: cognitoIdentity.IdentityId,
    accessKeyId: cognitoIdentityCredentials.Credentials.AccessKeyId,
    secretAccessKey: cognitoIdentityCredentials.Credentials.SecretKey,
    sessionToken: cognitoIdentityCredentials.Credentials.SessionToken,
    expiration: cognitoIdentityCredentials.Credentials.Expiration,
    authenticated: true,
  };
  localStorage.setItem(
    "PrifinaClientCredentials",
    JSON.stringify(clientCredentials),
  );

  //const clientCredentials = await cognitoCredentials(currentSession);

  const AppSyncConfig = {
    url: endpoint,
    region: region,
    auth: {
      type: AUTH_TYPE.AWS_IAM,
      credentials: clientCredentials,
    },
    disableOffline: true,
  };

  const client = new AWSAppSyncClient(AppSyncConfig, {
    link: new createAppSyncLink({
      ...AppSyncConfig,
      resultsFetcherLink: ApolloLink.from([
        setContext((request, previousContext) => {
          //console.log("APOLLO ", previousContext, request);
          return {
            headers: {
              ...previousContext.headers,
              "prifina-user": idToken,
            },
          };
        }),
        createHttpLink({
          uri: AppSyncConfig.url,
        }),
      ]),
    }),
  });

  return Promise.resolve(client);

  /*
    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        //credentials: () => Auth.currentCredentials(),
      },

      disableOffline: true,
    });
    return client;
    */
  /*
    const AppSyncConfig = {
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },

      disableOffline: true,
    };
    const client = new AWSAppSyncClient(AppSyncConfig, {
      link: new createAppSyncLink({
        ...AppSyncConfig,
        resultsFetcherLink: ApolloLink.from([
          setContext((request, previousContext) => {
            console.log("APOLLO ", previousContext, request);
            return {
              headers: {
                ...previousContext.headers,
                "x-tro-organization": "TESTING-HEADER",
              },
            };
          }),
          createHttpLink({
            uri: AppSyncConfig.url,
          }),
        ]),
      }),
    });

    console.log("USER CLIENT ", client);
    */
};

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

export const deleteAppVersionMutation = (API, id) => {
  return API.graphql({
    query: deleteAppVersion,
    variables: { id: id },
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

export const updateAppVersionMutation = (API, input) => {
  return API.graphql({
    query: updateAppVersion,
    variables: { input: input },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const addSystemNotificationMutation = (API, input) => {
  return API.graphql({
    query: addSystemNotification,
    variables: { input: input },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const createSystemNotificationMutation = (API, input) => {
  return API.graphql({
    query: createSystemNotification,
    variables: { input: input },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const getSystemNotificationCountQuery = (API, id) => {
  //console.log("API ", id);
  return API.graphql({
    query: getSystemNotificationCount,
    variables: { id: id },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const listSystemNotificationsQuery = (API, opts) => {
  // AMAZON_COGNITO_USER_POOLS
  return API.graphql({
    query: listSystemNotifications,
    variables: {
      filter: opts.filter || {},
      limit: opts.limit || 100,
      sortDirection: opts.sortDirection || "DESC",
      nextToken: opts.nextToken || null,
    },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const listSystemNotificationsByDateQuery = (API, opts) => {
  // AMAZON_COGNITO_USER_POOLS
  return API.graphql({
    query: listSystemNotificationsByDate,
    variables: {
      owner: opts.owner,
      filter: opts.filter || {},
      limit: opts.limit || 100,
      sortDirection: opts.sortDirection || "DESC",
      nextToken: opts.nextToken || null,
    },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const updatePrifinaUserMutation = (API, input) => {
  return API.graphql({
    query: updatePrifinaUser,
    variables: { input: input },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const getRequestTokenQuery = (API, id, source, status) => {
  return API.graphql({
    query: getRequestToken,
    variables: { id: id, source: source, status: status },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const getAppVersionQuery = (API, id) => {
  return API.graphql({
    query: getAppVersion,
    variables: { id: id },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};
export const addUserToCognitoGroupMutation = (API, id, group) => {
  return API.graphql({
    query: addUserToCognitoGroup,
    variables: { id: id, group: group },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};
export const changeUserPasswordMutation = (API, code, pw) => {
  return API.graphql({
    query: changeUserPassword,
    variables: { code: code, pass: pw },
    authMode: "AWS_IAM",
  });
};

export const updateCognitoUserMutation = (API, attrName, attrValue) => {
  return API.graphql({
    query: updateCognitoUser,
    variables: { attrName: attrName, attrValue: attrValue },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};
