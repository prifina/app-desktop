import { graphqlOperation } from "aws-amplify";
import gql from "graphql-tag";
import { currentCreds, currentSession, cognitoUserCustom, cognitoUserDefault } from "./mocks/authModels";
import { coreMockups } from "./mocks/coreGraphqlMockups";
import { userMockups } from "./mocks/userAppsyncMockups";
//console.log("CONFIG ", config);
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

import { getSandboxData } from "./mocks/athenaData";
import { getSubscriptionData } from "./mocks/subscriptionData";

import { getRandomInt, timeout } from "./mocks/helpers";


//import 
//const test = require("@dynamic-data/oura-mockups")["getSleepMockupData"];
//console.log("OURA", test);
//import * as TEST from "@dynamic-data/oura-mockups";
//console.log("OURA", TEST);

//parseFilter,
//getMockedData,

const qlMockups = {
  query: { ...coreMockups.query },
  mutation: { ...coreMockups.mutation }
}

const appsyncMockups = {
  query: { ...userMockups.query },
  mutation: { ...userMockups.mutation }
}

const shortId = () => {
  // this is unique enough...
  return Math.random().toString(36).slice(-10);
}

// Auth Client...
class AUTHClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;
    this.client = "MOCKUP";
    this.AuthConfig = cnf?.AuthConfig || {}
    this.Options = cnf?.Options || {}
    this.Authenticated = config.MOCKUP_INIT_AUTH_STATE;
    //console.log("NEW Client ");
    // COGNITO.configure(AUTHConfig);
  }

  AUTHConfigure(cnf) {
    this.AuthConfig = { ...this.AuthConfig, ...cnf };
    return this.AuthConfig;
  }
  setAuthenticated(status) {
    localStorage.setItem("_mockCognitoAuthenticationStatus", status);
    this.Authenticated = status;
  }
  getAuthenticated() {

    return this.Authenticated;
  }
  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  signOut() {
    return Promise.resolve(true);
  }

  signUp() {
    return Promise.resolve(true);
  }

  signIn(uname, passwd) {
    let cognitoUser = cognitoUserDefault;
    console.log("AUTH FLOW ", this.AuthConfig.authenticationFlowType);
    if (this.AuthConfig?.authenticationFlowType && this.AuthConfig.authenticationFlowType === 'CUSTOM_AUTH') {
      cognitoUser = cognitoUserCustom;
    }
    console.log("OPTS ", this.Options);
    if (this.Options.hasOwnProperty("userExists") && !this.Options.userExists) {
      cognitoUser = { "__type": "UserNotFoundException", "message": "User does not exist." };
      return Promise.reject(cognitoUser);
    }
    if (this.Options.hasOwnProperty("invalidUser") && this.Options.invalidUser) {
      cognitoUser = { "__type": "NotAuthorizedException", "message": "Incorrect username or password." };
      return Promise.reject(cognitoUser);
    }
    return Promise.resolve(cognitoUser);
  }

  sendCustomChallengeAnswer(user, answer) {
    return Promise.resolve(cognitoUserCustom);
  }

  setPreferredMFA(user, mfaMethod) {
    //mfaMethod: "TOTP" | "SMS" | "NOMFA" | "SMS_MFA" | "SOFTWARE_TOKEN_MFA"
    return Promise.resolve(mfaMethod);
  }

  currentCredentials() {
    return Promise.resolve(currentCreds);
  }

  currentSession() {
    //console.log(config.MOCKUP_INIT_AUTH_STATE);
    const currentAuth = localStorage.getItem("_mockCognitoAuthenticationStatus") === "true" || config.MOCKUP_INIT_AUTH_STATE;
    console.log("AUTH ", currentAuth, typeof currentAuth);

    if (currentAuth) {
      return Promise.resolve({
        ...currentSession,
        getIdToken: () => currentSession.idToken,
        getAccessToken: () => currentSession.accessToken,
        getRefreshToken: () => currentSession.refreshToken,
        isValid: true,
        getClockDrif: () => currentSession.clockDrift,
      });
    } else {
      return Promise.reject("No current user")
    }

  }


  confirmSignIn(user, code, mfaMethod) {
    //return Promise.reject("CONFIRM FAILED")
    return Promise.resolve(cognitoUserDefault);
  }

  currentAuthenticatedUser() {
    let cognitoUser = cognitoUserDefault;
    if (this.AuthConfig?.authenticationFlowType && this.AuthConfig.authenticationFlowType === 'CUSTOM_AUTH') {
      cognitoUser = cognitoUserCustom;
    }
    return Promise.resolve(cognitoUser);
  }

  changePassword(user, oldPwd, newPwd) {
    return Promise.resolve("SUCCESS");
  }

}

class SubscribeClient {
  constructor(init) {
    // query,variables...
    console.log("INIT ", init)
    this.query = init.query;
    this.variables = init.variables;
  }

  subscribe(args) {
    // next(), error()
    console.log("ARGS ", args)
    // send test notification..
    args.next({ data: "Subsription Testing..." });
    // random subscription handler
    // this should be unsubscribe()
    return shortId();
  }
}

// AppSync ...
class AppSyncClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;
    this.client = "MOCKUP";
    this.config = cnf?.AppSyncConfig || {}
    this.Options = cnf?.Options || {}
    this.subscriptions = [];
    this.callback = undefined;
  }

  AppSyncConfigure(cnf) {
    this.config = { ...this.config, ...cnf };
    return this.config;
  }
  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  setCallback(fn) {
    this.callback = fn;
  }
  // APPSYNC client Query
  query(rq, vars) {
    console.log("APPSYNC QUERY ", rq);
    console.log("APPSYNC QUERY VARS ", vars);

    if (vars === undefined && rq?.query !== undefined && rq?.variables !== undefined && rq.variables.input !== undefined) {
      console.log("PROVIDER QUERY ", rq.variables);
      //console.log("SANDBOX ", SANDBOX)
      return getSandboxData(rq.variables, this.callback);
    }
    console.log("APPSYNC QUERY ", gql(rq));
    const ql = gql(rq);
    //console.log(ql.definitions[0].name)
    //console.log(ql.definitions[0])
    //console.log(JSON.stringify(ql.definitions[0].selectionSet.selections[0]))
    // const test = await appSyncClient.query({
    //   query: gql(getCognitoUserDetails),
    //   variables: {},
    // });
    //return Promise.resolve(true);

    return Promise.resolve(appsyncMockups["query"][ql.definitions[0].name.value](vars, this.Options));
  }

  // APPSYNC client Mutation
  mutation(rq, vars) {
    const ql = gql(rq);
    return Promise.resolve(appsyncMockups["mutation"][ql.definitions[0].name.value](vars, this.Options));
    // return Promise.resolve(true);
  }
  subscribe(rq, vars) {
    // return new SubscribeClient({ query: gql(rq), variables: vars })
    const subscribtionID = shortId();
    this.subscriptions.push(subscribtionID);
    return subscribtionID;
  }
}

/*
let graphQLClient = undefined;
if (type === 'query') {
  graphQLClient = client.query({ query: gql(rq), variables: vars, });
}
if (type === 'mutation') {
  graphQLClient = client.mutate({ mutation: gql(rq), variables: vars, });
}
*/

// Amplify GRAPHQL Client API ... Authmodes  AMAZON_COGNITO_USER_POOLS | AWS_IAM
class CoreGraphQLApi {
  constructor(cnf) {
    console.log("CORE MOCK ");
    this.config = cnf?.config || {}
    this.Options = cnf?.Options || {}
    this.subscriptions = {};
    this.callback = undefined;
    this.timers = {};
  }
  configure(apiConfig) {
    this.config = { ...this.config, ...apiConfig };
    return this.config;
  }

  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }

  setCallback(fn) {
    this.callback = fn;
  }
  unsubscribe(subscriptionID) {
    this.subscriptions[subscriptionID].disconnect();
  }
  subscribe(rq, vars) {

    const subscribtionID = shortId();

    const ql = gql(rq);
    // const socket = getSubscriptionData(this.callback, vars, ql.definitions[0].name.value);
    //this.subscriptions[subscribtionID] = socket;
    if (process.env.REACT_APP_USE_MOCKUP_SERVER === "true") {
      const socket = getSubscriptionData(this.callback, vars, ql.definitions[0].name.value);
      this.subscriptions[subscribtionID] = socket;
    } else {
      this.subscriptions[subscribtionID] = { disconnect: () => { } };
    }

    //console.log("Subscribe ", ql, vars);
    /*
    // there are no back end subscription notifications.... create something timer based examples, so can call registered callback
    const timerInterval = getRandomInt(5, 15);
    const timer = setInterval(() => {
      // generate mockup notification.... 
      this.callback({ "data": "OK" });
    }, timerInterval * 1000 * 60);
    this.timers[subscribtionID] = timer;
    */
    return subscribtionID;
  }
  graphql(
    query = undefined,
    variables = {},
    authMode = "AMAZON_COGNITO_USER_POOLS",
  ) {

    const ql = graphqlOperation(query, variables);
    // console.log("QL ", ql);
    // query:"mutation updateCognitoUser($attrName: String!, $attrValue: String!) {\n  \n  updateCognitoUser( attrName: $attrName, attrValue: $attrValue)\n}"
    const op = ql.query.split(" ")[0];
    const fn = ql.query.split(" ")[1].split("(")[0];
    /* console.log("MOCK QL ", qlMockups);
    console.log("MOCK OP ", op);
    console.log("MOCK FN ", fn); */

    return Promise.resolve(qlMockups[op][fn](ql.variables, this.Options));
  }

};

class S3Storage {
  constructor(cnf) {
    this.client = "MOCKUP";
    this.config = cnf?.S3Config || {}
    this.Options = cnf?.Options || {}
    this.callback = undefined;
  }
  configure(cnf) {
    this.config = { ...this.config, ...cnf };
    return this.config;
  }
  /*
  const getImage = s3Key => {
    console.log("GET IMAGE URL ", s3Key);
    return new Promise(function (resolve, reject) {
  
      Storage.get(s3Key, { level: "public", download: false })
        .then(url => {
          var myRequest = new Request(url);
          fetch(myRequest).then(function (response) {
            if (response.status === 200) {
              console.log("URL ", url);
              resolve(url);
            } else {
              console.log("S3 ERROR ", response);
              reject(response.status);
            }
          });
        })
        .catch(err => {
          console.log("S3 ERROR ", err);
          reject(err);
        });
    });
  };
  */
  get(s3Key, options) {
    //getImage(appID + "/assets/" + images[idx]).
    //const icon = JSON.parse(localStorage.getItem("_mockPrifinaS3_xxxxyyyyzzzzz/assets/icon-1.png"));

    return new Promise(function (resolve, reject) {
      const img = localStorage.getItem("_mockPrifinaS3_" + s3Key);
      if (img !== null) {
        const imgJSON = JSON.parse(img);
        resolve(imgJSON.url);
      } else {
        resolve("");
      }
    });
  }
  put(s3Key, fileHandler, options) {

    console.log("FILE ", fileHandler.name, fileHandler.size, options)
    const totalSize = fileHandler.size;

    const reader = new FileReader();

    reader.readAsDataURL(fileHandler);

    reader.addEventListener('load', () => {
      //localStorage.setItem('thumbnail', reader.result);
      localStorage.setItem("_mockPrifinaS3_" + s3Key, JSON.stringify({ url: reader.result, key: s3Key, ...options }));
    });

    //options.progressCallback({ loaded: totalSize, total: totalSize });
    /*
        {
          "level": "public",
          "metadata": {
              "created": "2023-02-16T05:22:25.590Z",
              "alt-name": "project_openai_codex-main.zip"
          },
          "customPrefix": {
              "public": "uploads/"
          }
      }
      
      */
    return new Promise((resolve, reject) => {

      if (options?.progressCallback !== undefined) {
        //console.log("PROGRESS OPTION")
        let splitCnt = 0;
        let loaded = 0;
        (async function () {
          do {
            loaded = Math.floor(totalSize * (splitCnt * 20 / 100));
            if (loaded > totalSize) {
              loaded = totalSize;
            }
            splitCnt++;
            //console.log("PROGRESS OPTION ", loaded, totalSize)
            options.progressCallback({ loaded: loaded, total: totalSize })
            await timeout(500)
          } while (loaded < totalSize);

          resolve({
            ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
            ServerSideEncryption: "AES256",
            VersionId: "CG612hodqujkf8FaaNfp8U..FIhLROcp"
          })

        })()

      }
      /*
            resolve({
              ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
              ServerSideEncryption: "AES256",
              VersionId: "CG612hodqujkf8FaaNfp8U..FIhLROcp"
            })
            */

    });

  }
}


export { AUTHClient, CoreGraphQLApi, AppSyncClient, S3Storage };