

import AWSAppSyncClient, { AUTH_TYPE, createAppSyncLink } from "aws-appsync";
//import { AppSyncClient } from "@aws-sdk/client-appsync";

import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";

import gql from "graphql-tag";
const { setContext } = require("apollo-link-context");


/* 
let CREDS = new AWS.SharedIniFileCredentials({ profile: "graphql" });

AWS.config.credentials = CREDS;
AWS.config.update({ region: process.env.region, identityPoolRegion: process.env.region });
 */
//console.log(process.env);


const AppSyncConfig = {
  url: process.env.REACT_APP_APPSYNC_ENDPOINT,
  region: process.env.REACT_APP_APPSYNC_REGION,
  auth: {
    type: "API_KEY",
    apiKey: process.env.REACT_APP_APPSYNC_APIKEY
  },
  disableOffline: true,

};


const client = new AWSAppSyncClient(AppSyncConfig, {
  link: createAppSyncLink({
    ...AppSyncConfig,
    resultsFetcherLink: ApolloLink.from([
      setContext((request, previousContext) => {
        //console.log("APOLLO ", previousContext, request);
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

const makeRequest = (type, rq, vars) => {

  let graphQLClient = undefined;
  if (type === 'query') {
    graphQLClient = client.query({ query: gql(rq), variables: vars, });
  }
  if (type === 'mutation') {
    graphQLClient = client.mutate({ mutation: gql(rq), variables: vars, });
  }

  return new Promise(function (resolve, reject) {

    graphQLClient
      //client.query({ query: query, fetchPolicy: 'network-only' })   //Uncomment for AWS Lambda
      .then(data => {
        //console.log("results of query: ", data);
        resolve(data);

      })
      .catch(e => {
        //console.error(e);
        reject(e);
      });
  });

}


/*
export const verifyCodeMutation = (API, userCode) => {
  return API.graphql({
    query: verifyCode,
    variables: { user_code: userCode },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};
const addressBookResult = await client.query({
  query: gql(getAddressBook),
  variables: {
    id: prifinaID,
  },
});
*/

class GraphQLClient {
  constructor(config) {
    this.config = config || AppSyncConfig;
    this.client = new AWSAppSyncClient(this.config, {
      link: createAppSyncLink({
        ...this.config,
        resultsFetcherLink: ApolloLink.from([
          setContext((request, previousContext) => {
            //console.log("APOLLO ", previousContext, request);
            return {
              headers: {
                ...previousContext.headers,
                "x-tro-organization": "TESTING-HEADER",
              },
            };
          }),
          createHttpLink({
            uri: this.config.url,
          }),
        ]),
      }),
    });
  }


  query(rq, vars) {

    return new Promise((resolve, reject) => {

      this.client.query({ query: gql(rq), variables: vars, })
        //client.query({ query: query, fetchPolicy: 'network-only' })   //Uncomment for AWS Lambda
        .then(data => {
          //console.log("results of query: ", data);
          resolve(data);

        })
        .catch(e => {
          //console.error(e);
          reject(e);
        });
    });


  }
  mutation(rq, vars) {
    return new Promise((resolve, reject) => {
      this.client.mutate({ mutation: gql(rq), variables: vars, })
        //client.query({ query: query, fetchPolicy: 'network-only' })   //Uncomment for AWS Lambda
        .then(data => {
          //console.log("results of query: ", data);
          resolve(data);

        })
        .catch(e => {
          //console.error(e);
          reject(e);
        });
    });

  }
}


export { client, makeRequest, GraphQLClient }