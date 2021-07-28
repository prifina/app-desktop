export const API_KEY = process.env.REACT_APP_API_KEY;
export const SEARCH_ENGINE = process.env.REACT_APP_SEARCH_ENGINE;
export const GOOGLE_URL = "https://customsearch.googleapis.com/customsearch/v1";
export const REFRESH_TOKEN_EXPIRY = process.env.REACT_APP_REFRESH_TOKEN_EXPIRY;

const prod = {
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
const dev = {
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

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  support: "anybody@anywhere.org",
  ...config,
};
