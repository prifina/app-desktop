
const prod = {
  auth_region: process.env.AUTH_REGION,
  main_region: process.env.MAIN_REGION,
  user_region: process.env.USER_REGION,
  cognito: {
    USER_POOL_ID: process.env.POOL_ID,
    APP_CLIENT_ID: process.env.APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
    USER_IDENTITY_POOL_ID: process.env.USER_IDENTITY_POOL_ID,
  },
  appSync: {
    aws_appsync_graphqlEndpoint: process.env.APPSYNC_GRAPHQL_ENDPOINT,
    aws_appsync_authenticationType: process.env.APPSYNC_AUTH_TYPE,
    user_graphql_endpoint: process.env.USER_GRAPHQL_ENDPOINT
  },

};
const dev = {
  auth_region: process.env.AUTH_REGION,
  main_region: process.env.MAIN_REGION,
  user_region: process.env.USER_REGION,
  cognito: {
    USER_POOL_ID: process.env.POOL_ID,
    APP_CLIENT_ID: process.env.APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
    USER_IDENTITY_POOL_ID: process.env.USER_IDENTITY_POOL_ID,
  },
  appSync: {
    aws_appsync_graphqlEndpoint: process.env.APPSYNC_GRAPHQL_ENDPOINT,
    aws_appsync_authenticationType: process.env.APPSYNC_AUTH_TYPE,
    user_graphql_endpoint: process.env.USER_GRAPHQL_ENDPOINT
  },

};

// Default to dev if not set
const config = process.env.STAGE === "prod" ? prod : dev;

export default {

  ...config,
};
