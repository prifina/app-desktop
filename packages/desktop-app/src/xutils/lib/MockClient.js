import { graphqlOperation } from "aws-amplify";
import { currentCreds, currentSession, cognitoUserCustom, cognitoUserDefault } from "./mocks/authModels";
import { coreMockups } from "./mocks/coreGraphqlMockups";
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

const qlMockups = {
  query: { ...coreMockups.query },
  mutation: { ...coreMockups.mutation }
}

// Auth Client...
class AUTHClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;
    this.client = "MOCKUP";
    this.AuthConfig = cnf?.AuthConfig || {}
    this.Options = cnf?.Options || {}
    //console.log("NEW Client ");
    // COGNITO.configure(AUTHConfig);
  }

  AUTHconfigure(cnf) {
    this.AuthConfig = cnf;
    return cnf;
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

  setPreferredMFA(mfaMethod) {
    //mfaMethod: "TOTP" | "SMS" | "NOMFA" | "SMS_MFA" | "SOFTWARE_TOKEN_MFA"
    return Promise.resolve(mfaMethod);
  }

  currentCredentials() {
    return Promise.resolve(currentCreds);
  }

  currentSession() {
    return Promise.resolve({
      ...currentSession,
      getIdToken: () => currentSession.idToken,
      getAccessToken: () => currentSession.accessToken,
      getRefreshToken: () => currentSession.refreshToken,
      isValid: true,
      getClockDrif: () => currentSession.clockDrift,
    });
  }


  confirmSignIn(user, code, mfaMethod) {
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

// AppSync ...
class AppSyncClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;
    this.client = "MOCKUP";
    this.config = cnf?.AppSyncConfig || {}
  }

  AppSyncConfigure(cnf) {
    this.config = cnf;
    return cnf;
  }

  // APPSYNC client Query
  query(rq, vars) {
    // import gql from "graphql-tag";

    // const test = await appSyncClient.query({
    //   query: gql(getCognitoUserDetails),
    //   variables: {},
    // });
    return Promise.resolve(true);
  }

  // APPSYNC client Mutation
  mutation(rq, vars) {
    return Promise.resolve(true);
  }
}

// Amplify GRAPHQL Client API ... Authmodes  AMAZON_COGNITO_USER_POOLS | AWS_IAM
class CoreGraphQLApi {
  constructor(cnf) {
    console.log("CORE MOCK ");
    this.config = cnf?.config || {}
    this.Options = cnf?.Options || {}
  }
  configure(apiConfig) {
    this.config = apiConfig;
    return true;
  }

  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
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

export { AUTHClient, CoreGraphQLApi };