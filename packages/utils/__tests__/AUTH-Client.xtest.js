
import { isDeepEqual } from "./tools";

// replace this later with lib under tests... 
import { currentCreds, currentSession, cognitoUserDefault, cognitoUserCustom } from "../src/lib/mocks/authModels";

import { mfaMethods } from "../src/lib/mocks/helpers";

let PrifinaClient;

(async () => {
  if (process.env.REACT_APP_MOCKUP_CLIENT === "true") {

    const {
      AUTHClient
    } = await import("../src/lib/MockClient");

    PrifinaClient = new AUTHClient();

  }
})();

import config from "../src/config";

let AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.auth_region,
  identityPoolRegion: config.main_region,
  //region: config.main_region,
  //authenticationFlowType: 'CUSTOM_AUTH'
};

describe('Client Auth testing...', () => {

  //console.log("COMPARE KEYS ", isDeepEqual(person1, person2));

  //it.todo('needs tests2');

  it("signIn, default authenticationFlowType", async () => {
    PrifinaClient.AUTHconfigure(AUTHConfig);
    //authenticationFlowType: 'CUSTOM_AUTH'
    const result = await PrifinaClient.signIn("test-user", "passwd");
    //console.log("RES ", result);
    expect(result.authenticationFlowType).toEqual("USER_SRP_AUTH");
  })

  it("signIn, custom authenticationFlowType", async () => {
    AUTHConfig.authenticationFlowType = 'CUSTOM_AUTH';
    PrifinaClient.AUTHconfigure(AUTHConfig);
    //authenticationFlowType: 'CUSTOM_AUTH'
    const result = await PrifinaClient.signIn("test-user");
    //console.log("RES ", result);
    expect(result.authenticationFlowType).toEqual("CUSTOM_AUTH");
  })
  it("signIn, UserNotFoundException", async () => {
    PrifinaClient.AUTHconfigure(AUTHConfig);
    PrifinaClient.setOption({ userExists: false, invalidUser: false })
    expect.assertions(1);
    try {
      await PrifinaClient.signIn("test-user");
      expect.anything();
    } catch (e) {
      //console.log("ERR ", e)
      expect(e["__type"]).toMatch("UserNotFoundException");
    }

  })

  it("signIn, NotAuthorizedException", async () => {
    PrifinaClient.AUTHconfigure(AUTHConfig);
    PrifinaClient.setOption({ userExists: true, invalidUser: true })
    expect.assertions(1);
    try {
      await PrifinaClient.signIn("test-user");
      expect.anything();
    } catch (e) {
      //console.log("ERR ", e)
      expect(e["__type"]).toMatch("NotAuthorizedException");
    }

  })

  it("sendCustomChallengeAnswer", async () => {
    AUTHConfig.authenticationFlowType = 'CUSTOM_AUTH';
    PrifinaClient.AUTHconfigure(AUTHConfig);
    // this is cognitoUser object....
    const user = {};
    const result = await PrifinaClient.sendCustomChallengeAnswer(user, "Test123!#@");
    //console.log("RES ", result);
    expect(result.authenticationFlowType).toEqual("CUSTOM_AUTH");
  })

  it("confirmSignIn", async () => {
    // this is cognitoUser object....
    const user = {};
    const result = await PrifinaClient.confirmSignIn(user, "123456", "SMS_MFA");
    //console.log("RES ", result);
    expect(result.authenticationFlowType).toEqual("USER_SRP_AUTH");
  })


  it("currentAuthenticatedUser", async () => {
    const result = await PrifinaClient.currentAuthenticatedUser();
    //console.log("RES ", result);
    expect(result.authenticationFlowType).toBeDefined();
    let cognitoUser = undefined;
    if (result.authenticationFlowType === "USER_SRP_AUTH") {
      cognitoUser = cognitoUserDefault;
    }
    if (result.authenticationFlowType === "CUSTOM_AUTH") {
      cognitoUser = cognitoUserCustom;
    }
    const compKeys = isDeepEqual(result, cognitoUser);
    expect(compKeys).toBeTruthy();

  })

  it("changePassword", async () => {
    // this is cognitoUser object....
    const user = {};
    const result = await PrifinaClient.changePassword(user, "oldPass", "newPass");
    expect(result).toEqual("SUCCESS");
  })


  it("currentSession", async () => {
    //console.log("CLIENT ", PrifinaClient)
    const result = await PrifinaClient.currentSession();
    //console.log(result)
    const mockSession = {
      ...currentSession,
      getIdToken: () => currentSession.idToken,
      getAccessToken: () => currentSession.accessToken,
      getRefreshToken: () => currentSession.refreshToken,
      isValid: true,
      getClockDrif: () => currentSession.clockDrift,
    }

    const compKeys = isDeepEqual(result, mockSession);
    //console.log("COMPARE ", compKeys);
    expect(compKeys).toBeTruthy();

  })

  it("currentCredentials", async () => {

    const result = await PrifinaClient.currentCredentials();
    const compKeys = isDeepEqual(result, currentCreds);
    expect(compKeys).toBeTruthy();

  })


  it("signOut", async () => {
    await PrifinaClient.signOut();
    expect.anything();
  })
  it("sendCustomChallengeAnswer", async () => {
    await PrifinaClient.sendCustomChallengeAnswer();
    expect.anything();
  })

  it("setPreferredMFA", async () => {
    //mfaMethod: "TOTP" | "SMS" | "NOMFA" | "SMS_MFA" | "SOFTWARE_TOKEN_MFA"

    const result = await PrifinaClient.setPreferredMFA("TOTP");
    expect(mfaMethods).toContain(result);
  })


  //const currentSession = await client.currentSession();


});
