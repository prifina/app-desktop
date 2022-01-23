const puppeteer = require("puppeteer");
const { API, Auth } = require("aws-amplify");

const appsync = require("aws-appsync");

const { AUTH_TYPE } = require("aws-appsync");

const gql = require("graphql-tag");

const aws = require("aws-sdk");

const fs = require("fs");
//require("dotenv").config({ path: "../app-desktop/.env" });

const dotenv = require("dotenv");
const envConfig = dotenv.parse(fs.readFileSync("../app-desktop/.env"));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

/*  identityPool user... not required
  const idToken =
    "eyJraWQiOiJud0V1Vm1IQkdjVk5mc3NhTlZOaTlyNGZpM1RcL1pVQkhcL2s2XC9qRmtmQ1RzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMWIyZjhhYy04ZWIxLTQ0YzQtYmFhMS1lMTgyMjc1ZTE4ZDIiLCJjb2duaXRvOmdyb3VwcyI6WyJVU0VSIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9yZ2NNZGhYNVQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJmOTQwODYxZS02NDZkLTQ5NjktYTBjNC1hNTE2YmI4ZGU3YWIiLCJhdWQiOiI0NWRmMWdoMW5qdmpxcnIzaGl2YTJtbmgzYiIsImV2ZW50X2lkIjoiZGVkMmFhMDAtOWU3YS00ZmFkLWFlZDUtYzVkOWFkZGI5NzMzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjQ0Njc2NDMsImN1c3RvbTpwcmlmaW5hIjoiYTI3N2QyZmJiY2E4NjNiMTQwYTYyZmQ0NjZiZjQ4MjgyOWM0IiwiZXhwIjoxNjI0NDcxMjQzLCJpYXQiOjE2MjQ0Njc2NDN9.SxjLSYIcNAPz0hGAadCH9G1cJNNxRMYtISlld7gj1VqJ1DsMcKZob8tgPx99yCkYAHwMXjelT5YdhAbTxWMmXZyWQmXOfkq6OLZSLvm4WDUJtyyKQ9_dq80r18Y1gSr5YTkYxGmJW7go4cc5kXaLwSAMpIbv03Z2YlZ97XV9J4Wr_LkBSsyp8w_QuPi3OMjJWo1CZ_6yYf3dJ-MOLdIP3RoNvyOVelZLy3lzMP7Y_Pinb67CH2tt7rZimI6381HxJ0gnXMAB4GO5wY71nKwq2tvA_dZLfkkpIxFh1LHZmNnfEk1xRjBTvdvGwPFyM3mvBU6SuUdcnCLgCE-dgIfmOQ";

  const provider = "cognito-idp.us-east-1.amazonaws.com/us-east-1_rgcMdhX5T";

  let identityParams = {
    IdentityPoolId: "us-east-1:27d0bb9c-b563-497b-ad0f-82b0ceb9eb0c",
    AccountId: "429117803886",
    Logins: {},
  };
  identityParams.Logins[provider] = idToken;
  const cognitoidentity = new aws.CognitoIdentity({
    apiVersion: "2014-06-30",
    region: "us-east-1",
  });

  const cognitoIdentity = await cognitoidentity.getId(identityParams).promise();
  console.log("ID ", cognitoIdentity);
  */
//CognitoIdentityId-us-east-1:27d0bb9c-b563-497b-ad0f-82b0ceb9eb0c
/*

/*
const graphqlClient = new appsync.AWSAppSyncClient({
    url: 'https://axtf5pljnba4dmsibsdsa73vku.appsync-api.eu-west-1.amazonaws.com/graphql',
    region: "eu-west-1",
    auth: { type: AUTH_TYPE.API_KEY, apiKey: "da2-vbesz7y2jzbhrkigb4ci6o6kci"},
    disableOffline: true
});
*/
const createClient = (endpoint, region) => {
  const client = new appsync.AWSAppSyncClient({
    url: endpoint,
    region: region,
    auth: {
      type: AUTH_TYPE.AWS_IAM,
      credentials: () => Auth.currentCredentials(),
    },
    /*
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () =>
        (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    */
    disableOffline: true,
  });
  return client;
};

const getPrifinaSession = `query getSession($tracker: String!) {
    getSession(tracker: $tracker) {
      tokens
      expire
      identityPool
    }
  }`;

const addPrifinaSession = `mutation addSession($input:SessionInput) {
    addSession(input: $input)
  }`;

async function main() {
  const config = {
    invalidVerificationLink:
      "https://prifina.zendesk.com/hc/en-us/articles/360051754911",
    passwordLength: 10,
    usernameLength: 6,
    auth_region: process.env.REACT_APP_AUTH_REGION,
    main_region: process.env.REACT_APP_MAIN_REGION,
    cognito: {
      USER_POOL_ID: process.env.REACT_APP_POOL_ID,
      APP_CLIENT_ID: process.env.REACT_APP_APP_CLIENT_ID,
      DEV_CLIENT_ID: process.env.REACT_APP_DEV_CLIENT_ID,
      SERVICE_CLIENT_ID: process.env.REACT_APP_SERVICE_CLIENT_ID,
      IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
    },
    appSync: {
      aws_appsync_graphqlEndpoint:
        process.env.REACT_APP_APPSYNC_GRAPHQL_ENDPOINT,
      aws_appsync_authenticationType: process.env.REACT_APP_APPSYNC_AUTH_TYPE,
    },
    S3: {
      bucket: "prifina-app-data-dev",
      region: "us-east-1",
    },
  };

  const APIConfig = {
    aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
    aws_appsync_region: config.main_region,
    aws_appsync_authenticationType:
      config.appSync.aws_appsync_authenticationType,
  };

  const AUTHConfig = {
    // To get the aws credentials, you need to configure
    // the Auth module with your Cognito Federated Identity Pool
    mandatorySignIn: false,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    region: config.main_region,
  };

  console.log("ENV ", process.env);
  console.log("API CONFIG ", APIConfig);
  console.log("AUTH_TYPE ", AUTH_TYPE);
  Auth.configure(AUTHConfig);
  API.configure(APIConfig);

  const client = createClient(
    APIConfig.aws_appsync_graphqlEndpoint,
    APIConfig.aws_appsync_region
  );

  // get TEST tokens....
  const res = await client.query({
    query: gql(getPrifinaSession),
    variables: {
      tracker: "TEST",
    },
  });

  //console.log("RES ", res);
  let tokens = {};
  if (res.data.getSession === null) {
    const prompt = require("prompt-sync")({ sigint: true });
    // get credentials from env....
    const username = process.env.username;
    const password = process.env.password;
    let user = await Auth.signIn(username, password);
    console.log("USER ", user);

    if (user.challengeName === "SMS_MFA") {
      //normal login...
      console.log("Confirmation code was sent to ", user.challengeParam);
      let code = prompt("Enter code: ");
      const loggedUser = await Auth.confirmSignIn(user, code, "SMS_MFA");
      console.log("USER2", loggedUser);
      // set no mfa for next time...
      const mfa = await Auth.setPreferredMFA(loggedUser, "NOMFA");
      console.log("MFA2 ", mfa);

      user = loggedUser;
    }

    const userData = [
      { Name: "sub", Value: user.signInUserSession.idToken.payload.sub },
      {
        Name: "email_verified",
        Value: user.signInUserSession.idToken.payload.email_verified,
      },
      {
        Name: "phone_number_verified",
        Value: user.signInUserSession.idToken.payload.phone_number_verified,
      },
      {
        Name: "custom:prifina",
        Value: user.signInUserSession.idToken.payload["custom:prifina"],
      },
      { Username: user.signInUserSession.idToken.payload["cognito:username"] },
    ];

    // console.log("USERDATA ", userData, JSON.stringify(userData));

    let newTokens = {};
    newTokens[[user.keyPrefix, user.username, "clockDrift"].join(".")] =
      user.signInUserSession.clockDrift.toString();

    newTokens[[user.keyPrefix, "LastAuthUser"].join(".")] = user.username;
    newTokens[[user.keyPrefix, user.username, "idToken"].join(".")] =
      user.signInUserSession.idToken.jwtToken;
    newTokens[[user.keyPrefix, user.username, "accessToken"].join(".")] =
      user.signInUserSession.accessToken.jwtToken;
    newTokens[[user.keyPrefix, user.username, "refreshToken"].join(".")] =
      user.signInUserSession.refreshToken.token;
    newTokens["LastSessionIdentityPool"] = config.cognito.IDENTITY_POOL_ID;
    newTokens[user.userDataKey] = userData;
    //'{"UserAttributes":

    //userDataKey: 'CognitoIdentityServiceProvider.45df1gh1njvjqrr3hiva2mnh3b.f940861e-646d-4969-a0c4-a516bb8de7ab.userData',

    // is this needed.... identitypool user id...
    // 'CognitoIdentityId-us-east-1:27d0bb9c-b563-497b-ad0f-82b0ceb9eb0c': 'us-east-1:23116c0a-7fde-4af7-833d-1a1d739dd50a',

    //console.log("NEW ", newTokens);

    tokens = newTokens;
    tokens["LastSessionIdentityPool"] = AUTHConfig.identityPoolId;

    await client.mutate({
      mutation: gql(addPrifinaSession),
      variables: {
        input: {
          tracker: "TEST",
          tokens: JSON.stringify(tokens),
          expireToken: user.signInUserSession.idToken.payload.exp,
          expire:
            user.signInUserSession.idToken.payload.iat +
            process.env.REACT_APP_REFRESH_TOKEN_EXPIRY * 24 * 60 * 60,
        },
      },
    });
  } else {
    tokens = JSON.parse(res.data.getSession.tokens);
    tokens["LastSessionIdentityPool"] = res.data.getSession.identityPool;
    console.log("EXISTING TOKENS....");
  }

  console.log("TOKENS ", tokens);

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    devtools: true,
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/");

  await page.evaluate((tokens) => {
    for (const key in tokens) {
      localStorage.setItem(key, tokens[key]);
    }

    //return Promise.resolve("OK");
    window.location.reload();
  }, tokens);

  //browser.close();
}

main().catch((e) => {
  console.error(e);
});
