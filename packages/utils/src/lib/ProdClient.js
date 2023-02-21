import { graphqlOperation } from "aws-amplify";
import gql from "graphql-tag";
import { Amplify, API, Auth } from "aws-amplify";

//AppSync and Apollo libraries
import AWSAppSyncClient, { AUTH_TYPE, createAppSyncLink } from "aws-appsync";

/*
 https://aws-amplify.github.io/amplify-js/api/classes/authclass.html

changePassword
completeNewPassword
configure
confirmSignIn
confirmSignUp
currentAuthenticatedUser
currentCredentials
currentSession
currentUserCredentials
currentUserInfo
currentUserPoolUser
deleteUser
deleteUserAttributes
disableSMS
enableSMS
essentialCredentials
federatedSignIn
fetchDevices
forgetDevice
forgotPassword
forgotPasswordSubmit
getMFAOptions
getModuleName
getPreferredMFA
rememberDevice
resendSignUp
sendCustomChallengeAnswer
setPreferredMFA
setupTOTP
signIn
signOut
signUp
updateUserAttributes
userAttributes
userSession
verifiedContact
verifyCurrentUserAttribute
verifyCurrentUserAttributeSubmit
verifyTotpToken
verifyUserAttribute
verifyUserAttributeSubmit
wrapRefreshSessionCallback
*/

import config from "../config";
/*
const qlMockups = {
  query: { ...coreMockups.query },
  mutation: { ...coreMockups.mutation }
}

const appsyncMockups = {
  query: { ...userMockups.query },
  mutation: { ...userMockups.mutation }
}
*/

const shortId = () => {
  // this is unique enough...
  return Math.random().toString(36).slice(-10);
}

//Auth.configure(AUTHConfig);
//API.configure(APIConfig);

// Auth Client...
class AUTHClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;
    this.Client = Auth;
    this.AuthConfig = cnf?.AuthConfig || {}
    this.Client.configure(this.AuthConfig);
    this.Options = cnf?.Options || {}
    this.Authenticated = undefined;
  }

  AUTHConfigure(cnf) {
    this.AuthConfig = { ...this.AuthConfig, ...cnf };
    this.Client.configure(this.AuthConfig);
    return this.AuthConfig;
  }
  setAuthenticated(status) {
    this.Authenticated = status;
  }
  getAuthenticated() {
    return this.Authenticated;
  }
  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  signOut() {
    return this.Client.signOut();
  }
  signUp(user) {
    return this.Client.signUp(user);
  }
  signIn(uname, passwd) {
    return this.Client.signIn(uname, passwd);
  }

  sendCustomChallengeAnswer(user, answer) {
    return this.Client.sendCustomChallengeAnswer(user, answer);
  }
  setPreferredMFA(user, mfaMethod) {
    //mfaMethod: "TOTP" | "SMS" | "NOMFA" | "SMS_MFA" | "SOFTWARE_TOKEN_MFA"
    return this.Client.setPreferredMFA(user, mfaMethod);
  }

  currentCredentials() {
    return this.Client.currentCredentials();
  }

  currentSession() {
    return this.Client.currentSession();
  }

  confirmSignIn(user, code, mfaMethod = "SMS_MFA") {
    return this.Client.confirmSignIn(
      user,
      code,
      mfaMethod
    );
  }

  currentAuthenticatedUser() {
    return this.Client.currentAuthenticatedUser();
  }

  changePassword(user, oldPwd, newPwd) {
    return this.Client.changePassword(
      user,
      oldPwd,
      newPwd
    );
  }

}

const CreateClient = () => {
  return Auth.currentSession();
  /*
  export const getClient = async () => {
    return new AWSAppSyncClient({
      url: API_URL,
      region: process.env.aws_s3_region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },
      complexObjectsCredentials: () => Auth.currentCredentials(),
      disableOffline: true,
    })
  }
  */
}

// AppSync ...
class xAppSyncClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;

    this.config = cnf?.AppSyncConfig || {}
    console.log("AppSyncClient ", this.config);
    /*
    const appSync = {
      ...this.config,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        // Get the currently logged in users credential.
        jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
      },
      // Amplify uses Amazon IAM to authorize calls to Amazon S3. This provides the relevant IAM credentials.
      complexObjectsCredentials: () => Auth.currentCredentials(),
      disableOffline: true,
    }
    console.log("AppSyncClient ", appSync);
    CreateClient().then(client => {
      console.log("Create Client ", client);
    });
    */
    /*
    // AppSync client instantiation
    this.Client = new AWSAppSyncClient({
      ...this.config,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        // Get the currently logged in users credential.
        jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
      },
      // Amplify uses Amazon IAM to authorize calls to Amazon S3. This provides the relevant IAM credentials.
      complexObjectsCredentials: () => Auth.currentCredentials()
    });
    */
    // AppSync client instantiation
    this.Client = undefined;


    this.Options = cnf?.Options || {}
    this.subscriptions = {};
    this.callback = undefined;
  }

  AppSyncConfigure(cnf) {
    this.config = { ...this.config, ...cnf };
    // this changes Amplify graphQL client config.... 
    //Amplify.configure(this.config);
    return this.config;
  }
  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  setCallback(fn) {
    this.callback = fn;
  }
  // APPSYNC client Mutation
  mutation(rq, vars) {
    return this.Client.mutate({ mutation: gql(rq), variables: vars });
  }
  // APPSYNC client Query
  query(rq, vars = {}) {
    return this.Client.query({ query: gql(rq), variables: vars });
  }
  unsubscribe(subscriptionID) {
    // Stop receiving data updates from the subscription
    this.subscriptions[subscriptionID].unsubscribe();
  }
  subscribe(rq, vars) {

    const subscriptionID = shortId();
    const subscription = this.Client.subscribe({ query: gql(rq), variables: vars }).subscribe({
      next: res => this.callback(res),
      error: error => {
        console.error(error);
        // update({ ERROR: JSON.stringify(error) });
        // handle this error ???
        ///message: "Connection failed: com.amazon.coral.service#ExpiredTokenException"
      }
    });

    this.subscriptions[subscriptionID] = subscription;
    return subscriptionID;
  }
}


// AppSync ...
class AppSyncClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;

    this.config = cnf?.AppSyncConfig || {}
    console.log("AppSyncClient ", this.config);

    this.Client = API;

    this.Client.configure(this.config);
    this.Options = cnf?.Options || {}
    this.subscriptions = {};
    this.callback = undefined;
  }

  AppSyncConfigure(cnf) {
    this.config = { ...this.config, ...cnf };
    // this changes Amplify graphQL client config.... 
    //Amplify.configure(this.config);
    //identityPoolRegion: 'XX-XXXX-X',
    //graphql_endpoint_iam_region: 'us-east-1' 
    this.config.aws_appsync_authenticationType = AUTH_TYPE.AWS_IAM;
    this.config.API = {
      graphql_headers: async () => ({
        'prifina-user': (await Auth.currentSession()).getIdToken().getJwtToken()
      })
    }
    /*
    this.config.API.graphql_headers = async () => ({
      'My-Custom-Header': 'my value' // Set Custom Request Headers for non-AppSync GraphQL APIs
    })
    */
    /*
    {
      jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
    }
    */
    /*
    API: {
      graphql_endpoint: 'https:/www.example.com/my-graphql-endpoint',
      graphql_headers: async () => ({
        'My-Custom-Header': 'my value' // Set Custom Request Headers for non-AppSync GraphQL APIs
      })
    }
    */
    this.Client.configure(this.config);
    return this.config;
  }
  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  setCallback(fn) {
    this.callback = fn;
  }

  unsubscribe(subscriptionID) {
    // Stop receiving data updates from the subscription
    this.subscriptions[subscriptionID].unsubscribe();
  }

  subscribe(rq, vars) {

    const subscriptionID = shortId();
    this.Client.configure(this.config);
    const subscription = this.Client.graphql(graphqlOperation(rq, vars)).subscribe({
      next: ({ provider, value }) => { this.callback(provider, value) },
      error: error => {
        console.error(error);
        // do we need to throw exception here ???
      }
    });

    this.subscriptions[subscriptionID] = subscription;

    return subscriptionID;
  }
  /*
  graphql(
    query = undefined,
    variables = {},
    authMode = "AWS_IAM",
  ) {
    console.log("CORE graphql ", query);
    console.log("CORE graphql ", this.Client);
    return this.Client.graphql({ query, variables, authMode });
  }
  */

  // APPSYNC client Mutation
  mutation(rq, vars) {
    //graphqlOperation(queries.getTodo, { id: 'some id' })
    console.log("USER graphql mutation ", rq);
    this.Client.configure(this.config);
    return this.Client.graphql(graphqlOperation(rq, vars));
    //return this.Client.mutate({ mutation: gql(rq), variables: vars });
  }
  // APPSYNC client Query
  query(rq, vars = {}) {
    console.log("USER graphql query ", rq);
    this.Client.configure(this.config);
    return this.Client.graphql(graphqlOperation(rq, vars));
    // return this.Client.query({ query: gql(rq), variables: vars });
  }

}

// Amplify GRAPHQL Client API ... Authmodes  AMAZON_COGNITO_USER_POOLS | AWS_IAM
class CoreGraphQLApi {
  constructor(cnf) {

    this.Client = API;
    this.config = cnf?.config || {}
    this.Client.configure(this.config);
    this.Options = cnf?.Options || {}
    this.subscriptions = {};
    this.callback = undefined;
    this.timers = {};
  }
  configure(apiConfig) {
    this.config = { ...this.config, ...apiConfig };
    this.Client.configure(this.config);
    return this.config;
  }

  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  setCallback(fn) {
    this.callback = fn;
  }

  unsubscribe(subscriptionID) {
    // Stop receiving data updates from the subscription
    this.subscriptions[subscriptionID].unsubscribe();
  }

  subscribe(rq, vars) {

    const subscriptionID = shortId();

    this.Client.configure(this.config);
    const subscription = this.Client.graphql(graphqlOperation(rq, vars)).subscribe({
      next: ({ provider, value }) => { this.callback(provider, value) },
      error: error => {
        console.error(error);
        // Connection failed: {"errors":[{"errorType":"Unauthorized","message":"Not Authorized to access newSystemNotification on type Subscription"}]}
        // do we need to throw exception here ???
      }
    });

    this.subscriptions[subscriptionID] = subscription;

    return subscriptionID;
  }
  graphql(
    query = undefined,
    variables = {},
    authMode = "AMAZON_COGNITO_USER_POOLS",
  ) {
    console.log("CORE graphql ", query);
    this.Client.configure(this.config);
    console.log("CORE graphql ", this.Client);

    return this.Client.graphql({ query, variables, authMode });
  }
};

export { AUTHClient, CoreGraphQLApi, AppSyncClient };