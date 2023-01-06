import config from "../config";

console.log("CONFIG ", config);

// AppSync & Auth Client...
class GraphQLClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;
    this.client = "TEST";
    console.log("NEW Client ");
    // COGNITO.configure(AUTHConfig);
  }

  AUTHconfigure(cnf) {
    return Promise.resolve(true);
    /*
    this.AuthConfig = cnf;
    if (config.MOCKUP_CLIENT) {
      const result = Auth.configure(cnf);
      return result;
    }
    return COGNITO.configure(cnf);
    */
  }

  APIconfigure(cnf) {
    return Promise.resolve(true);
    /*
    this.config = cnf;
    const result = API.configure(cnf);
    return result;
    */
  }

  signOut() {
    return Promise.resolve(true);
  }

  signUp() {
    return Promise.resolve(true);
  }

  signIn(uname, passwd) {
    return Promise.resolve(true);
    /*
    if (config.MOCKUP_CLIENT) {
      return Promise.resolve(true);
    }
    console.log("SIGN IN ", uname);

    return COGNITO.signIn(uname, passwd);
    */
  }

  sendCustomChallengeAnswer(user, answer) {
    return Promise.resolve(true);
    /*
    if (config.MOCKUP_CLIENT) {
      return Promise.resolve(true);
    }
    // console.log("AUTH CONFIG", this.AuthConfig);
    return COGNITO.sendCustomChallengeAnswer(user, answer);
    */
  }

  confirmSignIn() {
    return Promise.resolve(true);
  }

  setPreferredMFA() {
    return Promise.resolve(true);
  }

  currentCredentials() {
    return Promise.resolve(true);
    //return Promise.resolve(currentCreds);
  }

  currentSession() {
    return Promise.resolve(true);
    /*
    // const _currentSession = await Auth.currentSession();
    if (config.MOCKUP_CLIENT) {
      // how to trigger unauthenticated mockup state...
      // return Promise.resolve(null);
      return Promise.resolve({
        ...currentSession,
        getIdToken: () => currentSession.idToken,
        getAccessToken: () => currentSession.accessToken,
        getRefreshToken: () => currentSession.refreshToken,
        isValid: true,
        getClockDrif: () => currentSession.clockDrift,
      });
    }
    return COGNITO.currentSession();
    */
  }

  query(rq, vars) {
    // import gql from "graphql-tag";

    // const test = await appSyncClient.query({
    //   query: gql(getCognitoUserDetails),
    //   variables: {},
    // });
    return Promise.resolve(true);
  }

  mutation(rq, vars) {
    return Promise.resolve(true);
  }
}

export { GraphQLClient };
