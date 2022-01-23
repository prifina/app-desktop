const { API, Auth } = require("aws-amplify");

const appsync = require("aws-appsync");

const { AUTH_TYPE } = require("aws-appsync");

const gql = require("graphql-tag");

const aws = require("aws-sdk");

const fs = require("fs");
const dotenv = require("dotenv");
const envConfig = dotenv.parse(fs.readFileSync("../app-desktop/.env"));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const puppeteer = require("puppeteer");

const i18nTranslate = require("../getI18n");
i18nTranslate.init();

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
    aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC_GRAPHQL_ENDPOINT,
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
  aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
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

Auth.configure(AUTHConfig);
API.configure(APIConfig);

const client = createClient(
  APIConfig.aws_appsync_graphqlEndpoint,
  APIConfig.aws_appsync_region
);

const isDebugging = () => {
  let debugging_mode = {
    headless: false,
    slowMo: 50,
    devtools: true,
  };
  return process.env.NODE_ENV === "debug" ? debugging_mode : {};
};

const checkThis = async (page, selector, text, timeout = 0) => {
  let found = false;
  console.log("CHECK ", text);

  try {
    await page.waitForFunction(
      (text, selector) =>
        document.querySelector(selector).innerText.includes(text),
      { timeout: timeout },
      text,
      selector
    );
    console.log(`The text "${text}" was found on the page`);
    found = true;
  } catch (e) {
    console.log(`The text "${text}" was not found on the page`);
    found = false;
  }

  return Promise.resolve(found);
};

const waitThis = async (page, selector, timeout = 0) => {
  let found = false;
  console.log("WAIT ", selector);

  try {
    await page.waitForSelector(selector, { timeout: timeout });
    console.log(`"${selector}" was found on the page`);
    found = true;
  } catch (e) {
    console.log(`"${selector}" was not found on the page`);
    found = false;
  }

  return Promise.resolve(found);
};

let browser;
let page;

jest.setTimeout(30000);

describe("Test Home page ", () => {
  beforeAll((done) => {
    //console.log("ENV ", process.env);
    // get TEST tokens....
    /*
    const res = await client.query({
      query: gql(getPrifinaSession),
      variables: {
        tracker: "TEST",
      },
    });
    console.log("TOKENS ", res);
    */

    client
      .query({
        query: gql(getPrifinaSession),
        variables: {
          tracker: "TEST",
        },
      })
      .then(async (res) => {
        console.log("TOKENS ", res);
        browser = await puppeteer.launch(isDebugging());
        page = await browser.newPage();
        await page.goto(process.env.TEST_URL);
        // default design viewport size
        page.setViewport({ width: 500, height: 2400 });
        //return Promise.resolve("OK");

        let tokens = JSON.parse(res.data.getSession.tokens);
        tokens["LastSessionIdentityPool"] = res.data.getSession.identityPool;

        await page.evaluate((tokens) => {
          for (const key in tokens) {
            localStorage.setItem(key, tokens[key]);
          }

          //return Promise.resolve("OK");
          window.location.reload();
        }, tokens);

        done();
      });
  });

  afterAll(async (done) => {
    if (isDebugging()) {
      //browser.close();
    }
    done();
  });

  test("loads correctly", async () => {
    expect.assertions(1);
    /*
// async/await can also be used with `.resolves`.
it('works with async/await and resolves', async () => {
  expect.assertions(1);
  await expect(user.getUserName(5)).resolves.toEqual('Paul');
});
*/

    console.log("LOADING....");

    let text = i18nTranslate.__("Settings");

    await expect(checkThis(page, "body", text, 10000)).resolves.toBe(true);
    //console.log("I18n", i18nTranslate.__("loginWelcomeMessage"));
    /*
    const found = await checkThis(page, "body", text, 10000);

    expect(found).toBe(true);

    done();
    */
  }, 16000);

  test("usermenu click", async (done) => {
    await page.click(".UserMenuAvatar");
    //const forgotPasswordTitle = i18nTranslate.__("resetPasswordTitle");
    const checkTitle = await checkThis(
      page,
      "[id*='blend-usermenu-']",
      "Notifications",
      3000
    );
    expect(checkTitle).toBe(true);

    done();
  }, 6000);
});

process.on("unhandledRejection", (reason) => {
  console.log("DEBUG: " + reason);
});
